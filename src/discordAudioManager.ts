import { Client, VoiceChannel, TextChannel, VoiceConnection } from "discord.js";
import { Observable, Observer } from "rxjs";
import ytdl = require("ytdl-core");
import { Song } from "./model/song";

export class DiscordAudioManager {

    private queuedSong: Song[] = [];
    private songHistory: Song[] = [];
    private currentSong: Song = undefined;
    private connection: VoiceConnection;
    private textChannel: TextChannel;
    private historyDisable: boolean = false;
    private isConnected = false;


    private observer: Observer<Song> = {
      next: (song) => {
        this.currentSong = song;
        this.textChannel.send(`Joue ${song.name}`)
        this.connection.play(ytdl(song.url))
        .on("finish", () => {
          this.manageHistory(song);
          if(this.queuedSong.length > 0) {
            this.observer.next(this.queuedSong.shift());
          } else {
            this.currentSong = undefined;
          }
        });
      },
      error: (err) => {
        console.error("playback error", err);
      },
      complete: () => {
        this.currentSong = undefined;
        console.log("complete");
      }
    };
    
    private songObservable: Observable<Song>;

    constructor() {
        this.songObservable = new Observable<Song>();
        this.songObservable.subscribe(this.observer)
    }

    public disconnect() {
      this.connection.disconnect();
    }

    public async play(song: Song) {
      this.queuedSong.push(song);

      if(!this.currentSong) {
        this.observer.next(this.queuedSong.shift());
      } else {
        this.textChannel.send(`Ajouté à la file d'attente ${song.name} :)`);
      }
    }

    public skip() {
      this.connection.dispatcher.end();
      
    }

    public back() {
      this.historyDisable = true;
      if(this.songHistory.length > 0) {
        this.queuedSong.unshift(this.songHistory.shift());

        if(!this.currentSong) {
          this.observer.next(this.queuedSong.shift());
        } else {
          this.connection.dispatcher.end();
        }
      }
    }

    public stop() {
      this.queuedSong = [];
      this.connection.dispatcher.end();
    }

    public rewind() {
      this.queuedSong.unshift(this.currentSong);
      
      if(!this.currentSong) {
        this.observer.next(this.queuedSong.shift());
      } else {
        this.connection.dispatcher.end();
      }
      
    }

    public async connect(voiceChannel: VoiceChannel, textChannel: TextChannel) {
      if(this.isConnected === false) {
        this.connection = await voiceChannel.join();
        this.connection.on("disconnect", () => {
          this.isConnected = false;
        })
        this.textChannel = textChannel;
      }
    }

    private manageHistory(song: Song) {
      if(this.historyDisable === false) {
        this.songHistory.unshift(JSON.parse(JSON.stringify(song)));
        this.songHistory = this.songHistory.slice(0, 20);
      }
    }
}
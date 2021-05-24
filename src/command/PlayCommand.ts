import "../interface/ICommand"
import { ICommand } from "../interface/ICommand";
import { Message, TextChannel } from "discord.js"

import search, * as youtubeSearch from "youtube-search";
import * as ytdl from "ytdl-core";
import { DiscordAudioManager } from "../discordAudioManager";
import { Song } from "../model/song";
import { ConnectCommand } from "./ConnectCommand";
import { SuperCall } from "typescript";
import { POINT_CONVERSION_UNCOMPRESSED } from "constants";



export class PlayCommand extends ConnectCommand {
    name: string;
    

    constructor(
        audioHandler: DiscordAudioManager,
        private youtubeKey: string
    ) {
        super(audioHandler);
    }

    async execute(argument: string, message: Message): Promise<void> {
        await super.execute(argument, message);

        let song: Song = new Song();
        let result = argument.search(/www\.youtube\.com/);
        if(result !== -1) {
            //get the song from url
            const songInfo: ytdl.videoInfo = await ytdl.getInfo(argument);
            song.url = songInfo.videoDetails.video_url;
            song.name = songInfo.videoDetails.title;
        } else {
            const searchOption: youtubeSearch.YouTubeSearchOptions = {
                maxResults: 10,
                key: this.youtubeKey
            };
            const searchResult: youtubeSearch.YouTubeSearchResults = (await search(argument, searchOption)).results[0];
            song.name = searchResult.title;
            song.url = searchResult.link;
        }
        //voiceChannel: VoiceChannel, textChannel: TextChannel
        this.audioHandler.play(song)
    };
    
}
import { Client, Message } from "discord.js"
import { YouTubeSearchResults, YouTubeSearchOptions } from "youtube-search"
import { Config } from "./model/Config"
import { ICommand } from "./interface/ICommand"
import { PlayCommand } from "./command/PlayCommand"
import { ImportsNotUsedAsValues, ObjectTypeDeclaration, Type } from "typescript"
import { CommandModel } from "./model/CommandModel"
import { DiscordAudioManager } from "./discordAudioManager"
import { QuitCommand } from "./command/QuitCommand"
import { SkipCommand } from "./command/SkipCommand"
import { BackCommand } from "./command/BackCommand"
import { StopCommand } from "./command/StopCommand"
import { RewindCommand } from "./command/RewindCommand"



class SpideyBot {
    private config: Config;
    private discordClient: Client;
    private audioHandler: DiscordAudioManager;
    private commandHandler: {[name: string]: ICommand};


    constructor() {
        this.config = require('../config.json');
        console.log(this.config.botToken)
        this.audioHandler = new DiscordAudioManager();
        this.configureDiscord();
    }

    private async configureDiscord() {
        this.discordClient = new Client();
        await this.discordClient.login(this.config.botToken);
        
        this.discordClient.once("ready", () => {
            console.log("Ready!");
        });
        
        this.discordClient.once("reconnecting", () => {
            console.log("Reconnecting!");
        });
        
        this.discordClient.once("disconnect", () => {
            console.log("Disconnect!");
        });

        this.discordClient.on("message", (message: Message) => {
            this.readMessage(message);
        })

        this.configureCommand();
    }

    private configureCommand() {
        this.commandHandler = {
            "play": new PlayCommand(this.audioHandler, this.config.youtubeSearchKey),
            "skip": new SkipCommand(this.audioHandler),
            "next": new SkipCommand(this.audioHandler),
            "back": new BackCommand(this.audioHandler),
            "rewind": new RewindCommand(this.audioHandler),
            "stop": new StopCommand(this.audioHandler),
            "quit": new QuitCommand(this.audioHandler)
        }
    }

    private readMessage(message: Message): void {
        
        if(message.channel.type !== "text" && message.author.bot === false) {
            try {
                message.channel.send("UwU");
            }
            finally {
                return;
            }
        }
        
        const commandeCourante: CommandModel = this.extractCommand(message.content);

        if(commandeCourante === undefined) {
            return;
        }

        if(commandeCourante.name in this.commandHandler) {
            try {
                this.commandHandler[commandeCourante.name].execute(commandeCourante.argument, message);
            }
            catch( error ) {
                console.error(error);
                message.channel.send("Je n'ai pas été capable de lire ta commande. Sowwy UwU")
                
            }
        }
        else {
            message.channel.send(`Les commandes supportés sont: ${Object.keys(this.commandHandler)}`)
        }
    }

    private extractCommand(message: string): CommandModel {
        let commande: CommandModel = new CommandModel();

        commande.prefix = message.charAt(0);
        if(this.config.prefix.find((str) => str === commande.prefix)) {
            const messages: string[] = message.split(" ");        
            commande.name = messages[0].slice(1)
            commande.argument = messages.length > 1 ? messages.slice(1).join(" "): undefined
            return commande
        }
        return undefined
    }
    

}

new SpideyBot();
import "../interface/ICommand"
import { ICommand } from "../interface/ICommand";
import { Message } from "discord.js"

import * as youtubeSearch from "youtube-search";
import { DiscordAudioManager } from "../discordAudioManager";



export class unimplementedCommand implements ICommand {
    name: string;

    constructor(
        public message: Message
    ) {

    }

    execute(argument: string, message: Message): void {
        this.message.channel.send("Commande pas encore ajouté")
    };
    
}
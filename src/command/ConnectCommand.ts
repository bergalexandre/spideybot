import "../interface/ICommand"
import { ICommand } from "../interface/ICommand";
import { Message, TextChannel } from "discord.js"

import search, * as youtubeSearch from "youtube-search";
import * as ytdl from "ytdl-core";
import { DiscordAudioManager } from "../discordAudioManager";
import { Song } from "../model/song";



export class ConnectCommand implements ICommand {
    name: string;
    

    constructor(
        protected audioHandler: DiscordAudioManager
    ) {        
    }

    async execute(argument: string, message: Message): Promise<void> {
        await this.audioHandler.connect(message.member.voice.channel, message.channel as TextChannel)
    };
    
}
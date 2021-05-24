import "../interface/ICommand"
import { ICommand } from "../interface/ICommand";
import { Message, TextChannel } from "discord.js"

import search, * as youtubeSearch from "youtube-search";
import * as ytdl from "ytdl-core";
import { DiscordAudioManager } from "../discordAudioManager";
import { Song } from "../model/song";
import { ConnectCommand } from "./ConnectCommand";



export class SkipCommand extends ConnectCommand {
    name: string;

    constructor(
        audioHandler: DiscordAudioManager
    ) {
        super(audioHandler);
    }

    async execute(argument: string, message: Message): Promise<void> {
        await super.execute(argument, message);
        this.audioHandler.skip();
    };
    
}
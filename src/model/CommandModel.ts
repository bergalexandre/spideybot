import { TextChannel } from "discord.js";

export class CommandModel {
    prefix: string
    name: string;
    argument: string;
    channel: TextChannel;
}
import { Message } from "discord.js"
import { Config } from "../model/Config"

export interface ICommand {
    name: string;
    execute:(argument: string, message: Message) => void;
}
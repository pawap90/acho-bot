import { Client, ChatUserstate } from 'tmi.js';
import { CommandCache } from '../cache/command.cache';
import { BaseTmiCommand } from './base-tmi.command';

export class HelpCommand extends BaseTmiCommand {

    constructor() {
        super('!help', 'Get a list of available commands', []);
    }

    protected executeLogic(channel: string, client: Client, tags: ChatUserstate): void {
        client.say(channel, this.getCommandNameList());
    }

    private getCommandNameList(): string {
        const commands = CommandCache.get();
        let message = '';

        if (commands)
            message = Object.keys(commands).join(', ');

        return message;
    }
}
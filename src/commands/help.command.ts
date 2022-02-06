import { Client } from 'tmi.js';
import { CommandCache } from '../cache/command.cache';
import { BaseTmiCommand } from './base-tmi.command';

export class HelpCommand extends BaseTmiCommand {

    constructor() {
        super('!help', 'Get a list of available commands', []);
    }

    protected executeLogic(channel: string, client: Client): void {
        const commandList = this.getCommandNameList();
        if (commandList)
            client.say(channel, commandList);
    }

    private getCommandNameList(): string | undefined {
        const commands = CommandCache.getPublic();
        let message;

        if (commands)
            message = commands.map(c => c.name).join(', ');

        return message;
    }
}
import { Client } from 'tmi.js';
import { CommandCache } from '../cache/command.cache';
import { BaseTmiCommand } from './base-tmi.command';
import { Role } from './itmi.command';

/**
 * Clears the command cache, forcing the command manager to 
 * reload commands from their loaders next time it needs to access the command cache.
 */
export class RefreshCommand extends BaseTmiCommand {

    constructor() {
        super('!refresh', 'Get a list of available commands', [Role.Broadcaster, Role.Moderator]);
    }

    protected executeLogic(channel: string, client: Client): void {
        CommandCache.clear();
        client.say(channel, 'Command cache refreshed!');
    }
}
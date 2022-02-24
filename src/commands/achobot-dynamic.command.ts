import { Client, ChatUserstate } from 'tmi.js';
import { BaseTmiCommand } from './base-tmi.command';

export abstract class AchoBotDynamicCommand extends BaseTmiCommand {

    protected abstract createResponse(channel: string, tags: ChatUserstate, message?: string): string;

    protected executeLogic(channel: string, client: Client, tags: ChatUserstate, message: string): void {
        const response = this.createResponse(channel, tags, message);
        client.say(channel, response);
    }
}
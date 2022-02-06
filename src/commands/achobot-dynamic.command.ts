import { Client, ChatUserstate } from 'tmi.js';
import { BaseTmiCommand } from './base-tmi.command';

export abstract class AchoBotDynamicCommand extends BaseTmiCommand {

    protected abstract createResponse(channel: string, tags: ChatUserstate): string;

    protected executeLogic(channel: string, client: Client, tags: ChatUserstate): void {
        const response = this.createResponse(channel, tags);
        client.say(channel, response);
    }
}
import { Client as TmiClient, ChatUserstate as TmiChatUserState } from 'tmi.js';
import { ITmiCommand } from "./tmi-command.manager";

export class AchobotDynamicCommand implements ITmiCommand {
    private response: string;
    command: string;

    constructor(config: { Command: string, Response: string }) {
        this.command = config.Command;
        this.response = config.Response;
    }

    execute(channel: string, client: TmiClient, tags: TmiChatUserState): void {
        client.say(channel, this.response);
    }
}
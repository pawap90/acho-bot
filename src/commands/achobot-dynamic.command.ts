import { Client, ChatUserstate } from "tmi.js";
import { ITmiCommand } from "./tmi-command.manager";

export class AchoBotDynamicCommand implements ITmiCommand {
    readonly response: string;
    private permissions: string[];

    constructor(response: string, permissions?: string[]) {
        this.response = response;
        this.permissions = permissions ?? [];
    }

    execute(channel: string, client: Client, tags: ChatUserstate): void {
        const userPermissions = this.getUserPermissions(client, channel, tags.username);

        if (this.permissions.length == 0 || userPermissions.some(permission => this.permissions.indexOf(permission) >= 0))
            client.say(channel, this.response);
        else
            client.say(channel, 'Not enough permissions');
    }

    private getUserPermissions(client: Client, channel: string, username?: string, susbscriber?: boolean): string[] {
        const permissions: string[] = [];

        if (!username) return permissions;

        if (username.toLowerCase() == channel.substring(1))
            permissions.push('Broadcaster');

        if (client.isMod(channel, username))
            permissions.push('Moderator');

        if (susbscriber)
            permissions.push('Subscriber');

        permissions.push('Viewer');

        permissions.push(`usr:${username.toLowerCase()}`)

        return permissions;
    }
}
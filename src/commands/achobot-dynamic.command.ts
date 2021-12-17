import { Client, ChatUserstate } from "tmi.js";
import { ITmiCommand } from "./tmi-command.manager";

export abstract class AchoBotDynamicCommand implements ITmiCommand {
    private permissions: string[];

    constructor(permissions?: string[]) {
        this.permissions = permissions ?? [];
    }

    protected abstract createResponse(channel: string, tags: ChatUserstate): string;

    execute(channel: string, client: Client, tags: ChatUserstate): void {
        const userPermissions = this.getUserPermissions(client, channel, tags.username);

        if (this.permissions.length == 0 || userPermissions.some(permission => this.permissions.indexOf(permission) >= 0)) {
            const response = this.createResponse(channel, tags);
            client.say(channel, response);
        }
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
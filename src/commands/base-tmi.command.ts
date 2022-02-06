import { Client, ChatUserstate } from 'tmi.js';
import { ITmiCommand, Role, Permissions } from './itmi.command';


export abstract class BaseTmiCommand implements ITmiCommand {
    permissions: string[];
    name: string;
    description: string;

    constructor(name: string, description: string, permissions?: string[]) {
        this.name = name;
        this.description = description;
        this.permissions = permissions ?? [];
    }

    protected abstract executeLogic(channel: string, client: Client, tags: ChatUserstate): void;

    execute(channel: string, client: Client, tags: ChatUserstate): void {
        const userPermissions = this.getUserPermissions(client, channel, tags.username);

        if (this.permissions.length == 0 || userPermissions.some(permission => this.permissions.indexOf(permission) >= 0)) {
            this.executeLogic(channel, client, tags);
        }
        else
            client.say(channel, 'Not enough permissions');
    }

    private getUserPermissions(client: Client, channel: string, username?: string, susbscriber?: boolean): Permissions[] {
        const userPermissions: Permissions[] = [];

        if (!username) return userPermissions;

        if (username.toLowerCase() == channel.substring(1))
            userPermissions.push(Role.Broadcaster);

        if (client.isMod(channel, username))
            userPermissions.push(Role.Moderator);

        if (susbscriber)
            userPermissions.push(Role.Subscriber);

        userPermissions.push(Role.Viewer);

        userPermissions.push(`usr:${username.toLowerCase()}`);

        return userPermissions;
    }
}
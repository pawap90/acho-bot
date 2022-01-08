import { Client, ChatUserstate } from "tmi.js";
import { ITmiCommand } from "./tmi-command.manager";

export type CommandParams = { [key: string]: string | null };

export abstract class AchoBotDynamicCommand implements ITmiCommand {
    private permissions: string[];
    definition: string;

    constructor(definition: string, permissions?: string[]) {
        this.definition = definition;
        this.permissions = permissions ?? [];
    }

    protected abstract createResponse(channel: string, tags: ChatUserstate, params?: CommandParams): string;

    execute(message: string, channel: string, client: Client, tags: ChatUserstate): void {
        const userPermissions = this.getUserPermissions(client, channel, tags.username);

        if (this.permissions.length == 0 || userPermissions.some(permission => this.permissions.indexOf(permission) >= 0)) {
            const params = this.extractParams(message);
            const response = this.createResponse(channel, tags, params);

            client.say(channel, response);
        }
        else
            client.say(channel, 'Not enough permissions');
    }

    executeConsole(message: string, channel: string): void {

        const params = this.extractParams(message);
        const response = this.createResponse(channel, {}, params);

        console.log(response);

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

    private extractParams(message: string): CommandParams | undefined {

        // Remove extra spaces.
        message = message.replace(/  /g, ' ');

        let paramsValues = message.split(' ');
        let paramNames = this.definition.split(' ');

        if (paramNames.length === 1)
            return undefined;
        else if (paramNames.length > 1)
            paramNames = paramNames.slice(1);

        if (paramsValues.length > 0)
            paramsValues = paramsValues.slice(1);

        const params: CommandParams = {};
        paramNames.forEach((name, index) => {
            const paramName = name.replace('<', '').replace('>', ''); // Remove <>

            if (paramsValues.length <= index)
                throw new ArgumentNotFoundError(paramName);

            params[paramName] = paramsValues.length >= index + 1 ? paramsValues[index] : null;
        });

        return params;
    }
}

export class ArgumentNotFoundError extends Error {
    constructor(name: string, message?: string) {
        super(message ?? 'Missing argument.' + ` | Argument name: ${name}`);
        this.name = name;

        Object.setPrototypeOf(this, ArgumentNotFoundError.prototype);
    }
}

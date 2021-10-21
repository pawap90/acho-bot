import { Client as TmiClient, ChatUserstate as TmiChatUserState } from 'tmi.js';

export interface ITmiCommand {
    execute(channel: string, client: TmiClient, tags: TmiChatUserState): void
}

interface TmiCommandDictionary { [command: string]: ITmiCommand }

export class TmiCommandManager {
    private commands: TmiCommandDictionary = {};

    register(options: { commands?: TmiCommandDictionary, command?: { command: string, handler: ITmiCommand } }) {
        if (options.commands)
            this.commands = options.commands;

        if (options.command)
            this.commands[options.command.command] = options.command.handler;
    }

    getCommand(command: string): ITmiCommand {
        return this.commands[command];
    }
}
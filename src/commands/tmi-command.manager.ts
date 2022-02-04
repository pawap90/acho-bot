import { Client as TmiClient, ChatUserstate as TmiChatUserState } from 'tmi.js';

export interface ITmiCommand {
    execute(channel: string, client: TmiClient, tags: TmiChatUserState): void;
}

export type TmiCommandDictionary = { [key: string]: ITmiCommand }

export class TmiCommandManager {
    private _commands: TmiCommandDictionary = {};


    get commands(): TmiCommandDictionary {
        return this._commands;
    }

    private set commands(commands: TmiCommandDictionary) {
        this._commands = commands;
    }

    register(commanDetail?: { key: string, command: ITmiCommand }, commands?: TmiCommandDictionary): void {
        if (!this._commands) this._commands = {};

        if (commands)
            this.commands = commands;
        else if (commanDetail)
            this._commands[commanDetail.key] = commanDetail.command;

        //CacheService.store<TmiCommandDictionary>(this.commandCacheKey, this._commands);
    }

    getCommand(name: string): ITmiCommand {
        return this._commands[name];
    }
}
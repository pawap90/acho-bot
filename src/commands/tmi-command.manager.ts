import { Client as TmiClient, ChatUserstate as TmiChatUserState } from 'tmi.js'
import CacheService from '../services/cache.service';

export interface ITmiCommand {
    /**  `!hello` or `!command {param}` */
    definition: string, 
    execute(message: string, channel: string, client: TmiClient, tags: TmiChatUserState): void;
    executeConsole(message: string, channel: string): void;
}

export type TmiCommandDictionary = { [key: string]: ITmiCommand }

export class TmiCommandManager {
    private readonly commandCacheKey = 'chatbot-commands';

    private _commands: TmiCommandDictionary = {};

    constructor() {
        //this._commands = CacheService.get<TmiCommandDictionary>(this.commandCacheKey);
    }

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

    getCommand(definition: string): ITmiCommand | undefined {
        const name = definition.split(' ')[0];

        return Object.values(this._commands).find(c => c.definition.split(' ')[0] === name);
    }
}
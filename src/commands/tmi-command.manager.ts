import { CommandCache } from '../cache/command.cache';
import { ICommandLoader, ITmiCommand, TmiCommandDictionary } from './itmi.command';

export class TmiCommandManager {

    loaders: ICommandLoader[];

    constructor(config: { loaders: ICommandLoader[] }) {
        this.loaders = config.loaders;
    }

    async getCommands(): Promise<TmiCommandDictionary> {
        const cachedCommands = CommandCache.get();
        
        if (!cachedCommands) 
            return await this.loadCommands();
        
        return cachedCommands;
    }

    async loadCommands(): Promise<TmiCommandDictionary> {
        let commandDictionary: TmiCommandDictionary = {};
        for (const key in this.loaders) {
            const loader = this.loaders[key];
            const loaderCommands = await loader.load();
            commandDictionary = { ...commandDictionary, ...loaderCommands };
        }

        CommandCache.store(commandDictionary);

        return commandDictionary;
    }

    async getCommand(name: string): Promise<ITmiCommand> {
        return (await this.getCommands())[name];
    }
}
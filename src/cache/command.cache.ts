import { ITmiCommand, Role, TmiCommandDictionary } from '../commands/itmi.command';
import { AppCache } from './cache.service';

/** 
 * ITmiCommand memory cache service 
 */
export class CommandCache {
    private static readonly COMMANDS_KEY = 'commands';

    static store(commands: TmiCommandDictionary): void {
        AppCache.set(this.COMMANDS_KEY, commands, 60 * 60 * 24);
    }

    static get(): TmiCommandDictionary | undefined {
        return AppCache.get<TmiCommandDictionary>(this.COMMANDS_KEY);
    }

    static getPublic(): ITmiCommand[] {
        const commands = this.get();
        if (!commands) return [];

        const publicCommands = Object.values(commands)
            .filter(c => {
                return !c.permissions || c.permissions.length == 0 || c.permissions.find(p => p == Role.Viewer || p == Role.Subscriber);
            })
            .sort((c1, c2) => c1.name.localeCompare(c2.name));

        return publicCommands;
    }

    static clear(): void {
        AppCache.set(this.COMMANDS_KEY, undefined, 60 * 60 * 24);
    }
}
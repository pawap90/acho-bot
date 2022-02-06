import { HelpCommand } from '../help.command';
import { TmiCommandDictionary, ICommandLoader } from '../itmi.command';


export class BuiltInCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!help': new HelpCommand()
        }
    }
}
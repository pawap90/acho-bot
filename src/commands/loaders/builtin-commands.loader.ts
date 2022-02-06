import { HelpCommand } from '../help.command';
import { TmiCommandDictionary, ICommandLoader } from '../itmi.command';
import { RefreshCommand } from '../refresh.command';


export class BuiltInCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!help': new HelpCommand(),
            '!refresh': new RefreshCommand()
        };
    }
}
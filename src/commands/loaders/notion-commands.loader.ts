import AchoBotDynamicScriptCommand from '../achobot-dynamic-script.command';
import AchoBotDynamicTextCommand from '../achobot-dynamic-text.command';
import { AchoBotDynamicCommand } from '../achobot-dynamic.command';
import { TmiCommandDictionary, ICommandLoader } from '../itmi.command';
import { NotionService } from '../../services/notion.service';

type NotionCommand = {
    CommandName: string,
    Response: string,
    Permissions: string,
    Type: string,
    Description: string,
    Example: string
};

export class NotionCommandsLoader implements ICommandLoader {
    loadedCommands: NotionCommand[] = [];

    getPublicCommands(): NotionCommand[] {
        return this.loadedCommands.filter(c => {
            return !c.Permissions || c.Permissions.length == 0 || c.Permissions.indexOf('Viewer') >= 0 || c.Permissions.indexOf('Subscriber') >= 0;
        });
    }

    async load(): Promise<TmiCommandDictionary> {

        const commands = await new NotionService().getDatabasePage<NotionCommand>(process.env.NOTION_DATABASEID!);
        this.loadedCommands = commands.sort((c1, c2) => c1.CommandName.localeCompare(c2.CommandName));

        const notionCommands: { [key: string]: AchoBotDynamicCommand } = {};

        for (let i = 0; i < this.loadedCommands.length; i++) {
            const command = this.loadedCommands[i];

            let permissions: string[] = [];
            if (command.Permissions && command.Permissions.length > 0)
                permissions = command.Permissions.split(',');

            const dynamicCommand = this.createCommandInstance(command, permissions);
            notionCommands[command.CommandName] = dynamicCommand;
        }

        return notionCommands;
    }

    private createCommandInstance(command: NotionCommand, permissions: string[]): AchoBotDynamicCommand {
        switch (command.Type) {
        case 'Text':
            return new AchoBotDynamicTextCommand(command.CommandName, command.Description, command.Response, permissions);
        case 'Script':
            return new AchoBotDynamicScriptCommand(command.CommandName, command.Description, command.Response, permissions);
        default:
            throw new Error('Unrecognized command type');
        }
    }
}
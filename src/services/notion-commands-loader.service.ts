import AchoBotDynamicScriptCommand from '../commands/achobot-dynamic-script.command';
import AchoBotDynamicTextCommand from '../commands/achobot-dynamic-text.command';
import { AchoBotDynamicCommand } from '../commands/achobot-dynamic.command';
import { TmiCommandDictionary } from '../commands/tmi-command.manager';
import { NotionService } from './notion.service';

type NotionCommand = {
    CommandName: string,
    Response: string,
    Permissions: string,
    Type: string,
    Description: string,
    Example: string
};

export class NotionCommandsLoader {
    static loadedCommands: NotionCommand[] = [];

    static getPublicCommands(): NotionCommand[] {
        return this.loadedCommands.filter(c => {
            return !c.Permissions || c.Permissions.length == 0 || c.Permissions.indexOf('Viewer') >= 0 || c.Permissions.indexOf('Subscriber') >= 0;
        });
    }

    static async load(): Promise<TmiCommandDictionary> {

        const commands = await new NotionService().getDatabasePage<NotionCommand>(process.env.NOTION_DATABASEID!);
        this.loadedCommands = commands.sort((c1, c2) => c1.CommandName.localeCompare(c2.CommandName));

        const notionCommands: { [key: string]: AchoBotDynamicCommand } = {};

        for (let i = 0; i < this.loadedCommands.length; i++) {
            const command = this.loadedCommands[i];

            let permissions: string[] = [];
            if (command.Permissions && command.Permissions.length > 0)
                permissions = command.Permissions.split(',');

            const dynamicCommand = NotionCommandsLoader.createCommandInstance(command.Type, command.Response, permissions);
            notionCommands[command.CommandName] = dynamicCommand;
        }

        return notionCommands;
    }

    private static createCommandInstance(type: string, response: string, permissions: string[]): AchoBotDynamicCommand {
        switch (type) {
        case 'Text':
            return new AchoBotDynamicTextCommand(response, permissions);
        case 'Script':
            return new AchoBotDynamicScriptCommand(response, permissions);
        default:
            throw new Error('Unrecognized command type');
        }
    }
}
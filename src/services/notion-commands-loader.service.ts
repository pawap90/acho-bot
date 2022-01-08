import AchoBotDynamicScriptCommand from "../commands/achobot-dynamic-script.command";
import AchoBotDynamicTextCommand from "../commands/achobot-dynamic-text.command";
import { AchoBotDynamicCommand } from "../commands/achobot-dynamic.command";
import { TmiCommandDictionary } from "../commands/tmi-command.manager";
import { NotionService } from "./notion.service";

type NotionCommand = { CommandName: string, Response: string, Permissions: string, Type: string };

export class NotionCommandsLoader {
    static async load(): Promise<TmiCommandDictionary> {

        const commands = await new NotionService().getDatabasePage<NotionCommand>(process.env.NOTION_DATABASEID!)

        const notionCommands: { [key: string]: AchoBotDynamicCommand } = {};

        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            let permissions: string[] = [];
            if (command.Permissions && command.Permissions.length > 0)
                permissions = command.Permissions.split(',');

            const dynamicCommand = NotionCommandsLoader.createCommandInstance(command, permissions);
            notionCommands[command.CommandName] = dynamicCommand;
        }

        return notionCommands;
    }

    private static createCommandInstance(command: NotionCommand, permissions: string[]): AchoBotDynamicCommand {
        switch (command.Type) {
            case 'Text':
                return new AchoBotDynamicTextCommand(command.CommandName, command.Response, permissions);
            case 'Script':
                return new AchoBotDynamicScriptCommand(command.CommandName, command.Response, permissions);
            default:
                throw new Error('Unrecognized command type');
        }
    }
}
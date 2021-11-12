import { AchoBotDynamicCommand } from "../commands/achobot-dynamic.command";
import { TmiCommandDictionary } from "../commands/tmi-command.manager";
import { NotionService } from "./notion.service";

type NotionCommand = { CommandName: string, Response: string, Permissions: string };

export class NotionCommandsLoader {
    static async load(): Promise<TmiCommandDictionary> {

        const commands = await new NotionService().getDatabasePage<NotionCommand>(process.env.NOTION_DATABASEID!)

        console.log(commands);

        const notionCommands: { [key: string]: AchoBotDynamicCommand } = {};

        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            let permissions: string[] = [];
            if (command.Permissions && command.Permissions.length > 0)
                permissions = command.Permissions.split(',');

            const dynamicCommand = new AchoBotDynamicCommand(command.Response, permissions);
            notionCommands[command.CommandName] = dynamicCommand;
        }

        return notionCommands;
    }
}
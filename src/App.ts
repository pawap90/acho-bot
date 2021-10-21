import * as dotenv from 'dotenv';

import ServerInit from './server-init';
import TwitchAuthController from './controllers/twitch-auth.controller';
import StatusController from './controllers/status.controller';
import TmiService from './services/tmi.service';
import { NotionService } from './services/notion.service';
import { TmiCommandManager } from './commands/tmi-command.manager';
import { AchobotDynamicCommand } from './commands/achobot.dynamic.command';

dotenv.config();

const app = ServerInit.init({
    '/api/twitch/auth': TwitchAuthController.routes(),
    '/api/status': StatusController.routes()
});

app.listen(process.env.PORT, async function () {
    console.info(`AchoBot running on port ${process.env.PORT}`);

    console.info('Attempting to start TMI client...');
    await new TmiService().startClient();

    const notionCommands = await new NotionService().getDatabasePage<{ Command: string, Response: string }>(process.env.NOTION_DB!);
    const commandManager = new TmiCommandManager();
    for (const key in notionCommands) {
        const command = notionCommands[key];
        commandManager.register({
            command: {
                command: command.Command,
                handler: new AchobotDynamicCommand(command)
            }
        })
    }
});


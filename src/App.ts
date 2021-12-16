import * as dotenv from 'dotenv';
import { TmiCommandManager } from './commands/tmi-command.manager';

import StatusController from './controllers/status.controller';
import TwitchAuthController from './controllers/twitch-auth.controller';
import HomeController from './controllers/home.controller';

import { NotionCommandsLoader } from './services/notion-commands-loader.service';
import Server from './server';
import TmiService from './services/tmi.service';

dotenv.config();

const app = Server.init({
    '/api/twitch/auth': TwitchAuthController.routes(),
    '/api/status': StatusController.routes(),
    '/': HomeController.routes()
});

app.listen(process.env.PORT, async function () {
    console.info('App running. Port: ' + process.env.PORT);

    const commandManager = new TmiCommandManager();
    const notionCommands = await NotionCommandsLoader.load();

    if (Object.keys(commandManager.commands).length == 0) commandManager.register(undefined, notionCommands);

    await new TmiService(commandManager).startClient();
});


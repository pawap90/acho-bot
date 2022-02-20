import { Client as TmiClient } from 'tmi.js';
import { TmiCommandManager } from '../commands/tmi-command.manager';
import { TwitchService } from './twitch.service';

export default class TmiService {
    private readonly commandManager: TmiCommandManager;

    constructor(commandManager: TmiCommandManager) {
        this.commandManager = commandManager;
    }

    async startClient(): Promise<void> {
        await this.commandManager.loadCommands();
        const client = this.createClient();

        try {
            client.on('message', async (channel, tags, message, self) => {
                if (self) return;

                const command = await this.commandManager.getCommand(message.toLowerCase().trim());
                if (command) {
                    command.execute(channel, client, tags, message);
                }
            });

            client.on('join', async (channel, username) => {
                if (username === process.env.TWITCH_BOT_USERNAME!) {
                    const refreshCommand = await this.commandManager.getCommand('!refresh');
                    refreshCommand?.execute(channel, client, { username });

                    const welcomeCommand = await this.commandManager.getCommand('!welcome');
                    welcomeCommand?.execute(channel, client, { username });
                }
            });

            await client.connect();
            console.info('TMI client connected');
        }
        catch (err) {
            console.error('TMI client startup failed');
            console.error(err);
        }
    }

    private createClient(): TmiClient {
        const client = new TmiClient({
            options: { debug: process.env.TMI_DEBUG ? true : false, messagesLogLevel: process.env.TMI_LOGLEVEL },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: this.getAccessToken
            },
            channels: `${process.env.TWITCH_CHANNELS}`.split(',')
        });

        return client;
    }

    private async getAccessToken(): Promise<string> {
        const twitchService = new TwitchService();

        try {
            const accessToken = await twitchService.getValidAccessToken();
            return accessToken;
        }
        catch (err) {
            console.error('There was an error getting the access token for TMI');
            throw err;
        }
    }
}
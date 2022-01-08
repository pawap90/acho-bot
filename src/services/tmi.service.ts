import { Client as TmiClient } from 'tmi.js';
import { TmiCommandManager } from '../commands/tmi-command.manager';
import { TwitchService } from './twitch.service';

export default class TmiService {
    private readonly commandManager: TmiCommandManager;

    constructor(commandManager: TmiCommandManager) {
        this.commandManager = commandManager;
    }

    async startClient(): Promise<void> {
        const client = this.createClient();

        try {
            await client.connect();
            console.info('TMI client connected');

            client.on('message', (channel, tags, message, self) => {
                if (self) return;

                const command = this.commandManager.getCommand(message.toLowerCase().trim());
                if (command) {
                    try {
                        command.execute(message, channel, client, tags);
                    }
                    catch (err) {
                        console.error('Error executing command')
                        console.error(err);
                    }
                }
            });
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
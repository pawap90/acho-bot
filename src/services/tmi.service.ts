import * as tmi from 'tmi.js';
import { TwitchService } from './twitch.service';

export default class TmiService {

    async startClient() {
        const client = this.createClient();

        try {
            await client.connect();
            console.info("TMI client connected");

            client.on('message', (channel, tags, message, self) => {
                if (self) return;
                if (message.toLowerCase() === '!hello') {
                    client.say(channel, `@${tags.username}, !`);
                }
            });
        }
        catch (err) {
            console.error("TMI client startup failed");
            console.error(err);
        }
    }

    private createClient(): tmi.Client {
        const client = new tmi.Client({
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
            const accessToken = await twitchService.getAccessToken();
            return accessToken;
        }
        catch (err) {
            console.error("There was an error getting the access token for TMI");
            throw err;
        }
    }
}
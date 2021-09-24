import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new tmi.Client({
	options: { debug: process.env.TMI_DEBUG ? true : false, messagesLogLevel: process.env.TMI_LOGLEVEL },
	connection: {
		reconnect: true,
		secure: false
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_BOT_OAUTHTOKEN
	},
	channels: `${process.env.TWITCH_CHANNELS}`.split(',')
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
	if (self) return;
	if (message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
	}
});
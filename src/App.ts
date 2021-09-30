import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as FlatCache from 'flat-cache';
import TwitchService from './services/twitch.service';
import ServerInit from './server-init';

const cache = FlatCache.load('acho-bot-cache');

dotenv.config();

const app = ServerInit.init();

const twitchService = new TwitchService({
	clientId: process.env.TWITCH_BOT_CLIENTID!,
	clientSecret: process.env.TWITCH_BOT_CLIENTSECRET!,
	redirectUri: process.env.TWITCH_BOT_REDIRECTURI!
});

app.get('/twitch/authorize', passport.authenticate('twitch', { scope: 'chat:read chat:edit' }));

app.get('/twitch/token', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

app.get('/', async (req, res) => {

	let accessToken = cache.getKey('twitch-access-token');

	try {
		const validationResult = await twitchService.validateAccessToken(accessToken);

		if (!validationResult.isValid) {

			// TODO: Refresh and validate again.
			// const refreshToken = cache.getKey('twitch-refresh-token');
			// const tokenInfo = await twitchService.refreshToken(refreshToken)

			res.json({ message: 'User authorization needed' }).status(401);
		}
		else {
			res.json({ message: 'Ready to join chat' });
		}

	}
	catch (err) {
		res.json({ message: 'Error validating token' }).status(500);
	}

	// if (myCache.get<string>('twitch-access-token')) {
	// 	startTmiClient();
	// 	res.send('<html><head><title>AchoBot</title></head>Connected</html>');
	// } else {
	// 	res.send('<html><head><title>AchoBot</title></head><a href="/twitch/authorize">Connect with Twitch account</a></html>');
	// }
});

app.listen(5000, function () {
	console.info(`AchoBot running on port ${process.env.PORT}`)
});

function startTmiClient() {
	const client = new tmi.Client({
		options: { debug: process.env.TMI_DEBUG ? true : false, messagesLogLevel: process.env.TMI_LOGLEVEL },
		connection: {
			reconnect: true,
			secure: true
		},
		identity: {
			username: process.env.TWITCH_BOT_USERNAME,
			password: 'oauth:lsa9ngwhjnicqy886r0dcma8l66rfe' //process.env.TWITCH_BOT_OAUTHTOKEN
		},
		channels: `${process.env.TWITCH_CHANNELS}`.split(',')
	});

	client.connect().catch((err) => {
		console.log(err);
	});

	client.on('message', (channel, tags, message, self) => {
		if (self) return;
		if (message.toLowerCase() === '!hello') {
			client.say(channel, `@${tags.username}, heya!`);
		}
	});

}
import * as dotenv from 'dotenv';

import ServerInit from './server-init';
import TwitchAuthController from './controllers/twitch-auth.controller';
import StatusController from './controllers/status.controller';
import TmiService from './services/tmi.service';
import CacheService from './services/cache.service';

dotenv.config();

const app = ServerInit.init();

// Controllers
app.use('/api/twitch/auth', TwitchAuthController.routes());
app.use('/api/status', StatusController.routes());

app.listen(5000, async function () {
	console.info(`AchoBot running on port ${process.env.PORT}`)
	
	console.info("Attempting to start TMI client...");
	await new TmiService().startClient();
});
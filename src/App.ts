import * as dotenv from 'dotenv';

import ServerInit from './server-init';
import TwitchAuthController from './controllers/twitch-auth.controller';
import StatusController from './controllers/status.controller';
import TmiService from './services/tmi.service';

dotenv.config();

const app = ServerInit.init({
    '/api/twitch/auth': TwitchAuthController.routes(),
    '/api/status': StatusController.routes()
});

app.listen(process.env.PORT, async function () {
    console.info(`AchoBot running on port ${process.env.PORT}`);
	
    console.info('Attempting to start TMI client...');
    await new TmiService().startClient();
});
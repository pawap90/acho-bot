import { Router } from 'express';
import { TwitchService, TwitchAuthorizationRequiredError } from '../services/twitch.service';

export default class StatusController {

    static routes(): Router {
        const router = Router();
        const twitchService = new TwitchService();

        router.get('/', async (req, res) => {
            try {
                await twitchService.getAccessToken();

                res.json({ message: 'Ready to chat' });
            }
            catch (err) {
                if (err instanceof TwitchAuthorizationRequiredError)
                    res.json({ message: 'AchoBot requires authorization' }).status(401);

                res.json({ message: 'Error validating token' }).status(500);
            }
        });

        return router;
    }
}
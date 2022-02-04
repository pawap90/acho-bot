import { Router } from 'express';
import { TwitchAuthorizationRequiredError, TwitchService } from '../services/twitch.service';

export default class StatusController {

    static routes(): Router {
        const router = Router();

        const twitchService = new TwitchService();

        router.get('/', async (req, res, next) => {
            try {
                await twitchService.getValidAccessToken();
                res.json({ message: 'Ready to chat!' });
            }
            catch (err) {
                if (err instanceof TwitchAuthorizationRequiredError)
                    res.json({ message: 'AchoBot requires authorization with Twitch' }).status(401);
                
                next(err);
            }
        });

        return router;
    }
}
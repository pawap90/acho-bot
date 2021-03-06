import { Router } from 'express';
import * as passport from 'passport';

export default class TwitchAuthController {

    static routes(): Router {
        const router = Router();

        router.get('/', passport.authenticate('twitch', { scope: 'chat:read chat:edit channel:read:subscriptions' }));

        router.get('/token', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/api/twitch/auth/failed' }));

        router.get('/failed', (req, res) => {
            res.json({ message: 'Authorization with Twitch failed' }).status(401);
        });

        return router;
    }
}
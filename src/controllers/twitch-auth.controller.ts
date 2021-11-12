import { Router } from 'express';
import * as passport from 'passport';

export default class TwitchAuthController {

    static routes(): Router {
        const router = Router();

        router.get('/', passport.authenticate('twitch', { scope: 'chat:read chat:edit' }));
        router.get('/token', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

        return router;
    }
}
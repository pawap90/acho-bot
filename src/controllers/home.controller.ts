import { Router } from 'express';
import { CommandCache } from '../cache/command.cache';
import { TwitchAuthorizationRequiredError, TwitchService } from '../services/twitch.service';

export default class HomeController {

    static routes(): Router {
        const router = Router();

        const twitchService = new TwitchService();

        router.get('/', async (req, res, next) => {
            try {
                await twitchService.getValidAccessToken();
                res.render('status.pug', { status: 200 });
            }
            catch (err) {
                if (err instanceof TwitchAuthorizationRequiredError)
                    res.render('status.pug', { status: 401 });
                
                res.render('status.pug', { status: 500 });
                next(err);
            }
        });

        router.get('/commands', async (req, res) => {           
            res.render('commands.pug', { 
                mode: req.query.mode, 
                commands: CommandCache.getPublic() 
            });
        });

        return router;
    }
}
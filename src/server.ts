import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';

import CacheService from './services/cache.service';
import { TwitchService } from './services/twitch.service';
import { HttpError } from './utils/http.error';

type RouteControllers = { [basePath: string]: express.Router };

export default class Server {

    static init(routes: RouteControllers): express.Express {

        const twitchService = new TwitchService();

        const app = express();

        app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.set('views', './src/views');
        app.set('view engine', 'pug');

        OAuth2Strategy.prototype.userProfile = (accessToken, done) => {
            twitchService.getUserProfile(accessToken)
                .then(res => done(null, res))
                .catch(err => done(err));
        };

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((id, done) => {
            done(null, id as Express.User);
        });

        passport.use('twitch', new OAuth2Strategy({
            authorizationURL: TwitchService.endpoints.OAUTH_AUTHORIZE,
            tokenURL: TwitchService.endpoints.OAUTH_TOKEN,
            clientID: twitchService.config.clientId,
            clientSecret: twitchService.config.clientSecret,
            callbackURL: twitchService.config.redirectUri,
            state: true
        },
        (accessToken: string, refreshToken: string, profile: any, done: OAuth2Strategy.VerifyCallback) => {

            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;

            if (profile.data[0].login != process.env.TWITCH_BOT_USERNAME!) {
                // Only allow login by the account configured in the env.
                done(new Error('Unauthorized account'));
            }
            else {   
                CacheService.storeRefreshToken(refreshToken);
                CacheService.storeAccessToken(accessToken);
    
                done(null, profile);
            }
        }));

        for (const path in routes) {
            const routeController = routes[path];
            app.use(path, routeController);
        }

        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

            console.error(err);

            if (res.headersSent) {
                return next(err);
            }

            if (err instanceof HttpError) // type guard
                res.json({ message: 'There was an error. Status code:' + err.status }).status(err.status);

            res.json({ message: 'There was an error' }).status(500);
        });

        return app;
    }
}
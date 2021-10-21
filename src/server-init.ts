import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';

import { TwitchService } from './services/twitch.service';
import CacheService from './services/cache.service';
import { HttpError } from './utils/http.error';

type RouteController = { [path: string]: express.Router }

export default class ServerInit {
    static init(routes: RouteController): express.Express {

        const app = express();
        app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        const twitchService = new TwitchService();

        OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
            twitchService.getUserProfile(accessToken)
                .then(res => {
                    done(null, res);
                })
                .catch(err => done(err));
        };

        passport.serializeUser(function (user, done) {
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
            function (accessToken: string, refreshToken: string, profile: any, done: OAuth2Strategy.VerifyCallback) {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;

                CacheService.storeAccessToken(accessToken);
                CacheService.storeRefreshToken(refreshToken);

                done(null, profile);
            }
        ));

        // Setup endpoints.
        for (const path in routes) {
            const route = routes[path];
            app.use(path, route);
        }

        // Setup error handler middleware.
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

            console.error('Using the error middleware')
            console.error(err);

            if (err instanceof HttpError)
                res.json({ message: 'There was an error. Status code:' + err.status }).status(err.status);

            res.json({ message: 'There was an error' }).status(500);
        });

        return app;
    }
}
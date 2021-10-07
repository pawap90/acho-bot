import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';
import * as FlatCache from 'flat-cache';
import { TwitchService } from './services/twitch.service';

export default class ServerInit {
    static init(): express.Express {

        const cache = FlatCache.load('acho-bot-cache');

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

            cache.setKey('twitch-access-token', accessToken);
            cache.setKey('twitch-refresh-token', refreshToken);
            cache.save();

            done(null, profile);
        }
        ));

        return app;
    }
}
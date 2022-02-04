import { FetchBuilder, FetchBuilderError } from '../utils/fetch.builder';
import CacheService from './cache.service';


type TwitchConfig = {
    clientId: string,
    clientSecret: string,
    redirectUri: string
}

export class TwitchService {

    readonly config: TwitchConfig;

    static readonly endpoints = {
        OAUTH_TOKEN: 'https://id.twitch.tv/oauth2/token',
        OAUTH_AUTHORIZE: 'https://id.twitch.tv/oauth2/authorize',
        OAUTH_VALIDATE: 'https://id.twitch.tv/oauth2/validate',
        GET_USERS: 'https://api.twitch.tv/helix/users'
    };

    constructor() {
        this.config = {
            clientId: process.env.TWITCH_BOT_CLIENTID!,
            clientSecret: process.env.TWITCH_BOT_CLIENTSECRET!,
            redirectUri: process.env.TWITCH_BOT_REDIRECTURI!
        };
    }

    async getUserProfile(accessToken: string): Promise<TwitchUser> {

        const result = await FetchBuilder
            .get<TwitchUser>(TwitchService.endpoints.GET_USERS)
            .setHeaders({
                'Client-ID': this.config.clientId,
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': 'Bearer ' + accessToken
            })
            .execute();

        return result.body;
    }

    async getValidAccessToken(): Promise<string> {
        // Try to get the access token from cache
        const accessToken = CacheService.getAccessToken();
        const refreshToken = CacheService.getRefreshToken();

        if (refreshToken && refreshToken.length > 0 && accessToken && accessToken.length > 0) {
            // If there's a token, check if it's valid.
            const tokenValidationResult = await this.validateAccessToken(accessToken);

            if (tokenValidationResult.isValid)
                return accessToken;

            // If it's not valid, refresh
            const tokens = await this.generateNewTokens(refreshToken);

            CacheService.storeAccessToken(tokens.access_token);
            CacheService.storeRefreshToken(tokens.refresh_token);
        }

        // If there's no access token, throw error
        throw new TwitchAuthorizationRequiredError('No token in cache');
    }

    async validateAccessToken(accessToken: string): Promise<TwitchTokenValidationResult> {
        try {
            const result = await FetchBuilder
                .get<TwitchTokenInformation>(TwitchService.endpoints.OAUTH_VALIDATE)
                .setHeaders({
                    'Authorization': 'Bearer ' + accessToken
                })
                .execute();

            return {
                isValid: true,
                tokenInformation: result.body
            };
        }
        catch (err) {
            if (err instanceof FetchBuilderError && (err as FetchBuilderError).status === 401)
                return { isValid: false };

            throw err;
        }
    }

    async generateNewTokens(refreshToken: string): Promise<TwitchToken> {

        let endpoint = TwitchService.endpoints.OAUTH_TOKEN;
        endpoint += `?client_id=${this.config.clientId}`;
        endpoint += `&client_secret=${this.config.clientSecret}`;
        endpoint += `&refresh_token=${refreshToken}`;
        endpoint += '&grant_type=refresh_token';

        const result = await FetchBuilder.post<TwitchToken>(endpoint)
            .execute();

        return result.body;
    }
}

export class TwitchAuthorizationRequiredError extends Error {
    constructor(message?: string) {
        super(message ?? 'Twitch Authorization required');

        Object.setPrototypeOf(this, TwitchAuthorizationRequiredError.prototype);
    }
}

type TwitchTokenValidationResult = {
    isValid: boolean,
    tokenInformation?: TwitchTokenInformation
}

type TwitchTokenInformation = {
    client_id: string,
    login: string,
    user_id: string,
    expires_in: number,
    scope: string[]
}

type TwitchToken = {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    scope: string[],
    token_type: string
}

type TwitchUser = {
    broadcaster_type: string,
    description: string,
    display_name: string,
    login: string,
    profile_image_url: string,
    type: string;
    created_at: string
}
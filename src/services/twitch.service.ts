import { FetchBuilder, FetchBuilderError } from '../engine/fetch.builder';

type TwitchConfig = {
    clientId: string,
    clientSecret: string,
    redirectUri: string
}

export default class TwitchService {

    readonly config: TwitchConfig;

    static readonly endpoints = {
        OAUTH_TOKEN: 'https://id.twitch.tv/oauth2/token',
        OAUTH_AUTHORIZE: 'https://id.twitch.tv/oauth2/authorize',
        OAUTH_VALIDATE: 'https://id.twitch.tv/oauth2/validate',
        GET_USERS: 'https://api.twitch.tv/helix/users'
    };

    constructor(config: TwitchConfig) {
        this.config = config;
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

    async validateAccessToken(accessToken: string): Promise<TwitchTokenValidation> {
        try {
            const result = await FetchBuilder
                .get<TwitchTokenInformation>(TwitchService.endpoints.OAUTH_VALIDATE)
                .setHeaders({
                    'Authorization': 'Bearer ' + accessToken
                })
                .execute();

            const validationResult = {
                isValid: true,
                tokenInformation: result.body
            } as TwitchTokenValidation;

            return validationResult;
        }
        catch (err) {
            if (err instanceof FetchBuilderError && (err as FetchBuilderError).status == 401)
                return { isValid: false }
            
            throw err;
        }
    }

    async refreshToken(refreshToken: string): Promise<TwitchToken> {

        let endpoint = TwitchService.endpoints.OAUTH_TOKEN;
        endpoint += `?client_id=${this.config.clientId}`;
        endpoint += `&client_secret=${this.config.clientSecret}`;
        endpoint += `&refresh_token=${refreshToken}`;
        endpoint += `&grant_type=refresh_token`;

        const result = await FetchBuilder
            .post<TwitchToken>(endpoint)
            .execute();

        return result.body;
    }
}

type TwitchUser = {
    broadcaster_type: string,
    description: string,
    display_name: string,
    login: string,
    profile_image_url: string,
    type: string,
    created_at: string,
}

type TwitchToken = {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    scope: string[],
    token_type: string
}

type TwitchTokenInformation = {
    isValid: boolean,
    client_id: string,
    login: string,
    user_id: string,
    expires_in: number,
    scope: string[]
}

type TwitchTokenValidation = {
    isValid: boolean,
    tokenInformation?: TwitchTokenInformation
}
import { AppCache } from './cache.service';

/** 
 * Twitch tokens memory cache service 
 */
export default class TwitchCache {

    private static readonly TWITCH_ACCESSTOKEN_KEY = 'twitch-access-token';
    private static readonly TWITCH_REFRESHTOKEN_KEY = 'twitch-refresh-token';
    
    static storeAccessToken(accessToken: string): void {
        AppCache.set(this.TWITCH_ACCESSTOKEN_KEY, accessToken);
    }

    static getAccessToken(): string | undefined {
        return AppCache.get<string>(this.TWITCH_ACCESSTOKEN_KEY);
    }

    static storeRefreshToken(refreshToken: string): void {
        AppCache.set(this.TWITCH_REFRESHTOKEN_KEY, refreshToken);
    }

    static getRefreshToken(): string | undefined {
        return AppCache.get(this.TWITCH_REFRESHTOKEN_KEY);
    }
}
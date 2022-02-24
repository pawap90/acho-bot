import { DurableCache } from './cache.service';

/** 
 * Twitch tokens cache service 
 */
export default class TwitchCache {

    private static readonly TWITCH_ACCESSTOKEN_KEY = 'twitch-access-token';
    private static readonly TWITCH_REFRESHTOKEN_KEY = 'twitch-refresh-token';
    
    static storeAccessToken(accessToken: string): void {
        DurableCache.setKey(this.TWITCH_ACCESSTOKEN_KEY, accessToken);
        DurableCache.save(true);
    }

    static getAccessToken(): string | undefined {
        return DurableCache.getKey(this.TWITCH_ACCESSTOKEN_KEY);
    }

    static storeRefreshToken(refreshToken: string): void {
        DurableCache.setKey(this.TWITCH_REFRESHTOKEN_KEY, refreshToken);
        DurableCache.save(true);
    }

    static getRefreshToken(): string | undefined {
        return DurableCache.getKey(this.TWITCH_REFRESHTOKEN_KEY);
    }
}
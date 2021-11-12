import * as FlatCache from 'flat-cache';

export default class CacheService {

    private static readonly CACHE_KEY = 'acho-bot-cache';
    private static readonly TWITCH_ACCESSTOKEN_KEY = 'twitch-access-token';
    private static readonly TWITCH_REFRESHTOKEN_KEY = 'twitch-refresh-token';
    
    static storeAccessToken(accessToken: string): void {
        this.store(this.TWITCH_ACCESSTOKEN_KEY, accessToken);
    }

    static getAccessToken(): string {
        return this.get<string>(this.TWITCH_ACCESSTOKEN_KEY);
    }

    static storeRefreshToken(refreshToken: string): void {
        this.store(this.TWITCH_REFRESHTOKEN_KEY, refreshToken);
    }

    static getRefreshToken(): string {
        return this.get(this.TWITCH_REFRESHTOKEN_KEY);
    }

    static store<TValue>(key: string, value: TValue): void {
        const cache = FlatCache.load(this.CACHE_KEY);
        cache.setKey(key, value);
        cache.save(true);
    }

    static get<TValue>(key: string): TValue {
        const cache = FlatCache.load(this.CACHE_KEY);
        const value: TValue = cache.getKey(key);

        return value;
    }

    static clearAll(): void {
        const cache = FlatCache.load(this.CACHE_KEY);
        cache.removeCacheFile();
    }
}
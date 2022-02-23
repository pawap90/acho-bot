import * as NodeCache from 'node-cache';
import * as FlatCache from 'flat-cache';

/** Memory cache. The cache is lost when the server stops. */
export const AppCache = new NodeCache();

/** Disk cache. Cached values will still be available after the server restarts */
export const DurableCache = FlatCache.load('ACHOBOT_DISK_CACHE');
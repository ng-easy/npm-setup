export declare const NODE_MODULES = "node_modules";
export declare const NPM_CACHE: string;
export declare const PLATFORM_ARCH: string;
export declare const ROLLING_CACHE_KEY: string;
export declare const CACHE_VERSION = "v1";
export interface Cache {
    path: string;
    keys: string[];
}
export declare function restoreCacheAction(cache: Cache): Promise<boolean>;
export declare function saveCacheAction(cache: Cache): Promise<boolean>;
export declare function getNodeModulesCache(): Promise<Cache>;
export declare function getNpmCache(): Promise<Cache>;

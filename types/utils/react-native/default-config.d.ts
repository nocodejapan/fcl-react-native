export function getDefaultConfig(): {
    "discovery.wallet.method.default": string;
    "fcl.storage.default": {
        can: boolean;
        get: (key: any) => Promise<any>;
        put: (key: any, value: any) => Promise<void>;
    } | null;
};

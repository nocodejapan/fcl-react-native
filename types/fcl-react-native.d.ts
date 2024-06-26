export { VERSION, query, verifyUserSignatures, serialize, tx, events, pluginRegistry, discovery, t, WalletUtils, AppUtils, InteractionTemplateUtils, getChainId, TestUtils, config, send, decode, account, block, isOk, isBad, why, pipe, build, withPrefix, sansPrefix, display, cadence, cdc, createSignableVoucher, voucherIntercept, voucherToTxId, transaction, script, ping, atBlockHeight, atBlockId, getAccount, getEvents, getEventsAtBlockHeightRange, getEventsAtBlockIds, getBlock, getBlockHeader, getCollection, getTransactionStatus, getTransaction, getNetworkParameters, getNodeVersionInfo, authorizations, authorization, args, arg, proposer, payer, limit, ref, params, param, validator, invariant, subscribeEvents, nodeVersionInfo, } from "@onflow/fcl-core";
export declare const mutate: (opts?: {
    cadence?: string | undefined;
    args?: any;
    template?: string | object | undefined;
    limit?: number | undefined;
    authz?: Function | undefined;
    proposer?: Function | undefined;
    payer?: Function | undefined;
    authorizations?: Function[] | undefined;
} | undefined) => Promise<string>;
declare const currentUser: {
    (): {
        authenticate: (arg0: any) => any;
        unauthenticate: () => void;
        authorization: Promise<object>;
        signUserMessage: Promise<import("@onflow/typedefs").CompositeSignature[]>;
        subscribe: (callback: Function) => Function;
        snapshot: () => Promise<import("@onflow/typedefs").CurrentUser>;
        resolveArgument: Promise<Function>;
    };
    authenticate: (arg0: any) => any;
    unauthenticate: () => void;
    authorization: Promise<object>;
    signUserMessage: Promise<import("@onflow/typedefs").CompositeSignature[]>;
    subscribe: (callback: Function) => Function;
    snapshot: () => Promise<import("@onflow/typedefs").CurrentUser>;
    resolveArgument: Promise<Function>;
};
export { currentUser };
export declare const authenticate: (opts?: {}) => any;
export declare const unauthenticate: () => void;
export declare const reauthenticate: (opts?: {}) => any;
export declare const signUp: (opts?: {}) => any;
export declare const logIn: (opts?: {}) => any;
export declare const authz: Promise<object>;
import { useServiceDiscovery, ServiceDiscovery } from "./utils/react-native";
export { useServiceDiscovery, ServiceDiscovery };

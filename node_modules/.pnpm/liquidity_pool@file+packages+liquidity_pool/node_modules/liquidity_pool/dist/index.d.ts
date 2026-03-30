import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDGGKE6AXV6BUGN5HSQKTUDVM6MMEHJSPGUYFL6VOVI6J54YDON6ESYU";
    };
};
export type DataKey = {
    tag: "TokenA";
    values: void;
} | {
    tag: "TokenB";
    values: void;
} | {
    tag: "TotalShares";
    values: void;
} | {
    tag: "ReserveA";
    values: void;
} | {
    tag: "ReserveB";
    values: void;
} | {
    tag: "Shares";
    values: readonly [string];
};
export interface Client {
    /**
     * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    swap: ({ to, buy_a, out, in_max }: {
        to: string;
        buy_a: boolean;
        out: i128;
        in_max: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    deposit: ({ to, desired_a, min_a, desired_b, min_b }: {
        to: string;
        desired_a: i128;
        min_a: i128;
        desired_b: i128;
        min_b: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    withdraw: ({ to, share_amount, min_a, min_b }: {
        to: string;
        share_amount: i128;
        min_a: i128;
        min_b: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<readonly [i128, i128]>>;
    /**
     * Construct and simulate a get_rsrvs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_rsrvs: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [i128, i128]>>;
    /**
     * Construct and simulate a balance_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    balance_shares: ({ user }: {
        user: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { token_a, token_b }: {
        token_a: string;
        token_b: string;
    }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        swap: (json: string) => AssembledTransaction<null>;
        deposit: (json: string) => AssembledTransaction<null>;
        withdraw: (json: string) => AssembledTransaction<readonly [bigint, bigint]>;
        get_rsrvs: (json: string) => AssembledTransaction<readonly [bigint, bigint]>;
        balance_shares: (json: string) => AssembledTransaction<bigint>;
    };
}

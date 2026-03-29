import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDGGKE6AXV6BUGN5HSQKTUDVM6MMEHJSPGUYFL6VOVI6J54YDON6ESYU",
  }
} as const

export type DataKey = {tag: "TokenA", values: void} | {tag: "TokenB", values: void} | {tag: "TotalShares", values: void} | {tag: "ReserveA", values: void} | {tag: "ReserveB", values: void} | {tag: "Shares", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap: ({to, buy_a, out, in_max}: {to: string, buy_a: boolean, out: i128, in_max: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({to, desired_a, min_a, desired_b, min_b}: {to: string, desired_a: i128, min_a: i128, desired_b: i128, min_b: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({to, share_amount, min_a, min_b}: {to: string, share_amount: i128, min_a: i128, min_b: i128}, options?: MethodOptions) => Promise<AssembledTransaction<readonly [i128, i128]>>

  /**
   * Construct and simulate a get_rsrvs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_rsrvs: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [i128, i128]>>

  /**
   * Construct and simulate a balance_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance_shares: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {token_a, token_b}: {token_a: string, token_b: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({token_a, token_b}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABlRva2VuQQAAAAAAAAAAAAAAAAAGVG9rZW5CAAAAAAAAAAAAAAAAAAtUb3RhbFNoYXJlcwAAAAAAAAAAAAAAAAhSZXNlcnZlQQAAAAAAAAAAAAAACFJlc2VydmVCAAAAAQAAAAAAAAAGU2hhcmVzAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAEc3dhcAAAAAQAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAVidXlfYQAAAAAAAAEAAAAAAAAAA291dAAAAAALAAAAAAAAAAZpbl9tYXgAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAAFAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAJZGVzaXJlZF9hAAAAAAAACwAAAAAAAAAFbWluX2EAAAAAAAALAAAAAAAAAAlkZXNpcmVkX2IAAAAAAAALAAAAAAAAAAVtaW5fYgAAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAMc2hhcmVfYW1vdW50AAAACwAAAAAAAAAFbWluX2EAAAAAAAALAAAAAAAAAAVtaW5fYgAAAAAAAAsAAAABAAAD7QAAAAIAAAALAAAACw==",
        "AAAAAAAAAAAAAAAJZ2V0X3JzcnZzAAAAAAAAAAAAAAEAAAPtAAAAAgAAAAsAAAAL",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAOYmFsYW5jZV9zaGFyZXMAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAs=" ]),
      options
    )
  }
  public readonly fromJSON = {
    swap: this.txFromJSON<null>,
        deposit: this.txFromJSON<null>,
        withdraw: this.txFromJSON<readonly [i128, i128]>,
        get_rsrvs: this.txFromJSON<readonly [i128, i128]>,
        balance_shares: this.txFromJSON<i128>
  }
}
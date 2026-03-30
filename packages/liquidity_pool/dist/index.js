import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { token_a, token_b }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ token_a, token_b }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABlRva2VuQQAAAAAAAAAAAAAAAAAGVG9rZW5CAAAAAAAAAAAAAAAAAAtUb3RhbFNoYXJlcwAAAAAAAAAAAAAAAAhSZXNlcnZlQQAAAAAAAAAAAAAACFJlc2VydmVCAAAAAQAAAAAAAAAGU2hhcmVzAAAAAAABAAAAEw==",
            "AAAAAAAAAAAAAAAEc3dhcAAAAAQAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAVidXlfYQAAAAAAAAEAAAAAAAAAA291dAAAAAALAAAAAAAAAAZpbl9tYXgAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAAFAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAJZGVzaXJlZF9hAAAAAAAACwAAAAAAAAAFbWluX2EAAAAAAAALAAAAAAAAAAlkZXNpcmVkX2IAAAAAAAALAAAAAAAAAAVtaW5fYgAAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAMc2hhcmVfYW1vdW50AAAACwAAAAAAAAAFbWluX2EAAAAAAAALAAAAAAAAAAVtaW5fYgAAAAAAAAsAAAABAAAD7QAAAAIAAAALAAAACw==",
            "AAAAAAAAAAAAAAAJZ2V0X3JzcnZzAAAAAAAAAAAAAAEAAAPtAAAAAgAAAAsAAAAL",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAOYmFsYW5jZV9zaGFyZXMAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAs="]), options);
        this.options = options;
    }
    fromJSON = {
        swap: (this.txFromJSON),
        deposit: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        get_rsrvs: (this.txFromJSON),
        balance_shares: (this.txFromJSON)
    };
}

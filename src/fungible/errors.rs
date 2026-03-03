use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub(crate) enum ContractError {
    // Indicates an internal error in protocol implementation, such as invalid
    // ledger state. This may not happen in the real networks, but might appear
    // when using malformed test data (such as malformed ledger snapshots).
    InternalError = 1,
    // Indicates an impossible function has been invoked, such as clawback for
    // an asset that does not have clawback enabled. Or, an operation has been
    // called affecting the issuer's trustline.
    OperationNotSupportedError = 2,
    // Indicates the SAC has already been initialized. This error may only occur
    // during initialization of an asset's SAC instance.
    AlreadyInitializedError = 3,
    // Unused = 4, - this error code is not used by SAC
    // Unused = 5, - this error code is not used by SAC
    // An account that would be modified by this transaction does not exist on
    // the network.
    AccountMissingError = 6,
    // Unused = 7, - this error code is not used by SAC
    // Indicates an amount less than zero was provided for a transfer amount.
    NegativeAmountError = 8,
    // Indicates an insufficient spender's available allowance amount. Also used
    // to indicate a problem with expiration ledger when creating an allowance.
    AllowanceError = 9,
    // Indicates too low of a balance to spend the requested amount, or a
    // balance as a result of this transaction would be too low or high, or a
    // problem with attempting a clawback on a non-clawback-enabled trustline.
    BalanceError = 10,
    // Indicates an address has had its balance authorization revoked by the
    // asset issuer.
    BalanceDeauthorizedError = 11,
    // Indicates this transaction would result in a spender's allowance
    // overflowing.
    OverflowError = 12,
    // Indicates a trustline entry does not exist for this address to hold this
    // asset.
    TrustlineMissingError = 13,
}

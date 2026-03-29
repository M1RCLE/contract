use soroban_sdk::{Address, Env, MuxedAddress, String, contract, contractimpl};
use stellar_access::ownable::{Ownable, set_owner};
use stellar_macros::only_owner;
use stellar_tokens::fungible::{Base, FungibleToken, burnable::FungibleBurnable};

#[contract]
pub struct EdmToken;

#[contractimpl]
impl EdmToken {
    pub fn __constructor(e: &Env, owner: Address) {
        Base::set_metadata(
            e,
            6,
            String::from_str(e, "EDM"),
            String::from_str(e, "EDMT"),
        );
        set_owner(e, &owner);
    }

    #[only_owner]
    pub fn mint(e: &Env, to: &Address, amount: i128) {
        Base::mint(e, to, amount);
    }
}

#[contractimpl(contracttrait)]
impl FungibleToken for EdmToken {
    type ContractType = Base;
}

#[contractimpl(contracttrait)]
impl FungibleBurnable for EdmToken {}

#[contractimpl(contracttrait)]
impl Ownable for EdmToken {}

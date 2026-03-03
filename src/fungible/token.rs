use crate::fungible::errors::ContractError;
use crate::fungible::events::{emit_approve, emit_burn, emit_mint, emit_transfer};
use crate::fungible::interface::StellarAssetInterface;
use soroban_sdk::{contract, contractimpl, contracttype, panic_with_error, Address, Env, String};

const DECIMALS: u32 = 18;
const DAY_IN_LEDGERS: u32 = 17280;
pub const BALANCE_EXTEND_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
pub const BALANCE_TTL_THRESHOLD: u32 = BALANCE_EXTEND_AMOUNT - DAY_IN_LEDGERS;

#[contracttype]
pub struct AllowanceData {
    pub amount: i128,
    pub live_until_ledger: u32,
}

#[contracttype]
pub struct AllowanceKey {
    pub owner: Address,
    pub spender: Address,
}

#[contracttype]
pub struct Metadata {
    pub decimals: u32,
    pub name: String,
    pub symbol: String,
}

#[contracttype]
pub enum FungibleStorageKey {
    Owner,
    Meta,
    TotalSupply,
    Balance(Address),
    Allowance(AllowanceKey),
}

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    pub fn init(env: Env, owner: Address, name: String, symbol: String) {
        if env.storage().instance().has(&FungibleStorageKey::Owner) {
            panic_with_error!(&env, ContractError::AlreadyInitializedError);
        }

        owner.require_auth();

        env.storage()
            .instance()
            .set(&FungibleStorageKey::Owner, &owner);
        env.storage().instance().set(
            &FungibleStorageKey::Meta,
            &Metadata {
                decimals: DECIMALS,
                name,
                symbol,
            },
        );
        env.storage()
            .instance()
            .set(&FungibleStorageKey::TotalSupply, &0_i128);
    }

    pub fn owner(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&FungibleStorageKey::Owner)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InternalError))
    }

    pub fn total_supply(env: &Env) -> i128 {
        env.storage()
            .instance()
            .get(&FungibleStorageKey::TotalSupply)
            .unwrap_or(0)
    }

    fn get_metadata(env: &Env) -> Metadata {
        env.storage()
            .instance()
            .get(&FungibleStorageKey::Meta)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InternalError))
    }

    fn allowance_data(env: &Env, owner: &Address, spender: &Address) -> AllowanceData {
        let key = AllowanceKey {
            owner: owner.clone(),
            spender: spender.clone(),
        };
        let allowance_data = env
            .storage()
            .temporary()
            .get(&FungibleStorageKey::Allowance(key))
            .unwrap_or(AllowanceData {
                amount: 0,
                live_until_ledger: 0,
            });

        if allowance_data.live_until_ledger < env.ledger().sequence() {
            AllowanceData {
                amount: 0,
                live_until_ledger: 0,
            }
        } else {
            allowance_data
        }
    }

    fn set_allowance(
        env: &Env,
        owner: &Address,
        spender: &Address,
        amount: i128,
        live_until_ledger: u32,
    ) {
        if amount < 0 {
            panic_with_error!(&env, ContractError::NegativeAmountError);
        }

        let current_ledger = env.ledger().sequence();

        if live_until_ledger > env.ledger().max_live_until_ledger()
            || (amount > 0 && live_until_ledger < current_ledger)
        {
            panic_with_error!(&env, ContractError::AllowanceError);
        }

        let key = FungibleStorageKey::Allowance(AllowanceKey {
            owner: owner.clone(),
            spender: spender.clone(),
        });
        let allowance = AllowanceData {
            amount,
            live_until_ledger,
        };

        env.storage().temporary().set(&key, &allowance);

        if amount > 0 {
            let live_for = live_until_ledger - current_ledger;

            env.storage()
                .temporary()
                .extend_ttl(&key, live_for, live_for);
        }
    }

    fn update(env: &Env, from: Option<&Address>, to: Option<&Address>, amount: i128) {
        if amount < 0 {
            panic_with_error!(&env, ContractError::NegativeAmountError);
        }
        if let Some(account) = from {
            let mut from_balance = Self::balance(env, account);
            if from_balance < amount {
                panic_with_error!(&env, ContractError::BalanceError);
            }
            from_balance -= amount;
            env.storage()
                .persistent()
                .set(&FungibleStorageKey::Balance(account.clone()), &from_balance);
        } else {
            let total_supply = Self::total_supply(env);
            let Some(new_total_supply) = total_supply.checked_add(amount) else {
                panic_with_error!(&env, ContractError::OverflowError);
            };
            env.storage()
                .instance()
                .set(&FungibleStorageKey::TotalSupply, &new_total_supply);
        }

        if let Some(account) = to {
            let to_balance = Self::balance(env, account) + amount;
            env.storage()
                .persistent()
                .set(&FungibleStorageKey::Balance(account.clone()), &to_balance);
        } else {
            let total_supply = Self::total_supply(env) - amount;
            env.storage()
                .instance()
                .set(&FungibleStorageKey::TotalSupply, &total_supply);
        }
    }

    fn spend_allowance(env: &Env, owner: &Address, spender: &Address, amount: i128) {
        if amount < 0 {
            panic_with_error!(&env, ContractError::NegativeAmountError);
        }

        let allowance = Self::allowance_data(env, owner, spender);

        if allowance.amount < amount {
            panic_with_error!(&env, ContractError::AllowanceError);
        }

        if amount > 0 {
            Self::set_allowance(
                env,
                owner,
                spender,
                allowance.amount - amount,
                allowance.live_until_ledger,
            );
        }
    }

    fn require_owner_auth(env: &Env) {
        let owner = Self::owner(env);
        owner.require_auth();
    }
}

#[contractimpl]
impl StellarAssetInterface for Token {
    fn decimals(env: &Env) -> u32 {
        Self::get_metadata(env).decimals
    }

    fn name(env: &Env) -> String {
        Self::get_metadata(env).name
    }

    fn symbol(env: &Env) -> String {
        Self::get_metadata(env).symbol
    }

    fn allowance(env: &Env, owner: &Address, spender: &Address) -> i128 {
        Self::allowance_data(env, owner, spender).amount
    }

    fn approve(
        env: &Env,
        owner: &Address,
        spender: &Address,
        amount: i128,
        live_until_ledger: u32,
    ) {
        owner.require_auth();
        Self::set_allowance(env, owner, spender, amount, live_until_ledger);
        emit_approve(env, owner, spender, amount, live_until_ledger);
    }

    fn balance(env: &Env, account: &Address) -> i128 {
        let key = FungibleStorageKey::Balance(account.clone());
        if let Some(balance) = env.storage().persistent().get::<_, i128>(&key) {
            env.storage().persistent().extend_ttl(
                &key,
                BALANCE_TTL_THRESHOLD,
                BALANCE_EXTEND_AMOUNT,
            );
            balance
        } else {
            0
        }
    }

    fn transfer(env: &Env, from: &Address, to: &Address, amount: i128) {
        from.require_auth();
        Self::update(env, Some(from), Some(to), amount);
        emit_transfer(env, from, to, None, amount);
    }

    fn transfer_from(env: &Env, spender: &Address, from: &Address, to: &Address, amount: i128) {
        spender.require_auth();
        Self::spend_allowance(env, from, spender, amount);
        Self::update(env, Some(from), Some(to), amount);
        emit_transfer(env, from, to, None, amount);
    }

    fn mint(env: &Env, to: &Address, amount: i128) {
        Self::require_owner_auth(env);
        Self::update(env, None, Some(to), amount);
        emit_mint(env, to, amount);
    }

    fn burn(env: &Env, from: &Address, amount: i128) {
        from.require_auth();
        Self::update(env, Some(from), None, amount);
        emit_burn(env, from, amount);
    }

    fn burn_from(env: &Env, spender: &Address, from: &Address, amount: i128) {
        spender.require_auth();
        Self::spend_allowance(env, from, spender, amount);
        Self::update(env, Some(from), None, amount);
        emit_burn(env, from, amount);
    }
}

use soroban_sdk::{contractevent, Address, Env};

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Approve {
    #[topic]
    pub owner: Address,
    #[topic]
    pub spender: Address,
    pub amount: i128,
    pub live_until_ledger: u32,
}

pub fn emit_approve(
    env: &Env,
    owner: &Address,
    spender: &Address,
    amount: i128,
    live_until_ledger: u32,
) {
    Approve {
        owner: owner.clone(),
        spender: spender.clone(),
        amount,
        live_until_ledger,
    }
    .publish(env);
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Transfer {
    #[topic]
    pub from: Address,
    #[topic]
    pub to: Address,
    pub to_muxed_id: Option<u64>,
    pub amount: i128,
}

pub fn emit_transfer(
    env: &Env,
    from: &Address,
    to: &Address,
    to_muxed_id: Option<u64>,
    amount: i128,
) {
    Transfer {
        from: from.clone(),
        to: to.clone(),
        to_muxed_id,
        amount,
    }
    .publish(env);
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Burn {
    #[topic]
    pub from: Address,
    pub amount: i128,
}

pub fn emit_burn(env: &Env, from: &Address, amount: i128) {
    Burn {
        from: from.clone(),
        amount,
    }
    .publish(env);
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Mint {
    #[topic]
    pub to: Address,
    pub amount: i128,
}

pub fn emit_mint(env: &Env, to: &Address, amount: i128) {
    Mint {
        to: to.clone(),
        amount,
    }
    .publish(env);
}

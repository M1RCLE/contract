#[cfg(test)]
mod tests {
    use crate::fungible::token::Token;
    use crate::fungible::token::TokenClient;
    use soroban_sdk::{
        testutils::{Address as _, MockAuth, MockAuthInvoke},
        Address, Env, IntoVal, String,
    };

    fn setup() -> (Env, TokenClient<'static>, Address, Address, Address) {
        let env = Env::default();
        let contract_id = env.register(Token, ());
        let client = TokenClient::new(&env, &contract_id);
        let owner = Address::generate(&env);
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        client
            .mock_auths(&[MockAuth {
                address: &owner,
                invoke: &MockAuthInvoke {
                    contract: &contract_id,
                    fn_name: "init",
                    args: (
                        &owner,
                        String::from_str(&env, "Token"),
                        String::from_str(&env, "TT"),
                    )
                        .into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .init(
                &owner,
                &String::from_str(&env, "Token"),
                &String::from_str(&env, "TT"),
            );
        (env, client, owner, alice, bob)
    }

    #[test]
    fn should_set_owner_name_and_symbol_when_initialized() {
        let (env, client, owner, _, _) = setup();
        assert_eq!(client.owner(), owner);
        assert_eq!(client.name(), String::from_str(&env, "Token"));
        assert_eq!(client.symbol(), String::from_str(&env, "TT"));
        assert_eq!(client.decimals(), 18);
    }

    #[test]
    fn should_mint_tokens_when_caller_is_owner() {
        let (_env, client, owner, alice, _) = setup();
        client.mock_all_auths().mint(&alice, &1_000);
        assert_eq!(client.balance(&alice), 1_000);
        assert_eq!(client.total_supply(), 1_000);
        let _ = owner;
    }

    #[test]
    #[should_panic]
    fn should_reject_mint_when_caller_is_not_owner() {
        let (env, client, owner, alice, _) = setup();
        let contract_id = client.address.clone();
        let attacker = Address::generate(&env);
        client
            .mock_auths(&[MockAuth {
                address: &attacker,
                invoke: &MockAuthInvoke {
                    contract: &contract_id,
                    fn_name: "mint",
                    args: (&alice, 500_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .mint(&alice, &500);
        let _ = owner;
    }

    #[test]
    fn should_transfer_tokens_when_balance_is_sufficient() {
        let (env, client, owner, alice, bob) = setup();
        client
            .mock_auths(&[MockAuth {
                address: &owner,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "mint",
                    args: (&alice, 1_000_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .mint(&alice, &1_000);

        client
            .mock_auths(&[MockAuth {
                address: &alice,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "transfer",
                    args: (&alice, &bob, 300_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .transfer(&alice, &bob, &300);

        assert_eq!(client.balance(&alice), 700);
        assert_eq!(client.balance(&bob), 300);
    }

    #[test]
    fn should_move_allowance_on_transfer_from_when_allowance_is_sufficient() {
        let (env, client, owner, alice, bob) = setup();
        client
            .mock_auths(&[MockAuth {
                address: &owner,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "mint",
                    args: (&alice, 1_000_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .mint(&alice, &1_000);

        client
            .mock_auths(&[MockAuth {
                address: &alice,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "approve",
                    args: (&alice, &bob, 400_i128, 0_u32).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .approve(&alice, &bob, &400, &0);

        client
            .mock_auths(&[MockAuth {
                address: &bob,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "transfer_from",
                    args: (&bob, &alice, &bob, 250_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .transfer_from(&bob, &alice, &bob, &250);

        assert_eq!(client.balance(&alice), 750);
        assert_eq!(client.balance(&bob), 250);
        assert_eq!(client.allowance(&alice, &bob), 150);
    }

    #[test]
    fn should_burn_caller_tokens_and_decrease_total_supply_when_burn_is_called() {
        let (env, client, owner, alice, _) = setup();
        client
            .mock_auths(&[MockAuth {
                address: &owner,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "mint",
                    args: (&alice, 1_000_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .mint(&alice, &1_000);

        client
            .mock_auths(&[MockAuth {
                address: &alice,
                invoke: &MockAuthInvoke {
                    contract: &client.address,
                    fn_name: "burn",
                    args: (&alice, 300_i128).into_val(&env),
                    sub_invokes: &[],
                },
            }])
            .burn(&alice, &300);

        assert_eq!(client.balance(&alice), 700);
        assert_eq!(client.total_supply(), 700);
    }
}

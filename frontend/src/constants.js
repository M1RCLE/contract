// ── Contract addresses ──────────────────────────────────────────
export const TOKEN_A  = 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA'; // USDC
export const TOKEN_B  = 'CCECJKPMU2DCVVNIUWVYYS4F3WETD7B6ABTJG7OVYEYEOJ4JI7KZ7FPZ'; // EDMT
export const CONTRACT = 'CDGGKE6AXV6BUGN5HSQKTUDVM6MMEHJSPGUYFL6VOVI6J54YDON6ESYU';
export const RPC_URL  = 'https://soroban-testnet.stellar.org';
export const NET_PASS = 'Test SDF Network ; September 2015';

// ── Known wallets ───────────────────────────────────────────────
export const WALLETS = [
  { name: 'Ходжахов Эмиль',  addr: 'GDL3XDTLQWUBTLWGWFTTQFRQMBBV4NO2FI2FSYX7HWKYOHTSYK5BGYKK' },
  { name: 'Шиндарев Михаил', addr: 'GBVQMFXXNOZFBARCPUEIJF5UFDW4EIBMWYBUJ7INU6B23NSUBUEXBNVY'  },
];

// ── Reactive state ──────────────────────────────────────────────
export const state = {
  connected: false,
  wIdx:      0,
  pk:        null,
  client:    null,   // liquidity_pool Client instance (set after connect)
  rA:        0n,     // Reserve A (USDC) in stroops
  rB:        0n,     // Reserve B (EDMT) in stroops
  totalS:    0n,     // Total LP shares in stroops
};

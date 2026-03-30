import { WALLETS, state } from './constants.js';
import { fmtAddr, setH, showRes, wait } from './utils.js';

// ── LOBSTR API accessor ─────────────────────────────────────────
const lobstr = () => window.lobstrApi;

// ── Connect ─────────────────────────────────────────────────────
export async function connectWallet() {
  const btn = document.getElementById('connectBtn');
  try {
    if (typeof window.lobstrApi === 'undefined') {
      alert('LOBSTR extension не найден.\nУстанови расширение с lobstr.co/signer-extension/');
      return;
    }

    btn.textContent = 'Подключение…';
    btn.disabled = true;

    const ok = await lobstr().isConnected();
    if (!ok) { alert('LOBSTR не готов. Открой мобильное приложение LOBSTR.'); return; }

    const pk = await lobstr().getPublicKey();
    if (!pk) { alert('Не удалось получить публичный ключ.'); return; }

    state.connected = true;
    state.pk = pk;

    // ── Инициализируй Client (раскомментируй после pnpm build) ──
    // import { Client, networks } from 'liquidity_pool';
    // state.client = new Client({
    //   ...networks.testnet,
    //   rpcUrl: 'https://soroban-testnet.stellar.org',
    //   publicKey: pk,
    //   signTransaction: xdr => lobstr().signTransaction(xdr),
    // });

    // Snap to wallet preset if address matches
    const idx = WALLETS.findIndex(w => w.addr === pk);
    if (idx >= 0) selectWallet(idx, false);
    else document.getElementById('waddr').textContent = fmtAddr(pk);

    onConnected(pk);

  } catch (e) {
    alert('Ошибка: ' + (e.message || e));
  } finally {
    btn.textContent = 'Connected';
    btn.disabled = false;
  }
}

// ── Disconnect ──────────────────────────────────────────────────
export function disconnectWallet() {
  Object.assign(state, { connected: false, pk: null, client: null, rA: 0n, rB: 0n, totalS: 0n });
  document.getElementById('connectBtn').style.display = '';
  document.getElementById('connectBtn').textContent = 'Connect LOBSTR';
  document.getElementById('lobstrNotice').style.display = '';
  document.getElementById('walletBar').style.display = 'none';
  setH('sA', '—'); setH('sB', '—'); setH('sS', '—');
}

// ── Select wallet preset ────────────────────────────────────────
export function selectWallet(idx, prefill = true) {
  state.wIdx = idx;
  state.pk   = WALLETS[idx].addr;

  document.querySelectorAll('.wpill').forEach((p, i) => p.classList.toggle('on', i === idx));
  document.getElementById('waddr').textContent = fmtAddr(WALLETS[idx].addr);

  if (prefill) {
    ['swapTo', 'depTo', 'wdTo', 'infoUser'].forEach(id => {
      const e = document.getElementById(id);
      if (e) e.value = WALLETS[idx].addr;
    });
  }
}

// ── After connect ───────────────────────────────────────────────
function onConnected(pk) {
  document.getElementById('connectBtn').style.display  = 'none';
  document.getElementById('lobstrNotice').style.display = 'none';
  document.getElementById('walletBar').style.display   = 'flex';

  ['swapTo', 'depTo', 'wdTo', 'infoUser'].forEach(id => {
    const e = document.getElementById(id);
    if (e && !e.value) e.value = pk;
  });
}

// ── Refresh reserves and shares ─────────────────────────────────
export async function refreshStats() {
  setH('sA', '<span style="color:var(--txt3)">…</span>');
  setH('sB', '<span style="color:var(--txt3)">…</span>');
  setH('sS', '<span style="color:var(--txt3)">…</span>');

  try {
    if (!state.client) {
      await wait(400);
      setH('sA', '—'); setH('sB', '—'); setH('sS', '—');
      showRes('infoRes', 'Подключи Client из TS-биндингов для загрузки живых данных.', 'info');
      return;
    }

    // ── Живые данные (раскомментируй) ───────────────────────────
    // const rsrvs = await state.client.get_rsrvs();
    // state.rA = rsrvs.result[0];
    // state.rB = rsrvs.result[1];
    //
    // const bal = await state.client.balance_shares({ user: state.pk });
    // state.totalS = bal.result; // NOTE: total_shares нужен отдельным вызовом
    //
    // import { dec6 } from './utils.js';
    // setH('sA', dec6(state.rA));
    // document.getElementById('sAsub').textContent = state.rA + 'n';
    // setH('sB', dec6(state.rB));
    // document.getElementById('sBsub').textContent = state.rB + 'n';
    // setH('sS', dec6(bal.result));
    // document.getElementById('sSsub').textContent = bal.result + 'n';

  } catch (e) {
    setH('sA', 'ERR'); setH('sB', 'ERR'); setH('sS', 'ERR');
    console.error('refreshStats:', e);
  }
}

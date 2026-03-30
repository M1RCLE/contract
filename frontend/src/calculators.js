import { state } from './constants.js';
import { toBig, dec6, g, setT, calcSwapSell, calcDepositAmounts } from './utils.js';

// ── Swap direction UI ────────────────────────────────────────────
export function updateSwapUI() {
  const buyA = document.getElementById('swapDir').value === 'BtoA';

  document.getElementById('outBadge').textContent = buyA ? 'USDC' : 'EDMT';
  document.getElementById('outBadge').className   = 'tb ' + (buyA ? 'tba' : 'tbb');
  document.getElementById('outTag').textContent   = buyA ? 'USDC' : 'EDMT';

  document.getElementById('inBadge').textContent  = buyA ? 'EDMT' : 'USDC';
  document.getElementById('inBadge').className    = 'tb ' + (buyA ? 'tbb' : 'tba');
  document.getElementById('inTag').textContent    = buyA ? 'EDMT' : 'USDC';

  // reset in_max when direction changes
  document.getElementById('swapInMax').value = '';
  calcSwap();
}

// ── Swap estimate ────────────────────────────────────────────────
export function calcSwap() {
  const buyA = document.getElementById('swapDir').value === 'BtoA';
  const out  = toBig(document.getElementById('swapOut').value);
  const est  = document.getElementById('swapEst');

  if (!out || out <= 0n) {
    setT('estSell', '—'); setT('estPrice', '—'); setT('estImpact', '—');
    return;
  }

  const [rSell, rBuy] = buyA ? [state.rB, state.rA] : [state.rA, state.rB];

  if (rSell === 0n || rBuy === 0n) {
    setT('estSell', '— (загрузи резервы через ↻)');
    setT('estPrice', '—'); setT('estImpact', '—');
    est.classList.add('on');
    return;
  }

  const sell = calcSwapSell(out, rSell, rBuy);
  if (!sell) {
    setT('estSell', '⚠ недостаточно ликвидности');
    setT('estPrice', '—'); setT('estImpact', '—');
    est.classList.add('on');
    return;
  }

  const spot   = Number(rSell) / Number(rBuy);
  const exec   = Number(sell)  / Number(out);
  const impact = (exec - spot) / spot * 100;

  setT('estSell',   dec6(sell) + ' ' + (buyA ? 'EDMT' : 'USDC'));
  setT('estPrice',  exec.toFixed(6) + ' ' + (buyA ? 'EDMT/USDC' : 'USDC/EDMT'));

  const impEl = document.getElementById('estImpact');
  impEl.textContent = impact.toFixed(3) + '%';
  impEl.className   = 'ev' + (impact > 5 ? ' w' : '');

  // auto-fill in_max with 1% slippage buffer if still empty
  const inMaxEl = document.getElementById('swapInMax');
  if (!inMaxEl.value) inMaxEl.value = dec6(sell * 101n / 100n);

  est.classList.add('on');
}

// ── Deposit estimate ─────────────────────────────────────────────
export function calcDeposit() {
  const da  = toBig(g('depDA'));
  const db  = toBig(g('depDB'));
  const est = document.getElementById('depEst');

  if (!da || !db) { est.classList.remove('on'); return; }

  const { actA, actB } = calcDepositAmounts(da, db, state.rA, state.rB);

  document.getElementById('dEstA').textContent = dec6(actA) + ' USDC';
  document.getElementById('dEstB').textContent = dec6(actB) + ' EDMT';

  if (state.rA > 0n && state.rB > 0n) {
    setT('dEstR', (Number(state.rA) / Number(state.rB)).toFixed(6) + ' USDC/EDMT');
  } else {
    setT('dEstR', 'Пул пуст — произвольное соотношение');
  }

  est.classList.add('on');

  // auto-fill slippage (5%)
  if (!g('depMinA')) document.getElementById('depMinA').value = dec6(actA * 95n / 100n);
  if (!g('depMinB')) document.getElementById('depMinB').value = dec6(actB * 95n / 100n);
}

// ── Withdraw estimate ────────────────────────────────────────────
export function calcWithdraw() {
  const share = toBig(g('wdShare'));
  const est   = document.getElementById('wdEst');

  if (!share || share <= 0n || state.totalS === 0n) { est.classList.remove('on'); return; }

  const oA  = state.rA * share / state.totalS;
  const oB  = state.rB * share / state.totalS;
  const pct = (Number(share) / Number(state.totalS) * 100).toFixed(3);

  document.getElementById('wEstA').textContent = dec6(oA) + ' USDC';
  document.getElementById('wEstB').textContent = dec6(oB) + ' EDMT';
  document.getElementById('wEstP').textContent = pct + '%';

  // auto-fill min with 5% slippage
  document.getElementById('wdMinA').value = dec6(oA * 95n / 100n);
  document.getElementById('wdMinB').value = dec6(oB * 95n / 100n);

  est.classList.add('on');
}

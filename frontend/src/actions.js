import { state } from './constants.js';
import { g, fmtAddr, toBig, dec6, wait, showRes, setLoading, resetBtn, calcSwapSell, calcDepositAmounts } from './utils.js';

function assertConnected(resId) {
  if (!state.connected) {
    showRes(resId, 'Сначала подключи LOBSTR кошелёк.', 'err');
    return false;
  }
  return true;
}

// ── Swap ────────────────────────────────────────────────────────
export async function doSwap() {
  const btn   = document.getElementById('swapBtn');
  const buyA  = document.getElementById('swapDir').value === 'BtoA';
  const to    = g('swapTo');
  const out   = toBig(g('swapOut'));
  const inMax = toBig(g('swapInMax'));

  if (!to || !out || !inMax) { showRes('swapRes', 'Заполни все поля.', 'err'); return; }
  if (!assertConnected('swapRes')) return;

  setLoading(btn, 'Симуляция…');
  try {
    // ── Реальный вызов (раскомментируй) ─────────────────────────
    // const tx = await state.client.swap({ to, buy_a: buyA, out, in_max: inMax });
    // await tx.signAndSend();
    // showRes('swapRes', `✓ Готово!\nTx hash: ${tx.sendTransactionResponse.hash}`, 'ok');
    // return;

    await wait(800);
    const [rSell, rBuy] = buyA ? [state.rB, state.rA] : [state.rA, state.rB];
    const sell = calcSwapSell(out, rSell, rBuy);
    showRes('swapRes',
      `[preview]\nswap({\n  to: "${fmtAddr(to)}",\n  buy_a: ${buyA},\n  out: ${out}n,\n  in_max: ${inMax}n\n})\n\n` +
      (sell ? `est. sell = ${dec6(sell)} ${buyA ? 'EDMT' : 'USDC'}` : 'загрузи резервы для расчёта'),
      'info',
    );
  } catch (e) {
    showRes('swapRes', 'Ошибка: ' + e.message, 'err');
  } finally {
    resetBtn(btn);
  }
}

// ── Deposit ─────────────────────────────────────────────────────
export async function doDeposit() {
  const btn  = document.getElementById('depBtn');
  const to   = g('depTo');
  const da   = toBig(g('depDA')),   minA = toBig(g('depMinA'));
  const db   = toBig(g('depDB')),   minB = toBig(g('depMinB'));

  if (!to || !da || !minA || !db || !minB) { showRes('depRes', 'Заполни все поля.', 'err'); return; }
  if (!assertConnected('depRes')) return;

  setLoading(btn, 'Симуляция…');
  try {
    // ── Реальный вызов (раскомментируй) ─────────────────────────
    // const tx = await state.client.deposit({ to, desired_a: da, min_a: minA, desired_b: db, min_b: minB });
    // await tx.signAndSend();
    // showRes('depRes', `✓ Готово!\nTx hash: ${tx.sendTransactionResponse.hash}`, 'ok');
    // return;

    await wait(800);
    showRes('depRes',
      `[preview]\ndeposit({\n  to: "${fmtAddr(to)}",\n  desired_a: ${da}n,  min_a: ${minA}n,\n  desired_b: ${db}n,  min_b: ${minB}n\n})`,
      'info',
    );
  } catch (e) {
    showRes('depRes', 'Ошибка: ' + e.message, 'err');
  } finally {
    resetBtn(btn);
  }
}

// ── Withdraw ────────────────────────────────────────────────────
export async function doWithdraw() {
  const btn   = document.getElementById('wdBtn');
  const to    = g('wdTo');
  const share = toBig(g('wdShare'));
  const minA  = toBig(g('wdMinA'));
  const minB  = toBig(g('wdMinB'));

  if (!to || !share || !minA || !minB) { showRes('wdRes', 'Заполни все поля.', 'err'); return; }
  if (!assertConnected('wdRes')) return;

  setLoading(btn, 'Симуляция…');
  try {
    // ── Реальный вызов (раскомментируй) ─────────────────────────
    // const tx = await state.client.withdraw({ to, share_amount: share, min_a: minA, min_b: minB });
    // const [oA, oB] = tx.result;
    // await tx.signAndSend();
    // showRes('wdRes', `✓ Готово!\nПолучил: ${dec6(oA)} USDC + ${dec6(oB)} EDMT`, 'ok');
    // return;

    await wait(800);
    const oA = state.totalS > 0n ? state.rA * share / state.totalS : null;
    const oB = state.totalS > 0n ? state.rB * share / state.totalS : null;
    showRes('wdRes',
      `[preview]\nwithdraw({\n  to: "${fmtAddr(to)}",\n  share_amount: ${share}n,\n  min_a: ${minA}n,  min_b: ${minB}n\n})\n\n` +
      (oA != null ? `returns: (${dec6(oA)} USDC, ${dec6(oB)} EDMT)` : 'загрузи резервы для расчёта'),
      'info',
    );
  } catch (e) {
    showRes('wdRes', 'Ошибка: ' + e.message, 'err');
  } finally {
    resetBtn(btn);
  }
}

// ── Check shares ────────────────────────────────────────────────
export async function checkShares() {
  const user = g('infoUser');
  if (!user) { showRes('infoRes', 'Введи адрес.', 'err'); return; }

  showRes('infoRes', '<span class="spin"></span> Запрос…', 'info');
  await wait(400);

  try {
    // ── Реальный вызов (раскомментируй) ─────────────────────────
    // const tx = await state.client.balance_shares({ user });
    // showRes('infoRes', `Shares: ${dec6(tx.result)}\nRaw: ${tx.result}n`, 'info');
    // return;

    showRes('infoRes',
      `balance_shares({ user: "${fmtAddr(user)}" })\n→ returns i128 (LP шеры)\n\nПодключи Client для запроса живых данных.`,
      'info',
    );
  } catch (e) {
    showRes('infoRes', 'Ошибка: ' + e.message, 'err');
  }
}

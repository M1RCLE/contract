// ── Decimal helpers (6 decimals) ────────────────────────────────
export const dec6  = n => (n != null ? (Number(n) / 1e6).toFixed(6) : '—');
export const toBig = f => {
  if (f === '' || f == null) return null;
  const v = parseFloat(f);
  if (isNaN(v)) return null;
  return BigInt(Math.round(v * 1e6));
};
export const fmtAddr = a => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '—');
export const wait    = ms => new Promise(r => setTimeout(r, ms));

// ── DOM helpers ─────────────────────────────────────────────────
export const g    = id => document.getElementById(id)?.value?.trim() ?? '';
export const el   = id => document.getElementById(id);
export const setT = (id, v) => { const e = el(id); if (e) e.textContent = v; };
export const setH = (id, v) => { const e = el(id); if (e) e.innerHTML   = v; };

export function showRes(id, msg, type = 'info') {
  const e = el(id);
  if (!e) return;
  e.className = `res on ${type}`;
  e.innerHTML = msg.replace(/\n/g, '<br>');
}

export function setLoading(btn, text) {
  btn._orig = btn.textContent;
  btn.innerHTML = `<span class="spin"></span>${text}`;
  btn.disabled = true;
}
export function resetBtn(btn) {
  btn.innerHTML = btn._orig;
  btn.disabled = false;
}

// ── Swap formula (mirrors pool.rs exactly) ───────────────────────
// sell = floor(reserve_sell * out * 1000 / ((reserve_buy - out) * 997)) + 1
export function calcSwapSell(out, rSell, rBuy) {
  if (out <= 0n || rBuy <= out) return null;
  const n = rSell * out * 1000n;
  const d = (rBuy - out) * 997n;
  if (d <= 0n) return null;
  return n / d + 1n;
}

// ── Deposit amounts (mirrors get_deposit_amounts in pool.rs) ────
export function calcDepositAmounts(da, db, rA, rB) {
  if (rA === 0n && rB === 0n) return { actA: da, actB: db };
  const amtB = da * rB / rA;
  if (amtB <= db) return { actA: da, actB: amtB };
  const amtA = db * rA / rB;
  return { actA: amtA, actB: db };
}

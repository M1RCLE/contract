import { connectWallet, disconnectWallet, selectWallet, refreshStats } from './wallet.js';
import { doSwap, doDeposit, doWithdraw, checkShares } from './actions.js';
import { updateSwapUI, calcSwap, calcDeposit, calcWithdraw } from './calculators.js';

// ── Tabs ─────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const panelId = 'panel-' + tab.dataset.panel;
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
      document.getElementById(panelId).classList.add('on');
      tab.classList.add('on');
    });
  });
}

// ── Wallet pills ─────────────────────────────────────────────────
function initWalletPills() {
  document.querySelectorAll('.wpill').forEach(pill => {
    pill.addEventListener('click', () => selectWallet(Number(pill.dataset.idx)));
  });
}

// ── Button events ────────────────────────────────────────────────
function initButtons() {
  document.getElementById('connectBtn').addEventListener('click', connectWallet);
  document.getElementById('disconnectBtn').addEventListener('click', disconnectWallet);
  document.getElementById('refreshBtn').addEventListener('click', refreshStats);
  document.getElementById('swapBtn').addEventListener('click', doSwap);
  document.getElementById('depBtn').addEventListener('click', doDeposit);
  document.getElementById('wdBtn').addEventListener('click', doWithdraw);
  document.getElementById('checkSharesBtn').addEventListener('click', checkShares);
}

// ── Input events ─────────────────────────────────────────────────
function initInputs() {
  document.getElementById('swapDir').addEventListener('change', updateSwapUI);
  document.getElementById('swapOut').addEventListener('input', calcSwap);
  document.getElementById('depDA').addEventListener('input', calcDeposit);
  document.getElementById('depDB').addEventListener('input', calcDeposit);
  document.getElementById('wdShare').addEventListener('input', calcWithdraw);
}

// ── Boot ─────────────────────────────────────────────────────────
function init() {
  initTabs();
  initWalletPills();
  initButtons();
  initInputs();
}

init();

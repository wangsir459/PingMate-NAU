const views = [...document.querySelectorAll('[data-view]')];
const navItems = [...document.querySelectorAll('.nav-item')];
const modalBackdrops = [...document.querySelectorAll('.modal-backdrop')];
const toast = document.querySelector('.toast');
const profileDrawer = document.querySelector('.profile-drawer');
const drawerShade = document.querySelector('.drawer-shade');
let activePlayer = { name: '林逸', level: 'L3', elo: '1126', style: '横拍 · 右手 · 弧圈快攻' };

function showView(name) {
  views.forEach(view => view.classList.toggle('active', view.dataset.view === name));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.viewTarget === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-view-target]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.viewTarget));
});

document.querySelectorAll('.filter-chip, .mode-switch button, .date-picks button, .venue-picks button, .match-tabs button, .ranking-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
  });
});

function openModal(name) {
  const modal = document.querySelector(`[data-modal="${name}"]`);
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  modalBackdrops.forEach(modal => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModals));
modalBackdrops.forEach(backdrop => backdrop.addEventListener('click', event => {
  if (event.target === backdrop) closeModals();
}));

function getPlayer(card) {
  return {
    name: card.dataset.name,
    level: card.dataset.level,
    elo: card.dataset.eloValue,
    style: card.dataset.style
  };
}

function fillOpponent(player) {
  activePlayer = player;
  document.querySelectorAll('[data-opponent-name]').forEach(el => el.textContent = player.name);
  document.querySelector('[data-opponent-level]').textContent = player.level;
  document.querySelector('[data-opponent-elo]').textContent = player.elo;
  document.querySelector('[data-opponent-style]').textContent = player.style;
  document.querySelector('[data-opponent-avatar]').textContent = player.name.slice(0, 1);
}

document.querySelectorAll('[data-challenge]').forEach(button => {
  button.addEventListener('click', () => {
    fillOpponent(getPlayer(button.closest('.player-card')));
    openModal('challenge');
  });
});

document.querySelector('[data-drawer-challenge]').addEventListener('click', () => {
  closeProfile();
  fillOpponent(activePlayer);
  openModal('challenge');
});

function showProfile(player) {
  activePlayer = player;
  document.querySelector('[data-drawer-name]').textContent = player.name;
  document.querySelector('[data-drawer-level]').textContent = player.level;
  document.querySelector('[data-drawer-elo]').textContent = player.elo;
  document.querySelector('[data-drawer-style]').textContent = player.style;
  document.querySelector('[data-drawer-avatar]').textContent = player.name.slice(0, 1);
  profileDrawer.classList.add('open');
  drawerShade.classList.add('open');
  profileDrawer.setAttribute('aria-hidden', 'false');
}

function closeProfile() {
  profileDrawer.classList.remove('open');
  drawerShade.classList.remove('open');
  profileDrawer.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-player-detail]').forEach(button => button.addEventListener('click', () => showProfile(getPlayer(button.closest('.player-card')))));
document.querySelectorAll('[data-close-profile]').forEach(button => button.addEventListener('click', closeProfile));

document.querySelector('[data-send-challenge]').addEventListener('click', () => {
  closeModals();
  toast.querySelector('strong').textContent = '邀请已发送';
  toast.querySelector('small').textContent = `${activePlayer.name} 回应后会第一时间通知你`;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
});

document.querySelectorAll('[data-score-player]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('[data-score-opponent]').textContent = button.dataset.scorePlayer;
  document.querySelectorAll('.score-step').forEach(step => step.classList.toggle('active', step.dataset.scoreStep === 'form'));
  openModal('score');
}));

document.querySelector('[data-submit-score]').addEventListener('click', () => {
  document.querySelectorAll('.score-step').forEach(step => step.classList.toggle('active', step.dataset.scoreStep === 'success'));
  document.querySelectorAll('[data-elo]').forEach(el => el.textContent = '1018');
});

document.querySelector('[data-finish-score]').addEventListener('click', () => {
  closeModals();
  showView('matches');
});

document.querySelector('[data-confirm-existing]').addEventListener('click', () => {
  document.querySelectorAll('.score-step').forEach(step => step.classList.toggle('active', step.dataset.scoreStep === 'success'));
  document.querySelectorAll('[data-elo]').forEach(el => el.textContent = '1018');
  openModal('score');
});

document.querySelector('[data-open-assessment]').addEventListener('click', () => {
  toast.querySelector('strong').textContent = '能力画像已保存';
  toast.querySelector('small').textContent = 'cyw · L2 入门 · 直拍';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3000);
});

document.querySelector('[data-open-public]').addEventListener('click', () => {
  toast.querySelector('strong').textContent = '公开约球卡已准备';
  toast.querySelector('small').textContent = '继续填写时间与场地即可发布';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3000);
});

document.querySelector('[data-open-profile="self"]').addEventListener('click', () => showProfile({ name: 'cyw', level: 'L2', elo: document.querySelector('[data-elo]').textContent, style: '直拍 · 南京审计大学 · 入门选手' }));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModals();
    closeProfile();
  }
});

// Deep links make presentation capture and guided demos reproducible.
const demoParams = new URLSearchParams(window.location.search);
const initialView = demoParams.get('view');
if (initialView && views.some(view => view.dataset.view === initialView)) showView(initialView);
if (demoParams.get('moment') === 'result') {
  document.querySelectorAll('.score-step').forEach(step => step.classList.toggle('active', step.dataset.scoreStep === 'success'));
  document.querySelectorAll('[data-elo]').forEach(el => el.textContent = '1018');
  openModal('score');
}

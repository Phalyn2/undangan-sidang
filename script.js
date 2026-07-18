(function initFloaters() {
  const emojis = ['💖', '✨', '🌸', '⭐', '🎀', '🦋'];
  const container = document.getElementById('floaters');
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floater';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    const duration = 10 + Math.random() * 14;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(el);
  }

  const sparkleCount = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < sparkleCount; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDelay = (Math.random() * 2.4) + 's';
    container.appendChild(s);
  }
})();

const targetDate = new Date('2026-08-20T09:00:00');

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
  };

  if (diff <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.mins.textContent = '00';
    els.secs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);

  els.days.textContent = String(days).padStart(2, '0');
  els.hours.textContent = String(hours).padStart(2, '0');
  els.mins.textContent = String(mins).padStart(2, '0');
  els.secs.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpBtn = document.getElementById('rsvpBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const rsvpYes = document.getElementById('rsvpYes');
const rsvpNo = document.getElementById('rsvpNo');
const rsvpFeedback = document.getElementById('rsvpFeedback');

function openModal() {
  modalOverlay.classList.add('open');
  rsvpFeedback.style.display = 'none';
  rsvpFeedback.textContent = '';
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

rsvpBtn.addEventListener('click', () => {
  openModal();
  launchConfetti();
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

rsvpYes.addEventListener('click', () => {
  rsvpFeedback.style.display = 'block';
  rsvpFeedback.textContent = 'Yeay makasih banyak! Sampai ketemu di hari-H ya 💖';
  launchConfetti();
});

let noButtonCount = 0;
const maxNoClicks = 3;

rsvpNo.addEventListener('click', function(e) {
  if (noButtonCount < maxNoClicks) {
    e.preventDefault();
    rsvpFeedback.style.display = 'block';
    rsvpFeedback.textContent = 'Hihi';
  }

  if (noButtonCount >= maxNoClicks) return;

  const container = this.parentElement;
  const containerRect = container.getBoundingClientRect();
  const buttonRect = this.getBoundingClientRect();

  const maxX = containerRect.width - buttonRect.width - 10;
  const maxY = containerRect.height - buttonRect.height - 10;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  this.style.position = 'absolute';
  this.style.left = randomX + 'px';
  this.style.top = randomY + 'px';
  this.style.transform = 'translateX(0)';

  noButtonCount++;

  if (noButtonCount >= maxNoClicks) {
    this.style.background = 'var(--pink-hot)';
    this.style.color = 'var(--white)';
    this.style.border = '2px solid var(--pink-hot)';
    this.textContent = '😊 Ya deh, aku hadir!';
    this.classList.add('yes');
    this.classList.remove('no');
    this.style.position = 'relative';
    this.style.left = 'auto';
    this.style.top = 'auto';

    this.onclick = function() {
      rsvpFeedback.style.display = 'block';
      rsvpFeedback.textContent = 'Yeay makasih banyak! Sampai ketemu di hari-H ya 💖';
      launchConfetti();
    };
  }
});

function launchConfetti() {
  const colors = ['#FFB6C1', '#FF69B4', '#FF1493', '#E8B96A', '#FFFDFB'];
  const pieceCount = 40;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const duration = 2.5 + Math.random() * 1.8;
    piece.style.animationDuration = duration + 's';
    piece.style.opacity = 0.85 + Math.random() * 0.15;
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), duration * 1000 + 100);
  }
}

(function initPhotoSlideshow() {
  const img = document.getElementById('profilePhoto');
  if (!img) return;

  let currentIndex = 1;
  const totalPhotos = 6;
  const intervalTime = 3000;

  function changePhoto() {
    currentIndex = (currentIndex % totalPhotos) + 1;

    img.classList.add('fade-out');
    img.classList.remove('fade-in');

    setTimeout(() => {
      img.src = `img/foto-${currentIndex}.jpeg`;
      img.classList.remove('fade-out');
      img.classList.add('fade-in');
    }, 400);
  }

  img.classList.add('fade-in');
  setInterval(changePhoto, intervalTime);
})();

const photoFrame = document.getElementById('photoFrame');
let isExpanded = false;

photoFrame.addEventListener('click', function(e) {
  e.stopPropagation();

  if (isExpanded) {
    this.classList.remove('expanded');
    isExpanded = false;
  } else {
    this.classList.add('expanded');
    isExpanded = true;
  }
});

const audio = new Audio('bg-song.mp3');
audio.loop = true;
audio.volume = 0.7;

const splashScreen = document.getElementById('splashScreen');
const splashBtn = document.getElementById('splashBtn');
const musicControl = document.getElementById('musicControl');

let isMusicPlaying = false;

function playMusic() {
  audio.play().then(() => {
    isMusicPlaying = true;
    musicControl.textContent = '🔊';
    musicControl.classList.remove('paused');
  }).catch(err => {
    console.log('Autoplay ditolak:', err);
  });
}

function pauseMusic() {
  audio.pause();
  isMusicPlaying = false;
  musicControl.textContent = '🔇';
  musicControl.classList.add('paused');
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

splashBtn.addEventListener('click', function() {
  playMusic();
  splashScreen.classList.add('hidden');

  setTimeout(() => {
    splashScreen.style.display = 'none';
  }, 800);
});

musicControl.addEventListener('click', toggleMusic);
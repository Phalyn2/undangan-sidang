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

const targetDate = new Date('2026-07-23T13:00:00');

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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkVWTE8kJKiXbS7z4iQyPj793LJNA-aGySOW_A4q6q5YOL3puAr50hRtJpWnnGhSDWmQ/exec';

async function loadMessages() {
  const container = document.getElementById('rsvpMessagesList');
  if (!container) return;

  try {
    const url = `${SCRIPT_URL}?action=getMessages`;
    const response = await fetch(url);
    const messages = await response.json();

    if (!messages || messages.length === 0) {
      container.innerHTML = `
        <div class="empty-message">
          ✨ Belum ada pesan. Jadilah yang pertama! 💕
        </div>
      `;
      return;
    }

    // Tampilkan 10 pesan terbaru (balik urutan)
    const latestMessages = messages.slice(-10).reverse();

    container.innerHTML = latestMessages.map(msg => `
      <div class="rsvp-message-item">
        <div class="msg-name">
          ${msg.name}
        </div>
        ${msg.message ? `<div class="msg-text">💬 ${msg.message}</div>` : ''}
        <div class="msg-time">${formatTimestamp(msg.timestamp)}</div>
      </div>
    `).join('');

    // Auto scroll ke atas
    container.scrollTop = 0;

  } catch (error) {
    console.error('Gagal memuat pesan:', error);
    container.innerHTML = `
      <div class="empty-message">
        ⚠️ Gagal memuat pesan, tapi tetep semangat! 💪
      </div>
    `;
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Jika kurang dari 1 jam
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} menit yang lalu`;
    }

    // Jika kurang dari 1 hari
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} jam yang lalu`;
    }

    // Format tanggal
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

// Panggil loadMessages saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
  // Tunggu sebentar agar splash screen tidak mengganggu
  setTimeout(() => {
    loadMessages();
  }, 1000);
});

function addMessageToUI(name, status, message, timestamp) {
  const container = document.getElementById('rsvpMessagesList');
  if (!container) return;

  // Hapus pesan kosong jika ada
  const emptyMessage = container.querySelector('.empty-message');
  if (emptyMessage) {
    container.innerHTML = '';
  }

  // Buat elemen pesan baru
  const messageItem = document.createElement('div');
  messageItem.className = 'rsvp-message-item';
  messageItem.style.animation = 'slideInMessage 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both';

  const statusBadge = status === 'Hadir' ? 'Hadir' : status;

  messageItem.innerHTML = `
    <div class="msg-name">
      ${name}
    </div>
    ${message ? `<div class="msg-text">💬 ${message}</div>` : ''}
    <div class="msg-time">Baru saja</div>
  `;

  // Tambahkan pesan di bagian atas (terbaru di atas)
  container.insertBefore(messageItem, container.firstChild);

  // Batasi jumlah pesan yang ditampilkan (maksimal 10)
  while (container.children.length > 10) {
    container.removeChild(container.lastChild);
  }

  // Scroll ke atas
  container.scrollTop = 0;

  // Update waktu setelah 1 menit menjadi "1 menit yang lalu"
  setTimeout(() => {
    const timeElement = messageItem.querySelector('.msg-time');
    if (timeElement) {
      timeElement.textContent = '1 menit yang lalu';
    }
  }, 60000);
}

async function saveToGoogleSheet(name, status, message) {
  try {
    const url = `${SCRIPT_URL}?name=${encodeURIComponent(name)}&status=${encodeURIComponent(status)}&message=${encodeURIComponent(message)}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    // Tambahkan pesan ke UI langsung setelah berhasil menyimpan
    const timestamp = new Date().toISOString();
    addMessageToUI(name, status, message, timestamp);

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    return false;
  }
}



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

rsvpYes.addEventListener('click', async () => {
  const nameInput = document.getElementById('rsvpName');
  const messageInput = document.getElementById('rsvpMessage');
  const name = nameInput.value.trim() || 'Anonim';
  const message = messageInput.value.trim() || '';

  if (!name) {
    rsvpFeedback.style.display = 'block';
    rsvpFeedback.textContent = '⚠️ Nama wajib diisi ya! Jangan malu-malu 😊';
    rsvpFeedback.style.color = '#FF1493';
    nameInput.style.borderColor = '#FF1493';
    nameInput.focus();
    return;
  }

  // VALIDASI: Pesan wajib diisi
  if (!message) {
    rsvpFeedback.style.display = 'block';
    rsvpFeedback.textContent = '💌 Kasih kata-kata dong buat aku! Nggak usah malu 😘';
    rsvpFeedback.style.color = '#FF1493';
    messageInput.style.borderColor = '#FF1493';
    messageInput.focus();
    return;
  }

  // Reset border
  nameInput.style.borderColor = 'var(--pink-pastel)';
  messageInput.style.borderColor = 'var(--pink-pastel)';

  // Disable buttons
  setButtonsDisabled(true);

  rsvpFeedback.style.display = 'block';
  rsvpFeedback.textContent = 'Menyimpan data... 💫';

  const saved = await saveToGoogleSheet(name, 'Hadir', message);

  // Enable buttons kembali
  setButtonsDisabled(false);

  if (saved) {
    rsvpFeedback.textContent = 'Yeay makasih banyak! Sampai ketemu di hari-H ya 💖';
    showToast('🎉 Berhasil! Terima kasih sudah RSVP! 💖', 'success');

    // Close modal setelah 1.5 detik
    setTimeout(() => {
      closeModal();
      nameInput.value = '';
      messageInput.value = '';
      rsvpFeedback.style.display = 'none';
    }, 1500);
  } else {
    rsvpFeedback.textContent = 'Ada kendala teknis, tapi tetep makasih ya! 💖';
    showToast('⚠️ Ada sedikit kendala, tapi data tetap tercatat!', 'warning');

    // Tetap close modal walau error
    setTimeout(() => {
      closeModal();
      nameInput.value = '';
      messageInput.value = '';
      rsvpFeedback.style.display = 'none';
    }, 2000);
  }

  launchConfetti();
});

let noButtonCount = 0;
const maxNoClicks = 3;

rsvpNo.addEventListener('click', function (e) {
  if (noButtonCount < maxNoClicks) {
    e.preventDefault();
    rsvpFeedback.style.display = 'block';
    rsvpFeedback.textContent = 'Hihi 🤭';
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

    this.onclick = async function () {
      const nameInput = document.getElementById('rsvpName');
      const messageInput = document.getElementById('rsvpMessage');
      const name = nameInput.value.trim() || 'Anonim';
      const message = messageInput.value.trim() || '';

      // VALIDASI: Nama wajib diisi
      if (!name) {
        rsvpFeedback.style.display = 'block';
        rsvpFeedback.textContent = '⚠️ Nama wajib diisi ya! Jangan malu-malu 😊';
        rsvpFeedback.style.color = '#FF1493';
        nameInput.style.borderColor = '#FF1493';
        nameInput.focus();
        return;
      }

      // VALIDASI: Pesan wajib diisi
      if (!message) {
        rsvpFeedback.style.display = 'block';
        rsvpFeedback.textContent = '💌 Kasih kata-kata dong buat aku! Nggak usah malu 😘';
        rsvpFeedback.style.color = '#FF1493';
        messageInput.style.borderColor = '#FF1493';
        messageInput.focus();
        return;
      }

      // Reset border
      nameInput.style.borderColor = 'var(--pink-pastel)';
      messageInput.style.borderColor = 'var(--pink-pastel)';

      // Disable buttons
      setButtonsDisabled(true);

      rsvpFeedback.style.display = 'block';
      rsvpFeedback.textContent = 'Menyimpan data... 💫';

      const saved = await saveToGoogleSheet(name, 'Hadir (akhirnya 😄)', message);

      setButtonsDisabled(false);

      if (saved) {
        rsvpFeedback.textContent = 'Yeay makasih banyak! Sampai ketemu di hari-H ya 💖';
        showToast('🎉 Berhasil! Terima kasih sudah RSVP! 💖', 'success');

        setTimeout(() => {
          closeModal();
          nameInput.value = '';
          messageInput.value = '';
          rsvpFeedback.style.display = 'none';
        }, 1500);
      } else {
        rsvpFeedback.textContent = 'Ada kendala teknis, tapi tetep makasih ya! 💖';
        showToast('⚠️ Ada sedikit kendala, tapi data tetap tercatat!', 'warning');

        setTimeout(() => {
          closeModal();
          nameInput.value = '';
          messageInput.value = '';
          rsvpFeedback.style.display = 'none';
        }, 2000);
      }

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

  let currentIndex = 0;
  const totalPhotos = 15;
  const intervalTime = 3000;
  let shuffledOrder = [];
  let isTransitioning = false;
  let isFirstLoad = true;

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initShuffledOrder() {
    shuffledOrder = [];
    for (let i = 1; i <= totalPhotos; i++) {
      shuffledOrder.push(i);
    }
    shuffleArray(shuffledOrder);
  }

  initShuffledOrder();

  // Preload semua gambar di awal
  function preloadImages() {
    const promises = [];
    for (let i = 1; i <= totalPhotos; i++) {
      promises.push(new Promise((resolve) => {
        const tempImg = new Image();
        tempImg.src = `img/foto-${i}.jpg`;
        tempImg.onload = resolve;
        tempImg.onerror = resolve; // tetap resolve walau error
      }));
    }
    return Promise.all(promises);
  }



  function changePhoto() {
    if (isTransitioning) return;
    isTransitioning = true;

    const photoNumber = shuffledOrder[currentIndex];
    currentIndex = (currentIndex + 1) % totalPhotos;

    if (currentIndex === 0) {
      initShuffledOrder();
    }

    img.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    img.style.opacity = '0';

    setTimeout(() => {
      img.src = `img/foto-${photoNumber}.jpg`;
      img.onload = function () {
        img.style.opacity = '1';
        isTransitioning = false;
      };
      img.onerror = function () {
        img.style.opacity = '1';
        isTransitioning = false;
      };
      setTimeout(() => {
        if (isTransitioning) {
          img.style.opacity = '1';
          isTransitioning = false;
        }
      }, 800);
    }, 450);
  }

  // Set initial state
  img.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  img.style.opacity = '0';

  // Load foto pertama dengan cepat
  async function loadFirstPhoto() {
    // Preload semua gambar di background
    preloadImages();

    // Langsung tampilkan foto pertama tanpa menunggu preload selesai
    const firstPhoto = shuffledOrder[0];
    img.src = `img/foto-${firstPhoto}.jpg`;
    img.onload = function () {
      img.style.opacity = '1';
    };
    // Fallback jika foto pertama belum load setelah 300ms
    setTimeout(() => {
      if (img.style.opacity === '0') {
        img.style.opacity = '1';
      }
    }, 300);
  }

  loadFirstPhoto();

  // Mulai slideshow setelah 2 detik (biar user lihat foto pertama dulu)
  setTimeout(() => {
    // Reset index biar ga ke-skip
    currentIndex = 1;
    setInterval(changePhoto, intervalTime);
  }, 2000);
})();

const photoFrame = document.getElementById('photoFrame');
let isExpanded = false;

photoFrame.addEventListener('click', function (e) {
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

splashBtn.addEventListener('click', function () {
  playMusic();
  splashScreen.classList.add('hidden');

  setTimeout(() => {
    splashScreen.style.display = 'none';
  }, 800);
});

musicControl.addEventListener('click', toggleMusic);

// Fungsi untuk disable tombol sementara
function setButtonsDisabled(disabled) {
  const yesBtn = document.getElementById('rsvpYes');
  const noBtn = document.getElementById('rsvpNo');
  const closeBtn = document.getElementById('modalClose');

  if (disabled) {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.style.opacity = '0.6';
    noBtn.style.opacity = '0.6';
    yesBtn.style.cursor = 'not-allowed';
    noBtn.style.cursor = 'not-allowed';
  } else {
    yesBtn.disabled = false;
    noBtn.disabled = false;
    yesBtn.style.opacity = '1';
    noBtn.style.opacity = '1';
    yesBtn.style.cursor = 'pointer';
    noBtn.style.cursor = 'pointer';
  }
}

// Tambahkan fungsi untuk menampilkan notifikasi toast
function showToast(message, type = 'success') {
  // Hapus toast lama jika ada
  const oldToast = document.querySelector('.toast-notification');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger animasi masuk
  setTimeout(() => toast.classList.add('show'), 10);

  // Hapus setelah 4 detik
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


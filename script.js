const slides = document.querySelectorAll('.hero-slide');
let current = 0;

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 6000);

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date('2026-03-29T12:30:00').getTime();
  const now = new Date().getTime();
  const timeLeft = weddingDate - now;

  if (timeLeft <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    return;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Gallery slider
document.addEventListener('DOMContentLoaded', function () {
  const gsMain = document.querySelector('.gs-main');
  const gsMainImg = document.querySelector('.gs-image');
  const thumbs = Array.from(document.querySelectorAll('.gs-thumb'));
  const prev = document.querySelector('.gs-prev');
  const next = document.querySelector('.gs-next');
  if (!gsMainImg || thumbs.length === 0) return;

  let index = 0;
  let isUserInitiated = false; // track if user clicked

  function setActive(i, scrollIntoView = false) {
    index = (i + thumbs.length) % thumbs.length;
    const src = thumbs[index].querySelector('img').getAttribute('data-full') || thumbs[index].querySelector('img').src;
    gsMainImg.src = src;
    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[index].classList.add('active');
    // scroll main gallery into view only if user clicked (not on init)
    if (scrollIntoView && gsMain && gsMain.scrollIntoView) {
      gsMain.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => setActive(i, true));
  });

  prev && prev.addEventListener('click', () => setActive(index - 1, true));
  next && next.addEventListener('click', () => setActive(index + 1, true));

  // touch support for main image
  let startX = 0;
  gsMainImg.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  gsMainImg.addEventListener('touchend', (e) => {
    const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const delta = endX - startX;
    if (delta > 40) setActive(index - 1, true);
    else if (delta < -40) setActive(index + 1, true);
  });

  // init without scroll
  setActive(0, false);
});

// Gift account copy buttons
document.addEventListener('DOMContentLoaded', function () {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const ta = document.createElement('textarea');
          ta.value = value;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const feedback = btn.nextElementSibling;
        if (feedback && feedback.classList) {
          feedback.classList.add('visible');
          setTimeout(() => feedback.classList.remove('visible'), 1600);
        }
      } catch (err) {
        console.error('copy failed', err);
      }
    });
  });
});

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text);

    const feedback = btn.nextElementSibling;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 1500);
  });
});

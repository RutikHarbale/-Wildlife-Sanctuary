/* ============================================
   WIDELIFE SANCTUARY — SCRIPT.JS
   ============================================ */

'use strict';

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    initCounters();
  }, 2200);
});

/* ---------- FLOATING LEAVES ---------- */
(function createLeaves() {
  const container = document.getElementById('leavesContainer');
  const colors = ['#2d6a4f','#52b788','#1a3d2b','#74c69d','#40916c'];
  for (let i = 0; i < 18; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    const size = Math.random() * 14 + 10;
    leaf.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.4 + 0.2};
    `;
    container.appendChild(leaf);
  }
})();

/* ---------- PARTICLES ---------- */
(function createParticles() {
  const container = document.getElementById('particlesContainer');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 6 + 4}s;
      animation-delay: ${Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
})();

/* ---------- NAVBAR ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMenu();
  });
});

function updateActiveNavLink() {
  const sections = ['home','about','gallery','visit','tickets','map','donate','footer'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) current = id;
    }
  });
  allNavLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

/* ---------- SMOOTH SCROLL for all anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (!a.classList.contains('nav-link')) {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }
});

/* ---------- PARALLAX SCROLLING ---------- */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
}, { passive: true });

/* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger children if parent is revealed
      const children = entry.target.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 120);
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- DONATION PROGRESS BAR ---------- */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const target = parseInt(bar.dataset.target, 10);
      setTimeout(() => { bar.style.width = target + '%'; }, 300);
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

const donateBar = document.getElementById('donateProgress');
if (donateBar) progressObserver.observe(donateBar);

/* ---------- ANIMATED COUNTERS ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

/* ---------- GALLERY FILTER ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) {
        item.style.animation = 'none';
        item.offsetHeight; // reflow
        item.style.animation = '';
      }
    });
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc  = document.getElementById('lightboxDesc');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

function openLightbox(src, title, desc) {
  lightboxImg.src   = src;
  lightboxImg.alt   = title;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent  = desc;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(item.dataset.src, item.dataset.title, item.dataset.desc);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeModal(); }
});

/* ---------- AMOUNT BUTTONS ---------- */
const amountBtns = document.querySelectorAll('.amount-btn');
const customInput = document.getElementById('customAmount');

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.amount === 'custom') {
      customInput.style.display = 'block';
      customInput.focus();
    } else {
      customInput.style.display = 'none';
    }
  });
});

/* ---------- DONATE BUTTON & MODAL ---------- */
const donateModal   = document.getElementById('donateModal');
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalOk       = document.getElementById('modalOk');
const donateBtn     = document.getElementById('donateBtn');

function openModal()  { donateModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { donateModal.classList.remove('open'); document.body.style.overflow = ''; }

donateBtn.addEventListener('click', openModal);
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', () => {
  closeModal();
  const home = document.getElementById('home');
  if (home) window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- RIPPLE EFFECT on primary buttons ---------- */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0); animation:rippleAnim 0.6s linear;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// Add ripple keyframe dynamically
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }`;
document.head.appendChild(styleTag);

/* ---------- STAGGER GALLERY REVEALS ---------- */
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 100);
      });
      galleryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) galleryObserver.observe(galleryGrid);

/* ============================================
   TICKET BOOKING SYSTEM
   ============================================ */

/* Ticket price map */
const TICKET_PRICES = { adult: 800, child: 400, safari: 1500 };
let selectedTicketType = '';
let selectedTicketPrice = 0;

/* --- Ticket Card Select Buttons --- */
document.querySelectorAll('.btn-select-ticket').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedTicketType  = btn.dataset.type;
    selectedTicketPrice = parseInt(btn.dataset.price, 10);

    // Highlight selected card
    document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('selected'));
    btn.closest('.ticket-card').classList.add('selected');

    // Sync the form select dropdown
    const sel = document.getElementById('bookType');
    if (sel) sel.value = selectedTicketType;

    // Recalculate total
    calcTotal();

    // Smooth scroll to booking form
    const bookingWrap = document.querySelector('.booking-wrap');
    if (bookingWrap) {
      const top = bookingWrap.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- Price Calculation --- */
function calcTotal() {
  const typeEl = document.getElementById('bookType');
  const qtyEl  = document.getElementById('bookQty');
  const totalAmountEl = document.getElementById('totalAmount');
  const totalNoteEl   = document.querySelector('.total-note');
  if (!typeEl || !qtyEl) return;

  const type  = typeEl.value;
  const qty   = parseInt(qtyEl.value, 10) || 1;
  const price = TICKET_PRICES[type] || 0;

  if (price > 0) {
    const total = price * qty;
    totalAmountEl.textContent = '\u20b9' + total.toLocaleString('en-IN');
    if (totalNoteEl) totalNoteEl.textContent = qty + ' x \u20b9' + price.toLocaleString('en-IN');
  } else {
    totalAmountEl.textContent = '\u20b90';
    if (totalNoteEl) totalNoteEl.textContent = 'Select type & quantity';
  }
}

/* Recalc when dropdown changes */
const bookTypeEl = document.getElementById('bookType');
if (bookTypeEl) {
  bookTypeEl.addEventListener('change', () => {
    selectedTicketType  = bookTypeEl.value;
    selectedTicketPrice = TICKET_PRICES[bookTypeEl.value] || 0;
    // Sync card highlight
    document.querySelectorAll('.ticket-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.type === bookTypeEl.value);
    });
    calcTotal();
  });
}

/* --- Quantity +/- Controls --- */
const qtyInput = document.getElementById('bookQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus  = document.getElementById('qtyPlus');

function setQty(val) {
  if (!qtyInput) return;
  const min = parseInt(qtyInput.min, 10) || 1;
  const max = parseInt(qtyInput.max, 10) || 20;
  qtyInput.value = Math.min(max, Math.max(min, val));
  calcTotal();
}

if (qtyMinus) qtyMinus.addEventListener('click', () => setQty(parseInt(qtyInput.value, 10) - 1));
if (qtyPlus)  qtyPlus.addEventListener('click',  () => setQty(parseInt(qtyInput.value, 10) + 1));
if (qtyInput) qtyInput.addEventListener('change', calcTotal);

/* --- Set minimum date to today --- */
const bookDateEl = document.getElementById('bookDate');
if (bookDateEl) {
  const today = new Date().toISOString().split('T')[0];
  bookDateEl.setAttribute('min', today);
}

/* --- Form Validation --- */
function clearErrors() {
  ['errName','errEmail','errDate','errType'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function showError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) input.classList.add('input-error');
  if (err)   err.textContent = msg;
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name  = document.getElementById('bookName')?.value.trim();
  const email = document.getElementById('bookEmail')?.value.trim();
  const date  = document.getElementById('bookDate')?.value;
  const type  = document.getElementById('bookType')?.value;

  if (!name || name.length < 2) {
    showError('bookName', 'errName', 'Please enter your full name.');
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('bookEmail', 'errEmail', 'Please enter a valid email address.');
    valid = false;
  }
  if (!date) {
    showError('bookDate', 'errDate', 'Please select a visit date.');
    valid = false;
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      showError('bookDate', 'errDate', 'Visit date cannot be in the past.');
      valid = false;
    }
  }
  if (!type) {
    showError('bookType', 'errType', 'Please select a ticket type.');
    valid = false;
  }

  return valid;
}

/* --- Form Submit --- */
const bookingForm    = document.getElementById('bookingForm');
const bookingConfirm = document.getElementById('bookingConfirm');
const confirmMsg     = document.getElementById('confirmMsg');
const bookAgainBtn   = document.getElementById('bookAgainBtn');

if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const name  = document.getElementById('bookName').value.trim();
    const date  = document.getElementById('bookDate').value;
    const type  = document.getElementById('bookType').value;
    const qty   = parseInt(document.getElementById('bookQty').value, 10);
    const price = TICKET_PRICES[type] || 0;
    const total = price * qty;
    const typeLabel = { adult: 'Adult', child: 'Child', safari: 'Safari Pass' }[type];

    const formatted = new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

    if (confirmMsg) {
      confirmMsg.textContent =
        `Hi ${name}! Your booking of ${qty} ${typeLabel} ticket(s) for ${formatted} ` +
        `is confirmed. Total paid: \u20b9${total.toLocaleString('en-IN')}. ` +
        `A confirmation has been sent to your email.`;
    }

    // Hide form, show confirmation
    bookingForm.style.display = 'none';
    if (bookingConfirm) bookingConfirm.classList.add('visible');
  });
}

if (bookAgainBtn) {
  bookAgainBtn.addEventListener('click', () => {
    // Reset form
    if (bookingForm) {
      bookingForm.reset();
      bookingForm.style.display = '';
    }
    if (bookingConfirm) bookingConfirm.classList.remove('visible');
    clearErrors();
    document.getElementById('totalAmount').textContent = '\u20b90';
    const noteEl = document.querySelector('.total-note');
    if (noteEl) noteEl.textContent = 'Select type & quantity';
    document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('selected'));
    selectedTicketType = '';
    selectedTicketPrice = 0;
  });
}

/* ============================================
   LEAFLET MAP — fixed (OSM tiles, deferred init)
   ============================================ */
(function initMap() {
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  /* Wait until Leaflet script is available */
  function setupMap() {
    if (typeof L === 'undefined') {
      setTimeout(setupMap, 100);
      return;
    }

    // Sanctuary coordinates — Western Ghats, near Sakleshpur, Karnataka
    const LAT = 12.9374;
    const LNG = 75.7831;

    const map = L.map('leafletMap', {
      center: [LAT, LNG],
      zoom: 13,
      scrollWheelZoom: false,  // prevent hijacking page scroll
      zoomControl: true
    });

    /* ---- OpenStreetMap tile layer (free, no API key, works on file://) ---- */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }).addTo(map);

    /* ---- Custom paw-print marker ---- */
    const markerIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:46px;height:46px;border-radius:50% 50% 50% 0;
        background:linear-gradient(135deg,#2d6a4f,#52b788);
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 20px rgba(45,106,79,0.7);
        border:3px solid rgba(255,255,255,0.4);">
        <span style="transform:rotate(45deg);color:#fff;font-size:1.2rem;">🐾</span>
      </div>`,
      iconSize:    [46, 46],
      iconAnchor:  [23, 46],
      popupAnchor: [0, -50]
    });

    /* ---- Marker + popup ---- */
    L.marker([LAT, LNG], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`
        <strong style="color:#52b788;font-size:1rem;">Widelife Sanctuary</strong>
        <p style="margin:6px 0 0;color:#ccc;font-size:0.82rem;">
          Western Ghats Forest Reserve<br>
          Sakleshpur, Karnataka — 577427<br>
          <a href="https://www.google.com/maps/dir/?api=1&destination=12.9374,75.7831"
             target="_blank" rel="noopener"
             style="color:#52b788;font-weight:600;">
            ↗ Get Directions
          </a>
        </p>`)
      .openPopup();

    /* ---- Shaded circle showing protected zone ---- */
    L.circle([LAT, LNG], {
      color:       '#52b788',
      fillColor:   '#2d6a4f',
      fillOpacity: 0.15,
      radius:      3000,
      weight:      2
    }).addTo(map);

    /* ---- Fix grey tiles: invalidate size after map is visible ---- */
    setTimeout(() => map.invalidateSize(), 300);

    /* ---- Also fix on IntersectionObserver trigger ---- */
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          map.invalidateSize();
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(mapContainer);
    }

    /* ---- Scroll-wheel zoom: only active when user clicks the map ---- */
    map.on('click',    () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
  }

  setupMap();
})();

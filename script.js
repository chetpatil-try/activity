/* =======================================================
   PORTFOLIO — SCRIPT.JS
   Typing effect · Particle canvas · Scroll animations
   Navbar · Testimonial slider · Form validation · Tilt
======================================================= */

'use strict';

/* --------------------------------------------------
   1. TYPING EFFECT
-------------------------------------------------- */
const typedEl  = document.getElementById('typedText');
const phrases  = [
  'Full-Stack Apps.',
  'Beautiful UIs.',
  'Fast APIs.',
  'Cloud Solutions.',
  'AI Experiences.',
];
let pIdx = 0, cIdx = 0, isDeleting = false;

function type() {
  const current = phrases[pIdx];
  typedEl.textContent = isDeleting
    ? current.substring(0, cIdx - 1)
    : current.substring(0, cIdx + 1);

  isDeleting ? cIdx-- : cIdx++;

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && cIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && cIdx === 0) {
    isDeleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();


/* --------------------------------------------------
   2. PARTICLE CANVAS — HERO BACKGROUND
-------------------------------------------------- */
const canvas  = document.getElementById('heroCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 245, 255, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles(count = 90) {
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawLines() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Pause particles when tab is hidden (performance)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(animFrame);
  else animateParticles();
});


/* --------------------------------------------------
   3. MOUSE PARALLAX — HERO
-------------------------------------------------- */
const heroContent = document.querySelector('.hero-content');
document.querySelector('.hero').addEventListener('mousemove', (e) => {
  const { innerWidth: W, innerHeight: H } = window;
  const x = (e.clientX / W - 0.5) * 12;
  const y = (e.clientY / H - 0.5) * 8;
  heroContent.style.transform = `translate(${x}px, ${y}px)`;
});
document.querySelector('.hero').addEventListener('mouseleave', () => {
  heroContent.style.transform = 'translate(0, 0)';
});


/* --------------------------------------------------
   4. NAVBAR — SCROLL & ACTIVE LINK
-------------------------------------------------- */
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-link');
const hamburger   = document.getElementById('navHamburger');
const navLinksEl  = document.getElementById('navLinks');
const sections    = document.querySelectorAll('section[id]');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 20);

  // Hide on scroll down, show on up
  if (current > lastScroll && current > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = current;

  // Active nav link
  let activeId = '';
  sections.forEach(s => {
    const top = s.offsetTop - 120;
    if (current >= top) activeId = s.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${activeId}`);
  });
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


/* --------------------------------------------------
   5. SCROLL REVEAL — INTERSECTION OBSERVER
-------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on position among siblings
        const siblings = [...entry.target.parentElement.children]
          .filter(c => c.classList.contains('reveal-up') ||
                       c.classList.contains('reveal-left') ||
                       c.classList.contains('reveal-right'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => revealObs.observe(el));


/* --------------------------------------------------
   6. PROJECT CARD TILT EFFECT
-------------------------------------------------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* --------------------------------------------------
   7. TESTIMONIAL SLIDER
-------------------------------------------------- */
const track    = document.getElementById('testimonialsTrack');
const cards    = track ? track.children : [];
const dotsWrap = document.getElementById('tlDots');
const prevBtn  = document.getElementById('prevTestimonial');
const nextBtn  = document.getElementById('nextTestimonial');
let current    = 0;
let autoPlay;

function createDots() {
  for (let i = 0; i < cards.length; i++) {
    const d = document.createElement('button');
    d.className = 'tl-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to review ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
}

function goTo(index) {
  current = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('.tl-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function startAuto() {
  autoPlay = setInterval(() => goTo(current + 1), 5000);
}

if (track && cards.length) {
  createDots();
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  startAuto();

  // Pause on hover
  track.closest('.testimonials-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.closest('.testimonials-wrapper').addEventListener('mouseleave', startAuto);
}

function resetAuto() { clearInterval(autoPlay); startAuto(); }


/* --------------------------------------------------
   8. CONTACT FORM — VALIDATION + TOAST
-------------------------------------------------- */
const form       = document.getElementById('contactForm');
const nameInput  = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const msgInput   = document.getElementById('messageInput');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const toast      = document.getElementById('toast');

function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.style.borderColor = isError ? '#ef4444' : 'var(--neon-cyan)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setError(input, msg) {
  input.style.borderColor = '#ef4444';
  input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
  showToast(`❌ ${msg}`, true);
}
function clearError(input) {
  input.style.borderColor = '';
  input.style.boxShadow   = '';
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError(nameInput);
    clearError(emailInput);
    clearError(msgInput);

    if (!nameInput.value.trim()) {
      return setError(nameInput, 'Please enter your name.');
    }
    if (!validateEmail(emailInput.value)) {
      return setError(emailInput, 'Please enter a valid email address.');
    }
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      return setError(msgInput, 'Message must be at least 10 characters.');
    }

    // Simulate sending
    const btnText = document.getElementById('btnText');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    submitBtn.style.opacity = '0.7';

    await new Promise(r => setTimeout(r, 1600));

    submitBtn.disabled = false;
    btnText.innerHTML  = 'Send Message ✉️';
    submitBtn.style.opacity = '1';
    form.reset();
    formSuccess.style.display = 'block';
    showToast('🎉 Message sent! I\'ll get back to you soon.');
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  });

  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });
}


/* --------------------------------------------------
   9. SMOOTH SKILL CHIP STAGGER ON ENTER
-------------------------------------------------- */
document.querySelectorAll('.skill-chip').forEach((chip, i) => {
  chip.style.opacity      = '0';
  chip.style.transform    = 'translateY(16px)';
  chip.style.transition   = `opacity 0.4s ease ${i * 30}ms, transform 0.4s ease ${i * 30}ms`;
});

const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-chip').forEach(chip => {
        chip.style.opacity   = '1';
        chip.style.transform = 'translateY(0)';
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => skillObs.observe(cat));


/* --------------------------------------------------
   10. COUNTER ANIMATION — ABOUT STATS
-------------------------------------------------- */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + '+';
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.textContent);
        animateCounter(el, target);
      });
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) statObs.observe(aboutSection);


/* --------------------------------------------------
   11. ACTIVE NAV TRANSITION
-------------------------------------------------- */
navbar.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease';

function navegar(seccion, elemento) {
  document.querySelectorAll('.pantalla').forEach(p => {
    p.classList.remove('pantalla-activa');
  });

  const destino = document.getElementById('seccion-' + seccion);
  if (destino) {
    destino.classList.add('pantalla-activa');
  }

  document.querySelectorAll('.menu-link').forEach(link => {
    link.classList.remove('activo');
  });
  elemento.classList.add('activo');

  if (window.innerWidth <= 920) {
    document.getElementById("nav-links").classList.remove("show");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(rescanReveals, 60);
}

document.addEventListener('DOMContentLoaded', () => {

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-ring"></div>
    <div class="loader-text">Cargando proyecto</div>
  `;
  document.body.appendChild(loader);

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 350);
    setTimeout(() => loader.remove(), 1100);
  });

  setTimeout(() => loader.classList.add('hidden'), 2500);

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks   = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("show");
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') navLinks.classList.remove('show');
    });
  }

  autoMarkReveals();

  initRevealObserver();

  initCardTilt();

  initParallax();

  initScrollProgress(progress);
});



function autoMarkReveals() {
  document.querySelectorAll('.section-head, .bloque-principal, .bloque-secundario, .mapa-texto, .mapa-imagen-wrap, .pie-pagina .col-footer')
    .forEach(el => el.classList.add('reveal'));

  document.querySelectorAll('.conceptos-grid, .rpubs-grid, .objetivos-grid')
    .forEach(el => el.classList.add('reveal-stagger'));

  document.querySelectorAll('.tabla-contenedor')
    .forEach(el => el.classList.add('reveal-zoom'));

  document.querySelectorAll('.mapa-container')
    .forEach(el => el.classList.add('reveal-zoom'));

  document.querySelectorAll('.section-box').forEach(el => el.classList.add('section-box'));
}

let revealObserver = null;

function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger, .section-box')
      .forEach(el => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  rescanReveals();
}

function rescanReveals() {
  if (!revealObserver) return;
  document
    .querySelectorAll('.reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible), .reveal-zoom:not(.is-visible), .reveal-stagger:not(.is-visible), .section-box:not(.is-visible)')
    .forEach(el => revealObserver.observe(el));
}

function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.tarjeta-concepto, .rpub-card, .bloque-secundario');
  const MAX = 6; 

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * MAX;
      const rotX = -((y - cy) / cy) * MAX;
      card.style.transform =
        `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroes = document.querySelectorAll('.hero, .subhero');
  if (!heroes.length) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    heroes.forEach(h => {
      const rect = h.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const before = h.querySelector(':scope > *:first-child') || h;
        const content = h.querySelector('.hero-content, .subhero-content');
        if (content) {
          content.style.transform = `translateY(${Math.min(y * 0.10, 60)}px)`;
          content.style.opacity = Math.max(1 - y / (window.innerHeight * 0.9), 0.0).toString();
        }
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

function initScrollProgress(bar) {
  if (!bar) return;
  let ticking = false;

  function update() {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}
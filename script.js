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

  document.querySelectorAll('.conceptos-grid, .rpubs-grid, .objetivos-grid, .regresion-grid')
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

  const cards = document.querySelectorAll('.tarjeta-concepto, .rpub-card, .regresion-card, .bloque-secundario');
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

function cerrarAviso() {
  const overlay = document.getElementById('aviso-overlay');
  if (!overlay) return;
  overlay.classList.add('cerrando');
  setTimeout(() => { overlay.style.display = 'none'; }, 320);
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('aviso-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', function (e) {
    if (e.target === this) cerrarAviso();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarAviso();
  });
});


function _posicionarSubmenuMas() {
  const li = document.getElementById('nav-mas');
  if (!li) return;
  const submenu = li.querySelector('.submenu-mas');
  if (!submenu) return;

  const rect = li.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const margin = 16;

  const prevVis = submenu.style.visibility;
  const prevOpa = submenu.style.opacity;
  const prevDis = submenu.style.display;
  submenu.style.visibility = 'hidden';
  submenu.style.opacity = '0';
  submenu.style.display = 'flex';
  const subH = submenu.offsetHeight;
  submenu.style.visibility = prevVis;
  submenu.style.opacity = prevOpa;
  submenu.style.display = prevDis;

  let top = rect.top;

  if (top + subH + margin > viewportH) {
    top = viewportH - subH - margin;
  }
  if (top < margin) top = margin;

  submenu.style.top  = top + 'px';
  submenu.style.left = (rect.right + 12) + 'px';

  const centroBoton = rect.top + rect.height / 2;
  const arrowTop = Math.max(8, Math.min(subH - 20, centroBoton - top - 6));
  submenu.style.setProperty('--arrow-top', arrowTop + 'px');
}

function toggleMasMenu(elemento, ev) {
  if (ev) ev.preventDefault();
  const li = document.getElementById('nav-mas');
  if (!li) return;
  li.classList.toggle('open');
  if (li.classList.contains('open')) _posicionarSubmenuMas();
}

document.addEventListener('DOMContentLoaded', () => {
  const li = document.getElementById('nav-mas');
  if (!li) return;

  li.addEventListener('mouseenter', _posicionarSubmenuMas);

  window.addEventListener('resize', _posicionarSubmenuMas);
  window.addEventListener('scroll', _posicionarSubmenuMas, { passive: true });

  document.addEventListener('click', (e) => {
    if (!li.contains(e.target)) li.classList.remove('open');
  });
});

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP_DEFAULT = 0.2;

let _zoomState = {
  scale: 1,
  tx: 0,
  ty: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  startTx: 0,
  startTy: 0
};

function _getZoomImg() {
  return document.getElementById('mapa-zoom-img');
}

function _getZoomViewport() {
  return document.getElementById('mapa-zoom-viewport');
}

function _aplicarTransformZoom() {
  const img = _getZoomImg();
  const nivel = document.getElementById('zoom-nivel');
  if (!img) return;
  img.style.transform =
    `translate(${_zoomState.tx}px, ${_zoomState.ty}px) scale(${_zoomState.scale})`;
  if (nivel) nivel.textContent = Math.round(_zoomState.scale * 100) + '%';
}

function ajustarZoom(delta) {
  const nuevo = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, _zoomState.scale + delta));
  if (nuevo === 1) { _zoomState.tx = 0; _zoomState.ty = 0; }
  _zoomState.scale = nuevo;
  _aplicarTransformZoom();
}

function resetZoom() {
  _zoomState = { ...(_zoomState), scale: 1, tx: 0, ty: 0,
                 dragging:false, startX:0, startY:0, startTx:0, startTy:0 };
  _aplicarTransformZoom();
}

(function initZoomPan() {
  document.addEventListener('DOMContentLoaded', () => {
    const vp = _getZoomViewport();
    if (!vp) return;

    vp.addEventListener('mousedown', (e) => {
      if (_zoomState.scale <= 1) return;
      _zoomState.dragging = true;
      _zoomState.startX = e.clientX;
      _zoomState.startY = e.clientY;
      _zoomState.startTx = _zoomState.tx;
      _zoomState.startTy = _zoomState.ty;
      vp.classList.add('is-dragging');
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      _zoomState.dragging = false;
      const vp2 = _getZoomViewport();
      vp2 && vp2.classList.remove('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!_zoomState.dragging) return;
      _zoomState.tx = _zoomState.startTx + (e.clientX - _zoomState.startX);
      _zoomState.ty = _zoomState.startTy + (e.clientY - _zoomState.startY);
      _aplicarTransformZoom();
    });

    vp.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      ajustarZoom(e.deltaY < 0 ? ZOOM_STEP_DEFAULT : -ZOOM_STEP_DEFAULT);
    }, { passive: false });

    vp.addEventListener('dblclick', () => {
      _zoomState.scale = _zoomState.scale > 1 ? 1 : 2;
      _zoomState.tx = 0; _zoomState.ty = 0;
      _aplicarTransformZoom();
    });
  });
})();

function abrirZoomFull() {
  const img = _getZoomImg();
  if (!img) return;

  let modal = document.getElementById('zoom-fullscreen-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'zoom-fullscreen-modal';
    modal.className = 'zoom-fullscreen';
    modal.innerHTML = `
      <button class="zoom-fullscreen-close" type="button" aria-label="Cerrar">
        <i class="fas fa-xmark"></i>
      </button>
      <img alt="Mapa ampliado">
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.zoom-fullscreen-close')) {
        modal.classList.remove('activo');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('activo');
    });
  }

  const fullImg = modal.querySelector('img');
  fullImg.src = img.src;
  modal.classList.add('activo');
}
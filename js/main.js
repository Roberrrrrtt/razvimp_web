/**
 * SCRIPT PRINCIPAL: NAVEGACIÓN, HEADER SCROLL, MENÚ MÓVIL Y ACORDEÓN FAQ
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Sticky con Detección de Scroll Suave
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Menú Móvil Avanzado (Drawer Lateral + Telón Backdrop)
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const siteNav = document.getElementById('siteNav');
  const navBackdrop = document.getElementById('navBackdrop');

  const openNav = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    siteNav?.classList.add('is-open');
    navBackdrop?.classList.add('is-active');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    siteNav?.classList.remove('is-open');
    navBackdrop?.classList.remove('is-active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (navToggle) {
    navToggle.addEventListener('click', openNav);
  }

  if (navClose) {
    navClose.addEventListener('click', closeNav);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
  }

  // Cerrar al hacer clic en cualquier enlace del menú móvil
  const navLinks = siteNav?.querySelectorAll('.site-nav__link') || [];
  navLinks.forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Cerrar si se pulsa fuera del menú
  document.addEventListener('click', (e) => {
    if (siteNav?.classList.contains('is-open')) {
      if (!siteNav.contains(e.target) && !navToggle?.contains(e.target)) {
        closeNav();
      }
    }
  });

  // Cerrar con tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav?.classList.contains('is-open')) {
      closeNav();
    }
  });

  // Selección rápida de servicio al pulsar la tarjeta en versión móvil
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth <= 640 && !e.target.closest('a')) {
        const titleEl = card.querySelector('.service-card__title');
        const serviceName = titleEl ? titleEl.textContent.replace(/^\d+\.\s*/, '').trim() : '';
        const select = document.getElementById('formService');
        if (select && serviceName) {
          select.value = serviceName;
          select.style.borderColor = 'var(--color-primary-light)';
          setTimeout(() => { select.style.borderColor = ''; }, 1200);
        }
        const contactSec = document.getElementById('contacto');
        if (contactSec) {
          const headerHeight = header ? header.offsetHeight : 70;
          const targetPos = contactSec.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  });
  // 3. Scroll Suave con Compensación de Header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 75;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

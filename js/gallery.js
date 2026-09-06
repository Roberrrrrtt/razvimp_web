/**
 * GESTIÓN DE GALERÍA, FILTROS Y LIGHTBOX
 */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');
  const beforeAfterSection = document.getElementById('beforeAfterWrapper');

  // 1. Filtrado de Categorías
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Activar botón pulsado
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Si el filtro es "antes-despues", mostrar/resaltar el comparador
      if (filterValue === 'antes-despues') {
        if (beforeAfterSection) {
          beforeAfterSection.style.display = 'block';
          beforeAfterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        galleryItems.forEach((item) => {
          item.style.display = 'none';
        });
        return;
      }

      // Si es otro filtro, mostrar u ocultar elementos
      if (beforeAfterSection) {
        beforeAfterSection.style.display = (filterValue === 'all') ? 'block' : 'none';
      }

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Lightbox Modal
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && closeBtn) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-card__title')?.textContent || '';
        const category = item.querySelector('.gallery-card__category')?.textContent || '';

        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption) {
            lightboxCaption.textContent = category ? `${category}: ${title}` : title;
          }
          lightbox.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }
});

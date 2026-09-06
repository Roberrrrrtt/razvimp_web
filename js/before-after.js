/**
 * COMPARADOR INTERACTIVO ANTES / DESPUÉS
 * Permite comparar visualmente el estado de una cubierta dañada vs impermeabilizada
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('beforeAfterBox');
  if (!container) return;

  const afterLayer = container.querySelector('.before-after__after-layer');
  const handle = container.querySelector('.before-after__handle');
  const labelBefore = container.querySelector('.before-after__label--before');
  const labelAfter = container.querySelector('.before-after__label--after');
  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;

    // Limitar entre 0 y el ancho del contenedor
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    // Transición suave de opacidad para que nunca choquen las etiquetas
    if (labelAfter) {
      labelAfter.style.opacity = percentage < 22 ? '0' : '1';
    }
    if (labelBefore) {
      labelBefore.style.opacity = percentage > 78 ? '0' : '1';
    }
  };

  // Eventos de Ratón (Mouse)
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Eventos Táctiles (Móviles / Tablets)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Ajustar tamaño de imagen interna al cambiar el ancho de pantalla
  const syncInnerImageWidth = () => {
    const innerImg = afterLayer?.querySelector('img');
    if (innerImg && container) {
      const boxWidth = Math.round(container.getBoundingClientRect().width || container.offsetWidth);
      innerImg.style.width = `${boxWidth}px`;
      innerImg.style.minWidth = '0px';
      innerImg.style.maxWidth = 'none';
    }
  };

  window.addEventListener('resize', syncInnerImageWidth);
  syncInnerImageWidth();
});

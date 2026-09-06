/**
 * GESTIÓN DEL FORMULARIO DE CONTACTO, SUBIDA DE FOTOS Y ENLACE A WHATSAPP
 */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('budgetForm');
  const serviceSelect = document.getElementById('formService');
  const propertySelect = document.getElementById('formProperty');
  const nameInput = document.getElementById('formName');
  const phoneInput = document.getElementById('formPhone');
  const emailInput = document.getElementById('formEmail');
  const locationInput = document.getElementById('formLocation');
  const descInput = document.getElementById('formDesc');
  const fileInput = document.getElementById('formPhotos');
  const fileDropzone = document.getElementById('fileDropzone');
  const filePreviewList = document.getElementById('filePreviewList');
  const formFeedback = document.getElementById('formFeedback');
  const btnWhatsAppDirect = document.getElementById('btnWhatsAppDirect');

  // Configuración de contacto
  const WHATSAPP_PHONE = '34632548552'; // Número oficial de contacto Razv Imp
  const CONTACT_EMAIL = 'razvanpopa599@gmail.com';
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

  // 1. Preseleccionar servicio desde las tarjetas de la sección "Nuestros Servicios"
  const serviceButtons = document.querySelectorAll('.btn-select-service');
  serviceButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetService = btn.getAttribute('data-service');
      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
        // Efecto de parpadeo suave en el campo para confirmación visual
        serviceSelect.style.borderColor = 'var(--color-primary-light)';
        setTimeout(() => {
          serviceSelect.style.borderColor = '';
        }, 1200);
      }
    });
  });

  // 2. Gestión de Subida de Fotos
  let selectedFiles = [];

  const renderFilePreviews = () => {
    if (!filePreviewList) return;
    filePreviewList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'file-preview-item';
      const sizeKb = Math.round(file.size / 1024);
      item.innerHTML = `
        <span>📷 ${file.name} (${sizeKb} KB)</span>
        <button type="button" data-index="${index}" style="color:#f43f5e;font-weight:bold;margin-left:4px;" title="Eliminar">&times;</button>
      `;
      filePreviewList.appendChild(item);
    });

    // Botones de eliminación
    filePreviewList.querySelectorAll('button').forEach((delBtn) => {
      delBtn.addEventListener('click', () => {
        const idx = parseInt(delBtn.getAttribute('data-index'), 10);
        selectedFiles.splice(idx, 1);
        renderFilePreviews();
      });
    });
  };

  if (fileInput && fileDropzone) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files) {
        selectedFiles = Array.from(e.target.files);
        renderFilePreviews();
      }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach((eventName) => {
      fileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        fileDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      fileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        fileDropzone.classList.remove('dragover');
      });
    });

    fileDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files) {
        selectedFiles = Array.from(e.dataTransfer.files);
        renderFilePreviews();
      }
    });
  }

  // 3. Generar Enlace Dinámico de WhatsApp
  const generateWhatsAppMessage = () => {
    const nombre = nameInput?.value.trim() || '';
    const tel = phoneInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const poblacion = locationInput?.value.trim() || '';
    const inmueble = propertySelect?.value || 'No especificado';
    const servicio = serviceSelect?.value || 'Impermeabilización de cubiertas';
    const desc = descInput?.value.trim() || '';

    let text = `¡Hola! Me pongo en contacto desde la web para solicitar presupuesto:\n\n`;
    if (tel) text += `📞 *Teléfono:* ${tel}\n`;
    if (email) text += `✉️ *Email:* ${email}\n`;
    if (desc) text += `💬 *Comentario / Problema:* ${desc}\n`;
    if (nombre) text += `👤 *Nombre:* ${nombre}\n`;
    if (poblacion) text += `📍 *Población / Zona:* ${poblacion}\n`;
    if (inmueble) text += `🏢 *Inmueble:* ${inmueble}\n`;
    if (servicio) text += `📌 *Servicio:* ${servicio}\n`;
    if (selectedFiles.length > 0) {
      text += `📷 *Tengo ${selectedFiles.length} foto(s) de la cubierta/filtración.*\n`;
    }

    return encodeURIComponent(text);
  };

  if (btnWhatsAppDirect) {
    btnWhatsAppDirect.addEventListener('click', (e) => {
      e.preventDefault();
      const message = generateWhatsAppMessage();
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 4. Envío del Formulario Directo por Email a razvanpopa599@gmail.com (FormSubmit)
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const tel = phoneInput?.value.trim();
      const email = emailInput?.value.trim();
      const desc = descInput?.value.trim();
      const nombre = nameInput?.value.trim() || 'No especificado';
      const poblacion = locationInput?.value.trim() || 'No especificada';
      const inmueble = propertySelect?.value || 'No especificado';
      const servicio = serviceSelect?.value || 'Impermeabilización de cubiertas';

      if (!tel || !email || !desc) {
        alert('Por favor, completa los campos obligatorios: Teléfono, Correo electrónico y el Comentario o descripción.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando solicitud por correo...';

      try {
        const formData = new FormData();
        formData.append('telefono', tel);
        formData.append('email', email);
        formData.append('nombre', nombre);
        formData.append('poblacion', poblacion);
        formData.append('tipo_inmueble', inmueble);
        formData.append('servicio_solicitado', servicio);
        formData.append('descripcion_problema', desc);
        formData.append('_subject', `Solicitud de Presupuesto - ${servicio} (${poblacion})`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');

        // Adjuntar fotos si las hay
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file, idx) => {
            formData.append(`foto_${idx + 1}`, file);
          });
        }

        const response = await fetch(FORMSUBMIT_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback is-success';
            formFeedback.innerHTML = `
              <strong>✓ ¡Solicitud enviada correctamente por correo electrónico!</strong><br>
              Hemos recibido tu mensaje en <strong>${CONTACT_EMAIL}</strong> y nos pondremos en contacto contigo lo antes posible al teléfono <strong>${tel}</strong>.<br>
              <div style="margin-top: 12px;">
                <a href="https://wa.me/${WHATSAPP_PHONE}?text=${generateWhatsAppMessage()}" target="_blank" class="btn btn--sm btn--whatsapp" style="display:inline-flex;">
                  Enviar también por WhatsApp para atención inmediata
                </a>
              </div>
            `;
          }
          contactForm.reset();
          selectedFiles = [];
          renderFilePreviews();
        } else {
          throw new Error('Error al enviar el formulario');
        }
      } catch (err) {
        // Fallback en caso de error de red o bloqueo
        if (formFeedback) {
          formFeedback.className = 'form-feedback is-success';
          formFeedback.innerHTML = `
            <strong>✓ Solicitud preparada.</strong><br>
            Para asegurar que recibimos tus datos de inmediato, pulsa en el botón inferior para enviárnoslos directamente por WhatsApp o contacta al <strong>+34 632 54 85 52</strong>.<br>
            <div style="margin-top: 12px;">
              <a href="https://wa.me/${WHATSAPP_PHONE}?text=${generateWhatsAppMessage()}" target="_blank" class="btn btn--sm btn--whatsapp" style="display:inline-flex;">
                Enviar solicitud por WhatsApp directo
              </a>
            </div>
          `;
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        formFeedback?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});

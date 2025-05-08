function toggleLogin(event) {
  if (event) event.preventDefault();
  const loginBox = document.getElementById('login-box');
  const overlay  = document.getElementById('blur-overlay');
  const isOpen   = loginBox.classList.toggle('active');
  overlay.classList.toggle('active', isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  // Estado
  let isLoginMode = true;

  // Elementos
  const trigger     = document.getElementById('login-trigger');
  const overlay     = document.getElementById('blur-overlay');
  const loginBox    = document.getElementById('login-box');
  const formTitle   = document.getElementById('form-title');
  const nameInput   = document.getElementById('user-name-input');
  const toggleLink  = document.getElementById('toggle-register');
  const form        = document.getElementById('auth-form');
  const submitBtn   = document.getElementById('login-submit');
  const loginItem   = document.getElementById('login-item');
  const userItem    = document.getElementById('user-item');
  const logoutLink  = document.getElementById('logout-link');
  const userNameNav = document.getElementById('user-name');

  // 1) Abrir/Cerrar modal
  trigger.addEventListener('click', toggleLogin);
  loginBox.addEventListener('click', e => e.stopPropagation());
  overlay.addEventListener('click', toggleLogin);

  // 2) Alternar Login <-> Registro
  toggleLink.addEventListener('click', e => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
      formTitle.textContent   = 'Iniciar Sesión';
      submitBtn.textContent   = 'Ingresar';
      nameInput.style.display = 'none';
      toggleLink.textContent  = '¿No tienes cuenta? Regístrate';
    } else {
      formTitle.textContent   = 'Registrarse';
      submitBtn.textContent   = 'Registrarse';
      nameInput.style.display = 'block';
      toggleLink.textContent  = '¿Ya tienes cuenta? Inicia sesión';
    }
  });

  function initializeCommentForms() {
    const user = sessionStorage.getItem('user');
    document
      .querySelectorAll('[id^="commentElement"]')
      .forEach(section => {
        const form      = section.querySelector('.comment-form');
        const textInput = form.querySelector('.comment-text');
        const stars     = Array.from(form.querySelectorAll('input[type=radio]'));
        const submitBtn = form.querySelector('.btn-comment-submit');
  
        // Mostrar/ocultar
        section.style.display = user ? 'block' : 'none';

        // Reset
        textInput.value = '';
        const starLabels = Array.from(section.querySelectorAll('.star-label'));
        stars.forEach(r => r.checked = false);
        submitBtn.disabled = true;
        starLabels.forEach(label => label.classList.remove('selected'));

        if (user) {
          // Cada vez que cambie texto o rating, activo botón
          form.addEventListener('input', () => {
            const hasText   = textInput.value.trim().length > 0;
            const hasStars  = stars.some(r => r.checked);
            submitBtn.disabled = !(hasText && hasStars);
          });

          const starLabels = Array.from(section.querySelectorAll('.star-label'));
          starLabels.forEach(label => {
            label.addEventListener('click', () => {
              const selectedValue = parseInt(label.dataset.value);
              starLabels.forEach(l => {
                const current = parseInt(l.dataset.value);
                if (current <= selectedValue) {
                  l.classList.add('selected');
                } else {
                  l.classList.remove('selected');
                }
              });
            });
          });
  
          // Capturo el envío
          form.addEventListener('submit', async e => {
            e.preventDefault();
            const comment = textInput.value.trim();
            const rating  = stars.find(r => r.checked).value;
            const excursionId = section.dataset.excursionId;
            const author  = sessionStorage.getItem('user');
  
            // 1) Insertar en el DOM
            const container = section.closest('.accordion-body').querySelector('.comment-list');
            const now = new Date().toLocaleDateString();
            const newHtml = `
              <div class="comment fade-in mb-3 p-3 border rounded bg-light-subtle">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <strong class="text-primary">${author}</strong>
                  <small class="text-muted">${now}</small>
                </div>
                <div class="mb-1">
                  ${generateStars(rating)}
                </div>
                <p class="mb-0">${comment}</p>
              </div>`;
            container.insertAdjacentHTML('beforeend', newHtml);
  
            // 2) Reset form
            textInput.value = '';
            stars.forEach(r => r.checked = false);
            submitBtn.disabled = true;
  
            // 3) Opcional: enviar al PHP
            try {
              const response = await fetch('php/save_comment.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ excursionId, author, comment, rating })
              });
            
              const result = await response.json();
              if (result.success) {
                console.log('Comentario guardado con éxito.');
            
                // Actualizar las estrellas de valoración media
                const starsContainer = section.closest('.accordion-body').querySelector('.stars');
                const ratingText = starsContainer?.nextElementSibling;
            
                if (starsContainer && result.aggregateRating) {
                  starsContainer.innerHTML = generateStars(result.aggregateRating.ratingValue);
                  if (ratingText) {
                    ratingText.textContent = `${parseFloat(result.aggregateRating.ratingValue).toFixed(1)} / 5 (${result.aggregateRating.reviewCount} opiniones)`;
                  }
                }
              } else {
                throw new Error(result.message || 'Error al guardar comentario');
              }
            
            } catch (err) {
              console.error('Error guardando comentario', err);
            }
          });
        }
      });
  }

  // Exponemos la función al ámbito global:
  window.initializeCommentForms = initializeCommentForms;

  // 3) Envío del formulario (Login o Registro)
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled  = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${
      isLoginMode ? 'Entrando…' : 'Registrando…'
    }`;

    const url  = isLoginMode ? 'php/login.php' : 'php/registrarse.php';
    const data = new FormData(form);

    try {
      const resp = await fetch(url, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const json = await resp.json();
      if (!json.success) throw new Error(json.message || 'Error en servidor');

      // Éxito: limpiamos form
      form.reset();
      submitBtn.innerHTML = `<i class="fas fa-check me-2"></i>¡OK!`;

      setTimeout(() => {
        toggleLogin();
        // Actualizamos navbar
        loginItem.classList.add('d-none');
        userItem.classList.remove('d-none');
        userNameNav.textContent = json.name;
        // Guardamos
        sessionStorage.setItem('user', json.name);
        initializeCommentForms();

      }, 600);

    } catch (err) {
      console.error(err);
      alert(err.message || 'Error en autenticación');
      submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Error`;
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? 'Ingresar' : 'Registrarse';
      }, 2000);
    }
  });

  // 4) Logout (cierra modal, limpia UI y session)
  logoutLink.addEventListener('click', e => {
    e.preventDefault();
    // cerrar modal si está abierto
    loginBox.classList.remove('active');
    overlay.classList.remove('active');
    // reset form/estado
    isLoginMode = true;
    form.reset();
    formTitle.textContent   = 'Iniciar Sesión';
    submitBtn.textContent   = 'Ingresar';
    submitBtn.disabled      = false;
    nameInput.style.display = 'none';
    toggleLink.textContent  = '¿No tienes cuenta? Regístrate';
    // navbar
    userItem.classList.add('d-none');
    loginItem.classList.remove('d-none');
    
    // 1) Se limpia la sesión:
    sessionStorage.clear();

    // 2) Se ocultan los formularios de comentario:
    initializeCommentForms();
  });

  // 5) Restaurar sesión al recargar
  const saved = sessionStorage.getItem('user');
  if (saved) {
    userNameNav.textContent = saved;
    loginItem.classList.add('d-none');
    userItem.classList.remove('d-none');
    initializeCommentForms();
  }
});

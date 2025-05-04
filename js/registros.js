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
    // limpiar sesión
    sessionStorage.clear();
  });

  // 5) Restaurar sesión al recargar
  const saved = sessionStorage.getItem('user');
  if (saved) {
    userNameNav.textContent = saved;
    loginItem.classList.add('d-none');
    userItem.classList.remove('d-none');
  }
});

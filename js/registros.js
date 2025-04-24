// 1) Función para mostrar/ocultar el cuadro de login
function toggleLogin(event) {
    event.preventDefault();
    console.log('toggleLogin disparada');
    const loginBox = document.getElementById('login-box');
    loginBox.style.display = loginBox.style.display === 'block'
      ? 'none'
      : 'block';
  }
  
  // 2) Función para cerrar sesión
  function logout(event) {
    event.preventDefault();
    // Oculta la sección de comentarios si existe
    const commentSection = document.getElementById('commentElement');
    if (commentSection) {
      commentSection.style.display = 'none';
      commentSection.querySelectorAll('input, textarea, button')
        .forEach(el => el.disabled = true);
    }
  
    // Oculta mensaje de bienvenida y muestra botón de login
    document.getElementById('user-info').style.display  = 'none';
    document.getElementById('login-btn').style.display = 'block';
  
    // Reabre el cuadro de login
    toggleLogin(event);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const formTitle  = document.getElementById('form-title');
    const nameInput  = document.getElementById('user-name-input');
    const toggleLink = document.getElementById('toggle-register');
    const form       = document.getElementById('auth-form');
    const btn        = document.getElementById('login-action-btn');
  
    // ————————————————
    // 3a) Solo el <a> dentro de #login-btn dispara toggleLogin()
    // ————————————————
    const loginLink = document.querySelector('#login-btn > a');
    loginLink.addEventListener('click', toggleLogin);
  
    // Evitamos que clics dentro del popup (inputs, enlaces) lo cierren
    const loginBox = document.getElementById('login-box');
    loginBox.addEventListener('click', e => e.stopPropagation());
  
    // ————————————————
    // 3b) Alternar entre Login y Registro
    // ————————————————
    toggleLink.addEventListener('click', e => {
      e.preventDefault();
      const isLogin = formTitle.textContent === 'Iniciar Sesión';
  
      formTitle.textContent   = isLogin ? 'Registrarse'   : 'Iniciar Sesión';
      btn.textContent         = isLogin ? 'Registrarse'   : 'Ingresar';
      nameInput.style.display = isLogin ? 'block'         : 'none';
      toggleLink.textContent  = isLogin
        ? '¿Ya tienes cuenta? Inicia sesión'
        : '¿No tienes cuenta? Regístrate';
    });
  
    // ————————————————
    // 3c) Envío AJAX para login o registro
    // ————————————————
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const isRegister = formTitle.textContent === 'Registrarse';
      const url        = isRegister ? 'php/registrarse.php' : 'php/login.php';
      const data       = new FormData(form);
  
      btn.disabled  = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>`
                    + (isRegister ? 'Registrando…' : 'Entrando…');
  
      try {
        const resp = await fetch(url, {
          method:  'POST',
          body:    data,
          headers: { 'Accept': 'application/json' }
        });
        const json = await resp.json();
        if (!json.success) throw new Error(json.message);
  
        form.reset();
        btn.innerHTML = `<i class="fas fa-check me-2"></i>¡OK!`;
        setTimeout(() => {
          document.getElementById('login-box').style.display  = 'none';
          document.getElementById('user-name').textContent   = json.name;
          document.getElementById('user-info').style.display = 'block';
        }, 800);
  
      } catch (err) {
        console.error(err);
        btn.disabled   = false;
        btn.innerHTML  = `<i class="fas fa-exclamation-triangle me-2"></i>Error`;
        alert(err.message || 'Error en la autenticación');
        setTimeout(() => {
          btn.disabled    = false;
          btn.textContent = isRegister ? 'Registrarse' : 'Ingresar';
        }, 2000);
      }
    });
});
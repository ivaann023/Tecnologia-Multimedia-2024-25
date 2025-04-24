document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact form');
    const btn  = form.querySelector('button[type="submit"]');
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando…';
  
      const data = new FormData(form);
      try {
        const resp = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
  
        if (resp.ok) {
          form.reset();
          btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Enviado!';
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar';
          }, 3000);
        } else {
          throw new Error('Error en el envío');
        }
      } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Error';
      }
    });
  });
  
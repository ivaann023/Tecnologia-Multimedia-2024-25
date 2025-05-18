// Usamos el Speech Synthesis API, que es una API nativa implementada en la mayoría de navegadores actuales.

function addSpeakButtons() {
  const textElements = document.querySelectorAll('.speak-text');
  textElements.forEach(el => {
    // Texto que vamos a leer
    const textContent = el.textContent.trim();

    // Crear el botón de control
    const button = document.createElement('button');
    button.classList.add('speak-button');
    button.dataset.state = 'idle'; // idle, speaking, paused
    button.textContent = '🔊';
    el.appendChild(button);

    let utterance = null;

    button.addEventListener('click', () => {
      const state = button.dataset.state;

      if (state === 'idle') {
        // 1) Comenzar
        utterance = new SpeechSynthesisUtterance(textContent);
        utterance.lang = 'es-ES';

        // Cuando termine, volvemos a estado idle
        utterance.onend = () => {
          button.dataset.state = 'idle';
          button.textContent = '🔊';
        };

        window.speechSynthesis.speak(utterance);
        button.dataset.state = 'speaking';
        button.textContent = '⏸️';

      } else if (state === 'speaking') {
        // 2) Pausar
        window.speechSynthesis.pause();
        button.dataset.state = 'paused';
        button.textContent = '▶️';

      } else if (state === 'paused') {
        // 3) Reanudar
        window.speechSynthesis.resume();
        button.dataset.state = 'speaking';
        button.textContent = '⏸️';
      }
    });
  });
}
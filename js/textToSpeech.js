// Usamos el Speech Synthesis API, que es una API nativa implementada en la mayoría de navegadores actuales.

function addSpeakButtons() {
    const textElements = document.querySelectorAll('.speak-text');
    textElements.forEach(el => {
        // Crear un contenedor de texto que solo tiene el texto
        const textContent = el.textContent.trim(); // Obtener el texto sin el emote del altavoz

        // Crear un botón para el botón de lectura (emote)
        const button = document.createElement('button');
        button.textContent = '🔊';  // Emoji para indicar sonido/lectura
        button.classList.add('speak-button');
        
        // Agregar un evento click para activar la síntesis de voz
        button.addEventListener('click', () => {
            const utterance = new SpeechSynthesisUtterance(textContent);
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        });
        
        // Insertar el botón justo después del texto (a la derecha)
        el.appendChild(button);  // Esto coloca el botón al final del texto
    });
}
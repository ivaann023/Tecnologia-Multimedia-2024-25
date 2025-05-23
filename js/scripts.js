/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Shrink the navbar 
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Function to toggle sound on the video
    const video = document.getElementById('background-video');
    const button = document.getElementById('toggle-sound');

    // Modificar la velocidad del video 
    if (video) {
        video.playbackRate = 0.75; 
    }

    if (button) {
        button.addEventListener('click', () => {
            if (video) {
                video.muted = !video.muted;
                button.innerHTML = video.muted 
                    ? '<i class="fas fa-volume-up"></i> Activar Sonido' 
                    : '<i class="fas fa-volume-mute"></i> Desactivar Sonido';
            }
        });
    }

    // CHATBOT FLOTANTE 
    const chatbotButton = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessage");
    const chatbotBody = document.getElementById("chatbotBody");

    if (chatbotButton && chatbotWindow && closeChatbot) {
        // Mostrar/Ocultar Chatbot
        chatbotButton.addEventListener("click", function () {
            chatbotWindow.style.display = chatbotWindow.style.display === "flex" ? "none" : "flex";
        });

        closeChatbot.addEventListener("click", function () {
            chatbotWindow.style.display = "none";
        });
    }

    // Función para enviar mensajes
    function sendMessage() {
        const userText = chatInput.value.trim();
        if (userText === "") return;

        // Agregar mensaje del usuario
        const userMessage = document.createElement("p");
        userMessage.textContent = userText;
        userMessage.style.textAlign = "right";
        userMessage.style.background = "#d1ecf1";
        userMessage.style.padding = "8px";
        userMessage.style.borderRadius = "10px";
        userMessage.style.maxWidth = "80%";
        userMessage.style.margin = "5px 0";
        chatbotBody.appendChild(userMessage);

        // Simular respuesta del chatbot
        setTimeout(() => {
            const botMessage = document.createElement("p");
            botMessage.classList.add("bot-message");

            if (userText.toLowerCase().includes("rutas")) {
                botMessage.textContent = "Puedes encontrar las mejores rutas en la sección de 'Rutas' de nuestra web!";
            } else if (userText.toLowerCase().includes("consejo")) {
                botMessage.textContent = "Te recomiendo llevar suficiente agua y ropa cómoda para explorar Mallorca!";
            } else {
                botMessage.textContent = "¡Gracias por tu mensaje! ¿En qué más puedo ayudarte?";
            }

            chatbotBody.appendChild(botMessage);
            chatbotBody.scrollTop = chatbotBody.scrollHeight; // Desplazar hacia abajo
        }, 1000);

        chatInput.value = "";
    }

    // Enviar mensaje con el botón
    if (sendMessageButton) {
        sendMessageButton.addEventListener("click", sendMessage);
    }

    // Enviar mensaje con Enter
    if (chatInput) {
        chatInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }

    // Controles del vídeo de “Conócenos”
    const teamVideo = document.getElementById('team-video');
    const playBtn   = document.getElementById('play-btn');
    const pauseBtn  = document.getElementById('pause-btn');
    const stopBtn   = document.getElementById('stop-btn');

    if (teamVideo) {
        playBtn.addEventListener('click',  () => teamVideo.play());
        pauseBtn.addEventListener('click', () => teamVideo.pause());
        stopBtn.addEventListener('click',  () => {
        teamVideo.pause();
        teamVideo.currentTime = 0;
        });
    }

    const volumeSlider = document.getElementById('volume-slider');
    if (teamVideo && volumeSlider) {
    // Inicializa el valor del vídeo
    teamVideo.volume = parseFloat(volumeSlider.value);

    // Al mover el slider, cambia el volumen
    volumeSlider.addEventListener('input', e => {
        teamVideo.volume = parseFloat(e.target.value);
    });
    }

    // Evita que al interactuar con el dropdown de usuario se cierre el menú hamburguesa
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', e => e.stopPropagation());
    });
  

    // Para el footer:
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

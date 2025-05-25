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

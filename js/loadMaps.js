document.addEventListener("DOMContentLoaded", function() {
    initMap();
});

function initMap() {
    // 1) Inicializa el mapa centrado en Mallorca
    var map = L.map('map').setView([39.8500, 2.8000], 10);

    // 2) Capa de OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3) Icono personalizado para la geolocalización del usuario
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:     [25, 41],
        iconAnchor:   [12, 41],
        popupAnchor:  [1, -34],
        shadowSize:   [41, 41]
    });

    // 4) Geolocalización del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: greenIcon }).addTo(map);
            userMarker.bindPopup('Tu ubicación').openPopup();
        }, function (err) {
            console.warn('Error en geolocalización:', err.message);
        }, {
            enableHighAccuracy: false,
            maximumAge: Infinity
        });
    } else {
        alert("Tu navegador no soporta Geolocalización.");
    }

    // 5) Carga dinámica de puntos desde el JSON de excursiones
    fetch('json/excursiones.json')
        .then(function(res) {
            if (!res.ok) throw new Error('Respuesta de red no OK');
            return res.json();
        })
        .then(function(data) {
            data.itemListElement.forEach(function(exc) {
                // Extrae latitud y longitud
                var lat = parseFloat(exc.containedInPlace.geo.latitude);
                var lng = parseFloat(exc.containedInPlace.geo.longitude);

                // Añade el marcador al mapa
                var marker = L.marker([lat, lng]).addTo(map);

                // Construye el contenido del popup: nombre + foto
                var popupContent = '<strong>' + exc.name + '</strong><br>';
                if (exc.image && exc.image.length > 0) {
                    popupContent +=
                      '<img src="' + exc.image[0] + '" ' +
                      'alt="' + exc.name + '" ' +
                      'style="display:block; width:150px; height:auto; margin-top:5px;">';
                }

                marker.bindPopup(popupContent);
            });
        })
        .catch(function(err) {
            console.error('Error cargando excursiones:', err);
        });
}
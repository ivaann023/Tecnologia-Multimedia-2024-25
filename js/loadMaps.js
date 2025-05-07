document.addEventListener("DOMContentLoaded", function() {
    initMap();
});

function initMap() {
    // 1) Inicializa el mapa centrado en Mallorca
    var map = L.map('map').setView([39.63, 3.02], 9);


    // 2) Capa de OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3) Icono personalizado para la geolocalización del usuario
    var userIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:     [25, 41],
        iconAnchor:   [12, 41],
        popupAnchor:  [1, -34],
        shadowSize:   [41, 41]
    });

    // Haversine para distancia en km
    function toRad(deg) { return deg * Math.PI / 180; }
    function getDistanceKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Carga y pinta marcadores según proximidad
    function loadExcursiones(userLat, userLng) {
        var PROXIMITY_KM = 20; // ajusta el radio a tu gusto
        fetch('json/excursiones.json')
            .then(function(res) {
                if (!res.ok) throw new Error('Respuesta de red no OK');
                return res.json();
            })
            .then(function(data) {
                data.itemListElement.forEach(function(exc) {
                    var lat = parseFloat(exc.containedInPlace.geo.latitude);
                    var lng = parseFloat(exc.containedInPlace.geo.longitude);

                    // Decide estilo: cerca → opacidad 1, lejos → opacidad reducida
                    var opts = {};
                    if (userLat != null && userLng != null) {
                        var dist = getDistanceKm(userLat, userLng, lat, lng);
                        if (dist > PROXIMITY_KM) {
                            opts.opacity = 0.4;
                        } else {
                            opts.opacity = 1.0;
                        }
                    }

                    // Crea marcador con estilo según cercanía
                    var marker = L.marker([lat, lng], opts).addTo(map);

                    // Popup con nombre y foto
                    var popup = '<strong>' + exc.name + '</strong><br>';
                    if (exc.image && exc.image.length) {
                        popup += '<img src="' + exc.image[0] + '" ' +
                                 'alt="' + exc.name + '" ' +
                                 'style="display:block; width:150px; height:auto; margin-top:5px;">';
                    }
                    marker.bindPopup(popup);
                });
            })
            .catch(function(err) {
                console.error('Error cargando excursiones:', err);
            });
    }

    // 4) Geolocalización del usuario y carga de excursiones
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var ulat = position.coords.latitude;
            var ulng = position.coords.longitude;

            // Marca la posición del usuario
            L.marker([ulat, ulng], { icon: userIcon }).addTo(map)
             .bindPopup('Tu ubicación').openPopup();

            loadExcursiones(ulat, ulng);
        }, function(err) {
            console.warn('Error en geolocalización:', err.message);
            // Si falla, pinta todas con opacidad por defecto
            loadExcursiones(null, null);
        }, {
            enableHighAccuracy: false,
            maximumAge: Infinity
        });
    } else {
        alert("Tu navegador no soporta Geolocalización.");
        loadExcursiones(null, null);
    }
}
document.addEventListener("DOMContentLoaded", function() {
    initMap();
});

function initMap() {
                                            
    var location = { lat: 39.8500, lng: 2.8000 }; // Coordinates for Sa Calobra, Mallorca

    var location2 = { lat: 39.7400, lng: 2.7000 }; // Coordinates for Sa Calobra, Mallorca
    
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    //MAPA 1
    var map = L.map('map').setView([39.7400,2.7000],10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: greenIcon }).addTo(map);

        }, function () {
        },{
            enableHighAccuracy: false,
            maximumAge: Infinity
        });
    } else {
        alert("Tu navegador no soporta Geolocalización.");
    }
    

    var marker12 = L.marker([location.lat, location.lng]).addTo(map);

    var marker13 = L.marker([location2.lat, location2.lng]).addTo(map);
    
}

function printParams(a, b){
    console.log(a);
    console.log(b);
}
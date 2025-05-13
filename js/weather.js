// weather.js

/**
 * getWeather
 * ---------
 * Recibe un array de coordenadas [[lat1, lon1], [lat2, lon2], …]
 * y rellena cada .weather-card con la info meteorológica correspondiente.
 */
function getWeather(coordenadas) {
    // Recorre todas las tarjetas renderizadas
    document.querySelectorAll('.weather-card').forEach((card, index) => {
        const [lat, lon] = coordenadas[index];

        fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&current_weather=true&language=es&temperature_unit=celsius`)
        .then(response => response.json())
        .then(data => {
        const weather = data.current_weather;

        // Añade este log para depuración
        console.log('Datos recibidos:', weather);

        // Valores por defecto:
        let description = 'Despejado';
        let iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Weather_Forecast-Sunny.svg';
        let category    = 'sunny';

        switch (weather.weathercode) {

            case 0:
              description = 'Despejado';
              iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Weather_Forecast-Sunny.svg';
              category    = 'sunny';
              break;

            case 1:
            case 2:
              description = 'Parcialmente nublado';
              iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/3/32/Weather_Forecast-PartlyCloudy.svg';
              category    = 'partly-cloudy';
              break;

            case 3:
              description = 'Nublado';
              iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/7/77/Weather_Forecast-Overcast.svg';
              category    = 'overcast';
              break;

            case 61:
              description = 'Lluvia ligera';
              iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Weather_Forecast-Overcast%2Bshowers.svg';
              category    = 'light-rain';
              break;

            case 63:
            case 65:
            case 80:
            case 81:
            case 82:
              description = 'Lluvia';
              iconUrl     = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Weather_Forecast-Overcast%2Brain.svg';
              category    = 'rain';
              break;

            default:
              description = 'Clima no especificado';
              iconUrl     = '../assets/img/weather-unknown.svg';
              category    = 'unknown';
              break;
        }

        // Se ponen los datos en la tarjeta
        card.querySelector('.temperature').textContent         = `${weather.temperature} °C`;
        card.querySelector('.weather-description').textContent = description;
        card.querySelector('.wind-speed').textContent          = `Velocidad del viento: ${weather.windspeed} m/s`;
        card.querySelector('.weather-icon').innerHTML          = `<img src="${iconUrl}" alt="${description}">`;

        card.classList.add(`weather-${category}`);
        })

        .catch(error => {
            console.error('Error al obtener clima:', error);
            card.querySelector('.temperature').textContent         = 'Error';
            card.querySelector('.weather-description').textContent = 'Sin datos';
        });
    });
}
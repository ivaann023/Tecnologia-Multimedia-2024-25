/*
        
document.addEventListener('DOMContentLoaded', function() {
    getWeather();
});
*/
function getWeather(coordenadas) {
    console.log(coordenadas);
    document.querySelectorAll('.weather-card').forEach((modal,index)=>{
        // Función para obtener y mostrar el clima
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordenadas[index][0]}&longitude=${coordenadas[index][1]}&current_weather=true&language=es&temperature_unit=celsius`)
        .then(response => response.json())
        .then(data => {
        // Accede a la información del clima
        const weather = data.current_weather;

        // Muestra la temperatura
        modal.querySelector('.temperature').textContent = `${weather.temperature} °C`;

        // Muestra la descripción del clima (en base al código del clima)
        let description = 'Despejado'; // Definir un mensaje predeterminado
        let iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Weather_Forecast-Sunny.svg'; // Icono predeterminado
        switch (weather.weathercode) {
            case 0:
                description = 'Despejado';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Weather_Forecast-Sunny.svg';
                break;
            case 1:
                description = 'Parcialmente nublado';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/32/Weather_Forecast-PartlyCloudy.svg';
                break;
            case 2:
                description = 'Nublado';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/77/Weather_Forecast-Overcast.svg';
                break;
            case 3:
                description = 'Lluvia ligera';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Weather_Forecast-Overcast%2Bshowers.svg';
                break;
            case 4:
                description = 'Lluvia';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Weather_Forecast-Overcast%2Brain.svg';
                break;
            default:
                description = 'Desconocido';
                iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Weather_Forecast-Overcast%2Brain.svg';
                break;
            // Agrega más casos según necesites
        }

        modal.querySelector('.weather-description').textContent = description;
        modal.querySelector('.wind-speed').textContent = `Velocidad del viento: ${weather.windspeed} m/s`;
        modal.querySelector('.weather-icon').innerHTML = `<img src="${iconUrl}" alt="Clima">`;
        })
        .catch(error => {
        console.error('Error:', error);
        modal.querySelector('.temperature').textContent = 'Error al obtener el clima';
        modal.querySelector('.weather-description').textContent = 'No se pudo cargar la información.';
        });
    });
    
}



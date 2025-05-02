import axios from 'axios';

let cachedWeather = null;
let lastWeatherFetchTime = 0;

export const getWeatherData = async (latitude, longitude) => {
    const now = Date.now();
    if (cachedWeather && (now - lastWeatherFetchTime) < 10 * 60 * 1000) {
        return cachedWeather; // usar cache por 10 minutos
    }

    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                hourly: 'temperature_2m,relative_humidity_2m,precipitation',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min',
                timezone: 'auto',
                current_weather: true
            }
        });

        cachedWeather = response.data;
        lastWeatherFetchTime = now;
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

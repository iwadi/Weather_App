// import { useEffect, useState } from 'react';
// import '/src/App.css';
// import axios from 'axios';

// interface WeatherData {
//     date: string;
//     morning?: number;
//     day?: number;
//     evening?: number;
//     night?: number;
// }

// interface WeatherForecastProps {
//     city: string;
//     days: number;
// }

// const API_KEY = 'a3020bcd380e283571def6dc5e97aea1';

// const WeatherForecast: React.FC<WeatherForecastProps> = ({ city, days }) => {
//     const [forecast, setForecast] = useState<WeatherData[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchWeather = async () => {
//         if (!city) return; // Не делаем запрос, если город пустой
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(
//             `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
//             );

//             const forecastByDay: { [key: string]: WeatherData } = {};

//             response.data.list.forEach((entry: any) => {
//             const dt = new Date(entry.dt * 1000);
//             const dateStr = dt.toLocaleDateString('ru-RU', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric',
//             });

//             if (!forecastByDay[dateStr]) {
//                 forecastByDay[dateStr] = { date: dateStr };
//             }

//             const hour = dt.getHours();
//             const temp = Math.round(entry.main.temp);

//             if (6 <= hour && hour < 12) {
//                 forecastByDay[dateStr].morning = temp;
//             } else if (12 <= hour && hour < 18) {
//                 forecastByDay[dateStr].day = temp;
//             } else if (18 <= hour && hour < 24) {
//                 forecastByDay[dateStr].evening = temp;
//             } else {
//                 forecastByDay[dateStr].night = temp;
//             }
//             });

//             const forecastArray = Object.values(forecastByDay).slice(0, days);
//             setForecast(forecastArray);
//         } catch (err) {
//             setError('Ошибка при загрузке данных. Проверьте название города.');
//         } finally {
//             setLoading(false);
//         }
//         };

//         fetchWeather();
//     }, [city, days]);

//     if (loading) return <div>Загрузка...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <div className="Forecast-Container">
//         {forecast.map((day) => (
//             <div className="Day-Card" key={day.date}>
//             <div className="forecast-item">
//                 <span className="forecast-title">Утро</span>
//                 <hr className="forecast-hr" />
//                 <div className="forecast-icon">☔</div>
//                 <span className="forecast-temperature">{day.morning ?? 'нет данных'}°</span>
//             </div>
//             <div className="forecast-item">
//                 <span className="forecast-title">День</span>
//                 <hr className="forecast-hr" />
//                 <div className="forecast-icon">☔</div>
//                 <span className="forecast-temperature">{day.day ?? 'нет данных'}°</span>
//             </div>
//             <div className="forecast-item">
//                 <span className="forecast-title">Вечер</span>
//                 <hr className="forecast-hr" />
//                 <div className="forecast-icon">☔</div>
//                 <span className="forecast-temperature">{day.evening ?? 'нет данных'}°</span>
//             </div>
//             <div className="forecast-item">
//                 <span className="forecast-title">Ночь</span>
//                 <hr className="forecast-hr" />
//                 <div className="forecast-icon">☔</div>
//                 <span className="forecast-temperature">{day.night ?? 'нет данных'}°</span>
//             </div>
//             </div>
//         ))}
//         </div>
//     );
// };

// export default WeatherForecast;

import { useEffect, useState } from 'react';
import '/src/App.css';
import axios from 'axios';

interface WeatherData {
    date: string;
    morning?: number;
    day?: number;
    evening?: number;
    night?: number;
    morningCondition?: string;
    dayCondition?: string;
    eveningCondition?: string;
    nightCondition?: string;
}

interface WeatherForecastProps {
    city: string;
    days: number;
}

const API_KEY = 'a3020bcd380e283571def6dc5e97aea1';

const WeatherForecast: React.FC<WeatherForecastProps> = ({ city, days }) => {
    const [forecast, setForecast] = useState<WeatherData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getWeatherIcon = (condition: string | null, temp: number | null) => {
        const tempValue = temp ?? 0;
        const lowerCondition = condition?.toLowerCase();

        if (tempValue <= -10) return '❄️';
        if (tempValue >= 30) return '☀️';

        switch (lowerCondition) {
            case 'clear':
                return tempValue > 0 ? '☀️' : '🌤️';
            case 'clouds':
                return tempValue > 0 ? '☁️' : '🌥️';
            case 'rain':
                return tempValue > 0 ? '☔' : '🌧️';
            case 'snow':
                return '❄️';
            case 'thunderstorm':
                return '⛈️';
            case 'drizzle':
                return '🌧️';
            case 'mist':
            case 'fog':
                return '🌫️';
            default:
                if (tempValue <= 0) return '❄️';
                if (tempValue > 20) return '☀️';
                return '🌡️';
        }
    };

    useEffect(() => {
        const fetchWeather = async () => {
            if (!city) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
                );

                const forecastByDay: { [key: string]: WeatherData } = {};

                response.data.list.forEach((entry: any) => {
                    const dt = new Date(entry.dt * 1000);
                    const dateStr = dt.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });

                    if (!forecastByDay[dateStr]) {
                        forecastByDay[dateStr] = { date: dateStr };
                    }

                    const hour = dt.getHours();
                    const temp = Math.round(entry.main.temp);
                    const condition = entry.weather[0].main;

                    if (6 <= hour && hour < 12) {
                        forecastByDay[dateStr].morning = temp;
                        forecastByDay[dateStr].morningCondition = condition;
                    } else if (12 <= hour && hour < 18) {
                        forecastByDay[dateStr].day = temp;
                        forecastByDay[dateStr].dayCondition = condition;
                    } else if (18 <= hour && hour < 24) {
                        forecastByDay[dateStr].evening = temp;
                        forecastByDay[dateStr].eveningCondition = condition;
                    } else {
                        forecastByDay[dateStr].night = temp;
                        forecastByDay[dateStr].nightCondition = condition;
                    }
                });

                const forecastArray = Object.values(forecastByDay).slice(0, days);
                setForecast(forecastArray);
            } catch (err) {
                setError('Ошибка при загрузке данных. Проверьте название города.');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, days]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="Forecast-Container">
            {forecast.map((day) => (
                <div className="Day-Card" key={day.date}>
                    <div className="forecast-item">
                        <span className="forecast-title">Утро</span>
                        <hr className="forecast-hr" />
                        <div className="forecast-icon">{getWeatherIcon(day.morningCondition ?? null, day.morning ?? null)}</div>
                        <span className="forecast-temperature">{day.morning ?? 'нет данных'}°</span>
                    </div>
                    <div className="forecast-item">
                        <span className="forecast-title">День</span>
                        <hr className="forecast-hr" />
                        <div className="forecast-icon">{getWeatherIcon(day.dayCondition ?? null, day.day ?? null)}</div>
                        <span className="forecast-temperature">{day.day ?? 'нет данных'}°</span>
                    </div>
                    <div className="forecast-item">
                        <span className="forecast-title">Вечер</span>
                        <hr className="forecast-hr" />
                        <div className="forecast-icon">{getWeatherIcon(day.eveningCondition ?? null, day.evening ?? null)}</div>
                        <span className="forecast-temperature">{day.evening ?? 'нет данных'}°</span>
                    </div>
                    <div className="forecast-item">
                        <span className="forecast-title">Ночь</span>
                        <hr className="forecast-hr" />
                        <div className="forecast-icon">{getWeatherIcon(day.nightCondition ?? null, day.night ?? null)}</div>
                        <span className="forecast-temperature">{day.night ?? 'нет данных'}°</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeatherForecast;
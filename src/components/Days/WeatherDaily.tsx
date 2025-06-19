import { useEffect, useState } from 'react';
import '/src/App.css';
import axios from 'axios';

interface WeatherData {
    date: string;
    morning?: number;
    day?: number;
    evening?: number;
    night?: number;
    icon?: string;
    dayOfWeek?: string; // Adding a field for the day of the week
}

interface WeatherDailyProps {
    city: string;
    days: number;
    dayNames?: string[]; // Optional props for custom day names
}

const API_KEY = 'a3020bcd380e283571def6dc5e97aea1';

const DEFAULT_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getWeatherIcon = (iconCode: string | undefined) => {
    switch (iconCode) {
        case '01d':
        case '01n':
            return '☀️';
        case '02d':
        case '02n':
            return '⛅';
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return '☁️';
        case '09d':
        case '09n':
            return '🌧️';
        case '10d':
        case '10n':
            return '🌦️';
        case '11d':
        case '11n':
            return '⛈️';
        case '13d':
        case '13n':
            return '❄️';
        case '50d':
        case '50n':
            return '🌫️';
        default:
            return '🌈';
    }
};

const WeatherDaily: React.FC<WeatherDailyProps> = ({ 
    city, 
    days, 
    dayNames = DEFAULT_DAY_NAMES 
}) => {
    const [forecast, setForecast] = useState<WeatherData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!city) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
                );

                const forecastByDay: { [key: string]: WeatherData } = {};
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                response.data.list.forEach((entry: any) => {
                    const dt = new Date(entry.dt * 1000);
                    const dateStr = dt.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });

                    if (!forecastByDay[dateStr]) {
                        // Calculate the day of the week (0 - Sunday, 1 - Monday, etc.)
                        const dayIdx = dt.getDay();
                        // Let's convert it to our format (1 - Monday, 7 - Sunday)
                        const normalizedDayIdx = dayIdx === 0 ? 6 : dayIdx - 1;
                        
                        forecastByDay[dateStr] = { 
                            date: dateStr,
                            icon: entry.weather[0].icon,
                            dayOfWeek: dayNames[normalizedDayIdx] // We use the transferred names
                        };
                    }

                    const hour = dt.getHours();
                    const temp = Math.round(entry.main.temp);

                    if (6 <= hour && hour < 12) {
                        forecastByDay[dateStr].morning = temp;
                    } else if (12 <= hour && hour < 18) {
                        forecastByDay[dateStr].day = temp;
                    } else if (18 <= hour && hour < 24) {
                        forecastByDay[dateStr].evening = temp;
                    } else {
                        forecastByDay[dateStr].night = temp;
                    }
                });

                const forecastArray = Object.values(forecastByDay)
                    .slice(0, days)
                    .sort((a, b) => {
                        // Sort the days in order
                        const dateA = new Date(a.date.split('.').reverse().join('-'));
                        const dateB = new Date(b.date.split('.').reverse().join('-'));
                        return dateA.getTime() - dateB.getTime();
                    });

                setForecast(forecastArray);
            } catch (err) {
                setError('Ошибка при загрузке данных. Проверьте название города.');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, days, dayNames]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="WeatherDaily-Container">
            {forecast.map((day) => (
                <div className="WeatherDaily-Card" key={day.date}>
                    <div className="day">
                        <span className="day-title">{day.dayOfWeek}</span>
                        <hr className="day-hr" />
                        <div className="day-icon">{getWeatherIcon(day.icon)}</div>
                        <hr className="day-hr" />
                        <div className="temps">
                            <span>Утро {day.morning ?? 'нет данных'}°</span>
                            <span>День {day.day ?? 'нет данных'}°</span>
                            <span>Вечер {day.evening ?? 'нет данных'}°</span>
                            <span>Ночь {day.night ?? 'нет данных'}°</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeatherDaily;
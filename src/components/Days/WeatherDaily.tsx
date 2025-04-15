import { useEffect, useState } from 'react';
import '/src/App.css';
import axios from 'axios';

interface WeatherData {
    date: string;
    morning?: number;
    day?: number;
    evening?: number;
    night?: number;
    icon?: string; // Добавляем поле для иконки
}

interface WeatherDailyProps {
    city: string;
    days: number;
}

const API_KEY = 'a3020bcd380e283571def6dc5e97aea1';

// Функция для получения эмодзи на основе погодного кода
const getWeatherIcon = (iconCode: string | undefined) => {
    switch (iconCode) {
        case '01d':
        case '01n':
            return '☀️'; // Ясно
        case '02d':
        case '02n':
            return '⛅'; // Малооблачно
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return '☁️'; // Облачно
        case '09d':
        case '09n':
            return '🌧️'; // Ливень
        case '10d':
        case '10n':
            return '🌦️'; // Дождь
        case '11d':
        case '11n':
            return '⛈️'; // Гроза
        case '13d':
        case '13n':
            return '❄️'; // Снег
        case '50d':
        case '50n':
            return '🌫️'; // Туман
        default:
            return '🌈'; // Неизвестная погода
    }
};

const WeatherDaily: React.FC<WeatherDailyProps> = ({ city, days }) => {
    const [forecast, setForecast] = useState<WeatherData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!city) return; // Не делаем запрос, если город пустой
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
                        forecastByDay[dateStr] = { 
                            date: dateStr,
                            icon: entry.weather[0].icon // Сохраняем иконку из первого временного окна дня
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

    // Функция для получения названия дня недели
    const getDayOfWeek = (dateStr: string) => {
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('ru-RU', { weekday: 'long' }).toUpperCase();
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="Forecast-Container">
            {forecast.map((day) => (
                <div className="Day-Card" key={day.date}>
                    <div className="day">
                        <span className="day-title">{getDayOfWeek(day.date)}</span>
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
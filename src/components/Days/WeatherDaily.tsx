import { useEffect, useState } from 'react';
import '/src/App.css';
import axios from 'axios';

interface WeatherData {
    date: string;
    morning?: number;
    day?: number;
    evening?: number;
    night?: number;
}

interface WeatherDailyProps {
    city: string;
    days: number;
}

const API_KEY = 'a3020bcd380e283571def6dc5e97aea1';

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
                forecastByDay[dateStr] = { date: dateStr };
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

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="Forecast-Container">
        {forecast.map((day) => (
            <div className="Day-Card" key={day.date}>
                <div className="day">
                    <span className="day-title">FRIDAY</span>
                    <hr className='day-hr'/>
                    <div className="day-icon">⛈️</div>
                    <hr className='day-hr'/>
                    <div className="temps">
                        <span>{day.morning ?? 'нет данных'}°</span>
                        <span>{day.day ?? 'нет данных'}°</span>
                        <span>{day.evening ?? 'нет данных'}°</span>
                        <span>{day.night ?? 'нет данных'}°</span>
                    </div>
                </div>
            </div>
        ))}
        </div>
    );
};


export default WeatherDaily;
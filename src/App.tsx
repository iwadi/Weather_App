import { useState } from 'react';
import './App.css';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
// import DailyForecast from './components/Days/DailyForecast';

// import Forecast from './components/Forecast';

import Header from './components/Header/Header';
import WeatherForecast from './components/WeatherForecast/WeatherForecast'

function App() {
  const [weatherLoaded, setWeatherLoaded] = useState<boolean>(false);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('Moscow');

  const handleSearch = () => {
    if (city.trim()) {
      setSearchCity(city);
    }
  };

  return (
    <>
      <div className="container">
        <div className='weather-container'>
          <Header />
          <CurrentWeather setWeatherLoaded={setWeatherLoaded} setCity={setCity} />
        </div>
        {weatherLoaded && (
        <>
          {weatherLoaded && <WeatherForecast city={city} days={1} />}
          {/* <Forecast /> */}

          {/* <DailyForecast /> */}
        </>
      )}
      </div>
    </>
  )
}

export default App;

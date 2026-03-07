import { useState } from 'react'
import './Home.css'

export default function Home(){
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response = await fetch("http://127.0.0.1:8000/", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ city }),
      });
      const data = await response.json();

      if(response.ok){
        setWeather(data.weather);
        setError(null);
      }else{
        setWeather(null);
        setError(data.error);
      }
    } catch(err){
      console.log("Error: ", err);
      setError("Server connection failed");
      setWeather(null)
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} id='search-form'>
        <input
          id='city-name'
          type='text' 
          placeholder='City name...'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type='submit'>Get weather</button>
      </form>
      
      {weather && (
        <div className='weather-container'>
          <h1>{weather.city}</h1>
          <div className='temp-container'>
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Weather icon" />
            <h1>{weather.temperature} °C</h1>
          </div>
          <p>{weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Feel: {weather.feelsLike}</p>
          <p>Min. temperature: {weather.tempMin} °C</p>
          <p>Max temperature: {weather.tempMax} °C</p>
          <p>Pressure: {weather.pressure}</p>
          <p>Visibility: {weather.visibility / 1000}km</p>
          <p>Wind speed: {(weather.windSpeed * 3.6).toFixed(2)}km/h</p>
        </div>
      )}

      {error && (
        <p>{error}</p>
      )}
    </>
  )
}
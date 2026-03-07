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
  
  let localTime;
  if(weather){
    localTime = new Date((weather.dt + weather.timezone) * 1000);
    var localHours = String(localTime.getUTCHours()).padStart(2, '0');
    var localMinutes = String(localTime.getUTCMinutes()).padStart(2, '0');
  }

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
          <div className='desc-container'>
            <h2>{weather.description}</h2>
          </div>
          <h2>Local time: {localHours + ":" + localMinutes}</h2>
          <div className='weather-overview-container'>
            <p>Humidity: {weather.humidity}%</p>
            <p>Feel: {weather.feelsLike} °C</p>
            <p>Min. temperature: {weather.tempMin} °C</p>
            <p>Max temperature: {weather.tempMax} °C</p>
            <p>Pressure: {weather.pressure}</p>
            {weather.visibility && <p>Visibility: {weather.visibility / 1000}km</p>}
            <p>Wind speed: {(weather.windSpeed * 3.6).toFixed(2)}km/h</p>
          </div>
        </div>
      )}

      {error && (
        <h2>{error}</h2>
      )}
    </>
  )
}
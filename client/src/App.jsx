import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

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
      }else{
        setWeather(null);
      }
    } catch(err){
      console.log("ESSE AQUI É O ERRO (SE TIVER): ", err);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
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
          <p>Temperature: {weather.temperature} °C</p>
        </div>
      )}
    </>
  )
}

export default App

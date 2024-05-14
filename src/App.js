import React, { useState, useEffect } from "react";
import { FaCity, FaThermometerHalf, FaCloud, FaSun, FaClock, FaTint, FaEye, FaWater } from "react-icons/fa";
import "./App.css";

function App() {
  const defaultLatitude = 12.5833;
  const defaultLongitude = -16.2719;
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("");
  const [city, setCity] = useState("Ziguinchor");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [humidity, setHumidity] = useState("");
  const [visibility, setVisibility] = useState("");
  const [dewPoint, setDewPoint] = useState("");
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [longitude, setLongitude] = useState(defaultLongitude);
  const [latitude, setLatitude] = useState(defaultLatitude);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f35738832cd20ebc25ad91c9a6414670&units=metric`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch weather data.");
        }
        const data = await response.json();
        setTemp(data.main.temp);
        setDesc(data.weather[0].main);
        setIcon(data.weather[0].icon);
        setCity(data.name);
        setSunrise(new Date(data.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(data.sys.sunset * 1000).toLocaleTimeString());
        setHumidity(data.main.humidity);
        setVisibility(data.visibility);
        setDewPoint(data.main.dew_point);
        setReady(true);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [longitude, latitude]);

  useEffect(() => {
    const changeTheme = () => {
      if (temp <= 10) {
        document.body.classList.add("cold-theme");
      } else if (temp > 10 && temp <= 20) {
        document.body.classList.add("moderate-theme");
      } else {
        document.body.classList.add("warm-theme");
      }
    };

    changeTheme();

    return () => {
      document.body.classList.remove("cold-theme", "moderate-theme", "warm-theme");
    };
  }, [temp]);

  const handleFetchWeather = () => {
    if (longitude && latitude) {
      setReady(false);
      setError(null);
    } else {
      setError("Please enter valid longitude and latitude.");
    }
  };

  return (
    <div className="App">
      <h1>Mon Appli Météo</h1>
      <div className="content">
        <div className="left">
          <h2>My Weather App</h2>
          {isReady ? (
            <div>
              <div>
                <FaCity /> <span>City:</span> {city}
              </div>
              <div>
                <FaThermometerHalf /> <span>Temperature:</span> {temp} °C
              </div>
              <div>
                <FaCloud /> <span>Description:</span> {desc}
              </div>
              <div>
                <FaSun /> <span>Sunrise:</span> {sunrise}
              </div>
              <div>
                <FaClock /> <span>Sunset:</span> {sunset}
              </div>
              <div>
                <FaTint /> <span>Humidity:</span> {humidity} %
              </div>
              <div>
                <FaEye /> <span>Visibility:</span> {visibility} m
              </div>
              <div>
                <FaWater /> <span>Dew Point:</span> {dewPoint} °C
              </div>
              {icon && (
                <img src= {`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Icône météo" />
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="right">
          <h2>Put Coordinates</h2>
          <div>
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <button onClick={handleFetchWeather}>Afficher les Informations</button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const CountrySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    // return the list of all countries
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://studies.cs.helsinki.fi/restcountries/api/all"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    // Step 1: simple filter
    const filterPrelim = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Step 2: exact match
    const exactMatches = filterPrelim.filter(
      (country) =>
        country.name.common.toLowerCase() === searchTerm.toLowerCase()
    );

    // Step 3: decide between exact or approximate matches with ternary operator
    const finalFilteredCountries =
      exactMatches.length > 0 ? exactMatches : filterPrelim;

    const sortedAndFilteredCountries = finalFilteredCountries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    setFilteredCountries(sortedAndFilteredCountries);
  }, [searchTerm, countries]);

  const handleClick = () => {
    console.log("handle click called");
    setSearchTerm("");
  };

  const renderCountries = () => {
    if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => setSearchTerm(country.name.common)}>
                show
              </button>
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return (
        <Country
          name={filteredCountries[0].name.common}
          capital={filteredCountries[0].capital}
          languages={filteredCountries[0].languages}
          flag={filteredCountries[0].flags}
          handleClick={handleClick}
        />
      );
    } else {
      return <div>No country data found for that search.</div>;
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {renderCountries()}
    </div>
  );
};

const Country = ({ name, capital, languages, flag, handleClick }) => {
  return (
    <>
      <br></br>
      <br></br>
      <button onClick={handleClick}>back</button>
      <h1>Name: {name}</h1>
      <p>Capital: {capital}</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={flag.png} alt={flag.alt} />
      <Weather capital={capital} />
    </>
  );
};

const Weather = ({ capital }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    fetchWeather();
  }, [capital]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <>
      <h3>Weather in {capital}</h3>
      <div>temperature {weatherData.main.temp} °C</div>
      <div>
        <img
          width="70px"
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
          alt={weatherData.weather[0].description}
        />
      </div>
      <div>wind {weatherData.wind.speed} m/s</div>
    </>
  );
};

function App() {
  return (
    <>
      <div>
        <h1>Countries Database Search</h1>
        <CountrySearch />
      </div>
    </>
  );
}

export default App;

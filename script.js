const input = document.querySelector("#input");
const weatherInfo = document.querySelector("#info");
const cityName = document.querySelector("#city-name");
const image = document.querySelector("#img");
const weatherIcon = document.querySelector("#icon");
const longitude = document.querySelector(".longitude");
const latitude = document.querySelector(".latitude");
const locationDetails = document.querySelector("#country_name");
const dateTime = document.querySelector(".date_div");
const error = document.querySelector(".error");

class WeatherApp {
  constructor() {
    this.apiKey = `QTNsYjn14AVUNQucfCXoVYqIO1GcMGNd`;
    this.cityURI = `https://dataservice.accuweather.com/locations/v1/cities/search?`;
    this.weatherURI = `https://dataservice.accuweather.com/currentconditions/v1/`;
    this.position = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?`;
  }
  async getKey(city){
    const citySearch = `apikey=${this.apiKey}&q=${city}`;
    const response = await fetch (this.cityURI + citySearch);
    const data = await response.json();
    return data[0];
  }
  async getWeather(key){
  const baseUrl = `${this.weatherURI}${key}?`;
  const weatherSearch = `apikey=${this.apiKey}`;
  const response = await fetch (baseUrl + weatherSearch);
  const data = await response.json();
  return data[0];
  }
  async startApp(){
  navigator.geolocation.getCurrentPosition((position) => {
    const geoPosition = `${position.coords.latitude}, ${position.coords.longitude}`;
    const coordinates = `apikey=${this.apiKey}&q=${geoPosition}`;
    fetch(this.position + coordinates)
      .then((response) => response.json())
      .then((data) => {
        weather(data.LocalizedName)
          .then(data => {
            updateUI(data)
          })
          .catch(err => console.log(err))
      }).catch(err => console.log(err));
  });
}
};

const getForecast = new WeatherApp();
 const weather = async (city) => {
  const cityData = await (getForecast.getKey(city))
  const weatherData = await (getForecast.getWeather(cityData.Key))
  return {cityData, weatherData}
}

input.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.location.value.trim();
  input.reset();
  weather(value)
    .then(data => {
      updateUI(data)
    })
  .catch(err => {
    console.log(err);
    error.style.display = "block";
  });
});

const updateUI = (info) => {
  const city = info.cityData;
  const weather = info.weatherData;
  const date = new Date();
  const currentDate = date.toDateString();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const newFormat = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  weatherInfo.innerHTML = `
          <p>${weather.WeatherText}</p>
          <p>${weather.Temperature.Metric.Value}&deg;C</p>`;
  dateTime.innerHTML = `<p class="date">${currentDate}</p><p class="time">${hours}:${minutes} ${newFormat}</p>`;
  weather.IsDayTime
    ? image.setAttribute("src", "images/daytime1.jpg")
    : image.setAttribute("src", "images/night.jpg");
  weatherIcon.setAttribute("src", `icons/${weather.WeatherIcon}.svg`);
  cityName.innerHTML = `<p>${city.LocalizedName}</p>`;
  longitude.innerHTML = `<p>Longitude: ${city.GeoPosition.Longitude}</p> `;
  latitude.innerHTML = `<p>Latitude: ${city.GeoPosition.Latitude}</p>`;
  locationDetails.innerHTML = `<p>${city.Country.EnglishName}(${city.Country.ID})</p><p class="state">${city.AdministrativeArea.EnglishName}</p>`;
};

getForecast.startApp();
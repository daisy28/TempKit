const input = document.querySelector("#input");
const weatherInfo = document.querySelector("#info");
const cityName = document.querySelector("#city-name");
const image = document.querySelector("#img");
const weatherIcon = document.querySelector("#icon");
const longitude = document.querySelector(".longitude");
const latitude = document.querySelector(".latitude");
const locationDetails = document.querySelector("#country_name");
const dateTime = document.querySelector(".date_div");
const apiKey = `CN8YpDrLos1FSNLR5w54u6PrCq3gposf`;

const getKey = (city) => {
     const baseUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?`;
     const citySearch = `apikey=${apiKey}&q=${city}`;
     fetch(baseUrl + citySearch)
          .then(response => response.json())
          .then(data => {
               console.log(data[0]);
               locationUI(data[0]);
               return getWeather(data[0].Key);
          })
}

const getWeather = (key) => {
     const baseUrl = `http://dataservice.accuweather.com/currentconditions/v1/${key}?`;
     const weatherSearch = `apikey=${apiKey}`;
     fetch(baseUrl + weatherSearch)
          .then(response => response.json())
          .then(data => {
               console.log(data[0]);
               return updateUI(data[0]);
          })
}

input.addEventListener("submit", (e) => {
     e.preventDefault();
     const value = input.location.value.trim();
     input.reset();
     return getKey(value);
})

const updateUI = (info) => {
     const date = new Date(info.EpochTime * 1000)
     const currentDate = date.toDateString()
     const currentTime = `${date.getHours()}:${date.getMinutes()}`
     console.log(date)
     console.log(currentTime)
     weatherInfo.innerHTML = `
          <p>${info.WeatherText}</p>
          <p>${info.Temperature.Metric.Value}&deg;C</p>`;
     dateTime.innerHTML = `<p class="date">${currentDate}</p><p class="time">${currentTime}</p>`
     info.IsDayTime ? image.setAttribute("src", "images/daytime1.jpg") : image.setAttribute("src", "images/night.jpg");
     weatherIcon.setAttribute("src", `icons/${info.WeatherIcon}.svg`);
}

const locationUI = (data) => {
     cityName.innerHTML = `<p>${data.LocalizedName}</p>`;
     longitude.innerHTML = `<p>Longitude: ${data.GeoPosition.Longitude}</p> `;
     latitude.innerHTML = `<p>Latitude: ${data.GeoPosition.Latitude}</p>`;
     locationDetails.innerHTML = `<p>${data.Country.EnglishName}(${data.Country.ID})</p><p class="state">${data.AdministrativeArea.EnglishName}</p>`;
}

const startApp = () => {
     navigator.geolocation.getCurrentPosition((position) => {
          la = `${position.coords.latitude}, ${position.coords.longitude}`
          const baseUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?`
          const coordinates = `apikey=${apiKey}&q=${la}`
          fetch(baseUrl + coordinates)
          .then(response => response.json())
          .then(data => {
               console.log(data.LocalizedName)
               return getKey(data.LocalizedName);
     })
     })
}

startApp()





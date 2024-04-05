angular
  .module("weatherApp", [])

  .controller("weatherController", [
    "$scope",
    "$http",
    function ($scope, $http) {
      $scope.city = "";
      $scope.currentWeather = null;
      $scope.forecasts = [];

      $scope.getWeatherDetails = function (cityName, lat, lon) {
        //access variable on h
        var apiUrl =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=cbb7f5c53aa2d5d4349bef7bf1ad233d";

        $http
          .get(apiUrl)
          .then(function (response) {
            var data = response.data.list;
            $scope.forecasts = [];

            $scope.currentWeather = {
              city: cityName,
              date: new Date(data[0].dt * 1000),
              temperature: Math.round(data[0].main.temp - 273.15),
              windSpeed: data[0].wind.speed,
              humidity: data[0].main.humidity,
              iconUrl:
                  "https://openweathermap.org/img/wn/" +
                  data[0].weather[0].icon +
                  ".png",
            };

            console.log(response.data);

            var uniqueForecastDays = [];
            var fiveDaysForecast = data.filter(function (forecast) {
              var forecastDate = new Date(forecast.dt * 1000).getDate();
              if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
              }
            });

            fiveDaysForecast.forEach(function (weatherItem) {
              $scope.forecasts.push({
                date: new Date(weatherItem.dt * 1000),
                temperature: Math.round(weatherItem.main.temp - 273.15),
                windSpeed: weatherItem.wind.speed,
                humidity: weatherItem.main.humidity,
                iconUrl:
                  "https://openweathermap.org/img/wn/" +
                  weatherItem.weather[0].icon +
                  ".png",
              });
            });
          })
          .catch(function (error) {
            console.error("Error fetching weather data:", error);
            alert(
              "Oops!! An error occurred while getting the weather forecast"
            );
          });
      };
      // $scope.createWeatherCard = function (cityName, weatherItem, index) {
      //   if (index === 0) {
      //     return `<div class="details">
      //           <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
      //           <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
      //             2
      //           )}C</h4>
      //           <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
      //           <h4>Humidity:${weatherItem.main.humidity}%</h4>

      //        </div>
      //        <div class="icon">
      //           <img src="${weatherItem.iconUrl}" alt="weather icon"/>
      //           <h4>${weatherItem.weather[0].description}</h4>

      //        </div>`;
      //   } else {
      //     return `<li class="card">
      //           <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
      //           <img src="${weatherItem.iconUrl}" alt="weather icon"/>
      //           <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}C</h4>
      //           <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
      //           <h4>Humidity:${weatherItem.main.humidity}%</h4>
      //        </li>`;
      //   }
      // };

      $scope.getCityCoordinates = function () {
        var cityName = $scope.city.trim();
        if (!cityName) return;

        var apiUrl =
          "https://api.openweathermap.org/geo/1.0/direct?q=" +
          cityName +
          "&limit=1&appid=cbb7f5c53aa2d5d4349bef7bf1ad233d";

        $http
          .get(apiUrl)
          .then(function (response) {
            var data = response.data;
            if (!data.length)
              return alert(`No coordinates found for ${cityName}`);

            var name = data[0].name;
            var lat = data[0].lat;
            var lon = data[0].lon;

            $scope.getWeatherDetails(name, lat, lon);
          })
          .catch(function (error) {
            console.error("Error getting coordinates:", error);
            alert("Oops!! An error occurred while getting the coordinates");
          });
      };

      $scope.getUserCoordinates = function () {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var apiUrl =
              "https://api.openweathermap.org/geo/1.0/reverse?lat=" +
              latitude +
              "&lon=" +
              longitude +
              "&limit=1&appid=cbb7f5c53aa2d5d4349bef7bf1ad233d";

            $http
              .get(apiUrl)
              .then(function (response) {
                var name = response.data[0].name;
                $scope.getWeatherDetails(name, latitude, longitude);
              })
              .catch(function (error) {
                console.error("Error getting user coordinates:", error);
                alert("Oops!! An error occurred while getting the city");
              });
          },
          function (error) {
            if (error.code === error.PERMISSION_DENIED) {
              alert("Geolocation request denied. Reset location permission");
            }
          }
        );
      };

      $scope.searchCity = function () {
        $scope.getCityCoordinates();
      };

      $scope.useLocation = function () {
        $scope.getUserCoordinates();
      };
    },
  ]);

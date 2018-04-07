window.onload = function() {
	// get json for current ip
	var inputUrl = "https://ipinfo.io/json";
	
	// get app id from Open Weather Map Api
	var appId = "611cfeb9442835207befca6184cb8971";

	// get the location element from the index - this is the H1 header
	var location = document.getElementById("location");

	var currentDate = new Date();

	//setting the date
	var dateElem = document.getElementById("date");
	var strDate = currentDate.toString();
	dateElem.innerHTML = strDate.substring(0, strDate.length-18)

	httpRequestAsync(inputUrl);

	// this function will call the ipinfo.io api and request the location
	function httpRequestAsync(url, callback) {

		// The XMLHttpRequest object is  used to request data from a web server.
		var httpReqIp = new XMLHttpRequest();

		// XMLHttpRequest.open(method, url, async)
		httpReqIp.open("GET", url, true);

		// The onreadystatechange property specifies a function to be executed 
		// every time the status of the XMLHttpRequest object changes
		httpReqIp.onreadystatechange = function() {

			// When readyState property is 4 and the status property is 200,
			// the response is ready
			if (httpReqIp.readyState == 4 & httpReqIp.status == 200) {

				// The responseText property returns the server response as a
				// text string
				var jsonIp = JSON.parse(httpReqIp.responseText);
				console.log(jsonIp);
				var city = jsonIp.city;
				var country = jsonIp.country;

				// This is an ECMAScript 6 feature called template literals.
				// or Back-ticks notation
				// this is also used in Visual Studio 2017
				// notice this is not a ' sign - it is a ` sign.
				location.innerHTML = `${city}, ${country}`;
				// it is equal to this:
				// location.innerHTML = city + ', ' + country;

				// getting the latitude and longitude from the jsonIp.loc using string.split()
				// it will split the string after the comma sign - ,
				// and will return an array - the first element will be the latitude
				// the second element will be the longitude
				var lat = jsonIp.loc.split(",")[0];
				var lon = jsonIp.loc.split(",")[1];
				var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=
						${lat}&lon=${lon}&appid=${appId}`; 
				httpRequestWeatherAsync(weatherUrl);
			}
		}

		// performs the request
		httpReqIp.send();

	}

	function httpRequestWeatherAsync(url, callback) {
		var httpReqWeather = new XMLHttpRequest();
		httpReqWeather.open("GET", url, true);
		httpReqWeather.onreadystatechange = function() {
			if (httpReqWeather.readyState == 4 & httpReqWeather.status == 200) {
				var jsonWeather = JSON.parse(httpReqWeather.responseText);
				console.log(jsonWeather);
				var description = jsonWeather.weather[0].description;
				var id = jsonWeather.weather[0].id;
				// the temp is received in kelvin - we need to convert it to celsius
				var temperature = jsonWeather.main.temp;
				var tempCelsuis = convertKelvinToCelsius(temperature);
				var humidity = jsonWeather.main.humidity;
				var windSpeed = jsonWeather.wind.speed;
				var visibility = jsonWeather.visibility;
				
				document.getElementById('text-desc').innerHTML = description;
				document.getElementById('icon-desc').className = `wi wi-owm-${id}`;
				document.getElementById('temperature-data').innerHTML = tempCelsuis;

				document.getElementById('humidity-data-text').innerHTML = `${humidity}%`;
				document.getElementById('wind-speed-data-text').innerHTML = `${windSpeed}m/h`;
				if (visibility == undefined) {
					document.getElementById('visibility-data-text').innerHTML = "N/A";
				} else {
					document.getElementById('visibility-data-text').innerHTML = `${visibility}&deg;`;
				}
				
			}
		}
		httpReqWeather.send();
	}
}

function convertKelvinToCelsius(kelvin) {
	if (kelvin < (0)) {
		return 'below absolute zero (0 K)';
	} else {
		return Math.round(kelvin-273.15);
	}
}







const cityInput = document.querySelector("#weatherCityInpot"); // get the city text input
const CountryCodeInput = document.querySelector("#countryCode"); // get the country code text input
const button = document.querySelector("#weatherSearch"); // get the weather search button
const htmlDisply = document.querySelector("#weatherCityDisplay"); // get the div to display the weather
const htmlPropertyDisply = document.querySelector("#propertiesDisplay"); // get the div to display the properties
const apiKey = process.env.MY_API_KEY; // api key for weather data
const propertyApiKey = process.env.MY_PROPERTY_API_KEY; // api key for properties data

// get the weather opbject properties and change to display with first Capital letter and no "_" character used only for weather data
const arrangePropertyForDisplay = (string) => {
  let displayString = string.split("_").join(" ");
  console.log(displayString);
  displayString =
    displayString.charAt(0).toUpperCase() + displayString.slice(1);
  return displayString;
};

//get json from api fetch
const handleReqest = (res) => {
  return res.json();
};

// show weather data
const handleData = (data) => {
  if (data.name === undefined) {
    htmlDisply.innerHTML = "";
    return alert("City or Country code doesn't match, please try again."); // if no city input or  city input is undefined send alert
  }
  let htmlData = `City: ${data.name}<br>`; // get the city first
  for (const item in data.main) {
    htmlData += `${arrangePropertyForDisplay(item)}: ${data.main[item]}<br>`; // add all properties and keys in data.main object
  }
  htmlDisply.innerHTML = htmlData;
};
// show properties data
const handlePropertyData = (data) => {
  htmlPropertyDisply.innerHTML = ""; // clear data from web page
  let propertiesUrl = data
    .map((p) => {
      const unitNumber = p.unitNumber === undefined ? "" : `${p.unitNumber}/`; // get the unit number if the property "unit" is available
      return `Property Type:${p.propertyType}<br>Bathrooms: ${p.bathrooms}<br>Bedrooms:\
       ${p.bedrooms}<br>Carspaces: ${p.carspaces}<br>Adress:\
       ${unitNumber}${p.streetNumber} ${p.streetName} ${p.streetType},\
        ${p.suburb}, ${p.postcode}, ${p.state}\
        <br><a href="${p.propertyDetailsUrl}" target="_blank">On domain.com.au</a>`;
    })
    .join("<br><br>");
  htmlPropertyDisply.innerHTML = propertiesUrl; //insert the properties data to the web page
};

// fetch the weather data from the api
function showWeather(event) {
  event.preventDefault();
  const baseURL = "https://api.openweathermap.org/data/2.5/weather";
  const parameters = `?q=${cityInput.value},${CountryCodeInput.value}&units=metric&appid=${apiKey}`;
  const finalUrl = baseURL + parameters;
  fetch(finalUrl).then(handleReqest).then(handleData);
}

// get the weathetr with enter click
cityInput.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    showWeather(event);
  }
});
// fetch the properties data from the api
function showProperties() {
  const url = `https://api.domain.com.au/v1/salesResults/${cityInput.value}/listings`;
  fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Api-Key": propertyApiKey,
    },
  })
    .then(handleReqest)
    .then(handlePropertyData);
}

// event listeners for the weather and properties searcg buttons
button.addEventListener("click", showWeather);
propertiesSearch.addEventListener("click", showProperties);

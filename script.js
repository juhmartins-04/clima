function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function getWeatherIcon(id) {
  if (id >= 200 && id < 300) return "wi-thunderstorm";
  if (id >= 300 && id < 500) return "wi-sprinkle";
  if (id >= 500 && id < 600) return "wi-rain";
  if (id >= 600 && id < 700) return "wi-snow";
  if (id >= 700 && id < 800) return "wi-fog";
  if (id === 800) return "wi-day-sunny";
  if (id > 800 && id < 900) return "wi-cloudy";
  return "wi-na";
}

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "8f5476e78fe027196d60be067152e138";
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

  try {
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error("Cidade não encontrada");
    const currentData = await currentResponse.json();

    const weatherDiv = document.getElementById("weatherResult");
    const iconClass = getWeatherIcon(currentData.weather[0].id);

    weatherDiv.innerHTML = `
      <h2>${currentData.name}, ${currentData.sys.country}</h2>
      <i class="weather-icon wi ${iconClass}"></i>
      <p><strong>🌡️ Temperatura:</strong> ${currentData.main.temp} °C</p>
      <p><strong>☁️ Clima:</strong> ${currentData.weather[0].description}</p>
      <p><strong>💧 Umidade:</strong> ${currentData.main.humidity}%</p>
      <p><strong>🌬️ Vento:</strong> ${currentData.wind.speed} m/s</p>
      <p><strong>📊 Pressão:</strong> ${currentData.main.pressure} hPa</p>
    `;

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Erro ao obter previsão do tempo");
    const forecastData = await forecastResponse.json();

    const forecastDiv = document.getElementById("forecastResult");
    forecastDiv.innerHTML = `<h3>Previsão (5 próximos dias)</h3>`;

    const dailyMap = {};
    forecastData.list.forEach(entry => {
      const date = new Date(entry.dt * 1000).toLocaleDateString("pt-BR");
      if (!dailyMap[date]) {
        dailyMap[date] = { min: entry.main.temp_min, max: entry.main.temp_max, entry };
      } else {
        dailyMap[date].min = Math.min(dailyMap[date].min, entry.main.temp_min);
        dailyMap[date].max = Math.max(dailyMap[date].max, entry.main.temp_max);
      }
    });

    Object.entries(dailyMap).slice(0, 5).forEach(([date, data]) => {
      const iconClass = getWeatherIcon(data.entry.weather[0].id);
      forecastDiv.innerHTML += `
        <div class="forecast-day">
          <p><strong>${new Date(data.entry.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</strong></p>
          <i class="weather-icon wi ${iconClass}"></i>
          <p>🌡️ Min: ${data.min}°C / Max: ${data.max}°C</p>
          <p>☁️ ${data.entry.weather[0].description}</p>
          <p>💧 Umidade: ${data.entry.main.humidity}%</p>
          <p>🌬️ Vento: ${data.entry.wind.speed} m/s</p>
        </div>
      `;
    });

  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
    document.getElementById("forecastResult").innerHTML = "";
  }
}

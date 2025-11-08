
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weatherForm");
  const resultDiv = document.getElementById("weatherResult");
  const historyList = document.getElementById("historyList");
  const year = document.getElementById("year");
  year.textContent = new Date().getFullYear();

  // Cargar historial de consultas
  const history = JSON.parse(localStorage.getItem("weather_history") || "[]");
  renderHistory(history);

  // Evento de búsqueda
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value.trim();
    if (!city) {
      alert("Por favor, ingresa el nombre de una ciudad.");
      return;
    }

    try {
      // Petición a wttr.in
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      if (!res.ok) throw new Error("Error al conectar con la API");
      const data = await res.json();

      const current = data.current_condition[0];
      const weather = {
        city,
        temp: current.temp_C,
        desc: current.weatherDesc[0].value,
        humidity: current.humidity,
        date: new Date().toLocaleString()
      };

      showWeather(weather);

      // Guardar en historial local
      history.push(weather);
      localStorage.setItem("weather_history", JSON.stringify(history));
      renderHistory(history);

    } catch (error) {
      console.error("Error al obtener el clima:", error);
      alert("No se pudo obtener el clima. Revisa tu conexión o el nombre de la ciudad.");
    }
  });

  // Mostrar resultado en pantalla
  function showWeather(w) {
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `
      <h4>${w.city}</h4>
      <p><strong>Temperatura:</strong> ${w.temp} °C</p>
      <p><strong>Condición:</strong> ${w.desc}</p>
      <p><strong>Humedad:</strong> ${w.humidity}%</p>
      <p class="meta">${w.date}</p>
    `;
  }

  // Renderizar historial
  function renderHistory(list) {
    historyList.innerHTML = "";
    if (!list.length) {
      historyList.innerHTML = "<p class='muted'>Aún no hay consultas.</p>";
      return;
    }
    list.slice().reverse().forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${item.city}</h4>
        <p>${item.temp} °C - ${item.desc}</p>
        <div class="meta">${item.date}</div>
      `;
      historyList.appendChild(card);
    });
  }
});

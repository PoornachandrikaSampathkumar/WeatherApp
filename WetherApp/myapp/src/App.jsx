import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 AUTO SUGGESTIONS
  const getSuggestions = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5`
    );

    const data = await res.json();
    setSuggestions(data.results || []);
  };

  // 📍 LOCATION
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      fetchWeather(pos.coords.latitude, pos.coords.longitude, "My Location");
    });
  };

  // 🌤️ FETCH WEATHER (PROPER HUMIDITY FIX)
  const fetchWeather = async (lat, lon, label) => {
    setLoading(true);

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    const data = await res.json();

    // ✅ REAL FIX: safe humidity mapping
    let humidity = null;

    if (data.hourly?.time && data.current_weather?.time) {
      const index = data.hourly.time.findIndex((t) =>
        t.slice(0, 13) === data.current_weather.time.slice(0, 13)
      );

      humidity =
        index !== -1 ? data.hourly.relativehumidity_2m[index] : null;
    }

    setWeather({
      temp: data.current_weather.temperature,
      wind: data.current_weather.windspeed,
      humidity: humidity ?? "N/A",
      location: label,
    });

    // 📊 forecast
    const chart = data.daily.time.map((t, i) => ({
      day: t.slice(5),
      temp: data.daily.temperature_2m_max[i],
    }));

    setForecast(chart);

    setLoading(false);
    setSuggestions([]);
  };

  // 🔍 SEARCH CITY
  const searchCity = async (name) => {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1`
    );

    const data = await res.json();
    if (!data.results) return;

    const loc = data.results[0];

    fetchWeather(
      loc.latitude,
      loc.longitude,
      `${loc.name}, ${loc.country}`
    );
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>🌤️ Weather Pro</h1>

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <input
          value={city}
          onChange={(e) => getSuggestions(e.target.value)}
          placeholder="Search city..."
          style={styles.input}
        />

        <button onClick={() => searchCity(city)} style={styles.btn}>
          Search
        </button>

        <button onClick={useMyLocation} style={styles.locBtn}>
          📍
        </button>
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div style={styles.dropdown}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              style={styles.item}
              onClick={() => {
                setCity(s.name);
                searchCity(s.name);
                setSuggestions([]);
              }}
            >
              {s.name}, {s.country}
            </div>
          ))}
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* WEATHER CARD */}
      {weather && (
        <div style={styles.card}>
          <h2>{weather.location}</h2>

          <div style={styles.grid}>
            <div>🌡️ {weather.temp}°C</div>
            <div>💨 {weather.wind} km/h</div>
            <div>💧 {weather.humidity}%</div>
          </div>
        </div>
      )}

      {/* CHART */}
      {forecast.length > 0 && (
        <div style={styles.chart}>
          <h3>📊 Temperature Trend</h3>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={forecast}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#38bdf8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* 🎨 MOBILE PRO UI */
const styles = {
  app: {
    minHeight: "100vh",
    padding: "18px",
    fontFamily: "Arial",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    color: "#e5e7eb",
  },

  title: {
    textAlign: "center",
  },

  searchBox: {
    display: "flex",
    gap: "8px",
    marginTop: "15px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },

  btn: {
    padding: "12px",
    borderRadius: "12px",
    background: "#3b82f6",
    border: "none",
    color: "white",
  },

  locBtn: {
    padding: "12px",
    borderRadius: "12px",
    background: "#334155",
    border: "none",
    color: "white",
  },

  dropdown: {
    background: "#0f172a",
    border: "1px solid #334155",
    marginTop: "5px",
    borderRadius: "10px",
  },

  item: {
    padding: "10px",
    borderBottom: "1px solid #1e293b",
    cursor: "pointer",
  },

  card: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
  },

  grid: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },

  chart: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
  },
};
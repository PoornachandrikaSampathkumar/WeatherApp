import { useState } from "react";

export default function SearchBar({
  fetchWeather,
  getCurrentLocationWeather,
}) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city);
      setCity("");
    }
  };

  return (
    <div>

      <label className="font-semibold">
        Enter a City Name
      </label>

      <input
        type="text"
        placeholder="E.g., New York, London, Tokyo"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full border p-3 rounded-md mt-2 outline-none"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md mt-4"
      >
        Search
      </button>

      <div className="text-center text-gray-500 my-4">
        or
      </div>

      <button
        onClick={getCurrentLocationWeather}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md"
      >
        Use Current Location
      </button>

    </div>
  );
}

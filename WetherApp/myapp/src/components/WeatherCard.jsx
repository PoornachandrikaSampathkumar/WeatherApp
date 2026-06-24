export default function WeatherCard({ weather }) {
  return (
    <div className="bg-blue-600 text-white rounded-xl p-5 flex justify-between items-center">

      <div>

        <h2 className="text-3xl font-bold">
          {weather.name}
        </h2>

        <p className="mt-3">
          Temperature: {weather.main?.temp}°C
        </p>

        <p>
          Wind: {weather.wind?.speed} M/S
        </p>

        <p>
          Humidity: {weather.main?.humidity}%
        </p>

      </div>

      <div className="text-center">

        <img
          src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
          alt="weather icon"
        />

        <p className="capitalize">
          {weather.weather?.[0]?.description}
        </p>

      </div>

    </div>
  );
}
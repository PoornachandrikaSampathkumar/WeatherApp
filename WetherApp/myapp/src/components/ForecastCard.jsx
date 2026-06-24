export default function ForecastCard({ item }) {
  return (
    <div className="bg-gray-500 text-white rounded-xl p-4">

      <h3 className="font-bold">
        {item.dt_txt.split(" ")[0]}
      </h3>

      <img
        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt=""
      />

      <p>
        Temp: {item.main.temp}°C
      </p>

      <p>
        Wind: {item.wind.speed} M/S
      </p>

      <p>
        Humidity: {item.main.humidity}%
      </p>

    </div>
  );
}
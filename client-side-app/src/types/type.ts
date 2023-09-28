export type WeatherData = {
  timestamp: number;
  data: {
    time: {
      local: string;
      utc: string;
    };
    weatherCode: {
      value: string;
    };
    temperature: number;
    dewPoint: number;
    feelsLike: number;
    wind: {
      direction: string;
      speed: number;
      gust: number;
    };
    relativeHumidity: number;
    pressure: {
      value: number;
      trend: number;
    };
    visibility: number;
    ceiling: number;
  };
};

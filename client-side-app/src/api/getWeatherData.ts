export const getWeatherData = async () => {
  try {
    const response = await fetch('http://localhost:3005/weather');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`Error getting weather data`, error);
    throw new Error('server cannot be reached: offline');
  }
};

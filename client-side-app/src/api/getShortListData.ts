export const getShortListData = async () => {
  try {
    const response = await fetch('http://localhost:3006/shortlist');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`Error getting weather data`, error);
    throw new Error('server cannot be reached: offline');
  }
};

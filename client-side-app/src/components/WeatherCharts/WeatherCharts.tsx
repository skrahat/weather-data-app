import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './Charts.css';
import { getWeatherData } from '../../api/getWeatherData';

const WeatherCharts: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  // Initialize chartRefs with an array of null values
  type ValidChartType = 'line' | 'bar' | 'scatter' | 'bubble';

  const chartRefs = useRef<Array<Chart<ValidChartType, any[], unknown> | null>>(
    [null, null, null, null, null, null]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData();

        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // Create the charts once when the component mounts
    if (chartRefs.current[0] === null) {
      chartRefs.current = chartRefs.current.map((_, index) => {
        const ctx = document.getElementById(
          `chart-x-${index}`
        ) as HTMLCanvasElement;

        const borderColor =
          index % 2 === 0 ? 'rgb(75, 192, 192)' : 'rgb(192, 75, 75)';

        return new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                label: '',
                data: [],
                borderColor: borderColor,
                borderWidth: 1,
                pointRadius: 0,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    // Update the charts' data when new data is available
    if (chartRefs.current[0]) {
      chartRefs.current.forEach((chartRef, index) => {
        if (chartRef) {
          try {
            // Extract timestamps and data values from the data
            const timestamps = data.map((entry) => new Date(entry.timestamp));
            let dataKey = '';
            switch (index) {
              case 0:
                dataKey = 'dewPoint';
                break;
              case 1:
                dataKey = 'visibility';
                break;
              case 2:
                dataKey = 'relativeHumidity';
                break;
              case 3:
                dataKey = 'temperature';
                break;
              case 4:
                dataKey = 'feelsLike';
                break;
              case 5:
                dataKey = 'ceiling';
                break;
              default:
                break;
            }

            // Check if data is an array before attempting to map it
            if (Array.isArray(data)) {
              const dataValues = data.map(
                (entry) => entry.data[dataKey] || null
              );

              if (chartRef.options && chartRef.options.scales) {
                if (chartRef.options.scales.y) {
                  chartRef.data.labels = timestamps;
                  chartRef.data.datasets[0].data = dataValues;

                  chartRef.options.scales.y.title = {
                    display: true,
                    text: dataKey,
                  };

                  // Update the chart
                  chartRef.update();
                }
              }
            }
          } catch (error) {
            console.error('Error updating chart:', error);
          }
        }
      });
    }
  }, [data]);

  return (
    <div>
      <h2>Toronto Data Charts</h2>
      <div className="chart-container">
        {chartRefs.current.map((_, index) => (
          <div key={index} className="chart-item">
            <canvas id={`chart-x-${index}`} width={400} height={200}></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCharts;

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './WeatherCharts.css';
import { getShortListData } from '../../api/getShortListData';
import { getWeatherData } from '../../api/getWeatherData';

type ValidChartType = 'line' | 'bar' | 'scatter' | 'bubble';

interface ShortListChartsProps {
  dataType: 'observations' | 'forecasts';
  number: number;
}

const ShortListCharts: React.FC<ShortListChartsProps> = ({
  dataType,
  number,
}) => {
  const [data, setData] = useState<any[]>([]);
  const chartRefs = useRef<Array<Chart<ValidChartType, any[], unknown> | null>>(
    [null, null, null, null, null, null]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = [];
        if (dataType === 'forecasts') {
          response = await getShortListData();
          // Extract the shortterm data
          response = response[0]?.data?.shortterm || [];
        } else {
          response = await getWeatherData();
        }
        // Set the data state
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 600 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dataType]);

  useEffect(() => {
    // Create the charts once when the component mounts or when data changes
    if (chartRefs.current[0] === null && data.length > 0) {
      console.log('Initializing charts...', data);

      chartRefs.current = chartRefs.current.map((_, index) => {
        const ctx = document.getElementById(
          `chart-${number}-${index}`
        ) as HTMLCanvasElement;

        const borderColor =
          index % 2 === 0 ? 'rgb(75, 192, 192)' : 'rgb(192, 75, 75)';

        const initialData = data.map(() => null);

        return new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map((entry) => entry?.time?.local),
            datasets: [
              {
                label: '',
                data: initialData,
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
                title: {
                  display: true,
                  text: 'Time (Local)',
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
  }, [dataType, data]);

  useEffect(() => {
    // Update the charts' data when new data is available
    if (chartRefs.current[0]) {
      chartRefs.current.forEach((chartRef, index) => {
        if (chartRef) {
          // Extract time.local and data values from the data
          const timeLocalValues = data.map((entry) => entry?.time?.local);
          let dataKey = '';
          console.log('entry', dataType, data);
          switch (index) {
            case 0:
              dataKey = 'dewPoint';
              break;
            case 1:
              dataKey = 'pop';
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
              dataKey = 'pressure';
              break;
            default:
              break;
          }
          let dataValues;
          if (dataType === 'forecasts') {
            dataValues = data.map((entry) => {
              const nestedValue = entry[dataKey];
              return nestedValue?.value !== undefined
                ? nestedValue.value
                : nestedValue;
            });
          } else {
            dataValues = data.map((entry) => entry.data[dataKey] || null);
          }
          // Check if chartRef.options and chartRef.options.scales are defined
          if (chartRef.options && chartRef.options.scales) {
            // Check if chartRef.options.scales.y is defined

            if (chartRef.options.scales.y) {
              // Update the chart's data and labels
              chartRef.data.labels = timeLocalValues;
              chartRef.data.datasets[0].data = dataValues;

              // Update chart-specific options
              chartRef.options.scales.y.title = {
                display: true,
                text: dataKey,
              };
              // Update the chart
              chartRef.update();
            }
          }
        }
      });
    }
  }, [dataType, data]);

  return (
    <div>
      <h2>Toronto Charts</h2>
      <div className="chart-container">
        {chartRefs.current.map((_, index) => (
          <div key={index} className="chart-item">
            <canvas
              id={`chart-${number}-${index}`}
              width={400}
              height={200}
            ></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortListCharts;

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './Charts.css';
import { getShortListData } from '../../api/getShortListData';
type ValidChartType = 'line' | 'bar' | 'scatter' | 'bubble';

const ShortListCharts: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const chartRefs = useRef<Array<Chart<ValidChartType, any[], unknown> | null>>(
    [null, null, null, null, null, null]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getShortListData();
        const shorttermData = response[0]?.data?.shortterm || [];

        // Set the data state
        setData(shorttermData);
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
  }, []);

  useEffect(() => {
    // Create the charts once when the component mounts or when data changes
    if (chartRefs.current[0] === null) {
      //console.log('Initializing charts...', data);

      chartRefs.current = chartRefs.current.map((_, index) => {
        const ctx = document.getElementById(
          `chart-2-${index}`
        ) as HTMLCanvasElement;

        const borderColor =
          index % 2 === 0 ? 'rgb(75, 192, 192)' : 'rgb(192, 75, 75)';

        const initialData = data.map(() => null); // Initialize with empty data

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
  }, [data]);

  useEffect(() => {
    // Update the charts' data when new data is available
    if (chartRefs.current[0]) {
      chartRefs.current.forEach((chartRef, index) => {
        if (chartRef) {
          // Extract time.local and data values from the data
          const timeLocalValues = data.map((entry) => entry?.time?.local);
          let dataKey = '';

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

          const dataValues = data.map((entry) => {
            const nestedValue = entry[dataKey];
            return nestedValue?.value !== undefined
              ? nestedValue.value
              : nestedValue;
          });

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
  }, [data]);

  return (
    <div>
      <h2>Toronto forecast Charts</h2>
      <div className="chart-container">
        {chartRefs.current.map((_, index) => (
          <div key={index} className="chart-item">
            <canvas id={`chart-2-${index}`} width={400} height={200}></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortListCharts;

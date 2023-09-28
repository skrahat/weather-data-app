import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface ChartContainerProps {
  chartData: any[];
  dataKey: string;
  title: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  chartData,
  dataKey,
  title,
}) => {
  const chartRef = useRef<any | null>(null);

  useEffect(() => {
    const ctx = document.getElementById(
      `chart-${dataKey}`
    ) as HTMLCanvasElement;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: title,
              data: [],
              borderColor: '',
              borderWidth: 2,
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
              title: {
                display: true,
                text: title,
              },
            },
          },
        },
      });
    }

    // Extract timestamps and data values from the data
    const timestamps = chartData.map((entry) => new Date(entry.timestamp));
    const dataValues = chartData.map((entry) => entry.data[dataKey] || null);

    // Update the chart's data and labels
    chartRef.current.data.labels = timestamps;
    chartRef.current.data.datasets[0].data = dataValues;

    // Update the chart
    chartRef.current.update();
  }, [chartData, dataKey, title]);

  return (
    <div className="chart-item">
      <canvas id={`chart-${dataKey}`} width={400} height={200}></canvas>
    </div>
  );
};

export default ChartContainer;

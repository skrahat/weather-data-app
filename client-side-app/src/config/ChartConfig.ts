import { ChartConfiguration } from 'chart.js/auto';

export const chartConfigurations: ChartConfiguration[] = [
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
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
  },
];

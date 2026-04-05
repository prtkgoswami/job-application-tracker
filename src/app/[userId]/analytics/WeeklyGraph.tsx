import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type Props = {
  weeklyStreak: Record<string, number>;
};

const WeeklyGraph = ({ weeklyStreak }: Props) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const dataPoints = labels.map((_, index) => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sun, 1 is Mon
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + index;
    const dateStr = new Date(d.setDate(diff)).toISOString().split("T")[0];

    return weeklyStreak[dateStr] || 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Smoothes the line
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fe9a00",
        pointBorderColor: "#fe9a00",
        pointBorderWidth: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide legend for a cleaner "dashboard" look
      tooltip: {
        enabled: true,
        displayColors: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `${context.parsed.y} Applications`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
          padding: 12,
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        border: { color: "rgba(255, 255, 255, 0.5)" },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
          padding: 12,
        },
        border: { color: "rgba(255, 255, 255, 0.5)" },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyGraph;

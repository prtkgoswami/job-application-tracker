import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// 1. Register the specific element for Pie/Doughnut
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  counts:
    | {
        applied: number;
        interviewing: number;
        rejected: number;
        offered: number;
        wishlisted: number;
      }
    | undefined;
};

const ApplicationBreakdown = ({ counts }: Props) => {
  const data = {
    labels: ["Pending", "Interviewing", "Rejected", "Offered", "Wishlisted"],
    datasets: [
      {
        data: [
          counts?.applied || 0,
          counts?.interviewing || 0,
          counts?.rejected || 0,
          counts?.offered || 0,
          counts?.wishlisted || 0,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)", // Applied - Blue
          "rgba(255, 206, 86, 0.8)", // Interviewing - Yellow
          "rgba(255, 99, 132, 0.8)", // Rejected - Red
          "rgba(75, 192, 192, 0.8)", // Offered - Green
          "rgba(153, 102, 255, 0.8)", // Wishlisted - Purple
        ],
        borderColor: ["#fff0"],
        borderWidth: 2,
        hoverOffset: 10, // Pops the segment out on hover
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true, // Circular legend icons look cleaner,
          font: { size: 12 },
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 6,
      },
    },
    // This creates the "hole" in the middle for a Doughnut look
    cutout: "60%",
  };

  return (
    <div style={{ height: "350px", width: "100%", position: "relative" }}>
      <Doughnut data={data} options={options} />
      {/* Optional: Add a center stat for "Total" */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <span
          style={{ fontSize: "24px", fontWeight: "bold", display: "block" }}
        >
          {Object.values(counts || {}).reduce((a, b) => a + b, 0)}
        </span>
        <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}>
          Total
        </span>
      </div>
    </div>
  );
};

export default ApplicationBreakdown;

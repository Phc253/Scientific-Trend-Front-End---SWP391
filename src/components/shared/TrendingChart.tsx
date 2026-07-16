import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TrendingChartProps {
  trendingData: any[];
}

const TrendingChart: React.FC<TrendingChartProps> = ({ trendingData }) => {
  // Lấy ra Top 7 từ khóa đứng đầu
  const topItems = trendingData.slice(0, 7);

  // Cấu hình dữ liệu cho biểu đồ
  const data = {
    labels: topItems.map((item) => item.name || "Chưa rõ"),
    datasets: [
      {
        label: "Điểm xu hướng",
        // ĐÃ SỬA THÀNH item.trendScore Ở ĐÂY 👇
        data: topItems.map((item) => item.trendScore || 0),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // Chuyển thành biểu đồ cột ngang
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13, weight: "bold" as const },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        beginAtZero: true, // Ép trục X bắt đầu từ 0
      },
      y: {
        grid: { display: false },
        ticks: { autoSkip: false }, // Không ẩn chữ nếu chữ quá dài
      },
    },
  };

  return (
    <div className="h-full w-full min-h-[250px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TrendingChart;

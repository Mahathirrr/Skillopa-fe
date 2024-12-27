import React from "react";
import { useSelector } from "react-redux";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const InstructorDashboard = () => {
  const { earnings } = useSelector((state) => state.payment);
  const { data: courses } = useSelector((state) => state.courses);

  const getChartData = () => {
    if (!earnings?.data?.payments) return null;

    const monthlyData = earnings.data.payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += payment.amount;
      return acc;
    }, {});

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: "Monthly Earnings",
          data: Object.values(monthlyData),
          backgroundColor: "rgba(56, 45, 139, 0.5)",
          borderColor: "rgb(56, 45, 139)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Earnings Overview",
      },
    },
  };

  const totalStudents = courses?.reduce((total, course) => {
    return total + (course.meta?.enrollments?.length || 0);
  }, 0);

  const totalCourses = courses?.length || 0;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Earnings
          </h3>
          <p className="text-3xl font-bold text-primary">
            IDR {earnings?.data?.totalEarnings?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-primary">{totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Courses</h3>
          <p className="text-3xl font-bold text-primary">{totalCourses}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {getChartData() && <Bar data={getChartData()} options={chartOptions} />}
      </div>
    </div>
  );
};

export default InstructorDashboard;

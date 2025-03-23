import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        fontFamily: "'Roboto', sans-serif",
        background: "#f8f9fa",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
      colors: ["#4f46e5"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Xu Hướng Doanh Thu",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#333",
        },
      },
      grid: {
        borderColor: "#e0e0e0",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 4,
        colors: ["#4f46e5"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Ngày",
          style: {
            fontSize: "14px",
            fontWeight: "500",
          },
        },
        labels: {
          style: {
            colors: "#333",
          },
        },
      },
      yaxis: {
        title: {
          text: "Doanh Thu (USD)",
          style: {
            fontSize: "14px",
            fontWeight: "500",
          },
        },
        min: 0,
        labels: {
          formatter: function (value) {
            return "$" + value.toLocaleString();
          },
          style: {
            colors: "#333",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.3,
          opacityFrom: 0.9,
          opacityTo: 0.6,
          stops: [0, 100],
        },
      },
    },
    series: [{ name: "Doanh Thu", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Doanh Thu", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        <AdminMenu />
        <main className="flex-1 p-6 xl:ml-64">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Bảng Điều Khiển
          </h1>

          {/* Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-indigo-600 rounded-full p-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">Tổng doanh thu</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    "$" + sales?.totalSales?.toLocaleString()
                  )}
                </div>
              </div>
              <div className="bg-indigo-50 px-6 py-2">
                <div className="text-indigo-600 text-sm font-medium">
                  Tổng doanh thu từ tất cả đơn hàng
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-pink-600 rounded-full p-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">Khách hàng</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {loading ? <Loader /> : customers?.length || 0}
                </div>
              </div>
              <div className="bg-pink-50 px-6 py-2">
                <div className="text-pink-600 text-sm font-medium">
                  Tổng số khách hàng đã đăng ký
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-amber-600 rounded-full p-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">Đơn hàng</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                </div>
              </div>
              <div className="bg-amber-50 px-6 py-2">
                <div className="text-amber-600 text-sm font-medium">
                  Tổng số đơn hàng đã đặt
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
              width="100%"
            />
          </div>

          {/* Danh sách đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Đơn Hàng Gần Đây
            </h2>
            <OrderList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from "react";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Đường kẻ ngang phía sau */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>

          {/* Các bước */}
          <div className="relative z-10 flex justify-between w-full">
            {/* Bước 1: Đăng Nhập */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                  step1
                    ? "bg-teal-500 border-teal-200 shadow-lg shadow-teal-200/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {step1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-gray-500 font-bold">1</span>
                )}
              </div>
              <span
                className={`mt-3 font-medium text-sm ${
                  step1 ? "text-teal-500" : "text-gray-500"
                }`}
              >
                Đăng Nhập
              </span>
            </div>

            {/* Bước 2: Giao Hàng */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                  step2
                    ? "bg-teal-500 border-teal-200 shadow-lg shadow-teal-200/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {step2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-gray-500 font-bold">2</span>
                )}
              </div>
              <span
                className={`mt-3 font-medium text-sm ${
                  step2 ? "text-teal-500" : "text-gray-500"
                }`}
              >
                Giao Hàng
              </span>
            </div>

            {/* Bước 3: Tổng Kết */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                  step3
                    ? "bg-teal-500 border-teal-200 shadow-lg shadow-teal-200/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {step3 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-gray-500 font-bold">3</span>
                )}
              </div>
              <span
                className={`mt-3 font-medium text-sm ${
                  step3 ? "text-teal-500" : "text-gray-500"
                }`}
              >
                Tổng Kết
              </span>
            </div>
          </div>

          {/* Đường kẻ tiến độ */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 transition-all duration-500 z-0"
            style={{
              width:
                step1 && step2 && step3
                  ? "100%"
                  : step1 && step2
                  ? "50%"
                  : step1
                  ? "0%"
                  : "0%",
            }}
          ></div>
        </div>

        {/* Chi tiết tiến độ */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div
            className={`p-3 rounded-lg ${
              step1 ? "bg-teal-50 text-teal-700" : "bg-gray-50 text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mx-auto mb-2 ${
                step1 ? "text-teal-500" : "text-gray-300"
              }`}
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
            <p className="text-xs font-medium">Tài khoản xác nhận</p>
          </div>

          <div
            className={`p-3 rounded-lg ${
              step2 ? "bg-teal-50 text-teal-700" : "bg-gray-50 text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mx-auto mb-2 ${
                step2 ? "text-teal-500" : "text-gray-300"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-xs font-medium">Thông tin giao hàng</p>
          </div>

          <div
            className={`p-3 rounded-lg ${
              step3 ? "bg-teal-50 text-teal-700" : "bg-gray-50 text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mx-auto mb-2 ${
                step3 ? "text-teal-500" : "text-gray-300"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xs font-medium">Xác nhận đơn hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;

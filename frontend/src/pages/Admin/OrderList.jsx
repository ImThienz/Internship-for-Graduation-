import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
        </div>

        <AdminMenu />

        {isLoading ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Sản Phẩm
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Mã Đơn Hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Khách Hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Ngày Đặt
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Tổng Tiền
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Thanh Toán
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Giao Hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                    >
                      Chi Tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={order.orderItems[0].image}
                            alt={order._id}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          {order.orderItems.length > 1 && (
                            <span className="ml-2 text-sm text-gray-500">
                              +{order.orderItems.length - 1} sản phẩm khác
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono">
                          {order._id.substring(0, 10)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user
                          ? order.user.username
                          : "Không có thông tin"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không có thông tin"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Chờ thanh toán
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Đã giao hàng
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Đang vận chuyển
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không có đơn hàng nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { FaCheck, FaClock, FaInfoCircle } from "react-icons/fa";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
        Đơn Hàng Của Tôi
      </h2>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="my-8">
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        </div>
      ) : orders?.length === 0 ? (
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
          <p className="text-blue-600 font-medium text-center">
            Bạn chưa có đơn hàng nào.
            <Link to="/products" className="underline ml-2 font-semibold">
              Tiếp tục mua sắm
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    HÌNH ẢNH
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    MÃ ĐƠN HÀNG
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    NGÀY ĐẶT
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    TỔNG TIỀN
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    THANH TOÁN
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                    GIAO HÀNG
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-4 px-6">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {order.totalPrice.toLocaleString("en-US")}$
                    </td>

                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCheck className="mr-1" /> Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaClock className="mr-1" /> Chờ thanh toán
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {order.isDelivered ? (
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCheck className="mr-1" /> Đã giao hàng
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaClock className="mr-1" /> Đang vận chuyển
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center transition duration-150">
                          <FaInfoCircle className="mr-2" /> Xem Chi Tiết
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;

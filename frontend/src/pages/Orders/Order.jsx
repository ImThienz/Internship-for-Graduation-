import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal?.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Đơn hàng đã được thanh toán thành công");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Đơn hàng đã được đánh dấu là đã giao");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
        </div>
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "details"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-pink-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "summary"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-pink-500"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Thông tin đơn hàng
          </button>
        </div>
        <div className="flex flex-col lg:flex-row">
          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3 p-6"
            >
              {order.orderItems.length === 0 ? (
                <Message>Đơn hàng trống</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Hình ảnh</th>
                        <th className="p-4 text-left">Sản phẩm</th>
                        <th className="p-4 text-center">Số lượng</th>
                        <th className="p-4 text-right">Đơn giá</th>
                        <th className="p-4 text-right">Tổng tiền</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div className="h-20 w-20 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                              />
                            </div>
                          </td>

                          <td className="p-4">
                            <Link
                              to={`/product/${item.product}`}
                              className="font-medium text-pink-600 hover:text-pink-800 hover:underline"
                            >
                              {item.name}
                            </Link>
                          </td>

                          <td className="p-4 text-center">{item.qty}</td>
                          <td className="p-4 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-semibold">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "summary" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3 p-6"
            >
              <div className="bg-pink-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Thông tin giao hàng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">
                      Người nhận:
                    </span>
                    <span className="text-gray-700">{order.user.username}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">Email:</span>
                    <span className="text-gray-700">{order.user.email}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">
                      Số điện thoại:
                    </span>
                    <span className="text-gray-700">
                      <p>{order.shippingAddress.phone}</p>
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">Địa chỉ: </span>
                    <span className="text-gray-700">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">
                      Phương thức thanh toán:
                    </span>
                    <span className="text-gray-700">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">
                      Trạng thái thanh toán:
                    </span>
                    {order.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã thanh toán ngày{" "}
                        {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Chưa thanh toán
                      </span>
                    )}
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 font-medium">
                      Trạng thái giao hàng:
                    </span>
                    {order.isDelivered ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã giao ngày{" "}
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Đang giao hàng
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/3 p-6 bg-gray-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Tổng quan đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền sản phẩm</span>
                  <span className="font-medium">
                    ${order.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    ${order.shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế</span>
                  <span className="font-medium">
                    ${order.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t mt-2">
                  <span className="text-lg font-bold text-gray-800">
                    Tổng cộng
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {!order.isPaid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-sm mb-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Thanh toán
                </h2>
                {loadingPay && <Loader />}
                {isPending ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                    <span className="ml-2 text-gray-600">
                      Đang tải PayPal...
                    </span>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {loadingDeliver && <Loader />}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mt-6"
                >
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg transition-all hover:from-pink-600 hover:to-pink-700 transform hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    onClick={deliverHandler}
                  >
                    Đánh dấu là đã giao hàng
                  </button>
                </motion.div>
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Order;

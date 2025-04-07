import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useClearCartMutation } from "../../redux/api/usersApiSlice";

// Thêm hằng số tỷ giá (đảm bảo giá trị này giống với backend)
const exchangeRate = 24500;

// Hàm định dạng tiền tệ
const formatCurrency = (value, currency) => {
  if (currency === 'VND') {
    return `${(value * exchangeRate).toLocaleString('vi-VN')} ₫`;
  } else {
    return `$${parseFloat(value).toFixed(2)}`;
  }
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [clearCartBackend] = useClearCartMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      if (userInfo) {
        // Nếu đã đăng nhập, xóa giỏ hàng từ backend
        await clearCartBackend().unwrap();
      }
      // Luôn xóa giỏ hàng local
      dispatch(clearCartItems());
      
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header with blur effect */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4">
          <ProgressSteps step1 step2 step3 />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 tracking-tight"
        >
          Hoàn tất đặt hàng
        </motion.h1>

        {cart.cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 mb-6 text-slate-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <Message>Giỏ hàng của bạn đang trống</Message>
            <Link
              to="/"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold">Sản phẩm của bạn</h2>
                </div>
                <div className="p-6">
                  {cart.cartItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-slate-200 dark:border-slate-700 last:border-0"
                    >
                      <div className="w-24 h-24 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:ml-6 flex-grow">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 text-slate-600 dark:text-slate-400">
                          Số lượng:{" "}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {item.qty}
                          </span>
                        </div>
                        <div className="mt-1 text-slate-600 dark:text-slate-400">
                          Đơn giá:{" "}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {cart.paymentMethod === "VNPAY" 
                              ? formatCurrency(item.price, 'VND')
                              : formatCurrency(item.price, 'USD')}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right sm:ml-4">
                        <div className="text-lg font-bold">
                          {cart.paymentMethod === "VNPAY" 
                            ? formatCurrency(item.qty * item.price, 'VND')
                            : formatCurrency(item.qty * item.price, 'USD')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Shipping information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
                    </div>
                    <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
                  </div>
                  <div className="pl-14 space-y-2 text-slate-900 dark:text-white font-medium ">
                    <p>{cart.shippingAddress.phone}</p>

                    <p className="">{cart.shippingAddress.address}</p>
                    <p>{cart.shippingAddress.city}</p>
                    <p>{cart.shippingAddress.country}</p>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold">
                      Phương thức thanh toán
                    </h2>
                  </div>
                  <div className="pl-14">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                      {cart.paymentMethod}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tổng tiền sản phẩm</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {cart.paymentMethod === "VNPAY" 
                        ? formatCurrency(cart.itemsPrice, 'VND')
                        : formatCurrency(cart.itemsPrice, 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {cart.paymentMethod === "VNPAY" 
                        ? formatCurrency(cart.shippingPrice, 'VND')
                        : formatCurrency(cart.shippingPrice, 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Thuế</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {cart.paymentMethod === "VNPAY" 
                        ? formatCurrency(cart.taxPrice, 'VND')
                        : formatCurrency(cart.taxPrice, 'USD')}
                    </span>
                  </div>
                  <div className="my-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">
                        Tổng thanh toán
                      </span>
                      <span className="text-lg font-bold">
                        {cart.paymentMethod === "VNPAY" 
                          ? formatCurrency(cart.totalPrice, 'VND')
                          : formatCurrency(cart.totalPrice, 'USD')}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <Message variant="danger">{error.data.message}</Message>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg flex items-center justify-center"
                    disabled={cart.cartItems.length === 0 || isLoading}
                    onClick={placeOrderHandler}
                  >
                    {isLoading ? (
                      <Loader size="small" color="white" />
                    ) : (
                      "Xác nhận đặt hàng"
                    )}
                  </motion.button>

                  <div className="mt-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                    Bằng cách đặt hàng, bạn đồng ý với{" "}
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      điều khoản và điều kiện
                    </a>{" "}
                    của chúng tôi
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;

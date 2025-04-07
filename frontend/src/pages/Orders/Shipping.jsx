import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [phone, setphone] = useState(shippingAddress.phone || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, phone, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div
      className="min-h-screen py-12 px-4 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/shopping-background.jpg')",
      }}
    >
      {/* Animated background overlay - GIẢM ĐỘ MỜ */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ProgressSteps step1 step2 />

        <div className="mt-12 rounded-2xl p-8 shadow-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 transform hover:scale-[1.01] transition-all duration-300">
          {/* Glowing corner effects */}
          <div className="absolute -top-1 -left-1 w-16 h-16 rounded-tl-2xl border-t-2 border-l-2 border-teal-400/70"></div>
          <div className="absolute -bottom-1 -right-1 w-16 h-16 rounded-br-2xl border-b-2 border-r-2 border-teal-400/70"></div>

          <div className="flex justify-center mb-8">
            <div className="relative group">
              <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-wide">
                Thông Tin Giao Hàng
              </h1>
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 rounded-full transform transition-all duration-300 group-hover:h-1.5 group-hover:from-teal-400 group-hover:to-indigo-400"></div>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <label className="block text-white font-medium mb-2 group-hover:text-teal-300 transition-colors duration-200">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-indigo-950/80 border border-cyan-600/50 rounded-lg focus:ring-3 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-300 text-white placeholder-cyan-200/80 outline-none shadow-lg"
                  placeholder="Nhập địa chỉ của bạn"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="absolute right-3 top-11 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-white font-medium mb-2 group-hover:text-teal-300 transition-colors duration-200">
                    Thành Phố
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-indigo-950/80 border border-cyan-600/50 rounded-lg focus:ring-3 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-300 text-white placeholder-cyan-200/80 outline-none shadow-lg"
                    placeholder="Nhập thành phố"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <div className="absolute right-3 top-11 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-white font-medium mb-2 group-hover:text-teal-300 transition-colors duration-200">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-indigo-950/80 border border-cyan-600/50 rounded-lg focus:ring-3 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-300 text-white placeholder-cyan-200/80 outline-none shadow-lg"
                    placeholder="Nhập Số Điện Thoại "
                    value={phone}
                    required
                    onChange={(e) => setphone(e.target.value)}
                  />
                  <div className="absolute right-3 top-11 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-white font-medium mb-2 group-hover:text-teal-300 transition-colors duration-200">
                  Quốc Gia
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-indigo-950/80 border border-cyan-600/50 rounded-lg focus:ring-3 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-300 text-white placeholder-cyan-200/80 outline-none shadow-lg"
                  placeholder="Nhập quốc gia"
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                />
                <div className="absolute right-3 top-11 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-cyan-500/30 pt-8">
              <h2 className="text-2xl font-semibold mb-5 text-white relative inline-block">
                Phương Thức Thanh Toán
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-transparent"></span>
              </h2>
              <div className="bg-indigo-950/80 p-6 rounded-lg border border-cyan-600/30 shadow-lg space-y-4">
                <label className="flex items-center space-x-4 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      className="form-radio h-6 w-6 text-teal-400 focus:ring-teal-400 border-cyan-700"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-white mr-4 text-lg">
                      PayPal hoặc Thẻ Tín Dụng
                    </span>
                    <div className="flex space-x-3">
                      <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-200">
                        <span className="text-white font-bold text-xs">
                          PayPal
                        </span>
                      </div>
                      <div className="w-12 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-md flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-200">
                        <span className="text-white font-bold text-xs">
                          VISA
                        </span>
                      </div>
                      <div className="w-12 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-md flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-200">
                        <span className="text-white font-bold text-xs">MC</span>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      className="form-radio h-6 w-6 text-teal-400 focus:ring-teal-400 border-cyan-700"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === "VNPAY"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-white mr-4 text-lg">VNPAY</span>
                    <div className="w-20 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-md flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-200">
                      <span className="text-white font-bold text-xs">VNPAY</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              className="w-full mt-10 py-4 px-6 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white font-bold text-lg shadow-lg transform transition duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:ring-opacity-50 relative overflow-hidden group"
              type="submit"
            >
              <span className="relative z-10 inline-flex items-center">
                Tiếp Tục
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {/* Button hover effect */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></span>
            </button>
          </form>
        </div>

        <div className="flex justify-center items-center mt-8 text-white space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-teal-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-center text-white">
            Thông tin của bạn được bảo mật và mã hóa an toàn
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;

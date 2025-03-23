import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeField, setActiveField] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Cập nhật hồ sơ thành công");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="relative min-h-screen py-10 overflow-hidden">
      {/* Nền sáng với gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-cyan-50">
        {/* Hiệu ứng mạch điện tử nhẹ */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute h-px w-full top-1/4 left-0 bg-blue-300"></div>
          <div className="absolute h-px w-full top-2/4 left-0 bg-cyan-300"></div>
          <div className="absolute h-px w-full top-3/4 left-0 bg-teal-300"></div>
          <div className="absolute w-px h-full top-0 left-1/4 bg-blue-300"></div>
          <div className="absolute w-px h-full top-0 left-2/4 bg-cyan-300"></div>
          <div className="absolute w-px h-full top-0 left-3/4 bg-teal-300"></div>

          {/* Điểm kết nối */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: `${Math.floor(Math.random() * 100)}%`,
                boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
              }}
            ></div>
          ))}

          {/* Hiệu ứng dữ liệu chạy */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`data-${i}`}
              className="absolute w-3 h-0.5 bg-cyan-400 animate-pulse"
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: `${Math.floor(Math.random() * 100)}%`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto p-4 mt-16 relative z-10">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-white text-center transition-all duration-300">
              Cập Nhật Hồ Sơ
            </h2>
            {/* Hiệu ứng chip trên tiêu đề */}
            <div className="absolute top-4 left-6 w-12 h-2 bg-blue-600 rounded-sm opacity-70"></div>
            <div className="absolute top-4 right-6 w-12 h-2 bg-cyan-600 rounded-sm opacity-70"></div>
          </div>

          <div className="p-8">
            {loadingUpdateProfile ? (
              <div className="flex justify-center p-10">
                <Loader />
              </div>
            ) : (
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold">
                    Họ Tên
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      className="relative w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-gray-800"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      onFocus={() => setActiveField("name")}
                      onBlur={() => setActiveField(null)}
                    />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      className="relative w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all text-gray-800"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField(null)}
                    />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-cyan-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold">
                    Mật Khẩu
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-green-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="relative w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                    />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-teal-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold">
                    Xác Nhận Mật Khẩu
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      className="relative w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all text-gray-800"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setActiveField("confirmPassword")}
                      onBlur={() => setActiveField(null)}
                    />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-green-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
                  <button
                    type="submit"
                    className="relative overflow-hidden bg-blue-900 text-gray-300 hover:text-white py-4 px-8 rounded-md font-medium border border-blue-700 group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative z-10">Cập Nhật</span>
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
                  </button>

                  <Link
                    to="/user-orders"
                    className="relative overflow-hidden bg-cyan-900 text-gray-300 hover:text-white py-4 px-8 rounded-md font-medium border border-cyan-700 text-center flex items-center justify-center group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative z-10">Đơn Hàng Của Tôi</span>
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

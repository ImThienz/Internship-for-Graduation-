import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng Ký</h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Đăng Ký"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Đã có tài khoản?{" "}
          <Link to={`/login?redirect=${redirect}`} className="text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;

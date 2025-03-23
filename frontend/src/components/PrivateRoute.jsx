import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// Mục đích của PrivateRoute là chỉ cho phép người dùng đã đăng nhập truy cập các trang bên trong.
// Nếu chưa đăng nhập,
// họ sẽ bị chuyển hướng đến trang đăng nhập.

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
export default AdminRoute;

// Nếu người dùng là admin → Render các route con (<Outlet />).
// Nếu người dùng không phải admin hoặc chưa đăng nhập → Điều hướng đến trang /login bằng <Navigate to="/login" replace />.

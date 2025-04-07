import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCartQuery } from "./redux/api/usersApiSlice";
import { syncCartFromServer } from "./redux/features/cart/cartSlice";

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Chỉ thực hiện truy vấn khi người dùng đã đăng nhập
  const { data: serverCart, isSuccess } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  // Đồng bộ giỏ hàng từ server khi user đã đăng nhập
  useEffect(() => {
    if (isSuccess && serverCart) {
      dispatch(syncCartFromServer(serverCart));
    }
  }, [isSuccess, serverCart, dispatch]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;

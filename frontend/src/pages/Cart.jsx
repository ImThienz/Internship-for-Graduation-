import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { motion } from "framer-motion";
import { 
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation
} from "../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [removeFromCartBackend] = useRemoveFromCartMutation();

  const addToCartHandler = async (product, qty) => {
    if (userInfo) {
      try {
        // Nếu đã đăng nhập, sử dụng API backend
        await updateCartItemQuantity({
          productId: product._id,
          qty,
        }).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Không thể cập nhật giỏ hàng");
      }
    } else {
      // Nếu chưa đăng nhập, sử dụng redux local
      dispatch(addToCart({ ...product, qty }));
    }
  };

  const removeFromCartHandler = async (id) => {
    if (userInfo) {
      try {
        // Nếu đã đăng nhập, sử dụng API backend
        await removeFromCartBackend(id).unwrap();
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } catch (err) {
        toast.error(err?.data?.message || "Không thể xóa khỏi giỏ hàng");
      }
    } else {
      // Nếu chưa đăng nhập, sử dụng redux local
      dispatch(removeFromCart(id));
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Giỏ Hàng Của Bạn Đang Trống
          </h2>
          <Link
            to="/shop"
            className="text-white bg-gradient-to-r from-pink-500 to-purple-500 py-2 px-6 rounded-lg hover:scale-105 transition-transform"
          >
            Đi Tới Cửa Hàng
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8">Giỏ Hàng</h1>

            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-6 bg-white shadow-lg rounded-xl p-4 mb-6 hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-2xl font-semibold text-pink-500 hover:text-purple-500"
                  >
                    {item.name}
                  </Link>

                  <p className="text-gray-600 mt-2">{item.brand}</p>
                  <p className="text-lg font-bold mt-2">${item.price}</p>
                </div>

                <select
                  className="p-2 border rounded-lg"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="text-red-500 text-2xl hover:scale-110 transition-transform"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="w-full md:w-1/3">
            <div className="bg-white shadow-lg rounded-xl p-6 sticky top-10">
              <h2 className="text-2xl font-bold mb-4">
                Tạm Tính ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                Sản Phẩm
              </h2>

              <p className="text-3xl font-extrabold mb-6">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </p>

              <button
                className="w-full py-3 rounded-lg text-xl text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Tiến Hành Thanh Toán
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;

import { createSlice } from "@reduxjs/toolkit";
// Import hàm updateCart từ file tiện ích (Utils) để cập nhật giỏ hàng
import { updateCart } from "../../../Utils/cartUtils";

// Khởi tạo trạng thái ban đầu (initialState) từ localStorage nếu có,
// nếu không sẽ khởi tạo mặc định với giỏ hàng trống, địa chỉ giao hàng trống,
// và phương thức thanh toán là "PayPal"
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart")) // Nếu có dữ liệu trong localStorage thì lấy ra và parse thành object
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" }; // Nếu không có thì dùng giá trị mặc định

// Tạo một slice cho giỏ hàng (cart) với các reducer xử lý các hành động liên quan đến giỏ hàng
const cartSlice = createSlice({
  name: "cart", // Tên slice là "cart"
  initialState, // Trạng thái ban đầu
  reducers: {
    // Action: Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      // Loại bỏ các thông tin không cần thiết (user, rating, numReviews, reviews) từ payload
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Nếu sản phẩm đã tồn tại, cập nhật lại thông tin sản phẩm
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào mảng cartItems
        state.cartItems = [...state.cartItems, item];
      }
      // Cập nhật giỏ hàng vào localStorage thông qua hàm updateCart
      return updateCart(state, item);
    },

    // Action: Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      // Lọc bỏ sản phẩm có _id trùng với payload (id sản phẩm cần xóa)
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      // Cập nhật lại giỏ hàng trong localStorage
      return updateCart(state);
    },

    // Action: Lưu địa chỉ giao hàng
    saveShippingAddress: (state, action) => {
      // Cập nhật địa chỉ giao hàng trong state
      state.shippingAddress = action.payload;
      // Lưu trạng thái mới vào localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Action: Lưu phương thức thanh toán
    savePaymentMethod: (state, action) => {
      // Cập nhật phương thức thanh toán trong state
      state.paymentMethod = action.payload;
      // Lưu trạng thái mới vào localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Action: Xóa toàn bộ sản phẩm trong giỏ hàng
    clearCartItems: (state, action) => {
      // Gán mảng cartItems thành rỗng
      state.cartItems = [];
      // Lưu trạng thái mới vào localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Action: Đặt lại giỏ hàng về trạng thái ban đầu
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;

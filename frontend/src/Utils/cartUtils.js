export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Tính toán giá trị của các sản phẩm trong giỏ hàng
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Không tính phí vận chuyển (giá trị là 0)
  state.shippingPrice = addDecimals(0);

  // Không tính thuế (giá trị là 0)
  state.taxPrice = addDecimals(0);

  // Tính tổng giá trị đơn hàng (chỉ bao gồm giá trị sản phẩm)
  state.totalPrice = state.itemsPrice;

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

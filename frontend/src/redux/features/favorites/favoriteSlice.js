import { createSlice } from "@reduxjs/toolkit";

// Tạo một slice Redux có tên là "favorites" để quản lý danh sách sản phẩm yêu thích
const favoriteSlice = createSlice({
  name: "favorites", // Định danh cho slice này
  initialState: [], // Trạng thái ban đầu là một mảng rỗng
  reducers: {
    addToFavorites: (state, action) => {
      // Thêm sản phẩm vào danh sách yêu thích nếu nó chưa có trong danh sách
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      // Xóa sản phẩm khỏi danh sách yêu thích dựa trên ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      // Cập nhật danh sách sản phẩm yêu thích từ localStorage hoặc một nguồn khác
      return action.payload;
    },
  },
});

// Xuất các action để có thể sử dụng trong các thành phần khác của ứng dụng
export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

// Selector để lấy danh sách sản phẩm yêu thích từ Redux store
export const selectFavoriteProduct = (state) => state.favorites;

export default favoriteSlice.reducer;

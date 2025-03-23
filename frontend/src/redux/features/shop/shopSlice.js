import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo trạng thái ban đầu của slice
const initialState = {
  categories: [], // Mảng lưu trữ danh mục sản phẩm
  products: [], // Mảng lưu trữ sản phẩm
  checked: [], // Mảng lưu trữ các danh mục được chọn
  radio: [], // Mảng lưu trữ giá trị radio button được chọn
  brandCheckboxes: {}, // Đối tượng lưu trạng thái checkbox của các thương hiệu
  checkedBrands: [], // Mảng lưu trữ các thương hiệu được chọn
};

// Tạo slice cho Redux với tên là "shop"
const shopSlice = createSlice({
  name: "shop", // Tên slice
  initialState, // Trạng thái ban đầu
  reducers: {
    // Action: Cập nhật danh sách danh mục
    setCategories: (state, action) => {
      state.categories = action.payload; // Gán payload (dữ liệu mới) cho categories
    },
    // Action: Cập nhật danh sách sản phẩm
    setProducts: (state, action) => {
      state.products = action.payload; // Gán payload (dữ liệu mới) cho products
    },
    // Action: Cập nhật các mục được chọn (checkbox)
    setChecked: (state, action) => {
      state.checked = action.payload; // Gán payload cho checked
    },
    // Action: Cập nhật giá trị radio button
    setRadio: (state, action) => {
      state.radio = action.payload; // Gán payload cho radio
    },
    // Action: Cập nhật thương hiệu được chọn
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload; // Gán payload cho selectedBrand
    },
  },
});

export const {
  setCategories, // Action cập nhật danh mục
  setProducts, // Action cập nhật sản phẩm
  setChecked, // Action cập nhật checkbox
  setRadio, // Action cập nhật radio button
  setSelectedBrand, // Action cập nhật thương hiệu được chọn
} = shopSlice.actions;

export default shopSlice.reducer;

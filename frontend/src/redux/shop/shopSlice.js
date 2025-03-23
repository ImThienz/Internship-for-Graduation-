import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [], // Mảng lưu trữ danh sách các danh mục sản phẩm.
  products: [], // Mảng lưu trữ danh sách các sản phẩm.
  checked: [], // Mảng lưu trữ các giá trị đã được chọn (ví dụ: các bộ lọc dạng checkbox).
  radio: [], // Mảng lưu trữ các giá trị đã chọn từ input kiểu radio.
  brandCheckboxes: {}, // Đối tượng lưu trạng thái checkbox cho từng thương hiệu.
  checkedBrands: [], // Mảng lưu trữ các thương hiệu đã được chọn.
};

// Tạo slice "shop" với tên, trạng thái ban đầu và các reducers (hàm xử lý cập nhật state).
const shopSlice = createSlice({
  name: "shop", // Tên của slice, sẽ được dùng để xác định slice trong store.
  initialState, // Gán trạng thái ban đầu đã khai báo ở trên.
  reducers: {
    // Các hàm reducer dùng để cập nhật từng phần của state.
    // Cập nhật danh sách categories từ action payload (dữ liệu truyền vào).
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    // Cập nhật danh sách products từ action payload.
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // Cập nhật mảng checked từ action payload (ví dụ: lưu trữ các bộ lọc checkbox).
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    // Cập nhật giá trị radio từ action payload (ví dụ: lựa chọn giá trị duy nhất).
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    // Cập nhật thương hiệu được chọn từ action payload.
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;

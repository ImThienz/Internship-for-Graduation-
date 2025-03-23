import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String, // Kiểu dữ liệu là chuỗi (string)
    trim: true, // Tự động xóa khoảng trắng ở đầu và cuối chuỗi
    required: true, // Bắt buộc phải có giá trị (không được để trống)
    maxLength: 255, // Độ dài tối đa của chuỗi là 255 ký tự
    unique: true, // Không cho phép trùng lặp (các tên trong collection phải khác nhau)
  },
});

export default mongoose.model("Category", categorySchema);

import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên sản phẩm
    image: { type: String, required: true }, // URL ảnh sản phẩm
    brand: { type: String, required: true }, // Thương hiệu của sản phẩm
    quantity: { type: Number, required: true }, // Số lượng sản phẩm
    category: { type: ObjectId, ref: "Category", required: true }, // ID của danh mục sản phẩm
    description: { type: String, required: true }, // Mô tả sản phẩm
    reviews: [reviewSchema], // Danh sách đánh giá từ người dùng
    rating: { type: Number, required: true, default: 0 }, // Điểm trung bình đánh giá
    numReviews: { type: Number, required: true, default: 0 }, // Số lượng đánh giá
    price: { type: Number, required: true, default: 0 }, // Giá sản phẩm
    countInStock: { type: Number, required: true, default: 0 }, // Số lượng sản phẩm còn trong kho
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

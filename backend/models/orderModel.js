// Import thư viện mongoose để làm việc với MongoDB
import mongoose from "mongoose";

// Tạo schema (lược đồ) cho collection "orders" trong MongoDB
const orderSchema = mongoose.Schema(
  {
    // Thông tin người dùng đặt hàng (tham chiếu đến collection "User")
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

    // Danh sách các mặt hàng trong đơn hàng
    orderItems: [
      {
        // Tên sản phẩm
        name: { type: String, required: true },

        // Số lượng sản phẩm
        qty: { type: Number, required: true },

        // Ảnh minh họa của sản phẩm
        image: { type: String, required: true },

        // Giá của sản phẩm
        price: { type: Number, required: true },

        // Tham chiếu đến sản phẩm trong collection "Product"
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    // Địa chỉ giao hàng
    shippingAddress: {
      address: { type: String, required: true }, // Địa chỉ cụ thể
      city: { type: String, required: true }, // Thành phố
      phone: { type: String, required: true }, // Mã bưu điện
      country: { type: String, required: true }, // Quốc gia
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      required: true,
    },

    // Kết quả thanh toán (lưu thông tin phản hồi từ cổng thanh toán)
    paymentResult: {
      id: { type: String }, // ID giao dịch
      status: { type: String }, // Trạng thái thanh toán (VD: "Completed")
      update_time: { type: String }, // Thời gian cập nhật trạng thái
      email_address: { type: String }, // Email của người thanh toán
    },

    // Tổng giá trị các mặt hàng
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0, // Mặc định là 0
    },

    // Giá trị thuế
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0, // Mặc định là 0
    },

    // Phí vận chuyển
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0, // Mặc định là 0
    },

    // Tổng giá trị đơn hàng (bao gồm: giá mặt hàng + thuế + phí vận chuyển)
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Trạng thái thanh toán (đã thanh toán hay chưa)
    isPaid: {
      type: Boolean,
      required: true,
      default: false, // Mặc định là "chưa thanh toán"
    },

    // Thời gian thanh toán
    paidAt: {
      type: Date,
    },

    // Trạng thái giao hàng (đã giao hay chưa)
    isDelivered: {
      type: Boolean,
      required: true,
      default: false, // Mặc định là "chưa giao hàng"
    },

    // Thời gian giao hàng
    deliveredAt: {
      type: Date,
    },
  },
  {
    // Tự động thêm timestamp (createdAt và updatedAt)
    timestamps: true,
  }
);

// Tạo model "Order" từ schema đã định nghĩa
const Order = mongoose.model("Order", orderSchema);

export default Order;

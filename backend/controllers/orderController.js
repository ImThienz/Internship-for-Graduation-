import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Hàm tiện ích - Đã sửa đổi để loại bỏ phí vận chuyển và thuế
function calcPrices(orderItems) {
  // Tính tổng giá trị đơn hàng từ các mặt hàng
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Đặt phí vận chuyển luôn bằng 0 (đã loại bỏ)
  const shippingPrice = 0;

  // Đặt thuế luôn bằng 0 (đã loại bỏ)
  const taxPrice = 0;

  // Tổng giá trị đơn hàng bây giờ chỉ bằng giá trị các mặt hàng
  const totalPrice = itemsPrice.toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice,
  };
}

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Kiểm tra nếu không có mặt hàng nào trong đơn hàng
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Tìm thông tin sản phẩm từ cơ sở dữ liệu
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Tạo mảng mặt hàng với giá từ cơ sở dữ liệu (để tránh giả mạo giá)
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      // Nếu không tìm thấy sản phẩm, trả về lỗi
      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      // Tạo đối tượng mặt hàng với giá từ cơ sở dữ liệu
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // Tính toán giá (không có thuế và phí vận chuyển)
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Tạo đơn hàng mới
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả đơn hàng (chỉ admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy đơn hàng của người dùng hiện tại
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đếm tổng số đơn hàng
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tính tổng doanh số
const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tính tổng doanh số theo ngày
const calcualteTotalSalesByDate = async (req, res) => {
  try {
    // Sử dụng MongoDB Aggregation để nhóm doanh số theo ngày
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tìm đơn hàng theo ID
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đánh dấu đơn hàng đã thanh toán
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      // Thêm người dùng vào danh sách purchasedBy của từng sản phẩm
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $addToSet: { purchasedBy: order.user } }
        );
      }

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đánh dấu đơn hàng đã giao
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};

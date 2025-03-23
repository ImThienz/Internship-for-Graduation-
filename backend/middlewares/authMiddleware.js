import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

//  xác thực người dùng
const authenticate = asyncHandler(async (req, res, next) => {
  // Lấy token từ cookie hoặc Authorization header
  let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  // Nếu không có token, trả về lỗi 401 (chưa xác thực)
  if (!token) {
    return res.status(401).json({ message: "Không được phép, không có token" });
  }

  try {
    // Giải mã token bằng JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong database, loại bỏ trường password để bảo mật
    req.user = await User.findById(decoded.userId).select("-password");

    // Nếu không tìm thấy user, trả về lỗi 401
    if (!req.user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    // Nếu xác thực thành công, chuyển sang middleware tiếp theo
    next();
  } catch (error) {
    // Nếu token không hợp lệ hoặc hết hạn, trả về lỗi 401
    return res
      .status(401)
      .json({ message: "Không được phép, token không hợp lệ" });
  }
});

//  kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
  // Kiểm tra nếu user có quyền admin thì cho phép tiếp tục
  if (req.user?.isAdmin) {
    next();
  } else {
    // Nếu không phải admin, trả về lỗi 403 (forbidden)
    return res
      .status(403)
      .json({ message: "Không được phép với tư cách admin" });
  }
};

export { authenticate, authorizeAdmin };

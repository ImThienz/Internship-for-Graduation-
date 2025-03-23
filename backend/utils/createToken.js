import jwt from "jsonwebtoken";

// Hàm tạo token JWT và lưu vào cookie
const generateToken = (res, userId) => {
  // Tạo token với payload là userId, sử dụng biến môi trường JWT_SECRET để mã hóa
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token sẽ hết hạn sau 30 ngày
  });

  // Lưu token vào cookie với các thuộc tính bảo mật
  res.cookie("jwt", token, {
    httpOnly: true, // Ngăn chặn JavaScript truy cập cookie (bảo vệ khỏi XSS)
    secure: process.env.NODE_ENV !== "development", // Chỉ sử dụng HTTPS nếu không phải môi trường development
    sameSite: "strict", // Ngăn chặn gửi cookie đến trang web khác (chống CSRF)
    maxAge: 30 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của cookie (30 ngày)
  });

  return token;
};

export default generateToken;

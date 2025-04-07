import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

/**
 * @desc    Tạo người dùng mới
 * @route   POST /api/users
 * @access  Public
 */
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra đầu vào
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  // Kiểm tra người dùng đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Người dùng đã tồn tại" });
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tạo người dùng mới
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Thông tin người dùng không hợp lệ" });
  }
});

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra đầu vào
  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  // Tìm người dùng theo email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Email hoặc mật khẩu không chính xác" });
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Email hoặc mật khẩu không chính xác" });
  }

  // Tạo token xác thực
  createToken(res, user._id);

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

/**
 * @desc    Đăng xuất người dùng hiện tại
 * @route   POST /api/users/logout
 * @access  Private
 */
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return res.status(200).json({ message: "Đăng xuất thành công" });
});

/**
 * @desc    Lấy tất cả người dùng
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  return res.status(200).json(users);
});

/**
 * @desc    Lấy thông tin người dùng hiện tại
 * @route   GET /api/users/profile
 * @access  Private
 */
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

/**
 * @desc    Cập nhật thông tin người dùng
 * @route   PUT /api/users/profile
 * @access  Private
 */
const editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Cập nhật thông tin cơ bản
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  // Cập nhật mật khẩu nếu có
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  return res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

/**
 * @desc    Xóa người dùng
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Không thể xóa người dùng quản trị");
  }

  await User.deleteOne({ _id: user._id });
  return res.status(200).json({ message: "Người dùng đã được xóa" });
});

/**
 * @desc    Lấy thông tin người dùng theo ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  return res.status(200).json(user);
});

/**
 * @desc    Cập nhật thông tin người dùng (Admin)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin =
    req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : user.isAdmin;

  const updatedUser = await user.save();

  return res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

// Thêm sản phẩm vào favorites
const addToFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.body.productId;

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Thiếu kiểm tra productId có tồn tại không
  if (!productId) {
    res.status(400);
    throw new Error("Không tìm thấy ID sản phẩm");
  }

  // Kiểm tra xem sản phẩm đã có trong favorites chưa
  if (user.favorites.includes(productId)) {
    res.status(400);
    throw new Error("Sản phẩm đã có trong danh sách yêu thích");
  }

  user.favorites.push(productId);
  await user.save();

  res.status(200).json(user.favorites);
});

// Xóa sản phẩm khỏi favorites
const removeFromFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  user.favorites = user.favorites.filter(id => id.toString() !== productId);
  await user.save();

  res.status(200).json(user.favorites);
});

// Lấy danh sách favorites của user
const getFavorites = asyncHandler(async (req, res) => {
  try {
    // Kiểm tra xem user có tồn tại không
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // Tìm user và populate favorites
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      model: 'Product', // Đảm bảo tên model là chính xác
      select: '_id name price image' // Chỉ lấy các trường cần thiết
    });
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra xem favorites có tồn tại không
    if (!user.favorites) {
      return res.status(200).json([]);
    }

    return res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error in getFavorites:', error);
    return res.status(500).json({ 
      message: "Lỗi khi lấy danh sách yêu thích",
      error: error.message 
    });
  }
});

// Lấy giỏ hàng của user
const getCart = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      model: 'Product',
      select: '_id name price image countInStock'
    });
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!user.cart) {
      return res.status(200).json([]);
    }

    return res.status(200).json(user.cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    return res.status(500).json({ 
      message: "Lỗi khi lấy giỏ hàng",
      error: error.message 
    });
  }
});

// Thêm sản phẩm vào giỏ hàng
const addToCart = asyncHandler(async (req, res) => {
  const { productId, name, image, price, qty, countInStock } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Không tìm thấy ID sản phẩm");
  }

  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingItem = user.cart.find(item => item.product.toString() === productId);

  if (existingItem) {
    // Cập nhật số lượng nếu sản phẩm đã tồn tại
    existingItem.qty = qty;
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    user.cart.push({
      product: productId,
      name,
      image,
      price,
      qty,
      countInStock
    });
  }

  await user.save();
  res.status(200).json(user.cart);
});

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();

  res.status(200).json(user.cart);
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  const cartItem = user.cart.find(item => item.product.toString() === productId);
  
  if (cartItem) {
    cartItem.qty = qty;
    await user.save();
    res.status(200).json(user.cart);
  } else {
    res.status(404);
    throw new Error("Sản phẩm không có trong giỏ hàng");
  }
});

// Xóa toàn bộ giỏ hàng
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  user.cart = [];
  await user.save();

  res.status(200).json([]);
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  editProfile,
  deleteUser,
  getUserById,
  updateUserById,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};

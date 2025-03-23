import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  editProfile,
  deleteUser,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 *   POST /api/users - Đăng ký người dùng mới
 *   GET /api/users - Lấy tất cả người dùng (Admin only)
 */
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

/**
 *   POST /api/users/auth - Đăng nhập người dùng
 */
router.post("/auth", loginUser);

/**
 *    POST /api/users/logout - Đăng xuất người dùng
 */
router.post("/logout", logoutCurrentUser);

/**
 *    GET /api/users/profile - Lấy thông tin người dùng hiện tại
 *    PUT /api/users/profile - Cập nhật thông tin người dùng hiện tại
 */
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, editProfile);

/**
 *   DELETE /api/users/:id - Xóa người dùng theo ID (Admin only)
 *   GET /api/users/:id - Lấy thông tin người dùng theo ID (Admin only)
 *   PUT /api/users/:id - Cập nhật thông tin người dùng theo ID (Admin only)
 */
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUser)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;

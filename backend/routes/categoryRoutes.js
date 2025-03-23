import express from "express";
const router = express.Router();

import {
  createCategory, // Tạo danh mục mới
  updateCategory, // Cập nhật danh mục theo `categoryId`
  removeCategory, // Xóa danh mục theo `categoryId`
  listCategory, // Lấy danh sách tất cả danh mục
  readCategory, // Đọc thông tin chi tiết của một danh mục theo `id`
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizeAdmin, createCategory);

router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);

router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);

router.route("/:id").get(readCategory);

export default router;

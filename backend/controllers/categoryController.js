import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Hàm tạo một danh mục mới
const createCategory = asyncHandler(async (req, res) => {
  try {
    // Lấy tên danh mục từ request body
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Tên danh mục là bắt buộc" });
    }

    // Kiểm tra xem danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Danh mục đã tồn tại" });
    }

    // Tạo danh mục mới và lưu vào cơ sở dữ liệu
    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Hàm cập nhật một danh mục
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    // Tìm danh mục theo ID
    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }

    // Cập nhật tên danh mục
    category.name = name;

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
});

// Hàm xóa một danh mục
const removeCategory = asyncHandler(async (req, res) => {
  try {
    // Tìm và xóa danh mục theo ID
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    // Trả về thông tin danh mục đã xóa
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
});

// Hàm lấy danh sách tất cả các danh mục
const listCategory = asyncHandler(async (req, res) => {
  try {
    // Lấy tất cả danh mục từ cơ sở dữ liệu
    const all = await Category.find({});
    // Trả về danh sách danh mục
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

// Hàm lấy thông tin một danh mục theo ID
const readCategory = asyncHandler(async (req, res) => {
  try {
    // Tìm danh mục theo ID
    const category = await Category.findOne({ _id: req.params.id });
    // Trả về thông tin danh mục
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};

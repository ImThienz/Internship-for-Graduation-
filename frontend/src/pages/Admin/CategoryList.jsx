import { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { motion, AnimatePresence } from "framer-motion";

const CategoryList = () => {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Tên danh mục là bắt buộc");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} đã được tạo.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo danh mục thất bại, vui lòng thử lại.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Tên danh mục là bắt buộc");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} đã được cập nhật`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} đã bị xóa.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa danh mục thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <AdminMenu />
      <div className="md:w-3/4 p-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-pink-500 pb-2">
            Quản lý Danh mục
          </h1>
        </motion.div>

        {/* Create Category Form */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Thêm Danh mục mới
          </h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-pink-500 hover:bg-pink-600 text-white py-1 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Thêm
              </button>
            </div>
          </form>
        </motion.div>

        {/* Categories List */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Tất cả Danh mục
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {categories?.map((category) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                      }}
                      className="w-full bg-white border-2 border-pink-300 text-pink-600 py-3 px-4 rounded-lg hover:bg-pink-50 focus:outline-none transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg group-hover:border-pink-500"
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {categories?.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy danh mục nào. Hãy thêm danh mục đầu tiên của bạn!
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Chỉnh sửa Danh mục
                </h3>
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Tên</label>
                    <input
                      type="text"
                      value={updatingName}
                      onChange={(e) => setUpdatingName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300 outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleDeleteCategory}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Xóa
                    </button>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => setModalVisible(false)}
                        className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryList;

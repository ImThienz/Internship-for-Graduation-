import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    brand: "",
    countInStock: 0,
  });

  const [image, setImage] = useState("");

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        category: productData.category?._id || "",
        quantity: productData.quantity || "",
        brand: productData.brand || "",
        countInStock: productData.countInStock || 0,
      });
      setImage(productData.image || "");
      setImageUrl(productData.image || null);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();
      productData.append("image", image);

      // Append all form data to FormData
      Object.keys(formData).forEach((key) => {
        productData.append(key, formData[key]);
      });

      const data = await updateProduct({
        productId: params._id,
        formData: productData,
      });

      if (data?.error) {
        toast.error("Cập nhật sản phẩm thất bại. Thử lại.");
      } else {
        toast.success("Sản phẩm đã được cập nhật thành công!");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật sản phẩm thất bại. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này không?"
      );
      if (!answer) return;

      setLoading(true);
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" đã được xóa thành công`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Xóa thất bại. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 mr-[50%]">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <AdminMenu />
          </div>

          <div className="md:w-3/4 bg-gray-800 rounded-xl shadow-2xl p-6">
            <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Cập Nhật Sản Phẩm
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="mb-8">
                <div className="relative group">
                  {imageUrl ? (
                    <div className="mb-4 relative">
                      <img
                        src={imageUrl}
                        alt="Ảnh sản phẩm"
                        className="h-64 w-full object-contain rounded-lg border-2 border-pink-500 p-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(null);
                          setImage("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-pink-500 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 transition-colors">
                      <input
                        type="file"
                        name="productImage"
                        accept="image/*"
                        onChange={uploadFileHandler}
                        className="hidden"
                        id="productImage"
                      />
                      <label
                        htmlFor="productImage"
                        className="cursor-pointer block"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-pink-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-4 text-lg font-medium">
                          Kéo thả ảnh vào đây hoặc nhấp để tải lên
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          PNG, JPG, GIF (tối đa 5MB)
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên sản phẩm */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Giá */}
                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Giá ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none"
                    placeholder="Nhập giá sản phẩm"
                  />
                </div>

                {/* Số lượng */}
                <div className="space-y-2">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Số lượng
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none"
                    placeholder="Nhập số lượng"
                  />
                </div>

                {/* Thương hiệu */}
                <div className="space-y-2">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none"
                    placeholder="Nhập tên thương hiệu"
                  />
                </div>

                {/* Số lượng trong kho */}
                <div className="space-y-2">
                  <label
                    htmlFor="countInStock"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Số lượng trong kho
                  </label>
                  <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none"
                    placeholder="Nhập số lượng trong kho"
                  />
                </div>

                {/* Danh mục */}
                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Danh mục
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Mô tả sản phẩm
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 transition-all outline-none resize-none"
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-4 px-10 rounded-lg text-lg font-medium transition-all
                    ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Cập Nhật Sản Phẩm"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className={`py-4 px-10 rounded-lg text-lg font-medium transition-all
                    ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    }
                  `}
                >
                  Xóa Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;

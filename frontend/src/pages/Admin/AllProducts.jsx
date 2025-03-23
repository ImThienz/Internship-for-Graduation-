import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  // Hàm cắt chuỗi 25 ký tự và thêm "..."
  const truncateText = (text, maxLength = 10) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-medium text-gray-700 animate-pulse">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-medium text-red-600">
          Lỗi tải sản phẩm!
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Tất Cả Sản Phẩm ({products.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full sm:w-44 h-44 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
                  />
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-900 font-sans tracking-wide">
                        {truncateText(product.name)}
                      </h2>
                      <span className="text-xs text-gray-500 font-medium">
                        {moment(product.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mt-2 font-serif italic">
                      {truncateText(product.description)}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xl font-extrabold text-indigo-600">
                        {product.price.toLocaleString("en-US")} $
                      </span>
                      <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center shadow-md">
                        Cập nhật
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Admin */}
        <div className="lg:col-span-1">
          <div className="sticky top-10">
            <AdminMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { motion } from "framer-motion";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const highestPrice = Math.max(
        ...filteredProductsQuery.data.map((product) => product.price)
      );
      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
    }
  }, [filteredProductsQuery.isLoading, filteredProductsQuery.data]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
        // Filter products based on price range and search term
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            const matchesPrice =
              product.price >= priceRange[0] && product.price <= priceRange[1];

            const matchesSearch = searchTerm
              ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.brand &&
                  product.brand
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
              : true;

            return matchesPrice && matchesSearch;
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    priceRange,
    searchTerm,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handleReset = () => {
    setSearchTerm("");
    setPriceRange([0, maxPrice]);
    window.location.reload();
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange([0, parseInt(e.target.value, 10)]);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen pb-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          ></motion.h1>

          <motion.div
            className="relative w-96"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel - Auto-resizes based on content */}
          <motion.div
            className="md:w-auto bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
              <h2 className="text-white text-xl font-semibold">Bộ Lọc</h2>
            </div>

            {/* Tabs for different filter types */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 px-6 py-3 font-medium text-sm ${
                  activeTab === "categories"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
                onClick={() => setActiveTab("categories")}
              >
                Danh Mục
              </button>
              <button
                className={`flex-1 px-6 py-3 font-medium text-sm ${
                  activeTab === "brands"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
                onClick={() => setActiveTab("brands")}
              >
                Thương Hiệu
              </button>
              <button
                className={`flex-1 px-6 py-3 font-medium text-sm ${
                  activeTab === "price"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
                onClick={() => setActiveTab("price")}
              >
                Giá
              </button>
            </div>

            <div className="p-4">
              {activeTab === "categories" && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 min-w-64">
                  {categories?.map((c) => (
                    <div key={c._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${c._id}`}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label
                        htmlFor={`category-${c._id}`}
                        className="ml-2 text-gray-700 hover:text-purple-600 cursor-pointer text-sm font-medium"
                      >
                        {c.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "brands" && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 min-w-64">
                  {uniqueBrands?.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="radio"
                        id={`brand-${brand}`}
                        name="brand"
                        onChange={() => handleBrandClick(brand)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-gray-700 hover:text-purple-600 cursor-pointer text-sm font-medium whitespace-nowrap"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "price" && (
                <div className="space-y-4 min-w-64">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">$0</span>
                    <span className="text-gray-600 text-sm">
                      ${priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={handlePriceRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm font-medium">
                      Khoảng Giá
                    </p>
                    <p className="text-gray-800 font-bold">
                      $0 - ${priceRange[1].toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 font-medium"
              >
                Đặt Lại Bộ Lọc
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Đã Tìm Thấy {products?.length} Sản Phẩm
                </h2>
              </div>
            </motion.div>

            {products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((p, index) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    className="transform transition-all duration-300"
                  >
                    <ProductCard p={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

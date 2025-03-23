// Product.js
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full p-4 relative shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105">
      <div className="relative">
        <img
          src={product?.image || "/placeholder.jpg"}
          alt={product?.name || "Sản phẩm"}
          className="w-full h-[20rem] object-cover rounded-xl"
        />
        <HeartIcon product={product} className="absolute top-4 right-4" />
      </div>

      <div className="p-4">
        <Link
          to={product?._id ? `/product/${product._id}` : "#"}
          className="block"
        >
          <h2 className="flex justify-between items-center text-xl font-semibold text-gray-800 dark:text-white">
            {product?.name || "Tên sản phẩm"}
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product?.price?.toLocaleString() || "0"}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;

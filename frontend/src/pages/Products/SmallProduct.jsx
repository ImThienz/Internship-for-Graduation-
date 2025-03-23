import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[18rem] h-full mx-5 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden rounded-lg group flex-1">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Icon trái tim yêu thích */}
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`} className="no-underline">
          <h2 className="flex justify-between items-center text-base font-medium text-gray-800 hover:text-pink-600 transition-colors duration-300">
            <div className="truncate">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-[0.7rem] font-bold px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;

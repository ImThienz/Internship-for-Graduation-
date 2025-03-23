import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Thêm vào giỏ hàng thành công", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  // Truncate product name to 25 characters
  const truncateName = (name) => {
    if (name.length > 25) {
      return name.substring(0, 25) + "...";
    }
    return name;
  };

  // Truncate description to 40 characters
  const truncateDesc = (desc) => {
    if (desc && desc.length > 40) {
      return desc.substring(0, 40) + "...";
    }
    return desc || "";
  };

  return (
    <motion.div
      className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.1 }}
    >
      <section className="relative group">
        <Link to={`/product/${p._id}`}>
          <div className="overflow-hidden">
            <motion.img
              className="w-full cursor-pointer"
              src={p.image}
              alt={p.name}
              style={{ height: "200px", objectFit: "cover" }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          <div className="absolute bottom-3 right-3 flex space-x-2">
            <motion.span
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.1 }}
            >
              {p?.brand}
            </motion.span>
          </div>
        </Link>

        <motion.div
          className="absolute top-3 left-3"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.1 }}
        >
          <HeartIcon product={p} />
        </motion.div>
      </section>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-base font-semibold text-gray-800 h-6 overflow-hidden">
            {truncateName(p?.name || "")}
          </h5>

          <motion.p
            className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </motion.p>
        </div>

        <p className="mb-4 text-gray-600 font-light text-sm h-10 overflow-hidden">
          {truncateDesc(p?.description)}
        </p>

        <div className="flex items-center justify-between mt-3">
          <motion.button
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg focus:outline-none shadow-sm"
            onClick={() => addToCartHandler(p, 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <FiShoppingCart className="mr-2 h-4 w-4" />
            Thêm vào giỏ
          </motion.button>

          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
            <Link
              to={`/product/${p._id}`}
              className="flex items-center text-sm font-medium text-pink-500 hover:text-purple-600 transition-all duration-300"
            >
              Chi Tiết
              <motion.svg
                className="w-3 h-3 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

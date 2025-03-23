import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaAngleLeft,
  FaRegHeart,
  FaHeart,
  FaFire,
  FaShippingFast,
} from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const mainRef = useRef(null);
  const [parallaxItems, setParallaxItems] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Hiệu ứng xuất hiện khi trang được tải
  useEffect(() => {
    setShowAnimation(true);

    // Tạo các particle cho nền
    generateParallaxItems();

    // Thêm hiệu ứng cursor custom
    document.body.style.cursor = "none";

    // Thêm scroll listener cho hiệu ứng parallax
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Theo dõi vị trí chuột cho cursor custom
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Theo dõi scroll cho hiệu ứng parallax
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  // Tạo các phần tử parallax ngẫu nhiên cho nền
  const generateParallaxItems = () => {
    const items = [];
    const shapes = ["circle", "square", "triangle"];
    const colors = ["#ff2c9c", "#5d4fff", "#00d9ff", "#50faaa"];

    for (let i = 0; i < 20; i++) {
      items.push({
        id: i,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 70 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        rotation: Math.random() * 360,
      });
    }

    setParallaxItems(items);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Đánh giá đã được tạo thành công");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  // Function để thay đổi dạng con trỏ chuột
  const handleMouseEnter = (variant) => {
    setCursorVariant(variant);
  };

  const handleMouseLeave = () => {
    setCursorVariant("default");
  };

  // Custom HeartIcon component với hiệu ứng
  const HeartIcon = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showRipple, setShowRipple] = useState(false);

    const toggleFavorite = () => {
      setIsFavorite(!isFavorite);
      setIsAnimating(true);
      setShowRipple(true);

      setTimeout(() => setIsAnimating(false), 500);
      setTimeout(() => setShowRipple(false), 800);
      // Thêm logic yêu thích thực tế ở đây nếu cần
    };

    return (
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`relative text-2xl cursor-pointer transition-transform duration-300 ${
            isAnimating ? "scale-125" : ""
          }`}
          onClick={toggleFavorite}
          onMouseEnter={() => handleMouseEnter("heart")}
          onMouseLeave={handleMouseLeave}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 filter drop-shadow-lg" />
          ) : (
            <FaRegHeart className="text-gray-300 hover:text-red-500 transition-colors duration-300" />
          )}

          {/* Hiệu ứng sóng tỏa ra khi click */}
          {showRipple && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-8 h-8 bg-red-500/50 rounded-full animate-ping"></div>
              <div className="absolute w-12 h-12 bg-red-500/30 rounded-full animate-ping animation-delay-300"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom Cursor
  const CustomCursor = () => {
    let cursorClass =
      "w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm fixed pointer-events-none z-50 flex items-center justify-center border border-white/50 transition-transform duration-200";
    let dotClass = "w-2 h-2 bg-white rounded-full";

    if (cursorVariant === "heart") {
      cursorClass =
        "w-10 h-10 bg-pink-500/30 rounded-full fixed pointer-events-none z-50 flex items-center justify-center border border-pink-500/50 transition-transform duration-200";
      dotClass = "w-5 h-5 text-pink-500";
    } else if (cursorVariant === "cart") {
      cursorClass =
        "w-10 h-10 bg-purple-500/30 rounded-full fixed pointer-events-none z-50 flex items-center justify-center border border-purple-500/50 transition-transform duration-200";
      dotClass = "w-5 h-5 text-purple-500";
    }

    return (
      <div
        className={cursorClass}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) scale(${
            cursorVariant === "default" ? 1 : 1.5
          })`,
        }}
      >
        {cursorVariant === "default" ? (
          <div className={dotClass}></div>
        ) : cursorVariant === "heart" ? (
          <FaHeart className={dotClass} />
        ) : (
          <FaShoppingCart className={dotClass} />
        )}
      </div>
    );
  };

  // Background Parallax Items
  const ParallaxBackground = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {parallaxItems.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.size}px`,
              height:
                item.shape === "circle" || item.shape === "square"
                  ? `${item.size}px`
                  : "auto",
              backgroundColor:
                item.shape !== "triangle" ? item.color : "transparent",
              borderRadius:
                item.shape === "circle"
                  ? "50%"
                  : item.shape === "square"
                  ? "10%"
                  : "0",
              clipPath:
                item.shape === "triangle"
                  ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                  : "none",
              opacity: item.opacity,
              transform: `translateY(${scrollY * item.speed}px) rotate(${
                item.rotation + scrollY * 0.05
              }deg)`,
              boxShadow: `0 0 20px ${item.color}80`,
              filter: "blur(2px)",
              transition: "transform 0.1s linear",
            }}
          >
            {item.shape === "triangle" && (
              <div
                style={{
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  backgroundColor: item.color,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={mainRef}
      className={`min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white transition-opacity duration-700 relative overflow-hidden ${
        showAnimation ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Custom cursor */}
      <CustomCursor />

      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Content wrapper with glass effect */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Nút Quay lại với hiệu ứng */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 group transition-all duration-300"
          onMouseEnter={handleMouseLeave}
        >
          <FaAngleLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium group-hover:underline relative overflow-hidden">
            Quay Lại
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </span>
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div
            className={`transition-all duration-700 transform ${
              showAnimation ? "translate-y-0" : "translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
              {/* Hiệu ứng glow chính */}
              <div
                className="absolute -inset-10 opacity-20 blur-xl"
                style={{
                  background: `radial-gradient(circle at ${
                    mousePosition.x / 5
                  }px ${
                    mousePosition.y / 5
                  }px, rgba(236, 72, 153, 0.3), rgba(99, 102, 241, 0.3), rgba(16, 185, 129, 0.1))`,
                  transform: `translate(${
                    (mousePosition.x - window.innerWidth / 2) / 40
                  }px, ${(mousePosition.y - window.innerHeight / 2) / 40}px)`,
                  transition: "background 0.3s ease, transform 0.2s ease",
                }}
              ></div>

              {/* Phần hình ảnh sản phẩm */}
              <div className="relative group perspective-1000">
                <div
                  className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-700 bg-gray-800 hover:shadow-pink-500/30 transition-all duration-500 transform-gpu group-hover:scale-105"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isHovered
                      ? `rotateY(${
                          (mousePosition.x - window.innerWidth / 2) / 50
                        }deg) rotateX(${
                          -(mousePosition.y - window.innerHeight / 2) / 50
                        }deg)`
                      : "rotateY(0) rotateX(0)",
                    transition: isHovered
                      ? "transform 0.1s ease"
                      : "transform 0.5s ease",
                  }}
                  onMouseEnter={() => {
                    setIsHovered(true);
                    handleMouseLeave();
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full object-cover transition-transform duration-700 ${
                      isHovered ? "scale-110" : "scale-100"
                    }`}
                  />

                  {/* Overlay gradient hiệu ứng */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
                      isHovered ? "opacity-70" : "opacity-0"
                    }`}
                  ></div>

                  {/* Tag giảm giá */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform-gpu rotate-3 animate-pulse">
                    <FaFire className="inline-block mr-1" /> HOT DEAL
                  </div>

                  <HeartIcon product={product} />

                  {/* Chi tiết nhanh khi hover */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent transform transition-transform duration-500 ${
                      isHovered ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <div className="text-xl font-bold mb-2">{product.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-pink-500">
                        ${product.price.toLocaleString("en-US")}
                      </div>
                      <Ratings value={product.rating} text="" />
                    </div>
                  </div>
                </div>

                {/* Hiệu ứng viền phát sáng khi hover */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(219,39,119,0.1) 0%, rgba(124,58,237,0.2) 50%, rgba(219,39,119,0.1) 100%)",
                    filter: "blur(20px)",
                    zIndex: -1,
                  }}
                ></div>

                {/* Badge shipping */}
                <div className="absolute -bottom-3 left-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform-gpu group-hover:scale-110 transition-transform duration-300">
                  <FaShippingFast />
                  <span className="font-medium">Free Shipping</span>
                </div>
              </div>

              {/* Phần thông tin sản phẩm */}
              <div className="flex flex-col space-y-6 relative">
                {/* Card backdrop với hiệu ứng glass */}
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm rounded-3xl z-0"></div>

                <div className="space-y-2 relative z-10 p-6">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} đánh giá`}
                    />
                  </div>
                </div>

                {/* Giá tiền với hiệu ứng */}
                <div className="group relative z-10 px-6">
                  <div className="relative">
                    <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500">
                      {product.price.toLocaleString("en-US")}$
                    </div>
                    <div
                      className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(219,39,119,1) 0%, rgba(124,58,237,1) 100%)",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm transform transition-all duration-300 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 relative z-10 mx-6">
                  <h3 className="text-lg font-semibold mb-2 relative">
                    Mô Tả Sản Phẩm
                    <span className="absolute -bottom-1 left-0 w-10 h-1 bg-pink-500"></span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Thông tin chi tiết sản phẩm */}
                <div className="grid grid-cols-2 gap-6 relative z-10 mx-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-300 p-4 rounded-lg hover:bg-pink-600/10">
                      <div className="bg-pink-600/20 p-3 rounded-full relative group">
                        <FaStore className="text-pink-500 relative z-10" />
                        <div className="absolute inset-0 bg-pink-600/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Thương hiệu</p>
                        <p className="font-medium">{product.brand}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-300 p-4 rounded-lg hover:bg-blue-600/10">
                      <div className="bg-blue-600/20 p-3 rounded-full relative group">
                        <FaClock className="text-blue-500 relative z-10" />
                        <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Thời gian đăng</p>
                        <p className="font-medium">
                          {moment(product.createdAt).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-300 p-4 rounded-lg hover:bg-purple-600/10">
                      <div className="bg-purple-600/20 p-3 rounded-full relative group">
                        <FaStar className="text-purple-500 relative z-10" />
                        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Lượt đánh giá</p>
                        <p className="font-medium">{product.numReviews}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-300 p-4 rounded-lg hover:bg-green-600/10">
                      <div className="bg-green-600/20 p-3 rounded-full relative group">
                        <FaBox className="text-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-600/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Còn lại</p>
                        <p className="font-medium">
                          {product.countInStock} sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Số lượng và thêm vào giỏ hàng */}
                <div className="pt-4 border-t border-gray-700/50 relative z-10 px-6">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    {product.countInStock > 0 ? (
                      <>
                        <div className="relative col-span-1">
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Số lượng
                          </label>
                          <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full h-[52px]"
                            onMouseEnter={handleMouseLeave}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                          <div className="absolute right-3 top-10 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>

                        <button
                          onClick={addToCartHandler}
                          onMouseEnter={() => handleMouseEnter("cart")}
                          onMouseLeave={handleMouseLeave}
                          className="col-span-2 relative group overflow-hidden rounded-lg h-[52px]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center gap-2 text-white font-medium z-10">
                            <FaShoppingCart className="transition-transform group-hover:scale-110 duration-300" />
                            <span>Thêm vào giỏ hàng</span>
                          </div>

                          {/* Hiệu ứng glow và ripple */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-pink-500/20 blur-md"></div>
                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg animate-pulse"></div>
                          </div>
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="col-span-3 bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 py-3 px-4 font-medium cursor-not-allowed h-[52px]"
                      >
                        <FaShoppingCart />
                        Hết hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Phần tabs đánh giá và thông tin khác */}
            <div className="mt-16 relative z-10">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

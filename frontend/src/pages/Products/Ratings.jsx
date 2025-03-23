import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text }) => {
  const fullStars = Math.floor(value); // Số lượng ngôi sao đầy
  const halfStars = value - fullStars >= 0.5 ? 1 : 0; // Kiểm tra có nửa sao hay không
  const emptyStars = 5 - fullStars - halfStars; // Số lượng ngôi sao rỗng còn lại

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className="text-yellow-500 ml-1" /> // Ngôi sao đầy, màu vàng
      ))}
      {halfStars === 1 && <FaStarHalfAlt className="text-yellow-500 ml-1" />}{" "}
      {/* Ngôi sao nửa, màu vàng */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className="text-yellow-500 ml-1" /> // Ngôi sao rỗng, màu vàng
      ))}
      {text && <span className="ml-2 text-yellow-500">{text}</span>}{" "}
      {/* Hiển thị văn bản nếu có */}
    </div>
  );
};

export default Ratings;

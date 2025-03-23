import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    fade: true,
  };

  return (
    <div className="mb-12">
      {isLoading ? (
        <div className="flex items-center justify-center h-96 text-gray-500">
          Đang tải...
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="max-w-4xl mx-auto">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-3xl overflow-hidden transition-transform transform hover:scale-[1.02]"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-full h-auto max-h-[28rem] object-contain rounded-t-3xl"
                />

                <div className="p-8">
                  <h2 className="text-3xl font-extrabold text-gray-800 mb-5">
                    {name}
                  </h2>

                  <p className="text-xl text-red-600 font-semibold mb-5">
                    Giá: {price.toLocaleString("en-US")} USD
                  </p>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {description.substring(0, 170)}...
                  </p>

                  <div className="grid grid-cols-2 gap-8 text-gray-700">
                    <div>
                      <p className="flex items-center mb-4">
                        <FaStore className="mr-2 text-blue-500" /> Thương hiệu:{" "}
                        <span className="font-semibold text-gray-800">
                          {brand}
                        </span>
                      </p>
                      <p className="flex items-center mb-4">
                        <FaClock className="mr-2 text-pink-400" /> Ngày đăng:{" "}
                        <span className="font-semibold text-gray-800">
                          {moment(createdAt).format("DD/MM/YYYY")}
                        </span>
                      </p>
                      <p className="flex items-center mb-4">
                        <FaStar className="mr-2 text-yellow-400" /> Đánh giá:{" "}
                        <span className="font-semibold text-gray-800">
                          {numReviews} lượt
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center mb-4">
                        <FaStar className="mr-2 text-yellow-400" /> Điểm số:{" "}
                        <span className="font-semibold text-gray-800">
                          {Math.round(rating)} / 5
                        </span>
                      </p>
                      <p className="flex items-center mb-4">
                        <FaShoppingCart className="mr-2 text-green-500" /> Số
                        lượng:{" "}
                        <span className="font-semibold text-gray-800">
                          {quantity}
                        </span>
                      </p>
                      <p className="flex items-center mb-4">
                        <FaBox className="mr-2 text-green-500" /> Tồn kho:{" "}
                        <span
                          className={`font-semibold ${
                            countInStock > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {countInStock > 0 ? "Còn hàng" : "Hết hàng"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;

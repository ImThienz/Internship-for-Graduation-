import { useGetFavoritesQuery } from "../../redux/api/usersApiSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/Loader";

const Favorites = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: favorites = [], isLoading } = useGetFavoritesQuery(undefined, {
    skip: !userInfo,
  });
  const navigate = useNavigate();

  if (!userInfo) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <Loader />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-8">
        Sản phẩm yêu thích
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Bạn chưa có sản phẩm yêu thích nào.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

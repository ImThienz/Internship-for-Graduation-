import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-8">
        Sản phẩm yêu thích
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">
          Bạn chưa có sản phẩm yêu thích nào.
        </p>
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

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery,
} from "../../redux/api/usersApiSlice";

const HeartIcon = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, {
    skip: !userInfo,
  });
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  const isFavorite = favorites.some((p) => p._id === product._id);

  const toggleFavorite = async () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);

    try {
      if (isFavorite) {
        await removeFromFavorites(product._id).unwrap();
      } else {
        await addToFavorites(product._id).unwrap();
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer transition-transform duration-300 transform hover:scale-125"
      onClick={toggleFavorite}
    >
      {isFavorite ? (
        <FaHeart
          className={`text-red-500 drop-shadow-lg ${
            animate ? "animate-ping" : ""
          }`}
        />
      ) : (
        <FaRegHeart
          className={`text-gray-800 drop-shadow-md ${
            animate ? "animate-bounce" : ""
          }`}
        />
      )}
    </div>
  );
};

export default HeartIcon;

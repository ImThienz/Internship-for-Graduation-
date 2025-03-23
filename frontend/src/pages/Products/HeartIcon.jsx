import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer transition-transform duration-300 transform hover:scale-125"
      onClick={toggleFavorites}
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

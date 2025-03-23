// Thêm một sản phẩm vào localStorage
export const addFavoriteToLocalStorage = (product) => {
  // Lấy danh sách sản phẩm yêu thích từ localStorage
  const favorites = getFavoritesFromLocalStorage();

  // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa, nếu chưa thì thêm vào
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    // Lưu danh sách sản phẩm yêu thích mới vào localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Xóa một sản phẩm khỏi localStorage
export const removeFavoriteFromLocalStorage = (productId) => {
  // Lấy danh sách sản phẩm yêu thích từ localStorage
  const favorites = getFavoritesFromLocalStorage();

  // Lọc ra danh sách mới, loại bỏ sản phẩm có ID trùng với productId
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );

  // Cập nhật danh sách mới vào localStorage
  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

// Lấy danh sách sản phẩm yêu thích từ localStorage
export const getFavoritesFromLocalStorage = () => {
  // Lấy dữ liệu dưới dạng JSON từ localStorage
  const favoritesJSON = localStorage.getItem("favorites");

  // Chuyển đổi JSON thành mảng hoặc trả về mảng rỗng nếu không có dữ liệu
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};

import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineShop,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { AiOutlinePhone } from "react-icons/ai";
import zaloIcon from "./img_shop_info/icons8-zalo.svg";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-screen fixed transition-all duration-300`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-gray-300"
        >
          <AiOutlineHome className="mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium">
            TRANG CHỦ
          </span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-gray-300"
        >
          <AiOutlineShopping className="mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium">
            CỬA HÀNG
          </span>
        </Link>

        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-gray-300"
        >
          <AiOutlineShoppingCart className="mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium">
            GIỎ HÀNG
          </span>
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>

        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-gray-300"
        >
          <FaHeart className="mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium">
            YÊU THÍCH
          </span>
          <FavoritesCount />
        </Link>

        <Link
          to="/shop-info"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-gray-300"
        >
          <AiOutlineShop className="mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium">
            Giới Thiệu
          </span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white font-medium">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-gray-800 text-white rounded shadow-lg ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-700 rounded-t"
                  >
                    Quản lý
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Danh mục
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Người dùng
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">
                Hồ sơ
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700 rounded-b"
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        )}

        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2 hover:text-gray-300"
              >
                <AiOutlineLogin className="mr-2" size={26} />
                <span className="hidden nav-item-name font-medium">
                  ĐĂNG NHẬP
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2 hover:text-gray-300"
              >
                <AiOutlineUserAdd className="mr-2" size={26} />
                <span className="hidden nav-item-name font-medium">
                  ĐĂNG KÝ
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="contact-buttons">
        <a href="tel:0347912756" className="contact-button">
          <AiOutlinePhone size={20} />
          <span>0347912756</span>
        </a>
        <a
          href="https://zalo.me/0347912756"
          target="_blank"
          className="contact-button"
        >
          <img src={zaloIcon} alt="Zalo" />
        </a>
      </div>
    </div>
  );
};

export default Navigation;

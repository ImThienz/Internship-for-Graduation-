import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { useState } from "react";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    >
      {/* Nút chuyển theme */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
      >
        {isDarkMode ? "🌙 " : "☀️ "}
      </button>

      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">Sản phẩm hot</h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-[2rem] ml-[10%] mr-[10%]">
              {data.products.map((product) => (
                <div key={product._id} className="w-full flex justify-center">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

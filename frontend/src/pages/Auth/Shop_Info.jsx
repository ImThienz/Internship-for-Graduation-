import React from "react";
import { motion } from "framer-motion";
import Anh1 from "./img_shop_info/4.png";
import Anh2 from "./img_shop_info/2.jpg";
import Anh3 from "./img_shop_info/1.png";

const Shop_Info = () => {
  // Variants cho hiệu ứng fade và slide
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-gray-50 font-sans">
      {/* Banner Section */}
      <div className="relative overflow-hidden">
        <motion.img
          src={Anh1}
          alt="TechChip Banner"
          className="w-full h-[800px] object-cover rounded-b-lg shadow-xl"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            TechChip - Kiến Tạo Tương Lai Công Nghệ
          </motion.h1>
        </motion.div>
      </div>

      {/* Company Introduction */}
      <motion.div
        className="py-16 pl-[10%] pr-5 md:pr-20 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }} // Hiệu ứng chạy khi 30% section vào tầm nhìn
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
          variants={fadeInUp}
        >
          Chúng Tôi Là Ai?
        </motion.h2>
        <motion.p
          className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed"
          variants={fadeInUp}
        >
          TechChip không chỉ là nhà cung cấp vi mạch và linh kiện điện tử hàng
          đầu tại Việt Nam, chúng tôi là những người tiên phong, mang đến những
          giải pháp công nghệ đột phá cho mọi ngành công nghiệp. Từ những con
          chip nhỏ bé đến những hệ thống thẻ điện tử thông minh, mỗi sản phẩm
          của chúng tôi đều được tạo ra với đam mê, sự chính xác và cam kết chất
          lượng tuyệt đối.
        </motion.p>
        <motion.img
          src={Anh3}
          alt="TechChip Team"
          className="mt-8 mx-auto w-full md:w-1/2 rounded-lg shadow-md"
          variants={scaleIn}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 pl-[6%] pr-5 md:pr-20 py-12 bg-gradient-to-r from-blue-50 to-indigo-50"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }} // Hiệu ứng chạy khi 30% section vào tầm nhìn
      >
        {[
          { value: "2015", label: "Khởi nguồn hành trình" },
          { value: "+200", label: "Chuyên gia công nghệ" },
          { value: "+3.000", label: "Đối tác tin cậy" },
          { value: "4.9/5", label: "Sự hài lòng tuyệt vời" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg"
            variants={scaleIn}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-indigo-600">{stat.value}</h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Business Philosophy */}
      <motion.div
        className="py-16 pl-[5%] pr-5 md:pr-20 flex flex-col md:flex-row items-center gap-10 bg-white"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }} // Hiệu ứng chạy khi 30% section vào tầm nhìn
      >
        <motion.div className="md:w-1/2" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sứ Mệnh & Tầm Nhìn
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Tại TechChip, chúng tôi tin rằng công nghệ không chỉ là công cụ, mà
            còn là cầu nối cho một tương lai bền vững. Với sự minh bạch làm nền
            tảng, sự đổi mới làm động lực, và chất lượng làm lời hứa, chúng tôi
            không ngừng nỗ lực để mang đến giá trị vượt trội cho khách hàng, đối
            tác và cộng đồng.
          </p>
        </motion.div>
        <motion.img
          src={Anh2}
          alt="Philosophy Illustration"
          className="md:w-1/2 rounded-lg shadow-lg"
          variants={scaleIn}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 pl-[10%] pr-5 md:pr-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }} // Hiệu ứng chạy khi 30% section vào tầm nhìn
        >
          {/* Contact Info */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-4">
              Liên Hệ Với Chúng Tôi
            </h3>
            <p>Email: contact@techchip.vn</p>
            <p>Hotline: 1900 1234</p>
            <p>Địa chỉ: 123 Đường Công Nghệ, TP. Hồ Chí Minh</p>
          </motion.div>
          {/* Working Hours */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-4">Thời Gian Làm Việc</h3>
            <ul className="space-y-2">
              <li>Thứ Hai - Thứ Sáu: 8:00 - 17:30</li>
              <li>Thứ Bảy: 8:00 - 12:00</li>
              <li>Chủ Nhật: Nghỉ</li>
            </ul>
          </motion.div>
          {/* Social Media */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-4">
              Kết Nối Với Chúng Tôi
            </h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-400 transition">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="#" className="hover:text-indigo-400 transition">
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
              <a href="#" className="hover:text-indigo-400 transition">
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-8 text-center border-t border-gray-700 pt-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
        >
          <p>© 2025 TechChip. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
};

export default Shop_Info;

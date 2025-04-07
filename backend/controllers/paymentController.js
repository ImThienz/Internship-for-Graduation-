import querystring from 'qs';
import crypto from 'crypto';
import moment from 'moment';
import { vnpayConfig } from '../config/vnpayConfig.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/orderModel.js';

// Sắp xếp object theo key ASCII
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      sorted[key] = obj[key];
    }
  }
  return sorted;
}

// Tạo URL thanh toán VNPAY
export const createPayment = asyncHandler(async (req, res) => {
  const { amount, orderInfo, orderId } = req.body;
  
  // Chuyển đổi USD sang VND
  const exchangeRate = 24500;
  const amountInVND = Math.round(amount * exchangeRate);
  
  console.log("Creating payment for Order ID:", orderId);
  console.log("Original amount (USD):", amount);
  console.log("Converted amount (VND):", amountInVND);
  
  const date = new Date();
  const createDate = date.toISOString().slice(0, 19).replace(/T|-|:/g, "");
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  const txnRef = orderId || date.valueOf().toString();

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Amount: amountInVND * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang: ${txnRef}`,
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_Locale: "vn",
    vnp_BankCode: "NCB"
  };

  // Sắp xếp các tham số theo key
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  // Tạo chuỗi dữ liệu ký
  const signData = new URLSearchParams(sortedParams).toString();
  
  // Tạo chữ ký
  const secureHash = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(signData)
    .digest("hex");

  // Tạo URL thanh toán
  const paymentUrl = `${vnpayConfig.vnp_Url}?${signData}&vnp_SecureHash=${secureHash}`;
  
  console.log('PaymentURL:', paymentUrl);
  
  res.json({ code: '00', data: paymentUrl });
});

// Tạo URL tĩnh để test
export const createStaticPayment = asyncHandler(async (req, res) => {
  // URL tĩnh với tham số cố định
  const staticUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2450000&vnp_Command=pay&vnp_CreateDate=20250406225615&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+test&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fpayment%2Fvnpay_return&vnp_TmnCode=V9HUOY9E&vnp_TxnRef=1712426175000&vnp_Version=2.1.0&vnp_BankCode=NCB&vnp_SecureHash=e52abdee0f9bc3abf3a9bbf3f562c5fc69ff46d8d1a54daaa67d1dc35278d80a2bfaff8f1f242da4d2c95e124b40cf1ab551e1acae4c6dda04950cda65a82cd0';
  
  res.json({ code: '00', data: staticUrl });
});

// Format số tiền
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Xử lý kết quả thanh toán
export const vnpayReturn = asyncHandler(async (req, res) => {
  console.log("VNPay callback hit");
  console.log("VNPay Query Params:", req.query);

  try {
    const vnp_Params = req.query;
    
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp các tham số theo key
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    // Tạo chuỗi dữ liệu ký
    const signData = new URLSearchParams(sortedParams).toString();
    
    // Tạo chữ ký để kiểm tra
    const checkHash = crypto
      .createHmac("sha512", vnpayConfig.vnp_HashSecret)
      .update(signData)
      .digest("hex");

    // Thông tin thanh toán
    const paymentInfo = {
      orderId: vnp_Params["vnp_TxnRef"],
      amount: formatCurrency(parseInt(vnp_Params["vnp_Amount"]) / 100),
      orderInfo: vnp_Params["vnp_OrderInfo"],
      transactionNo: vnp_Params["vnp_TransactionNo"],
      bankCode: vnp_Params["vnp_BankCode"],
      payDate: vnp_Params["vnp_PayDate"] ? new Date(
        vnp_Params["vnp_PayDate"].substring(0, 4),
        vnp_Params["vnp_PayDate"].substring(4, 6) - 1,
        vnp_Params["vnp_PayDate"].substring(6, 8),
        vnp_Params["vnp_PayDate"].substring(8, 10),
        vnp_Params["vnp_PayDate"].substring(10, 12),
        vnp_Params["vnp_PayDate"].substring(12, 14)
      ).toLocaleString("vi-VN") : new Date().toLocaleString("vi-VN"),
    };

    if (checkHash === secureHash) {
      const transactionStatus = vnp_Params["vnp_TransactionStatus"];

      if (transactionStatus === "00") {
        // Thanh toán thành công
        const orderId = vnp_Params["vnp_TxnRef"];
        console.log("Mã đơn hàng từ VNPay:", orderId);

        try {
          // Cập nhật trạng thái đơn hàng
          const order = await Order.findById(orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: vnp_Params["vnp_TransactionNo"],
              status: "success",
              update_time: new Date().toISOString(),
            };
            await order.save();
            console.log("Order updated:", order);
          }
        } catch (error) {
          console.error("Error updating order:", error);
        }

        // Trả về trang thành công
        res.send(`
          <html>
            <head>
              <title>Kết quả thanh toán</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 20px; 
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px; 
                }
                .success { 
                  color: #28a745; 
                }
                .detail-row { 
                  margin: 10px 0; 
                }
                .label { 
                  font-weight: bold; 
                }
                .home-button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
                  text-align: center;
                }
                .home-button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="success">Thanh toán thành công!</h2>
                <div class="detail-row">
                  <span class="label">Mã đơn hàng:</span> ${paymentInfo.orderId}
                </div>
                <div class="detail-row">
                  <span class="label">Số tiền:</span> ${paymentInfo.amount}
                </div>
                <div class="detail-row">
                  <span class="label">Nội dung thanh toán:</span> ${paymentInfo.orderInfo}
                </div>
                <div class="detail-row">
                  <span class="label">Mã giao dịch:</span> ${paymentInfo.transactionNo}
                </div>
                <div class="detail-row">
                  <span class="label">Ngân hàng:</span> ${paymentInfo.bankCode}
                </div>
                <div class="detail-row">
                  <span class="label">Thời gian thanh toán:</span> ${paymentInfo.payDate}
                </div>
                <a href="http://localhost:5173" class="home-button">Đi shopping tiếp</a>
              </div>
            </body>
          </html>
        `);
      } else {
        // Thanh toán thất bại
        res.send(`
          <html>
            <head>
              <title>Kết quả thanh toán</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 20px; 
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px; 
                }
                .error { 
                  color: #dc3545; 
                }
                .detail-row { 
                  margin: 10px 0; 
                }
                .label { 
                  font-weight: bold; 
                }
                .home-button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
                  text-align: center;
                }
                .home-button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="error">Giao dịch thất bại!</h2>
                <div class="detail-row">
                  <span class="label">Mã đơn hàng:</span> ${paymentInfo.orderId}
                </div>
                <div class="detail-row">
                  <span class="label">Số tiền:</span> ${paymentInfo.amount}
                </div>
                <div class="detail-row">
                  <span class="label">Lý do:</span> Giao dịch không thành công
                </div>
                <div class="detail-row">
                  <span class="label">Thời gian:</span> ${paymentInfo.payDate}
                </div>
                <a href="http://localhost:5173" class="home-button">Thử thanh toán lại lần nữa</a>
              </div>
            </body>
          </html>
        `);
      }
    } else {
      res.send(`
        <html>
          <head>
            <title>Kết quả thanh toán</title>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 20px; 
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
              }
              .error { 
                color: #dc3545; 
              }
              .home-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                text-align: center;
              }
              .home-button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="error">Lỗi giao dịch!</h2>
              <p>Chữ ký không hợp lệ!</p>
              <a href="http://localhost:5173" class="home-button">Quay về trang chủ</a>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("Error processing VNPay return:", error);
    res.status(500).send(`
      <html>
        <head>
          <title>Lỗi</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              border: 1px solid #ddd; 
              border-radius: 5px; 
            }
            .error { 
              color: #dc3545; 
            }
            .home-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              text-align: center;
            }
            .home-button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">Có lỗi xảy ra!</h2>
            <p>Có lỗi xảy ra khi xử lý kết quả thanh toán</p>
            <a href="http://localhost:5173" class="home-button">Quay về trang chủ</a>
          </div>
        </body>
      </html>
    `);
  }
});

// API xử lý IPN URL
export const vnpayIPN = asyncHandler(async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    
    // Sắp xếp các tham số theo key
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});
    
    // Tạo chuỗi dữ liệu ký
    const signData = new URLSearchParams(sortedParams).toString();
    
    // Tạo chữ ký để kiểm tra
    const checkHash = crypto
      .createHmac("sha512", vnpayConfig.vnp_HashSecret)
      .update(signData)
      .digest("hex");
    
    if (checkHash === secureHash) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const transactionStatus = vnp_Params["vnp_TransactionStatus"];
      
      // Nếu thanh toán thành công (00)
      if (transactionStatus === "00") {
        // Cập nhật trạng thái đơn hàng
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          await order.save();
        }
      }
      
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  } catch (error) {
    console.error("Error processing VNPay IPN:", error);
    res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
});

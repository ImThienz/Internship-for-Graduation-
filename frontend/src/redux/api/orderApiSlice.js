import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo đơn hàng mới
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL, // Gửi yêu cầu tới URL của đơn hàng
        method: "POST", // Sử dụng phương thức POST để tạo mới
        body: order, // Dữ liệu đơn hàng gửi kèm
      }),
    }),

    // Lấy thông tin chi tiết của một đơn hàng cụ thể
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`, // Truy xuất thông tin đơn hàng qua ID
      }),
    }),

    // Thanh toán đơn hàng
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`, // Endpoint thanh toán theo ID đơn hàng
        method: "PUT", // Cập nhật thông tin thanh toán
        body: details, // Dữ liệu chi tiết thanh toán
      }),
    }),

    // Lấy Client ID của PayPal
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL, // Gửi yêu cầu tới endpoint của PayPal
      }),
    }),

    // Lấy danh sách đơn hàng của người dùng hiện tại
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`, // Endpoint trả về các đơn hàng của người dùng
      }),
      keepUnusedDataFor: 5, // Giữ dữ liệu trong 5 giây nếu không sử dụng
    }),

    // Lấy tất cả đơn hàng (dành cho admin hoặc quản lý)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL, // Truy xuất toàn bộ danh sách đơn hàng
      }),
    }),

    // Đánh dấu đơn hàng là "đã giao"
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`, // Endpoint cập nhật trạng thái giao hàng
        method: "PUT", // Sử dụng phương thức PUT để cập nhật
      }),
    }),

    // Lấy tổng số đơn hàng
    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`, // Endpoint trả về tổng số đơn hàng
    }),

    // Lấy tổng doanh số bán hàng
    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`, // Endpoint trả về tổng doanh số
    }),

    // Lấy tổng doanh số theo ngày
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`, // Endpoint trả về doanh số theo ngày
    }),
  }),
});

// Xuất các hook được tạo tự động từ các endpoint
export const {
  useGetTotalOrdersQuery, // Hook lấy tổng số đơn hàng
  useGetTotalSalesQuery, // Hook lấy tổng doanh số
  useGetTotalSalesByDateQuery, // Hook lấy tổng doanh số theo ngày

  useCreateOrderMutation, // Hook tạo đơn hàng
  useGetOrderDetailsQuery, // Hook lấy thông tin chi tiết đơn hàng
  usePayOrderMutation, // Hook thanh toán đơn hàng
  useGetPaypalClientIdQuery, // Hook lấy Client ID của PayPal
  useGetMyOrdersQuery, // Hook lấy đơn hàng của người dùng hiện tại
  useDeliverOrderMutation, // Hook cập nhật trạng thái giao hàng
  useGetOrdersQuery, // Hook lấy danh sách tất cả đơn hàng
} = orderApiSlice;

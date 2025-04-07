import { apiSlice } from "./apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createVNPayUrl: builder.mutation({
      query: (payload) => ({
        url: `/api/payment/create_payment_url`,
        method: "POST",
        // body: data,
        body: payload,
      }),
    }),
    getVNPayStatus: builder.query({
      query: (params) => ({
        url: `/api/payment/vnpay_return`,
        method: "GET",
        params,
      }),
    }),
    createVNPayStaticUrl: builder.mutation({
      query: () => ({
        url: '/api/payment/create_static_payment',
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useCreateVNPayUrlMutation,
  useGetVNPayStatusQuery,
  useCreateVNPayStaticUrlMutation
} = paymentApiSlice;

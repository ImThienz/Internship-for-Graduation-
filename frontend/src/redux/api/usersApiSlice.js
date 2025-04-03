import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Đăng nhập người dùng
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, // Gửi request đến endpoint /auth
        method: "POST",
        body: data, // Chứa thông tin đăng nhập (email, password)
      }),
    }),

    // Đăng ký tài khoản mới
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // Gửi request đến endpoint chính USERS_URL
        method: "POST",
        body: data, // Chứa thông tin đăng ký (email, password, name,...)
      }),
    }),

    // Đăng xuất người dùng
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`, // Gửi request đến endpoint /logout
        method: "POST",
      }),
    }),

    // Cập nhật hồ sơ người dùng
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // Gửi request đến endpoint /profile
        method: "PUT",
        body: data, // Chứa thông tin hồ sơ cần cập nhật
      }),
    }),

    // Lấy danh sách người dùng
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL, // Gửi request đến endpoint USERS_URL để lấy danh sách user
      }),
      providesTags: ["User"], // Đánh dấu dữ liệu liên quan đến "User"
      keepUnusedDataFor: 5, // Giữ dữ liệu không sử dụng trong 5 giây
    }),

    // Xóa người dùng theo ID
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, // Gửi request đến endpoint USERS_URL/{userId}
        method: "DELETE",
      }),
    }),

    // Lấy thông tin chi tiết của một người dùng
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`, // Gửi request đến endpoint USERS_URL/{id}
      }),
      keepUnusedDataFor: 5, // Giữ dữ liệu trong cache trong 5 giây
    }),

    // Cập nhật thông tin người dùng theo ID
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, // Gửi request đến endpoint USERS_URL/{userId}
        method: "PUT",
        body: data, // Chứa thông tin cần cập nhật
      }),
      invalidatesTags: ["User"], // Invalidate cache để cập nhật lại dữ liệu
    }),

    // Lấy danh sách favorites của người dùng
    getFavorites: builder.query({
      query: () => ({
        url: `${USERS_URL}/favorites`,
      }),
      providesTags: ['Favorites'],
    }),

    // Thêm sản phẩm vào favorites của người dùng
    addToFavorites: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/favorites`,
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Xóa sản phẩm khỏi favorites của người dùng
    removeFromFavorites: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/favorites/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = userApiSlice;

import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

// Tạo và mở rộng categoryApiSlice từ apiSlice
export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint tạo danh mục mới
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
    }),

    // Endpoint cập nhật danh mục
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    // Endpoint xoá danh mục
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),

    // Endpoint lấy danh sách danh mục
    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/categories`,
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const authApi = createApi({
  baseQuery,
  reducerPath: "api",
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        body,
        url: "auth/login",
        method: "POST",
      }),
    }),

    registerUser: builder.mutation({
      query: (body) => ({
        body,
        url: "/auth/register",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        body,
        url: "/auth/forgot-password",
        method: "POST",
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        body,
        url: `/auth/reset-password/${body.token}`,
        method: "POST",
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        body,
        url: `/auth/verify-email`,
        method: "POST",
      }),
    }),

    resendVerification: builder.mutation({
      query: (body) => ({
        body,
        url: `/auth/resend-verification`,
        method: "POST",
      }),
    }),

    refreshToken: builder.mutation({
      query: (body) => ({
        body,
        url: "auth/refresh",
        method: "POST",
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: "POST",
      }),
    }),

    getAllUsers: builder.query({
      query: (args?: any) => ({
        url: "users",
        params: args,
      }),
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `users/${id}`,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ body, id }) => ({
        url: `auth/users/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    updateUserRole: builder.mutation({
      query: ({ body, id }) => ({
        url: `auth/users/${id}/role`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} = authApi;

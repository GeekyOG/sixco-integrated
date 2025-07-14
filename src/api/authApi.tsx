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
  }),
});

export const {
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

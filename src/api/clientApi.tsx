import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const clientApi = createApi({
  baseQuery,
  reducerPath: "clientApi",
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        body,
        url: "clients/login",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        body,
        url: "/clients/forgot-password",
        method: "POST",
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        body,
        url: `/clients/reset-password/${body.token}`,
        method: "POST",
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        body,
        url: `/clients/verify-email`,
        method: "POST",
      }),
    }),

    resendVerification: builder.mutation({
      query: (body) => ({
        body,
        url: `/clients/resend-verification`,
        method: "POST",
      }),
    }),

    addClient: builder.mutation({
      query: (body) => ({
        body,
        url: "clients",
        method: "POST",
      }),
    }),

    getAllClients: builder.query({
      query: (args?: any) => ({
        url: "clients",
        params: args,
      }),
    }),

    getClients: builder.query({
      query: (id) => ({
        url: `clients/${id}`,
      }),
    }),

    updateClients: builder.mutation({
      query: ({ body, id }) => ({
        url: `clients/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    getClientProject: builder.query({
      query: ({ id, args }) => ({
        url: `clients/${id}/projects`,
        params: args,
      }),
    }),

    deleteClients: builder.mutation({
      query: (id) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddClientMutation,
  useDeleteClientsMutation,
  useGetAllClientsQuery,
  useGetClientsQuery,
  useLazyGetAllClientsQuery,
  useLazyGetClientsQuery,
  useUpdateClientsMutation,
  useForgotPasswordMutation,
  useLoginUserMutation,
  useResendVerificationMutation,
  useLazyGetClientProjectQuery,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} = clientApi;

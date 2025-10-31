import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const rolesApi = createApi({
  baseQuery,
  reducerPath: "rolesApi",
  endpoints: (builder) => ({
    addRole: builder.mutation({
      query: ({ id, body }) => ({
        body,
        url: `roles/`,
        method: "POST",
      }),
    }),

    getAllRole: builder.query({
      query: ({ currentPage }) => ({
        url: "roles",
        params: { currentPage },
      }),
    }),

    getAllPermissions: builder.query({
      query: ({ currentPage }) => ({
        url: "auth/permissions",
        params: { currentPage },
      }),
    }),

    getRole: builder.query({
      query: (id) => ({
        url: `roles/${id}`,
      }),
    }),

    updateRole: builder.mutation({
      query: ({ body, id }) => ({
        url: `roles/${id}`,
        method: "PATCH",
        body: body,
      }),
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetAllRoleQuery,
  useLazyGetAllRoleQuery,
  useGetRoleQuery,
  useLazyGetRoleQuery,
  useGetAllPermissionsQuery,
} = rolesApi;

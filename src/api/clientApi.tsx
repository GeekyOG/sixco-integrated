import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const clientApi = createApi({
  baseQuery,
  reducerPath: "clientApi",
  endpoints: (builder) => ({
    addClient: builder.mutation({
      query: (body) => ({
        body,
        url: "clients",
        method: "POST",
      }),
    }),

    getAllClients: builder.query({
      query: () => ({
        url: "clients",
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
        method: "PATCH",
        body: body,
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
} = clientApi;

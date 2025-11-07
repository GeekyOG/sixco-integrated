import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const hseDocumentApi = createApi({
  baseQuery,
  reducerPath: "hseDocumentApi",
  endpoints: (builder) => ({
    addDocument: builder.mutation({
      query: ({ id, body }) => ({
        body,
        url: `hse/documents/${id}`,
        method: "POST",
      }),
    }),

    getAllDocument: builder.query({
      query: (args?: any) => ({
        url: "hse/documents",
        params: args,
      }),
    }),

    getDocument: builder.query({
      query: (id) => ({
        url: `hse/documents/${id}`,
      }),
    }),

    updateDocument: builder.mutation({
      query: ({ body, id }) => ({
        url: `hse/documents/${id}`,
        method: "PATCH",
        body: body,
      }),
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `hse/documents/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentQuery,
  useLazyGetAllDocumentQuery,
  useGetDocumentQuery,
  useLazyGetDocumentQuery,
} = hseDocumentApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const documentApi = createApi({
  baseQuery,
  reducerPath: "documentApi",
  endpoints: (builder) => ({
    addDocument: builder.mutation({
      query: ({ id, body }) => ({
        body,
        url: `documents/${id}`,
        method: "POST",
      }),
    }),

    getAllDocument: builder.query({
      query: (args?: any) => ({
        url: "documents",
        params: args,
      }),
    }),

    getDocument: builder.query({
      query: (id) => ({
        url: `documents/${id}`,
      }),
    }),

    updateDocument: builder.mutation({
      query: ({ body, id }) => ({
        url: `documents/${id}`,
        method: "PATCH",
        body: body,
      }),
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `documents/${id}`,
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
} = documentApi;

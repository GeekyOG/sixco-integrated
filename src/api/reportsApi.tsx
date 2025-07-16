import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const reportsApi = createApi({
  baseQuery,
  reducerPath: "reportsApi",
  endpoints: (builder) => ({
    addReport: builder.mutation({
      query: (body) => ({
        body,
        url: "reports",
        method: "POST",
      }),
    }),

    getAllReport: builder.query({
      query: () => ({
        url: "reports",
      }),
    }),

    getReport: builder.query({
      query: (id) => ({
        url: `reports/${id}`,
      }),
    }),

    updateReport: builder.mutation({
      query: ({ body, id }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        url: `reports/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddReportMutation,
  useDeleteReportMutation,
  useGetAllReportQuery,
  useGetReportQuery,
  useLazyGetAllReportQuery,
  useLazyGetReportQuery,
  useUpdateReportMutation,
} = reportsApi;

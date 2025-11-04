import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const hseReportApi = createApi({
  baseQuery,
  reducerPath: "hseReportApi",
  endpoints: (builder) => ({
    addHSEReport: builder.mutation({
      query: (body) => ({
        body,
        url: "hse/reports",
        method: "POST",
      }),
    }),

    getAllHSEReport: builder.query({
      query: ({ currentPage }) => ({
        url: "hse/reports",
        params: { currentPage },
      }),
    }),

    getHSEReport: builder.query({
      query: (id) => ({
        url: `hse/reports/${id}`,
      }),
    }),

    updateHSEReport: builder.mutation({
      query: ({ body, id }) => ({
        url: `hse/reports/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteHSEReport: builder.mutation({
      query: (id) => ({
        url: `hse/reports/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddHSEReportMutation,
  useDeleteHSEReportMutation,
  useGetAllHSEReportQuery,
  useGetHSEReportQuery,
  useLazyGetAllHSEReportQuery,
  useLazyGetHSEReportQuery,
  useUpdateHSEReportMutation,
} = hseReportApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const portfolioApi = createApi({
  baseQuery,
  reducerPath: "portfolioApi",
  endpoints: (builder) => ({
    getAllPortfolio: builder.query({
      query: () => ({
        url: "projects",
      }),
    }),

    addPortfolio: builder.mutation({
      query: (body) => ({
        url: "projects",
        body: body,
        method: "POST",
      }),
    }),

    getPortfolio: builder.query({
      query: (id) => ({
        url: `projects/${id}`,
      }),
    }),

    updatePortfolio: builder.mutation({
      query: ({ body, id }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deletePortfolio: builder.mutation({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddPortfolioMutation,
  useDeletePortfolioMutation,
  useGetAllPortfolioQuery,
  useGetPortfolioQuery,
  useLazyGetAllPortfolioQuery,
  useLazyGetPortfolioQuery,
  useUpdatePortfolioMutation,
} = portfolioApi;

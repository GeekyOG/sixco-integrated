import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const overviewApi = createApi({
  baseQuery,
  reducerPath: "overviewApi",
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: () => ({
        url: "api/overview",
      }),
    }),
  }),
});

export const { useGetOverviewQuery, useLazyGetOverviewQuery } = overviewApi;

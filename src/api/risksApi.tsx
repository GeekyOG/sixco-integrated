import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const riskApi = createApi({
  baseQuery,
  reducerPath: "riskApi",
  endpoints: (builder) => ({
    addRisk: builder.mutation({
      query: (body) => ({
        body,
        url: "Risk",
        method: "POST",
      }),
    }),

    getAllRisk: builder.query({
      query: (args?: any) => ({
        url: "risk",
        params: args,
      }),
    }),

    getRisk: builder.query({
      query: (id) => ({
        url: `risk/${id}`,
      }),
    }),

    updateRisk: builder.mutation({
      query: ({ body, id }) => ({
        url: `risk/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteRisk: builder.mutation({
      query: (id) => ({
        url: `risk/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddRiskMutation,
  useDeleteRiskMutation,
  useGetAllRiskQuery,
  useGetRiskQuery,
  useLazyGetAllRiskQuery,
  useLazyGetRiskQuery,
  useUpdateRiskMutation,
} = riskApi;

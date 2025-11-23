import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const hseTrainingApi = createApi({
  baseQuery,
  reducerPath: "hseTrainingApi",
  endpoints: (builder) => ({
    addTraining: builder.mutation({
      query: (body) => ({
        body,
        url: "training",
        method: "POST",
      }),
    }),

    getAllTraining: builder.query({
      query: (args?: any) => ({
        url: "training",
        params: args,
      }),
    }),

    getTraining: builder.query({
      query: (id) => ({
        url: `training/${id}`,
      }),
    }),

    updateTraining: builder.mutation({
      query: ({ body, id }) => ({
        url: `training/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteTraining: builder.mutation({
      query: (id) => ({
        url: `training/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddTrainingMutation,
  useDeleteTrainingMutation,
  useGetAllTrainingQuery,
  useGetTrainingQuery,
  useLazyGetAllTrainingQuery,
  useLazyGetTrainingQuery,
  useUpdateTrainingMutation,
} = hseTrainingApi;

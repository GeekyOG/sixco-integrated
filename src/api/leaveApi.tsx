import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const leaveApi = createApi({
  baseQuery,
  reducerPath: "leaveApi",
  endpoints: (builder) => ({
    addLeave: builder.mutation({
      query: (body) => ({
        body,
        url: "leaves",
        method: "POST",
      }),
    }),

    getAllLeave: builder.query({
      query: (args?: any) => ({
        url: "leaves",
        params: args,
      }),
    }),

    getLeave: builder.query({
      query: (id) => ({
        url: `leaves/${id}`,
      }),
    }),

    updateLeave: builder.mutation({
      query: ({ body, id }) => ({
        url: `leaves/${id}/status`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddLeaveMutation,
  useDeleteLeaveMutation,
  useGetAllLeaveQuery,
  useGetLeaveQuery,
  useLazyGetAllLeaveQuery,
  useLazyGetLeaveQuery,
  useUpdateLeaveMutation,
} = leaveApi;

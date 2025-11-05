import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const tasksApi = createApi({
  baseQuery,
  reducerPath: "tasksApi",
  endpoints: (builder) => ({
    addTask: builder.mutation({
      query: (body) => ({
        body,
        url: "tasks",
        method: "POST",
      }),
    }),

    getAllTask: builder.query({
      query: (args?: any) => ({
        url: "tasks",
        params: args,
      }),
    }),

    getTask: builder.query({
      query: (id) => ({
        url: `tasks/${id}`,
      }),
    }),

    updateTask: builder.mutation({
      query: ({ body, id }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetAllTaskQuery,
  useGetTaskQuery,
  useLazyGetAllTaskQuery,
  useLazyGetTaskQuery,
  useUpdateTaskMutation,
} = tasksApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const directChatApi = createApi({
  baseQuery,
  reducerPath: "directChatApi",
  endpoints: (builder) => ({
    addChat: builder.mutation({
      query: (body) => ({
        body,
        url: `direct-chat/send`,
        method: "POST",
      }),
    }),

    getAllChat: builder.query({
      query: ({ user1, user2 }) => ({
        url: `direct-chat/${user1}/${user2}`,
      }),
    }),

    getChat: builder.query({
      query: (id) => ({
        url: `direct-chat/${id}`,
      }),
    }),

    updateChat: builder.mutation({
      query: ({ body, id }) => ({
        url: `direct-chat/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteChat: builder.mutation({
      query: (id) => ({
        url: `direct-chat/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddChatMutation,
  useDeleteChatMutation,
  useGetAllChatQuery,
  useGetChatQuery,
  useLazyGetAllChatQuery,
  useLazyGetChatQuery,
  useUpdateChatMutation,
} = directChatApi;

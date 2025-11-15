import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const chatsApi = createApi({
  baseQuery,
  reducerPath: "chatsApi",
  endpoints: (builder) => ({
    addChat: builder.mutation({
      query: (body) => ({
        body,
        url: `messaging/directs/${body.userId}`,
        method: "POST",
      }),
    }),

    getAllChat: builder.query({
      query: (args?: any) => ({
        url: "messaging/conversations",
        params: args,
      }),
    }),

    getChat: builder.query({
      query: (id) => ({
        url: `messaging/${id}`,
      }),
    }),

    updateChat: builder.mutation({
      query: ({ body, id }) => ({
        url: `messaging/message/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteChat: builder.mutation({
      query: (id) => ({
        url: `messaging/message/${id}`,
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
} = chatsApi;

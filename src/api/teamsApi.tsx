import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const teamsApi = createApi({
  baseQuery,
  reducerPath: "teamsApi",
  endpoints: (builder) => ({
    addTeam: builder.mutation({
      query: (body) => ({
        body,
        url: "teams",
        method: "POST",
      }),
    }),

    getAllTeam: builder.query({
      query: (args?: any) => ({
        url: "teams",
        params: args,
      }),
    }),

    getTeam: builder.query({
      query: (id) => ({
        url: `teams/${id}`,
      }),
    }),

    updateTeam: builder.mutation({
      query: ({ body, id }) => ({
        url: `teams/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    assignMember: builder.mutation({
      query: (body) => ({
        url: `teams/assign`,
        method: "POST",
        body: body,
      }),
    }),

    unAssignMember: builder.mutation({
      query: (body) => ({
        url: `teams/unassign`,
        method: "POST",
        body: body,
      }),
    }),

    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `teams/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddTeamMutation,
  useDeleteTeamMutation,
  useGetAllTeamQuery,
  useGetTeamQuery,
  useLazyGetAllTeamQuery,
  useLazyGetTeamQuery,
  useUpdateTeamMutation,
  useAssignMemberMutation,
  useUnAssignMemberMutation,
} = teamsApi;

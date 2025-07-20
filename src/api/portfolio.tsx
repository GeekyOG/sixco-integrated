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
        url: "projects/create",
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

    assignTeam: builder.mutation({
      query: (body) => ({
        url: `projects/assign`,
        method: "POST",
        body: body,
      }),
    }),
    getProjectMembers: builder.query({
      query: (id) => ({
        url: `projects/${id}/members`,
      }),
    }),
    addClientToProject: builder.mutation({
      query: ({ body, id }) => ({
        url: `projects/clients`,
        method: "POST",
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
  useAddClientToProjectMutation,
  useAssignTeamMutation,
  useGetProjectMembersQuery,
} = portfolioApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const auditScheduleApi = createApi({
  baseQuery,
  reducerPath: "auditScheduleApi",
  endpoints: (builder) => ({
    addAuditSchedule: builder.mutation({
      query: (body) => ({
        body,
        url: "auditor",
        method: "POST",
      }),
    }),

    getAllAuditSchedule: builder.query({
      query: (args?: any) => ({
        url: "auditor",
        params: args,
      }),
    }),

    getAuditSchedule: builder.query({
      query: (id) => ({
        url: `auditor/${id}`,
      }),
    }),

    updateAuditSchedule: builder.mutation({
      query: ({ body, id }) => ({
        url: `auditor/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteAuditSchedule: builder.mutation({
      query: (id) => ({
        url: `auditor/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddAuditScheduleMutation,
  useDeleteAuditScheduleMutation,
  useGetAllAuditScheduleQuery,
  useGetAuditScheduleQuery,
  useLazyGetAllAuditScheduleQuery,
  useLazyGetAuditScheduleQuery,
  useUpdateAuditScheduleMutation,
} = auditScheduleApi;

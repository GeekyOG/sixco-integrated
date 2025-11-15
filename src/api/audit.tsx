import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const auditApi = createApi({
  baseQuery,
  reducerPath: "auditApi",
  endpoints: (builder) => ({
    getAllAudit: builder.query({
      query: (args?: any) => ({
        url: "audits",
        params: args,
      }),
    }),

    getAudit: builder.query({
      query: (id) => ({
        url: `audits`,
      }),
    }),
  }),
});

export const {
  useGetAllAuditQuery,
  useGetAuditQuery,
  useLazyGetAllAuditQuery,
  useLazyGetAuditQuery,
} = auditApi;

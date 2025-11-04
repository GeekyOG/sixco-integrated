import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../api/authApi";
import { overviewApi } from "../api/overviewApi";
import { portfolioApi } from "../api/portfolio";
import { leaveApi } from "../api/leaveApi";
import { clientApi } from "../api/clientApi";
import { reportsApi } from "../api/reportsApi";
import { tasksApi } from "../api/tasksApi";
import { teamsApi } from "../api/teamsApi";
import { documentApi } from "../api/documentApi";
import { rolesApi } from "../api/rolesApi";
import { hseReportApi } from "../api/hseReportApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [overviewApi.reducerPath]: overviewApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [hseReportApi.reducerPath]: hseReportApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      clientApi.middleware,
      overviewApi.middleware,
      portfolioApi.middleware,
      leaveApi.middleware,
      reportsApi.middleware,
      tasksApi.middleware,
      teamsApi.middleware,
      documentApi.middleware,
      rolesApi.middleware,
      hseReportApi.middleware
    ),
});

setupListeners(store.dispatch);

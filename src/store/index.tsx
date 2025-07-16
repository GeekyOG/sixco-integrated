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
      teamsApi.middleware
    ),
});

setupListeners(store.dispatch);

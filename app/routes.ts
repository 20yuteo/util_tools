import { type RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/home.tsx"
  },
  {
    path: "/api/cron",
    file: "routes/api.cron.ts"
  }
] satisfies RouteConfig;

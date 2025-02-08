// src/router.ts
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import { Box } from "@chakra-ui/react";
import { Suspense, lazy } from "react";

// 遅延読み込みするコンポーネント
const TaskStepper = lazy(() => import("@/components/layout/TaskStepper"));
const TaskTemplatePage = lazy(
  () => import("@/components/layout/TaskTemplatePage")
);
const ConfigPage = lazy(() => import("../layout/ConfigPage"));

// 共通のルート（ヘッダー付き）
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Box height="70px" />
      <Box height="calc(100vh - 80px)" as="main" px="20px">
        <Outlet />
      </Box>
    </>
  ),
});

// "/" のルート
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskStepper />
    </Suspense>
  ),
});

// "/template" のルート
const templateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/template",
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskTemplatePage />
    </Suspense>
  ),
});

// "/config" のルート
const configRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/config",
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigPage />
    </Suspense>
  ),
});

// ルートツリーの作成
const routeTree = rootRoute.addChildren([
  homeRoute,
  templateRoute,
  configRoute,
]);

// ルーターの作成
export const router = createRouter({
  routeTree,
});

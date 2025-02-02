// src/router.ts
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import TaskStepper from "@/components/layout/TaskStepper";
import TaskTemplatePage from "@/components/layout/TaskTemplatePage";

// 共通のルート（ヘッダー付き）
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});

// "/" のルート
const homeRoute = createRoute({
  getParentRoute: () => rootRoute, // 親ルートを指定
  path: "/",
  component: TaskStepper,
});

// "/template" のルート
const templateRoute = createRoute({
  getParentRoute: () => rootRoute, // 親ルートを指定
  path: "/template",
  component: TaskTemplatePage,
});

// ルートツリーの作成
const routeTree = rootRoute.addChildren([homeRoute, templateRoute]);

// ルーターの作成
export const router = createRouter({
  routeTree,
});

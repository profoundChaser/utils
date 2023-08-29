import {
  createRouter,
  createWebHistory,
  isNavigationFailure,
  RouteRecordRaw,
} from "vue-router";

export const Layout = () => import("@layout/index.vue");

console.log(Layout);
export const constantRouter: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    meta: {
      title: "首页",
    },
    children: [],
  },
];

const router = createRouter({
  routes: constantRouter,
  history: createWebHistory(),
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.afterEach((to, from, failure) => {
document.title = to.meta.title as string
  if (isNavigationFailure(failure)) {
    console.log("failed navigation", failure);
  }
});

export default router;

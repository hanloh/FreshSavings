import App from "../App.vue";
import { createRouter, createWebHistory } from "vue-router";
import CheckOut from "../pages/CheckOut.vue";
import LogIn from "../pages/LogIn.vue";
import SignUp from "../pages/SignUp.vue";
import RecipeGenerator from "../pages/RecipeGenerator.vue";
import InventoryTracker from "../pages/InventoryTracker.vue";
import PageNotFound from "../pages/PageNotFound.vue";
import HomePage from "../pages/HomePage.vue";
import ConfirmationPage from "../pages/ConfirmationPage.vue";
import MarketPlace from "../pages/MarketPlace.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "App",
  //   component: App,
  // },
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/marketplace",
    name: "MarketPlace",
    component: MarketPlace,
  },
  {
    path: "/checkout",
    name: "CheckOut",
    component: CheckOut,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,
    meta: {
      hideNavBar: true,
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      hideNavBar: true,
    },
  },
  {
    path: "/recipe-generator",
    name: "RecipeGenerator",
    component: RecipeGenerator,
  },
  {
    path: "/inventory-tracker",
    name: "InventoryTracker",
    component: InventoryTracker,
    meta: { requiresAuth: true },
  },
  {
    path: "/404-page-not-found",
    name: "PageNotFound",
    component: PageNotFound,
  },
  {
    path: "/confirmation-page",
    name: "ConfirmationPage",
    component: ConfirmationPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const sessionData = JSON.parse(localStorage.getItem("session"));
  console.log("Session Data:", sessionData);

  if (to.matched.some((record) => record.meta.requiresAuth) && !sessionData) {
    console.log(
      "Requires authentication but user not logged in. Redirecting to login."
    );
    next("/login");
  } else {
    console.log(
      "User is authenticated or the route does not require authentication. Proceeding to the next step."
    );
    next();
  }
});

export default router;

import Vue from "vue";
import VueRouter from "vue-router";
import Head_v2 from "@/views/Head_v2.vue";
import Login from "@/views/Login.vue";
import Donor from "@/views/Donor.vue";
import Coordinator from "@/views/Coordinator.vue";
import SocialWorker from "@/views/SocialWorker.vue";
import NotFound from "@/views/404.vue";
import Forbidden from "@/views/403.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/head_v2/:id",
    name: "Head_v2",
    component: Head_v2
  },
  {
    path: "/donor/:id",
    name: "Donor",
    component: Donor
  },
  {
    // path: "/login",
    path: "",
    name: "login",
    component: Login
  },
  {
    path: "/coordinator/:id",
    name: "Coordinator",
    component: Coordinator
  },
  {
    path: "/social_worker/:id",
    name: "SocialWorker",
    component: SocialWorker
  },
  {
    path: "/forbidden",
    name: "403",
    component: Forbidden
  },
  {
    path: "*",
    name: "404",
    component: NotFound
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  let isAuthenticated = sessionStorage.getItem("loggedIn");

  // if (to.name !== "login" && !isAuthenticated) {
  //   next({ path: "/" });
  // } else {
  //   next();
  // }

  // ! really messy route guarding
  if (isAuthenticated) {
    // for all logged in staff
    if (to.name === "login") {
      next();
    }
    // trying to relogin ==> allow
    else if (
      to.name.startsWith(sessionStorage.getItem("loggedInAs")) &&
      (from.name === "login" || from.name === null)
    ) {
      // trying to go to designated route ==> allow
      next();
    } else {
      // trying to visit an undesignated route
      if (to.name === "404") {
        sessionStorage.setItem("loggedInAs", "maliciousinsider");
        next();
      }
      next({ path: "/notfound" });
    }
  } else {
    // if not logged in
    // trying to login ==> allow
    if (to.name === "login") {
      next();
    } else {
      next({ path: "/" });
    }
  }
});

export default router;

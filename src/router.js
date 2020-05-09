import Vue from 'vue'
import Router from 'vue-router'
import Home from './view/Home.vue'
import Login from "./components/auth/Login.vue";
import store from "./data/store.js";
import Team from "./components/team/Team";
import Workflow from "./components/workflow/Workflow";
import Script from "./components/script/Script";
import Workload from "./components/workload/Workload";
import Monitoring from "./components/monitoring/Monitoring";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/teams",
      name: "teams",
      component: Team,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/workflows",
      name: "workflows",
      component: Workflow,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/workloads",
      name: "workloads",
      component: Workload,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/scripts",
      name: "scripts",
      component: Script,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/monitoring",
      name: "monitoring",
      component: Monitoring,
      beforeEnter: ifAuthenticated
    }
  ]
})

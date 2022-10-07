import Main from "./components/main.js";
import Login from "./components/login.js";
import Signup from "./components/signup.js";
import About from "./components/about.js";
import store from "./store.js";

const routes = [
  { path: "/", component: Main },
  { path: "/wiki/:title", component: Main },
  { path: "/login", component: Login, name: "Login" },
  { path: "/signup", component: Signup, name: "Signup" },
  { path: "/about", component: About },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !store.me.id &&
    // ❗️ Avoid an infinite redirect
    !["Login", "Signup"].includes(to.name)
  ) {
    // redirect the user to the login page
    return { name: "Login" };
  }
});

const app = Vue.createApp({
  data() {
    return {};
  },

  methods: {},

  async mounted() {},
});
app.use(router);
app.mount("#app");

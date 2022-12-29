import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomePage,
    // ログインが必要なページは「reqiresAuth」をtrueとする。
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// 画面遷移直前に毎回実行されるナビゲーションガード
router.beforeEach(function (to, from, next) {
  const isLoggedIn = store.state.auth.isLoggedIn;
  const token = localStorage.getItem("access");
  console.log("to.path=", to.path);
  console.log("isLoggedIn=", isLoggedIn);

  // ログインが必要な画面に遷移するとき
  if (
    to.matched.some(function (record) {
      return record.meta.requiresAuth;
    })
  ) {
    // ログインしていないとき
    if (!isLoggedIn) {
      console.log("user is not logged in.");
      // 認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        console.log("try to renew user info.");
        store
          .dispatch("auth/renew")
          .then(function () {
            // 再取得できたら次へリダイレクト
            console.log("succeeded to renew. so, free to next.");
            next();
          })
          .catch(function () {
            // 再取得できなければログイン画面へリダイレクト
            forceToLoginPage(to);
          });
      } else {
        // 認証用トークンが残っていなければログイン画面へリダイレクト
        forceToLoginPage(to);
      }
    } else {
      // ログインしているとき
      console.log("user is already logged in. so, free to next.");
      next();
    }
  } else {
    // ログインが不要な画面に遷移するとき
    console.log("go to public page.");
    next();
  }
});

// ログイン画面へリダイレクト
function forceToLoginPage(to) {
  console.log("force to login page.");
  router.replace({
    path: "/login",
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath },
  });
}

export default router;

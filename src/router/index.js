import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: () => import("../components/Login"),
    },
    {
        path: "/home",
        component: () => import("../components/Home"),
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

//挂载路由导航守卫
router.beforeEach(((to, from, next) => {
    //to 将要访问
    //from 从哪里访问
    //next 放行   next(url) 重定向到url上  next() 继续访问to的路径
    if (to.path === '/login') return next();
    //获取本地存储的user对象
    const userFlag = window.sessionStorage.getItem("user");
    if (!userFlag) return next('/login');   //没有，跳转到登录页面
    next(); //符合要求，放行
}))

export default router   //暴露出去

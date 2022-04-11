import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import UserList from "@/components/users/UserList";
import Roles from "@/components/auth/Roles";
import chart from "@/components/Chart";
import Order from "@/components/Order";
import Rights from "@/components/auth/Rights";
import Goods from "@/components/goods/Goods";
import Params from "@/components/goods/Params";
import Categorie from "@/components/goods/Categorie";

Vue.use(VueRouter)

const routes = [
  {path: '/',redirect: '/login'},
  {path: '/login',component:Login},
  {path: '/home',component:Home,redirect:'/welcome',children:[
      {path: '/welcome',component:Welcome},
      {path: '/users',component:UserList},
      {path: '/roles',component:Roles},
      {path: '/reports',component: chart},
      {path: '/orders',component: Order},
      {path: '/rights',component: Rights},
      {path: '/goods',component: Goods},
      {path: '/params',component: Params},
      {path: '/categories',component: Categorie}
    ]},
]

const router = new VueRouter({
  routes
})
//路由守卫
//验证token; to:去哪里  from来自 next放行
router.beforeEach((to,from,next)=>{
  //登入的时候 放行
  if(to.path=='/login'){
    next();
    //判断token是否有值
  }else if(sessionStorage.getItem('token')==null){
    next({path:'/login'})
  }else{
    //下一步
    next();
  }
})

export default router

//电话验证


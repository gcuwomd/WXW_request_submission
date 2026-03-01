import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import MemberLayout from '@/components/layout/MemberLayout.vue';
import LoginCallback from '@/views/login/LoginCallback.vue';

// 引入你原来的路由模块 (假设你把它们作为子路由)
import adminRoutes from './admin'; 
import memberRoutes from './member'; 

// 定义基础路由
const routes = [
  {
    path: '/login/callback',
    name: 'LoginCallback',
    component: LoginCallback,
    meta: { public: true } // 标记为公开访问
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { role: 'admin' }, // 需要管理员权限
    children: adminRoutes // 你的 admin.js 导出应该是数组
  },
  {
    path: '/member',
    component: MemberLayout,
    meta: { role: 'officer' }, // 需要干事权限
    children: memberRoutes // 你的 member.js 导出应该是数组
  },
  {
    path: '/',
    name: 'Root',
    redirect: (to) => {
       // 根路径重定向逻辑交给 beforeEach 或者在这里读取 store
       const store = useUserStore()
       if (store.role === 'admin') return '/admin/TaskList' // 假设 admin 有个 dashboard
       if (store.role === 'officer') return '/member/MemberTaskList' // 假设 member 首页是任务列表
       return '/login/callback' // 没登录就去登录流程
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局前置守卫 (核心 SSO 逻辑)
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const token = userStore.token;

  // 1. 如果去的是公开页面 (如登录回调页)，直接放行
  if (to.meta.public) {
    next();
    return;
  }

  // 2. 如果没有 Token，强制跳转到学校 SSO
  if (!token) {
    // 构造回调地址：当前域名的 /login/callback 页面
    const callbackUrl = encodeURIComponent(window.location.origin + '/login/callback');
    // 跳转学校认证
    window.location.href = `https://auth.gcu.edu.cn/application/oauth/redirect?client_id=123456&callbackUrl=&redirect_uri=${callbackUrl}`;
    return;
  }

  // 3. 权限判断
  // 如果要去管理员页面，但角色不是 admin
  if (to.path.startsWith('/admin') && userStore.role !== 'admin') {
    next('/member'); // 踢回干事页
    return;
  }
  
  // 如果要去干事页面，但角色是 admin (看需求，管理员能不能看干事页？一般可以，或者踢回 admin)
  // 这里假设严格隔离
  if (to.path.startsWith('/member') && userStore.role !== 'officer') {
    next('/admin'); 
    return;
  }

  next();
});

export default router;
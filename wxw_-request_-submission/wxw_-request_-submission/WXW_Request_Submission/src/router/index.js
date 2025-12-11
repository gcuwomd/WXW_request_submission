import { createRouter, createWebHistory } from 'vue-router';
import admin from './admin';
import member from './member';

const BaseRoutes = [];
const routes = BaseRoutes.concat(admin, member);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

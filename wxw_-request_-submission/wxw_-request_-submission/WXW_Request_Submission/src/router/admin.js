// src/router/admin.js
import TaskList from '@/views/admin/TaskList.vue';
import AdminUse from '@/views/admin/AdminUse.vue';
import Detail from '@/views/admin/Detail.vue'; // 引入独立的详情页面

const admin = [
  {
    path: 'TaskList',
    component: TaskList,
  },
  {
    path: 'AdminUse',
    component: AdminUse,
  },
  {
    path: 'TaskDetail', // 新增：管理员任务详情路由
    name: 'AdminTaskDetail',
    component: Detail,
  }
];

export default admin;
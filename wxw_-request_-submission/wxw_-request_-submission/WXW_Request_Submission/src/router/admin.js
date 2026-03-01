// 管理员路由
import TaskList from '@/views/admin/TaskList.vue';
import AdminUse from '@/views/admin/AdminUse.vue';

const admin = [
  {
    path: 'TaskList',
    component: TaskList,
  },
  {
    path: 'AdminUse',
    component: AdminUse,
  },
];

export default admin;

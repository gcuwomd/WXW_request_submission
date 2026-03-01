// src/router/member.js
import MemberUse from '@/views/member/MemberUse.vue'
import TaskList from '@/views/member/TaskList.vue'
import TaskDetail from '@/views/member/TaskDetail.vue' // 引入独立的详情页面

const member = [
  {
    path: 'MemberUse',
    component: MemberUse,
  },
  {
    path: 'MemberTaskList',
    component: TaskList,
  },
  {
    path: 'TaskDetail', // 新增：干事任务详情路由
    name: 'MemberTaskDetail',
    component: TaskDetail,
  }
];

export default member;
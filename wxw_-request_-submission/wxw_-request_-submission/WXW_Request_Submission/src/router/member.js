// 干事路由
import MemberUse from '@/views/member/MemberUse.vue'
import TaskList from '@/views/member/TaskList.vue'

const member = [
  {
    path: '/MemberUse',
    component: MemberUse,
  },
  {
    path: '/MemberTaskList',
    component: TaskList,
  },
];

export default member;
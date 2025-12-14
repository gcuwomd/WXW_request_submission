import axios from 'axios'

const request = axios.create({
  baseURL: '', // 根据 vite 代理配置
  timeout: 5000
})

// 1. 获取主任务列表 (管理员首页)
// 接口: GET /api/administrator/get/allMain
export const fetchMainTasks = (params = { page: 1, pageSize: 100 }) => {
  return request({
    url: '/api/administrator/get/allMain',
    method: 'get',
    params
  })
}

// 2. 根据主任务ID获取其下的所有子任务 (分配页面用)
// 接口: GET /api/administrator/get/allSonTask
export const fetchSubTasks = (mainTaskId) => {
  return request({
    url: '/api/administrator/get/allSonTask',
    method: 'get',
    params: { mainTaskId }
  })
}

// 3. 发布(创建)子任务
// 接口: POST /api/administrator/post/sonTask
export const createSubTask = (data) => {
  return request({
    url: '/api/administrator/post/sonTask',
    method: 'post',
    data // 注意：文档显示 body 参数，所以用 data
  })
}

// 4. 删除子任务
// 接口: DELETE /api/administrator/post/deleteSonTask
export const deleteSubTask = (sonTaskId) => {
  return request({
    url: '/api/administrator/post/deleteSonTask',
    method: 'delete',
    params: { sonTaskId }
  })
}

// 5. 修改子任务状态 (审核：通过/打回)
// 接口: POST /api/administrator/update/sonStatus
// status: 2-已完成(通过), 3-已打回
export const auditSubTask = (sonTaskId, status) => {
  return request({
    url: '/api/administrator/update/sonStatus',
    method: 'post',
    params: { sonTaskId, status }
  })
}

// 6. 获取所有干事列表 (用于下拉框选择)
// 接口: GET /api/administrator/get/allUser
export const fetchAllOfficers = () => {
  return request({
    url: '/api/administrator/get/allUser',
    method: 'get',
    params: { departmentId: 1 } // 假设默认获取某部门，或者根据登录人信息动态传
  })
}

// 7. 修改主任务状态 (例如：子任务都做完了，手动把主任务改为已完成)
// 接口: POST /api/administrator/update/mainStatus
export const updateMainStatus = (mainTaskId, status) => {
  return request({
    url: '/api/administrator/update/mainStatus',
    method: 'post',
    params: { mainTaskId, status }
  })
}
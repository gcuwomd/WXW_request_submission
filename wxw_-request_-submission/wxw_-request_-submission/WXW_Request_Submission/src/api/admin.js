// gcuwomd/wxw_request_submission/WXW_request_submission-e4248e0335afb39faeb0a9f495e1e51a333ef66f/wxw_-request_-submission/wxw_-request_-submission/WXW_Request_Submission/src/api/admin.js

import request from '@/utils/request' // 引入封装好的 request

// 1. 获取主任务列表
export const fetchMainTasks = (params = { page: 1, pageSize: 100 }) => {
  return request({
    url: '/check/api/administrator/get/allMain', // 添加 /check
    method: 'get',
    params
  })
}

// 2. 根据主任务ID获取子任务
export const fetchSubTasks = (mainTaskId) => {
  return request({
    url: '/check/api/administrator/get/allSonTask', // 添加 /check
    method: 'get',
    params: { mainTaskId }
  })
}

// 3. 发布子任务
export const createSubTask = (data) => {
  return request({
    url: '/check/api/administrator/post/sonTask', // 添加 /check
    method: 'post',
    data
  })
}

// 4. 删除子任务
export const deleteSubTask = (sonTaskId) => {
  return request({
    url: '/check/api/administrator/post/deleteSonTask', // 添加 /check
    method: 'delete',
    params: { sonTaskId }
  })
}

// 5. 审核子任务 (通过/打回)
export const auditSubTask = (sonTaskId, status) => {
  return request({
    url: '/check/api/administrator/update/sonStatus', // 添加 /check
    method: 'post',
    params: { sonTaskId, status }
  })
}

// 6. 获取所有干事
export const fetchAllOfficers = () => {
  return request({
    url: '/check/api/administrator/get/allUser', // 添加 /check
    method: 'get',
    params: { departmentId: 1 }
  })
}

// 7. 修改主任务状态
export const updateMainStatus = (mainTaskId, status) => {
  return request({
    url: '/check/api/administrator/update/mainStatus', // 添加 /check
    method: 'post',
    params: { mainTaskId, status }
  })
}
// src/api/admin.js
import request from '@/utils/request' 

// 获取当前登录用户信息
export const fetchUserInfo = () => {
  return request({
    url: '/permission/user/information',
    method: 'get'
  })
}

// 1. 获取主任务列表
export const fetchMainTasks = (params = { page: 1, pageSize: 100 }) => {
  return request({
    url: '/check/api/administrator/get/allMain',
    method: 'get',
    params
  })
}

// 2. 根据主任务ID获取子任务
export const fetchSubTasks = (mainTaskId) => {
  return request({
    url: '/check/api/administrator/get/allSonTask',
    method: 'get',
    params: { mainTaskId }
  })
}

// 3. 发布子任务
export const createSubTask = (data) => {
  return request({
    url: '/check/api/administrator/post/sonTask',
    method: 'post',
    data
  })
}

// 4. 删除子任务
export const deleteSubTask = (sonTaskId) => {
  return request({
    url: '/check/api/administrator/post/deleteSonTask',
    method: 'delete',
    params: { sonTaskId }
  })
}

// 5. 审核子任务 (通过/打回)
export const auditSubTask = (sonTaskId, status) => {
  return request({
    url: '/check/api/administrator/update/sonStatus',
    method: 'post',
    params: { sonTaskId, status }
  })
}

// 6. 获取所有干事
export const fetchAllOfficers = (departmentId) => {
  return request({
    url: '/check/api/administrator/get/allUser',
    method: 'get',
    params: { departmentId }
  })
}

// 7. 修改主任务状态
export const updateMainStatus = (mainTaskId, status) => {
  return request({
    url: '/check/api/administrator/update/mainStatus',
    method: 'post',
    params: { mainTaskId, status }
  })
}

// 8. 根据id获取主任务需求
export const fetchMainRequirement = (mainTaskId) => {
  return request({
    url: '/check/api/administrator/get/mainRequirement',
    method: 'get',
    params: { mainTaskId }
  })
}

// 9. 管理员获取干事回复附件列表
export const fetchReplyAttachments = (breakdownId) => {
  return request({
    url: '/check/api/administrator/get/ReplyAnnexList',
    method: 'get',
    params: { breakdownId }
  })
}

// 10. 管理员下载干事回复附件
export const downloadReplyAttachment = (objectName, localPath) => {
  return request({
    url: '/check/api/administrator/download/ReplyAnnex',
    method: 'get',
    params: { objectName, localPath },
    responseType: 'blob' 
  })
}

// 11. 根据干事姓名查询主任务
export const fetchMainTasksByOfficial = (Official) => {
  return request({
    url: '/check/api/administrator/get/mainTaskByOfficial',
    method: 'get',
    params: { Official }
  })
}

// 12. 根据任务名称查询主任务基础信息 ---
export const fetchMainTaskByName = (mainTaskName) => {
  return request({
    url: '/check/api/administrator/get/mainTaskByName',
    method: 'get',
    params: { mainTaskName }
  })
}
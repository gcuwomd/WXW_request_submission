// src/api/member.js
import request from '@/utils/request' 

// 1. 获取干事任务列表
export const fetchMemberTasks = (officerName) => {
  return request({
    url: '/check/api/officer/get/myTasks',
    method: 'get',
    params: { officerAddress: officerName }
  })
}

// 2. 查看任务附件列表 (后端下发的附件)
export const fetchTaskAttachments = (breakdownId) => {
  return request({
    url: '/check/api/officer/get/AnnexList', 
    method: 'get',
    params: { breakdownId }
  })
}

// 3. 下载任务附件
export const downloadTaskAttachment = (objectName, localPath) => {
  return request({
    url: '/check/api/officer/download/Annex',
    method: 'get',
    params: { objectName, localPath },
    responseType: 'blob' // 下载文件需注明 blob
  })
}

// 4. 提交任务/修改状态
export const updateTaskStatus = (breakdownId, status) => {
  return request({
    url: '/check/api/officer/post/sonStatus',
    method: 'post',
    params: { breakdownId, status }
  })
}

// 5. 干事查看回复附件列表 (自己上传的)
export const fetchReplyAttachments = (breakdownId) => {
  return request({
    url: '/check/api/officer/get/ReplyAnnexList',
    method: 'get',
    params: { breakdownId }
  })
}

// 6. 干事下载回复附件
export const downloadReplyAttachment = (objectName, localPath) => {
  return request({
    url: '/check/api/officer/download/ReplyAnnex',
    method: 'get',
    params: { objectName, localPath },
    responseType: 'blob'
  })
}

// 7. 上传地址 (用于 el-upload action)
// 注意：该请求不经过axios，需要在el-upload中配置headers携带token
export const uploadUrl = '/check/api/officer/add/Annexs'
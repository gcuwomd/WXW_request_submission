// gcuwomd/wxw_request_submission/WXW_request_submission-e4248e0335afb39faeb0a9f495e1e51a333ef66f/wxw_-request_-submission/wxw_-request_-submission/WXW_Request_Submission/src/api/member.js

import request from '@/utils/request' // 引入封装好的 request

// 1. 获取干事任务列表
export const fetchMemberTasks = (officerName) => {
  return request({
    url: '/check/api/officer/get/myTasks', // 添加 /check
    method: 'get',
    params: { officerAddress: officerName }
  })
}

// 2. 查看附件列表
export const fetchTaskAttachments = (breakdownId) => {
  return request({
    url: '/check/api/officer/get/AnnexList', // 添加 /check (注意文档里有个 typo "checkl"，这里修正为 check)
    method: 'get',
    params: { breakdownId }
  })
}

// 3. 提交任务/修改状态
export const updateTaskStatus = (breakdownId, status) => {
  return request({
    url: '/check/api/officer/post/sonStatus', // 添加 /check
    method: 'post',
    params: { 
      breakdownId: breakdownId,
      status: status 
    }
  })
}

// 4. 上传地址 (用于 el-upload action)
// 注意：el-upload 组件会自动请求这个地址，它默认不会经过 axios 拦截器！
// 所以你需要在 el-upload 组件里手动添加 :headers="{ Authorization: 'Bearer ' + token }"
export const uploadUrl = '/check/api/officer/add/Annexs'
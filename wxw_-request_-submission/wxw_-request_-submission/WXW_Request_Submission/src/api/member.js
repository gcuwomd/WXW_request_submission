import axios from 'axios'

// 配置基础路径，如果在 vite.config.js 中配置了代理，这里可以是空字符串或者 '/api'
// 假设 vite 配置了代理 /api -> 后端地址
const request = axios.create({
  baseURL: '', // 根据你的 vite 代理配置调整，通常保持为空让代理处理
  timeout: 5000
})

// 1. 获取干事被分配的任务列表
// 对应接口: GET /api/officer/get/myTasks
export const fetchMemberTasks = (officerName) => {
  return request({
    url: '/api/officer/get/myTasks',
    method: 'get',
    params: { officerAddress: officerName } // 文档参数名为 officerAddress，实际含义为干事姓名
  })
}

// 2. 干事查看任务附件列表
// 对应接口: GET /api/officer/get/AnnexList
export const fetchTaskAttachments = (breakdownId) => {
  return request({
    url: '/api/officer/get/AnnexList',
    method: 'get',
    params: { breakdownId }
  })
}

// 3. 干事修改任务状态 (提交任务)
// 对应接口: POST /api/officer/post/sonStatus
export const updateTaskStatus = (breakdownId, status) => {
  return request({
    url: '/api/officer/post/sonStatus',
    method: 'post',
    // 文档显示这两个参数是 query 参数，所以用 params
    params: { 
      breakdownId: breakdownId,
      status: status 
    }
  })
}

// 4. 附件上传地址 (用于 el-upload 组件的 action 属性)
export const uploadUrl = '/api/officer/add/Annexs'
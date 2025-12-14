//axios 封装
// gcuwomd/wxw_request_submission/WXW_request_submission-e4248e0335afb39faeb0a9f495e1e51a333ef66f/wxw_-request_-submission/wxw_-request_-submission/WXW_Request_Submission/src/utils/request.js

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  // 注意：这里不要写具体的 baseURL，依靠 vite 代理转发
  baseURL: '', 
  timeout: 10000 // 请求超时时间
})

// Request 拦截器
service.interceptors.request.use(
  (config) => {
    // 假设登录成功后，token 存储在 localStorage 中，键名为 'token'
    // 如果你存的名字不一样（比如 'access_token'），请在这里修改
    const token = localStorage.getItem('token') 
    
    if (token) {
      // 按照微服务规范，通常是 Authorization: Bearer <token>
      // 也有部分后端直接用 token: <token>，请根据你们后端要求调整，这里按标准 Bearer 写法
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 拦截器
service.interceptors.response.use(
  (response) => {
    // 假设后端返回的数据结构是 { code: 0, data: ..., message: ... }
    const res = response.data
    
    // 如果后端约定 code !== 0 (或200) 为错误，可以在这里统一处理
    // 这里的判断条件请根据接口文档调整
    if (res.code !== 0 && res.code !== 200) {
        ElMessage.error(res.message || '系统错误')
        
        // 如果是 401 或 403 (无权限)，可以强制登出或跳转登录页
        if (res.code === 401 || res.code === 403) {
            // 清除 token 并跳转登录
            localStorage.removeItem('token')
            // router.push('/login') // 需要引入 router
        }
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        return res
    }
  },
  (error) => {
    console.error('err' + error)
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
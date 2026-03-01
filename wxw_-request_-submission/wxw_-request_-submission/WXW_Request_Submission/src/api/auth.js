import request from '@/utils/request'

// 登录接口
export const login = (code) => {
  // 1. 强制清除旧 Token，防止干扰登录
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('role')

  return request({
    url: '/login', // 登录接口
    method: 'post',
    data: {
      code: code
    }
  })
}

// 获取用户信息接口
export const getUserInfo = () => {
  return request({
    url: '/permission/user/information',
    method: 'get'
  })
}
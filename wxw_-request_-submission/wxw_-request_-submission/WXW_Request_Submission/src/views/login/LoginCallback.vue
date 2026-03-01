<template>
  <div class="callback-container">
    <div class="loading-box">
      <h2>正在进行身份认证...</h2>
      <p>请稍候，正在跳转至系统</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login, getUserInfo } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  // 1. 获取 URL 中的 code 参数
  const code = route.query.code

  if (!code) {
    ElMessage.error('未检测到认证授权码，请重新登录')
    setTimeout(() => {
        // 如果没有 code，重新去 SSO
        window.location.href = 'https://auth.gcu.edu.cn/application/oauth/redirect?client_id=123456&callbackUrl=&redirect_uri=' + encodeURIComponent(window.location.origin + '/login/callback')
    }, 2000)
    return
  }

  try {
    // 2. 调用后端登录接口
    const res = await login(code)
    
    // 假设后端返回结构: { code: 200, data: "JWT_STRING...", message: "..." }
    const token = res.data 
    
    if (!token) throw new Error('Token 获取失败')

    // 3. 解析 Token 获取 UserID
    // 后端 Token Payload: "sub": "{\"id\":\"202410098042\", ...}"
    const decoded = jwtDecode(token)
    
    let userId = ''
    try {
        // 解析 sub 字段中的 JSON 字符串
        const subObj = JSON.parse(decoded.sub)
        userId = subObj.id
    } catch (e) {
        console.error('Token sub 解析失败', e)
        userId = decoded.sub // 兜底
    }

    // 4. 先存入临时 Token 以便请求用户信息拦截器可以带上
    localStorage.setItem('token', token)

    // 5. 请求用户信息接口，获取权限角色
    const userInfoRes = await getUserInfo()
    if (!userInfoRes.data) {
      throw new Error('未获取到用户信息')
    }

    // 获取 roleId（1 是干事，2 是管理员）
    const roleId = userInfoRes.data.roleId
    let role = ''
    if (roleId === 2) {
      role = 'admin'
    } else if (roleId === 1) {
      role = 'officer'
    } else {
      role = 'officer' // 默认或兜底为干事
    }

    // 6. 存入完整的用户信息到 Pinia
    userStore.setUserHost(token, userId, role)

    ElMessage.success(`欢迎回来，${userInfoRes.data.username || userId}`)

    // 7. 跳转首页 (路由守卫会根据角色再次分发)
    router.push('/')

  } catch (error) {
    console.error(error)
    
    // 如果是 401 或 code 无效，重新跳转认证
    if (error.response && error.response.status === 401) {
       ElMessage.warning('认证已过期，正在重新跳转...')
       setTimeout(() => {
           // 清除当前 URL 里的 code 参数，避免死循环
           const cleanUrl = window.location.origin + '/login/callback'
           window.location.href = 'https://auth.gcu.edu.cn/application/oauth/redirect?client_id=123456&callbackUrl=&redirect_uri=' + encodeURIComponent(cleanUrl)
       }, 1500)
       return
    }

    ElMessage.error('登录失败：' + (error.message || '未知错误'))
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.loading-box {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
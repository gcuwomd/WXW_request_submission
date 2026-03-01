import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('userId') || '')
  const role = ref(localStorage.getItem('role') || '') // admin 或 officer

  // 设置用户信息
  function setUserHost(newToken, newId, newRole) {
    token.value = newToken
    userId.value = newId
    role.value = newRole

    localStorage.setItem('token', newToken)
    localStorage.setItem('userId', newId)
    localStorage.setItem('role', newRole)
  }

  // 登出/清除信息
  function logout() {
    token.value = ''
    userId.value = ''
    role.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
  }

  return { token, userId, role, setUserHost, logout }
})
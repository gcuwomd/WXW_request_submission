// 管理员相关接口
import axios from 'axios'

// 获取管理员任务列表（主任务）
export const fetchMainTasks = () => {
  return axios.get('/api/mainTask')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error fetching main tasks:', error)
      throw error
    })
}

export const fetchDetail = () => {
  return axios.get('/api/Detail')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error fetching main tasks:', error)
      throw error
    })
}
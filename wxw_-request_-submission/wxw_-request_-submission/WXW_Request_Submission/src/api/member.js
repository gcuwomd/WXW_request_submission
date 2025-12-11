//干事相关接口
import axios from 'axios'

// 获取干事任务列表
export const fetchMemberTasks = () => {
  return axios.get('/api/task')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error fetching member tasks:', error)
      throw error
    })
}
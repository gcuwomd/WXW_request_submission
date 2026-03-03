<template>
  <div class="common-layout">
    <el-container>
      <el-header style="display: flex; justify-content: space-between; align-items: center; background-color: rgb(43, 43, 43); color: white; height: 60px;">
        <div style="display: flex; align-items: center;">
          <img src="http://43.139.169.119:3640/assets/wxw-B19cp2E8.png" alt="" style="width: 50px; height: 50px;">
          <p style="font-size: 15px; margin-left: 10px; margin-bottom: 0;"> 学生网络与信息工作委员会需求处理管理系统</p>
        </div>
        
        <div style="display: flex; align-items: center; margin-right: 20px;">
          <el-popover
            placement="bottom-end"
            title="当前登录信息"
            :width="200"
            trigger="hover"
          >
            <div class="user-info-box">
              <p><strong>姓名：</strong>{{ userInfo.username || '管理员' }}</p>
              <p><strong>角色：</strong>系统管理员</p>
              <p v-if="userInfo.departmentId"><strong>部门号：</strong>{{ userInfo.departmentId }}</p>
              </div>
            
            <template #reference>
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-avatar :size="32" :icon="UserFilled" style="margin-right: 10px;" />
                <span style="font-size: 15px;">你好，{{ userInfo.username || '管理员' }}</span>
              </div>
            </template>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <el-row class="tac" style="width: 200px;">
          <el-aside style="width: 400px; ">
            <el-col :span="12">
              <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <RouterLink to="/admin/TaskList">
                  <el-menu-item index="1">
                    <template #title>
                      <el-icon>
                        <ChatDotSquare />
                      </el-icon>
                      <span>任务列表</span>
                    </template>
                  </el-menu-item>
                </RouterLink>
                <RouterLink to="/admin/AdminUse">
                  <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>使用说明</span>
                  </el-menu-item>
                </RouterLink>
              </el-menu>
            </el-col>
          </el-aside>
        </el-row>
        
        <RouterView />
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ChatDotSquare, Menu as IconMenu, UserFilled } from '@element-plus/icons-vue' 
import { fetchUserInfo } from '@/api/admin' 

const userInfo = ref<any>({})

onMounted(async () => {
  try {
    const res = await fetchUserInfo()
    if (res.data) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

/* 悬浮框内容样式 */
.user-info-box p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}
</style>
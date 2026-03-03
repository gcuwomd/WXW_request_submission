<template>
  <div class="common-layout">
    <el-container>
      <el-header style="display: flex; justify-content: space-between; align-items: center; background-color: rgb(43, 43, 43); color: white; height: 60px;">
        <div style="display: flex; align-items: center;">
          <img src="http://43.139.169.119:3640/assets/wxw-B19cp2E8.png" alt="" style="width: 50px; height: 50px;">
          <p style="font-size: 15px; margin-left: 10px; margin-bottom: 0;"> 学生网络与信息工作委员会需求处理干事系统</p>
        </div>

        <div style="display: flex; align-items: center; margin-right: 20px;">
          <el-popover
            placement="bottom-end"
            title="个人信息"
            :width="200"
            trigger="hover"
          >
            <div class="user-info-box">
              <p><strong>姓名：</strong>{{ userInfo.username || '干事' }}</p>
              <p><strong>角色：</strong>普通干事</p>
              <p v-if="userInfo.departmentId"><strong>部门号：</strong>{{ userInfo.departmentId }}</p>
            </div>
            
            <template #reference>
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-avatar :size="32" :icon="UserFilled" style="margin-right: 10px; " />
                <span style="font-size: 15px;">你好，{{ userInfo.username || '干事' }}</span>
              </div>
            </template>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <el-row class="tac" style="width: 200px;">
          <el-aside style="width: 400px;">
            <el-col :span="12">
              <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <router-link to="/member/MemberTaskList">
                  <el-menu-item index="1">
                    <template #title>
                      <el-icon>
                        <ChatDotSquare />
                      </el-icon>
                      <span>任务列表</span>
                    </template>
                  </el-menu-item>
                </router-link>
                <router-link to="/member/MemberUse">
                  <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>使用说明</span>
                  </el-menu-item>
                </router-link>
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
import { ref, onMounted } from 'vue'
import { Menu as IconMenu, ChatDotSquare, UserFilled } from '@element-plus/icons-vue'
import { fetchUserInfo } from '@/api/member' 

// 改用对象存储，方便展示更多字段
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
body {
  padding: 0;
  margin: 0;
}

.el-header {
  background-color: rgb(43, 43, 43);
  color: white;
  height: 60px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
}

.main {
  background-size: 1200px;
  background-color: rgba(240, 248, 255);
  background-position: center;
  height: 100vh;
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

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
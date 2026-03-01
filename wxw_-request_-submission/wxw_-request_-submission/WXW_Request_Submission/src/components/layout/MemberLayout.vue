// 干事布局组件
<template>
  <div class="common-layout">
    <!-- 头部 -->
    <el-container>
      <el-header>
        <img src="http://43.139.169.119:3640/assets/wxw-B19cp2E8.png" alt="" style="width: 50px; height: 50px; margin-top: 10px;">
        <p class="mb-10px" style="color: rgb(255, 255, 255); font-size: 15px; align-self: end;"> 学生网络与信息工作委员会需求处理干事系统
        </p>
      </el-header>
      <el-container>

        <!-- 侧边栏 -->
        
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
        

        <!-- 主内容区域 -->
          <RouterView />
        
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>


import {
  Menu as IconMenu,
  ChatDotSquare,
} from '@element-plus/icons-vue'

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
  color: black;
  height: 60px;
  display: flex;
  align-items: space-between;
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
</style>

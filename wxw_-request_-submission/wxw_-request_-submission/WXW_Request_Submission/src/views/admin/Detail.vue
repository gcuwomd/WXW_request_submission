<!-- Detail.vue -->
<template>
  <div class="common-layout">
    <el-container class="float-window">
      <el-main class="float-window-content">
        <div class="content-wrapper">
          <h2 style="margin: 0 auto;">{{ detailData?.taskName || '干事任务' }}</h2>
          <p style="margin-left: 90px;">干事名称：{{ detailData?.name || '暂无名称' }}</p>
          <p style="margin-left: 90px;">任务截止时间：{{ detailData?.dataLine || '暂无截止时间' }}</p>
          <p style="margin-left: 90px;">任务状态：{{ detailData?.tag || '暂无状态' }}</p>
          <p style="margin-left: 90px;">任务完成证明附件:</p>
          <div class="att">
            {{ detailData?.requirement || '暂无附件内容' }}
          </div>
        </div>
        <img src="/wxw.svg">
        <div style="display: flex; justify-content: space-around;">
          <el-button type="primary" v-if="detailData?.tag == '待审核'" @click="open2">通过</el-button>
          <el-popconfirm width="220" :icon="InfoFilled" icon-color="#626AEF" title="你确实要打回该任务吗？"
            @cancel="onCancel" v-if="detailData?.tag == '待审核'">
            <template #reference>
              <el-button  type="danger">打回</el-button>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel" >返回</el-button>
              <el-button type="danger" size="small" @click="confirm(),open3()">
                确认
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <div class="bottom-button-container">
          <el-button type="primary" @click="close">关闭</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
// 定义 props 接口
interface DetailData {
  CreateDate?: string
  name?: string
  tag?: string
  dataLine?: string
  requirement?: string
  taskName?: string
}

// 接收来自 AssignTask 的数据
const props = defineProps<{
  detailData?: DetailData
}>()

// 关闭按钮
const emit = defineEmits(['close']);
const close = () => {
  emit('close');
};

const open2 = () => {
  ElMessage({
    message: '您已经通过该任务',
    type: 'success',
  })
}

const open3 = () => {
ElMessage.error('您已经打回该任务')
}

</script>

<style scoped>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}

.common-layout {
  position: static;
}

.float-window {
  position: fixed;
  width: 60%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.float-window-content {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
}

.flex {
  display: fixed;
  width: 100%;
  height: 100%;
}

.bottom-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.att {
  height: 20%;
  width: 80%;
  border: solid 1px #242424;
  margin: 0 auto;
  padding: 10px;
  overflow: auto;
}

.float-window-content img {
  height: 40%;
  width: 30%;
  position: absolute;
  right: 100px;
  top: 100px;
}
</style>
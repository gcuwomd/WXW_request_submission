<template>
    <div class="common-layout">
        <el-container class="float-window">
            <el-main class="float-window-content">
                <div class="content-wrapper">
                    <div class="left">
                        <p class="text">任务ID: {{ taskData?.id || '暂未分配ID' }}</p>
                        <p class="text">任务名称: {{ taskData?.taskName }}</p>
                        <div class="need">
                            <p class="text" style="margin: 0;">任务需求：</p>
                            <div class="need-box">{{ taskData?.requirement || '暂无需求描述' }}</div>
                        </div>
                        <div class="need">
                            <p class="text" style="margin: 10px 0;">相关附件：</p>
                            <div class="need-box" style="margin-top: 10px;">{{ taskData?.attachments }}</div>
                        </div>
                        <p class="text">要求时间: {{ taskData?.deadline }}</p>
                        <p class="text">发布者: {{ taskData?.adminer }}</p>
                        <p class="text">当前状态: {{ taskData?.tag }}</p>
                    </div>
                    
                    <div class="right" v-if="taskData?.tag === '进行中' || taskData?.tag === '被打回'">
                        
                        <div v-if="taskData?.tag === '被打回'" style="background-color: #fef0f0; border: 1px solid #fbc4c4; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                            <el-alert title="任务被打回" type="error" description="请修改后重新提交" :closable="false" show-icon />
                        </div>

                        <p class="text">任务状态进度：</p>
                        <el-steps style="max-width: 600px; margin-bottom: 20px;" :active="taskData?.tag === '被打回' ? 0 : 1" align-center>
                            <el-step title="进行中" />
                            <el-step title="待审核" />
                            <el-step title="已完成" />
                        </el-steps>

                        <p class="text">上传完成证明附件：</p>
                        <el-upload 
                            class="upload-demo" 
                            drag
                            :action="uploadAction"
                            :data="{ breakdownId: taskData?.id }"
                            name="files" 
                            :on-success="handleUploadSuccess"
                            :on-error="handleUploadError"
                            multiple>
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                               拖拽文件到此处或 <em>点击上传</em>
                            </div>
                        </el-upload>

                        <div style="text-align: center; margin-top: 30px;">
                            <el-button 
                                type="primary" 
                                @click="submitTask" 
                                :loading="isSubmitting"
                                size="large">
                                {{ taskData?.tag === '被打回' ? '重新提交' : '提交任务' }}
                            </el-button>
                        </div>
                    </div>

                    <div class="right" v-else-if="taskData?.tag === '待审核'" style="display: flex;flex-direction: column; align-items: center;justify-content: center;">
                        <p class="text"><strong>任务已提交，等待审核</strong></p>
                        <el-steps style="max-width: 800px; margin-top: 20px;" :active="2" align-center>
                            <el-step title="进行中" />
                            <el-step title="待审核" />
                            <el-step title="已完成" />
                        </el-steps>
                        <div style="margin-top: 30px; text-align: center;">
                            <p class="text">请耐心等待管理员审核。</p>
                        </div>
                    </div>

                    <div class="right" v-else-if="taskData?.tag === '已完成'" style="display: flex;justify-content: center; flex-direction: column; align-items: center;">
                        <img src="/image/finsh.png" alt="完成" style="width: 80%;">
                        <h2 style="margin-top: 20px; color: #67C23A;"><strong>任务已完成</strong></h2>
                    </div>
                </div>

                <div class="bottom-button-container">
                    <el-button @click="close">关闭窗口</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { updateTaskStatus, uploadUrl } from '../../api/member'

const props = defineProps<{
  taskData?: any
}>()

const emit = defineEmits(['close', 'taskUpdated'])
const isSubmitting = ref(false)
const uploadAction = uploadUrl // 绑定上传接口地址

const close = () => {
    emit('close')
}

// 上传成功回调
const handleUploadSuccess = (response) => {
    // 假设后端返回 code=200 或 code=0 为成功
    if (response.code === 200 || response.code === 0) {
        ElMessage.success('附件上传成功')
    } else {
        ElMessage.warning('上传可能有误: ' + response.message)
    }
}

const handleUploadError = () => {
    ElMessage.error('网络错误，附件上传失败')
}

// 提交任务 (修改状态)
const submitTask = async () => {
    if (!props.taskData?.id) {
        ElMessage.error('无法获取任务ID')
        return
    }

    isSubmitting.value = true
    try {
        // 调用接口将状态改为 "待审核"
        // 假设后端状态码约定: 1 代表 '待审核'
        await updateTaskStatus(props.taskData.id, 1)
        
        ElMessage.success('提交成功，请等待管理员审核')
        emit('taskUpdated') // 通知父组件刷新列表
        emit('close')       // 关闭弹窗
    } catch (error) {
        console.error(error)
        ElMessage.error('提交失败，请重试')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.common-layout {
    position: static;
}

.float-window {
    position: fixed;
    width: 65%;
    height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2000;
}

.float-window-content {
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content-wrapper {
    display: flex;
    justify-content: space-between;
    flex: 1;
    overflow-y: auto;
}

.left {
    width: 45%;
    border-right: 1px solid #eee;
    padding-right: 20px;
}

.right {
    width: 50%;
    padding-left: 20px;
}

.bottom-button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eaeaea;
}

.need-box {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #fafafa;
    min-height: 60px;
    margin-top: 5px;
}

.text {
    margin: 10px 0;
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
}
</style>
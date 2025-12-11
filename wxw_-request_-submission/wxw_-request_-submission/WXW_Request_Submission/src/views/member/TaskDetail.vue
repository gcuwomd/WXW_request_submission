<!-- 任务详情 -->
<template>
    <div class="common-layout">
        <el-container class="float-window">
            <el-main class="float-window-content">
                <div class="content-wrapper">
                    <div class="left">
                        <p class="text">工单ID: {{ taskData?.id || '暂未分配工单ID' }}</p>
                        <p class="text">任务名称: {{ taskData?.taskName || '暂未分配任务名称' }}</p>
                        <div class="need">
                            <p class="text" style="margin: 0;">任务需求：</p>
                            <div class="need-box">{{ taskData?.requirement || '暂无需求描述' }}</div>
                        </div>
                        <div class="need">
                            <p class="text" style="margin: 10px 0;">相关附件：</p>
                            <div class="need-box" style="margin-top: 10px;">{{ taskData?.attachments || '暂无附件' }}</div>
                        </div>
                        <p class="text">要求时间: {{ taskData?.date || '暂未分配要求时间' }}</p>
                        <p class="text">发布者: {{ taskData?.adminer || '暂未分配发布者' }}</p>
                        <p class="text">任务状态: {{ taskData?.tag || '暂未分配任务状态' }}</p>
                    </div>
                    
                    <!-- 进行中状态 -->
                    <div class="right" v-if="taskData?.tag === '进行中'">
                        <p class="text">任务状态：</p>
                        <el-steps style="max-width: 600px" :active="getStepActive(taskData?.tag)" align-center>
                            <el-step title="进行中" description="In Progress" />
                            <el-step title="已完成" description="Completed" />
                            <el-step title="被打回" description="Returned" />
                        </el-steps>
                        <p class="text">请上传完成的相关附件：</p>
                        <el-upload class="upload-demo" drag
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                               在这里可以<em>上传任务附件</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    *这里可以上传证明任务完成的相关附件
                                </div>
                            </template>
                        </el-upload>
                        <el-form-item>
                            <el-button 
                                type="primary" 
                                @click="submitTask" 
                                style="display: flex; margin: 0 auto; margin-top: 45px;">
                                提交
                            </el-button>
                        </el-form-item>
                    </div>

                    <!-- 待审核状态 -->
                    <div class="right" v-else-if="taskData?.tag === '待审核'" style="display: flex;flex-direction: column; align-items: center;justify-content: center;">
                        <p class="text"><strong>任务已提交，等待审核</strong></p>
                        <el-steps style="max-width: 800px; margin-top: 20px;" :active="2" align-center>
                            <el-step title="进行中" description="In Progress" />
                            <el-step title="待审核" description="Under Review" />
                            <el-step title="已完成" description="Completed" />
                        </el-steps>
                        <div style="margin-top: 30px; text-align: center;">
                            <p class="text">您的任务已完成提交，正在等待管理员审核。</p>
                            <p class="text">审核通过后状态将变为"已完成"，</p>
                            <p class="text">若需要修改将变为"被打回"。</p>
                        </div>
                    </div>

                    <!-- 被打回状态 -->
                    <div class="right" v-else-if="taskData?.tag === '被打回'" style="display: flex;flex-direction: column; align-items: center;justify-content: center;">
                        <div class="returned-notice" style="background-color: #fef0f0; border: 1px solid #fbc4c4; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                            <el-alert
                                title="任务被打回"
                                type="error"
                                description="管理员已打回您的任务提交，请根据反馈修改后重新提交"
                                :closable="false"
                                show-icon>
                            </el-alert>
                        </div>
                        <p class="text">请重新上传完成的相关附件：</p>
                        <el-upload class="upload-demo" drag
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                               在这里可以<em>重新上传任务附件</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    *请根据管理员反馈修改后重新上传证明任务完成的相关附件
                                </div>
                            </template>
                        </el-upload>
                        <el-form-item>
                            <el-button 
                                type="primary" 
                                @click="submitTask" 
                                style="display: flex; margin: 0 auto; margin-top: 45px;">
                                重新提交
                            </el-button>
                        </el-form-item>
                    </div>

                    <!-- 已完成状态 -->
                    <div class="right" v-else-if="taskData?.tag === '已完成'" style="display: flex;justify-content: center; flex-direction: column; align-items: center;">
                        <img src="/image/finsh.png" alt="" style="width: 100%;">
                        <h1 style="margin-top: 20px;"><strong>该任务已完成</strong></h1>
                    </div>
                </div>
                <div class="bottom-button-container">
                    <el-button type="primary" @click="close">关闭</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface TaskData {
  date: string
  taskName: string
  adminer: string
  tag: string
  id?: string
  requirement?: string
  attachments?: string
}

const props = defineProps<{
  taskData?: TaskData
}>()

const emit = defineEmits(['close', 'taskUpdated']);

const close = () => {
    emit('close');
};

//提交任务按钮
const submitTask = () => {
    ElMessage({
    message: '您已经提交任务，等待审核',
    type: 'success',
  })
};

const getStepActive = (tag?: string) => {
    switch(tag) {
        case '进行中': return 1
        case '待审核': return 2
        case '已完成': return 3
        case '被打回': return 2
        default: return 0
    }
}
</script>

<style scoped>
.common-layout {
    position: static;
}

.float-window {
    position: fixed;
    width: 60%;
    height: 75%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.float-window-content {
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content-wrapper {
    display: flex;
    justify-content: space-between;
    flex: 1;
}

.flex {
    display: fixed;
    width: 100%;
    height: 100%;
}

.left {
    display: flex;
    width: 45%;
    height: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.right {
    width: 45%;
    height: 100%;
}

.bottom-button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eaeaea;
}

.close-button {
    padding: 10px 30px;
    background-color: #f5f5f5;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.close-button:hover {
    background-color: #eef0f3;
}

.need {
    display: flex;
    height: 30%;
}

.need-box {
    border: solid #dcdfe6 1px;
    width: 80%;
    height: 100%;
    border-radius: 15px;
    padding: 10px;
    background-color: #f9f9f9;
}

.text {
    margin: 8px 0;
    font-size: 14px;
    color: #333;
}

.returned-notice {
    background-color: #fef0f0;
    border: 1px solid #fbc4c4;
    border-radius: 8px;
    padding: 15px;
}
</style>
<template>
    <el-main class="detail-container">
        <el-card shadow="never" class="header-card">
            <el-page-header @back="goBack" title="返回">
                <template #content>
                    <span class="text-large font-600 mr-3"> 任务详情 </span>
                    <el-tag :type="getStatusType(taskData.tag)" class="ml-2">{{ taskData.tag }}</el-tag>
                </template>
            </el-page-header>
        </el-card>

        <div class="content-layout">
            <el-card shadow="hover" class="left-card">
                <template #header>
                    <div class="card-header">
                        <span>基础信息</span>
                    </div>
                </template>
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="任务ID">{{ taskData.id || '暂无' }}</el-descriptions-item>
                    <el-descriptions-item label="任务名称">{{ taskData.taskName }}</el-descriptions-item>
                    <el-descriptions-item label="发布者">{{ taskData.adminer }}</el-descriptions-item>
                    <el-descriptions-item label="下发时间">{{ taskData.date }}</el-descriptions-item>
                    <el-descriptions-item label="截止时间">
                        <span style="color: #F56C6C; font-weight: bold;">{{ taskData.deadline }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="任务需求">
                        <div style="white-space: pre-wrap;">{{ taskData.requirement || '暂无需求描述' }}</div>
                    </el-descriptions-item>
                </el-descriptions>

                <div class="annex-section">
                    <h4>任务附件 (后端下发)</h4>
                    <el-table :data="annexList" border style="width: 100%" v-loading="loadingAnnex">
                        <template #empty><el-empty description="暂无附件" :image-size="60" /></template>
                        <el-table-column prop="object" label="文件名" />
                        <el-table-column prop="size" label="大小(KB)" width="100" />
                        <el-table-column prop="createTime" label="上传时间" width="180" />
                        <el-table-column label="操作" width="100" fixed="right">
                            <template #default="scope">
                                <el-button type="primary" link @click="downloadFile(scope.row.object)">下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <el-card shadow="hover" class="right-card">
                <template #header>
                    <div class="card-header">
                        <span>进度与操作</span>
                    </div>
                </template>
                
                <div class="step-container">
                    <el-steps :active="getStepActive()" align-center finish-status="success">
                        <el-step title="进行中" />
                        <el-step title="待审核" />
                        <el-step title="已完成" />
                    </el-steps>
                </div>

                <div v-if="taskData.tag === '被打回'" class="alert-box">
                    <el-alert title="任务被打回" type="error" description="请根据意见修改后重新上传附件并提交。" :closable="false" show-icon />
                </div>
                <div v-if="taskData.tag === '待审核'" class="alert-box">
                    <el-alert title="等待管理员审核" type="warning" description="您已提交任务完成证明，请耐心等待审核。" :closable="false" show-icon />
                </div>
                <div v-if="taskData.tag === '已完成'" class="finish-box">
                    <img src="/image/finsh.png" alt="已完成" style="width: 200px;">
                    <h3 style="color: #67C23A;">任务圆满完成！</h3>
                </div>

                <div v-if="taskData.tag === '进行中' || taskData.tag === '被打回'" class="action-section">
                    <h4>上传完成证明附件</h4>
                    <el-upload 
                        class="upload-demo" 
                        drag
                        :action="uploadAction"
                        :data="{ breakdownId: taskData.id }"
                        name="files" 
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError"
                        multiple>
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
                    </el-upload>

                    <div class="submit-btn-wrapper">
                        <el-button 
                            type="primary" 
                            @click="submitTask" 
                            :loading="isSubmitting"
                            size="large"
                            style="width: 200px;">
                            {{ taskData.tag === '被打回' ? '重新提交任务' : '提交任务' }}
                        </el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </el-main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { updateTaskStatus, uploadUrl, fetchTaskAttachments, downloadTaskAttachment } from '../../api/member'

const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const uploadAction = uploadUrl 

const taskData = ref<any>({})
const annexList = ref([])
const loadingAnnex = ref(false)

// 初始化页面数据
onMounted(() => {
    // 从 sessionStorage 恢复任务数据
    const savedData = sessionStorage.getItem('currentMemberTask')
    if (savedData) {
        taskData.value = JSON.parse(savedData)
        loadAttachments()
    } else {
        ElMessage.warning('丢失任务数据，请重新进入')
        goBack()
    }
})

// 返回列表页
const goBack = () => {
    sessionStorage.removeItem('currentMemberTask')
    router.push('/member/MemberTaskList')
}

// 辅助：获取状态颜色
const getStatusType = (tag: string) => {
    if (tag === '已完成') return 'success'
    if (tag === '被打回') return 'danger'
    if (tag === '进行中') return 'primary'
    if (tag === '待审核') return 'warning'
    return 'info'
}

// 辅助：计算步骤条激活索引
const getStepActive = () => {
    if (taskData.value.tag === '待审核') return 1
    if (taskData.value.tag === '已完成') return 3
    if (taskData.value.tag === '被打回') return 0
    return 0 // 进行中
}

// 获取任务附件列表
const loadAttachments = async () => {
    if (!taskData.value.id) return
    loadingAnnex.value = true
    try {
        const res = await fetchTaskAttachments(taskData.value.id)
        if (res && res.data) {
            annexList.value = res.data
        }
    } catch (error) {
        console.error('获取附件失败', error)
    } finally {
        loadingAnnex.value = false
    }
}

// 下载附件
const downloadFile = async (fileName: string) => {
    try {
        // 注：localPath 参数后端可能用于特殊用途，通常前端下载只需文件名即可，这里传空或按需传递
        const res = await downloadTaskAttachment(fileName, '')
        // 创建 Blob 下载链接
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        ElMessage.error('下载失败')
    }
}

const handleUploadSuccess = (response: any) => {
    if (response.code === 200 || response.code === 0) {
        ElMessage.success('附件上传成功')
    } else {
        ElMessage.warning('上传可能有误: ' + response.message)
    }
}

const handleUploadError = () => {
    ElMessage.error('网络错误，附件上传失败')
}

// 提交任务
const submitTask = async () => {
    if (!taskData.value.id) {
        ElMessage.error('无法获取任务ID')
        return
    }

    isSubmitting.value = true
    try {
        // 根据后端设计，状态1代表待审核
        await updateTaskStatus(taskData.value.id, 1)
        ElMessage.success('提交成功，请等待管理员审核')
        // 模拟刷新状态
        taskData.value.tag = '待审核'
        // 更新缓存避免返回时状态闪烁
        sessionStorage.setItem('currentMemberTask', JSON.stringify(taskData.value))
    } catch (error) {
        console.error(error)
        ElMessage.error('提交失败，请重试')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.detail-container {
    background-color: #f4f6f8;
    min-height: calc(100vh - 60px);
    padding: 20px;
    box-sizing: border-box;
}

.header-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.content-layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.left-card {
    flex: 3;
    border-radius: 8px;
}

.right-card {
    flex: 2;
    border-radius: 8px;
}

.card-header {
    font-weight: bold;
    font-size: 16px;
}

.annex-section {
    margin-top: 30px;
}
.annex-section h4 {
    margin-bottom: 15px;
    color: #303133;
    border-left: 4px solid #409EFF;
    padding-left: 10px;
}

.step-container {
    margin: 20px 0 40px 0;
}

.alert-box {
    margin-bottom: 30px;
}

.finish-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
}

.action-section h4 {
    margin-bottom: 15px;
    color: #303133;
}

.submit-btn-wrapper {
    margin-top: 30px;
    text-align: center;
}
</style>
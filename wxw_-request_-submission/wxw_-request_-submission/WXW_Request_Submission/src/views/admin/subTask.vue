<template>
    <div class="common-layout">
        <el-container class="float-window">
            <el-main class="float-window-content">
                <div class="content-wrapper">
                    <div class="left">
                        <p class="text">工单ID: {{ taskData?.id }}</p>
                        <p class="text">任务名称: {{ taskData?.taskName }}</p>
                        <p class="text">委托老师: {{ taskData?.teacher }} ({{ taskData?.phoneNumber }})</p>
                        <p class="text">地址: {{ taskData?.officeAddress }}</p>
                        <div class="need">
                            <p class="text" style="margin: 0;">任务需求：</p>
                            <div class="need-box">{{ taskData?.taskName }} (详细需求请调用详情接口)</div>
                        </div>
                        <p class="text">截止时间：{{ taskData?.dateLimit }}</p>
                    </div>

                    <div class="right">
                        <div v-if="taskData?.tag === '待受理' || taskData?.tag === '进行中'" style="width: 100%">
                            <h3>分配详情</h3>
                            <el-table :data="subTaskData" height="300" style="width: 100%">
                                <template #empty>
                                    <el-empty description="暂未分配给干事" :image-size="80" />
                                </template>
                                <el-table-column prop="taskName" label="子任务名" />
                                <el-table-column prop="officer" label="干事" />
                                <el-table-column prop="statusTag" label="状态" />
                                <el-table-column label="操作" width="160">
                                    <template #default="scope">
                                        <el-button v-if="scope.row.status === 1" type="primary" size="small" @click="openAuditDetail(scope.row)">审核</el-button>
                                        <el-button v-else size="small" @click="openAuditDetail(scope.row)">查看</el-button>
                                        
                                        <el-popconfirm title="确定删除此子任务?" @confirm="handleDelete(scope.row)">
                                            <template #reference>
                                                <el-button type="danger" :icon="Delete" circle size="small" />
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div style="margin-top: 20px; text-align: center;">
                                <el-button type="primary" @click="showSubTaskForm = true">分配新干事</el-button>
                                <el-button type="success" @click="finishMainTask">主任务结项</el-button>
                            </div>
                        </div>

                        <div v-else style="text-align: center;">
                            <img src="/image/finsh.png" style="width: 80%;">
                            <h2>主任务已完成</h2>
                        </div>
                    </div>
                </div>

                <div class="bottom-button-container">
                    <el-button @click="close">关闭窗口</el-button>
                </div>

                <FloatSubTask 
                    v-if="showSubTaskForm" 
                    :main-task-id="taskData?.id" 
                    @close="showSubTaskForm = false"
                    @submit="refreshSubTasks" 
                />

                <FloatDetail 
                    v-if="showDetail" 
                    :detail-data="currentDetail" 
                    @close="showDetail = false"
                    @audited="refreshSubTasks"
                    style="z-index: 11000;" 
                />
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FloatSubTask from './subTask.vue'
import FloatDetail from './Detail.vue'
import { fetchSubTasks, deleteSubTask, updateMainStatus } from '../../api/admin'

const props = defineProps<{ taskData: any }>()
const emit = defineEmits(['close'])

const subTaskData = ref([])
const showSubTaskForm = ref(false)
const showDetail = ref(false)
const currentDetail = ref(null)

const close = () => emit('close')

// 状态映射
const statusMap = { 0: '进行中', 1: '待审核', 2: '已完成', 3: '已打回' }

// 获取子任务列表
const refreshSubTasks = async () => {
    if (!props.taskData?.id) return
    try {
        const res = await fetchSubTasks(props.taskData.id)
        const list = res.data || []
        subTaskData.value = list.map(item => ({
            ...item,
            id: item.sonTaskId,
            statusTag: statusMap[item.status] || '未知'
        }))
    } catch (e) {
        console.error(e)
    }
}

// 删除子任务
const handleDelete = async (row) => {
    try {
        await deleteSubTask(row.id)
        ElMessage.success('删除成功')
        refreshSubTasks()
    } catch (e) {
        ElMessage.error('删除失败')
    }
}

// 结项
const finishMainTask = async () => {
    try {
        await updateMainStatus(props.taskData.id, "已完成")
        ElMessage.success('主任务已标记为完成')
        emit('close') // 关闭并刷新主列表
    } catch (e) {
        ElMessage.error('操作失败')
    }
}

// 打开审核详情
const openAuditDetail = (row) => {
    currentDetail.value = row
    showDetail.value = true
}

onMounted(() => {
    refreshSubTasks()
})
</script>

<style scoped>
/* 样式同前 */
.common-layout { position: static; }
.float-window { position: fixed; width: 75%; height: 90%; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9000; }
.float-window-content { padding: 30px; background: white; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; height: 100%; }
.content-wrapper { display: flex; justify-content: space-between; flex: 1; overflow: hidden; }
.left { width: 40%; padding-right: 20px; border-right: 1px solid #eee; overflow-y: auto; }
.right { width: 58%; padding-left: 20px; overflow-y: auto; }
.need-box { background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px solid #eee; margin: 5px 0; }
.text { margin: 8px 0; font-size: 14px; color: #333; line-height: 1.6; }
.bottom-button-container { margin-top: 20px; text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
</style>
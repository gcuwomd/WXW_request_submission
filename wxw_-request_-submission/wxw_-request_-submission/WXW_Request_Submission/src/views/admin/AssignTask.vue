<!-- 分配任务 -->
<template>
    <div class="common-layout">
        <el-container class="float-window">
            <el-main class="float-window-content">
                <div class="content-wrapper">
                    <div class="left">
                        <p class="text">工单ID: {{ taskData?.id || '暂未分配工单ID' }}</p>
                        <p class="text">任务名称: {{ taskData?.taskName || '暂未分配任务名称' }}</p>
                        <p class="text">被委托部门: {{ taskData?.department || '暂未分配部门' }}</p>
                        <div class="need">
                            <p class="text" style="margin: 0;">任务需求：</p>
                            <div class="need-box">{{ taskData?.requirement || '暂无需求描述' }}</div>
                        </div>
                        <div class="need">
                            <p class="text" style="margin: 10px 0;">需求附件：</p>
                            <div class="need-box" style="margin-top: 5px;">{{ taskData?.attachments || '暂无附件' }}</div>
                        </div>
                        <p class="text">要求截止时间：{{ taskData?.date || '暂未分配截止时间' }}</p>
                        <p class="text">老师姓名：{{ taskData?.teacher || '暂未分配老师' }}</p>
                        <p class="text">联系方式: {{ taskData?.phoneNumber || '暂未分配联系方式' }}</p>
                        <p class="text">办公地址: {{ taskData?.address || '暂未分配办公地址' }}</p>
                    </div>

                    <!-- 待受理 -->
                    <div class="right" v-if="taskData.tag && taskData.tag == '待受理'">
                        <el-table :data="subTaskData" height="350" style="width: 100%">
                            <template #empty>
                                <el-empty description="暂无子任务" :image-size="100" />
                            </template>
                            <el-table-column prop="taskName" label="任务名称" />
                            <el-table-column prop="name" label="干事名称" />
                            <el-table-column prop="dateline" label="任务截止时间" />
                            <el-table-column label="详情" width="150" v-if="subTaskData.length > 0">
                                <template #default="scope">
                                    <el-button type="primary" @click="DetailClick(scope.row)">详情</el-button>
                                    <el-popconfirm title="你确定删除该子任务吗？">
                                        <template #reference>
                                            <el-button type="danger" :icon="Delete" circle />
                                        </template>
                                    </el-popconfirm>
                                    <FloatDetail v-if="showDetail" @close="showDetail = false" style="z-index: 10000;"
                                        :detail-data="currentDetail" />
                                </template>
                            </el-table-column>

                        </el-table>

                        <div style="margin-top: 30px;">
                            <el-button type="primary" @click="showSubTaskForm = true">
                                创建子任务
                            </el-button>
                            <el-button @click="open">已完成创建</el-button>
                        </div>
                    </div>

                    <FloatSubTask v-if="showSubTaskForm" @close="showSubTaskForm = false"
                        @submit="handleSubTaskSubmit" />


                    <!-- 已完成 -->
                    <div class="right" v-else-if="taskData.tag && taskData.tag == '已完成'"
                        style="display: flex;flex-direction: column;">
                        <img src="/image/finsh.png" alt="" style="width: 100%;">
                        <h1><strong>该任务已完成</strong></h1>
                    </div>

                    <!-- 进行中 -->
                    <div class="right" v-else-if="taskData.tag && taskData.tag == '进行中'"
                        style="display: flex;flex-direction: column;">
                        <p class="text"><strong>下发任务详情</strong></p>
                        <el-table :data="tableData" :row-class-name="tableRowClassName"
                            style="width: 100% ;--el-table-border-color:none">
                            <el-table-column prop="CreateDate" label="下发时间" width="100" />
                            <el-table-column prop="name" label="干事名称" width="100" />
                            <el-table-column prop="tag" label="状态" width="150" />
                            <el-table-column fixed="right" label="详情" min-width="10">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="DetailClick(scope.row)">
                                        任务详情
                                    </el-button>
                                    <FloatDetail v-if="showDetail" @close="showDetail = false" style="z-index: 10000;"
                                        :detail-data="currentDetail" />
                                </template>
                            </el-table-column>
                        </el-table>
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
import {ref,onMounted, computed} from 'vue'
import type {ElMessage } from 'element-plus'
import FloatSubTask from '../../views/admin/subTask.vue'
import FloatDetail from '../../views/admin/Detail.vue'
import "../../mock/mock.js"
import { fetchDetail } from '../../api'
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

interface TaskData {
    date: string
    taskName: string
    teacher: string
    tag: string
    id?: string
    requirement?: string
    attachments?: string
    department?: string
    phoneNumber?: string
    address?: string
}

const props = defineProps<{
    taskData?: TaskData
}>()

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
// 子任务数据
const subTaskData = ref([])

// 表单
interface RuleForm {
    name: string      // 任务名称
    count: string     // 任务人数
    cities: string[]  // 被委托干事
    date1: string     // 日期
    date2: string     // 时间
    desc: string      // 任务描述
}

const showSubTaskForm = ref(false)

// 添加处理子任务提交的方法
const handleSubTaskSubmit = (formData) => {
  console.log('接收到的子任务数据:', formData)
  // 这里可以处理子任务数据的保存逻辑
  showSubTaskForm.value = false
}

const cities = ref([])// 表单的被委托干事

// 使用计算属性生成任务人数选项
const options = computed(() => {
    const maxCount = cities.value.length || 10
    return Array.from({ length: maxCount }).map((_, idx) => ({
        value: `${idx + 1}`,
        label: `${idx + 1}`,
    }))
})

// 获取干事列表
const tableData = ref([])

//获取干事任务列表功能 后期需优化放在api文件夹下
async function fetchDetailList() {
    try {
        const response = await fetchDetail()  // 使用导入的API方法
        tableData.value = response.data
    } catch (error) {
        console.error('Error fetching task list:', error)
    }
}

//改变主任务状态为进行中（后面调整时需要添加接口事件）
const open = () => {
  ElMessageBox.confirm(
    '确认完成子任务的创建了吗？',
    '提醒',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '子任务创建完成，主任务状态已更新为进行中',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消创建子任务',
      })
    })
}

//获取子任务列表
async function getSubTaskList() {
    try {
        const response = await fetchDetail()
        subTaskData.value = response.data
        // 这里可以添加处理逻辑，比如更新组件状态
        subTaskData.value.forEach(item => 
            {
                item.taskName = item.taskName
                item.name = item.name
                item.dateline = item.dataLine
            }
        )
    } catch (error) {
        console.error('没有获取到子任务列表:', error)
    }
}

//详情浮窗
const showDetail = ref(false)
const currentDetail = ref(null)

const DetailClick = (row) => {
    currentDetail.value = row
    showDetail.value = true;
}

//状态颜色
const tableRowClassName = ({ row }) => {
    if (row.tag === '已完成') {
        return 'success-row'
    } else if (row.tag === '已打回') {
        return 'danger-row'
    } else if (row.tag === '进行中') {
        return 'a'
    } else if (row.tag === '待审核')
        return 'review-row'
    return ''
}


// 筛选受理干事功能实现 受理干事下拉框的选项（干事名字获取）
async function getMemberNames() {
    try {
        const response = await fetchDetail()
        // 确保每个选项都有 value 和 label
        cities.value = response.data.map(item => ({
            value: item.name || '', 
            label: item.name || '未知'
        }))
    } catch (error) {
        console.error('没有获取到受理干事的姓名:', error)
    }
}
onMounted(() => {
    fetchDetailList()
    getMemberNames()
    getSubTaskList()
})
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
    width: 70%;
    height: 95%;
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
    width: 100%;
}

.content-wrapper {
    height: 85%;
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
    /* height: 100%; */
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.right {
    justify-content: center;
    width: 45%;
    /* height: 100%; */
    display: flex;
    align-items: center;
    flex-direction: column;
}

.bottom-button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eaeaea;
}

.need {
    display: flex;
    height: 20%;
}

.need-box {
    border: solid #dcdfe6 1px;
    width: 80%;
    height: 80%;
    border-radius: 15px;
    padding: 10px;
    background-color: #f9f9f9;
}

.text {
    margin: 8px 0;
    font-size: 14px;
    color: #333;
}

.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.el-table .success-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-table .review-row) {
    background-color: #ffe171;
}
</style>
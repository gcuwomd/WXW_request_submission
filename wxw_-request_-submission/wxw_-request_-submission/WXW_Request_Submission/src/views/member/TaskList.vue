<template>
    <el-main class="main">
        <span><strong>我的任务列表</strong></span>
        <el-input v-model="input" style="width: 240px ; margin-left: 10px;" placeholder="请输入任务名称" :suffix-icon="Search" />
        
        <div style="margin-top: 20px;">
            <el-table :data="tableData" :default-sort="{ prop: 'deadline', order: 'descending' }"
                :row-class-name="tableRowClassName" class="member-task-table" style="width: 100%;--el-table-border-color:none;"
                @filter-change="handleFilterChange">
                <template #empty>
                    <el-empty description="暂无任务信息" />
                </template>
                
                <el-table-column prop="date" label="下发时间" sortable />
                <el-table-column prop="taskName" label="任务名称" />
                <el-table-column prop="adminer" label="发布者" />
                <el-table-column prop="deadline" label="截止时间" />
                
                <el-table-column prop="tag" label="状态" :filters="[
                    { text: '进行中', value: '进行中' },
                    { text: '已完成', value: '已完成' },
                    { text: '被打回', value: '被打回' },
                    { text: '待审核', value: '待审核' },
                ]" :filter-method="filterTag" filter-placement="bottom-end" column-key="tag">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.tag)" disable-transitions>
                            {{ scope.row.tag }}
                        </el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column fixed="right" label="详情">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleClick(scope.row)">
                            任务详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <FloatWindow 
                v-if="showFloatWindow" 
                :task-data="currentTask"
                @close="showFloatWindow = false" 
                @taskUpdated="fetchTaskList" 
                style="z-index: 10000;" 
            />
        </div>

        <div>
            <el-pagination 
                v-model:current-page="currentPage" 
                v-model:page-size="pageSize"
                :background="true" 
                layout="prev, pager, next, jumper" 
                :total="filteredData.length" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                style="display: flex; justify-content: center; margin-top: 20px;" 
            />
        </div>
    </el-main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import FloatWindow from '../../views/member/TaskDetail.vue'
import { fetchMemberTasks } from '../../api/member' 
import { useUserStore } from '@/store/user'

const showFloatWindow = ref(false)
const currentFilters = ref({ tag: [] })
const currentTask = ref(null)
const input = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const allTableData = ref([]) 

const userStore = useUserStore()

// 状态映射字典 (需要根据后端实际返回的 integer 值进行调整)
// 假设: 0-进行中, 1-待审核, 2-已完成, 3-被打回
const statusMap = {
    0: '进行中',
    1: '待审核',
    2: '已完成',
    3: '被打回'
}

// 获取任务列表
async function fetchTaskList() {
    try {
        // 3. 修改这里：使用 store 中的 userId (即学号/用户名)
        const currentOfficerName = userStore.userId 
        
        if (!currentOfficerName) {
            console.error('未获取到用户信息，无法加载任务')
            return
        }

        console.log('正在获取任务列表，用户:', currentOfficerName)
        const response = await fetchMemberTasks(currentOfficerName)
        
        const rawList = response.data || [] 

        allTableData.value = rawList.map(item => ({
            id: item.sonTaskId,           
            taskName: item.taskName,
            adminer: item.administrator || '管理员', 
            deadline: item.deadline,
            date: item.createTime || '2023-01-01',   
            tag: statusMap[item.status] || '未知状态', 
            statusOrigin: item.status,    
            requirement: item.taskDetail, 
            attachments: item.annexName || '无' 
        }))
    } catch (error) {
        console.error('获取任务列表失败:', error)
    }
}

const handleClick = (row) => {
    currentTask.value = row
    showFloatWindow.value = true
}

// 辅助函数：根据中文状态返回 Tag 类型
const getStatusType = (tag) => {
    if (tag === '已完成') return 'success'
    if (tag === '被打回') return 'danger'
    if (tag === '进行中') return 'primary'
    if (tag === '待审核') return 'warning'
    return 'info'
}

const tableRowClassName = ({ row }) => {
    if (row.tag === '已完成') return 'success-row'
    if (row.tag === '被打回') return 'danger-row'
    if (row.tag === '进行中') return 'primary-row'
    if (row.tag === '待审核') return 'warning-row'
    return ''
}

const filterTag = (value, row) => {
    return row.tag === value
}

const handleFilterChange = (filters) => {
    currentFilters.value = filters
    currentPage.value = 1
}

const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
}

const handleCurrentChange = (page) => {
    currentPage.value = page
}

const filteredData = computed(() => {
    let data = [...allTableData.value]
    if (currentFilters.value.tag && currentFilters.value.tag.length > 0) {
        data = data.filter(item => currentFilters.value.tag.includes(item.tag))
    }
    if (input.value) {
        data = data.filter(item => item.taskName.includes(input.value))
    }
    return data
})

const tableData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

onMounted(() => {
    fetchTaskList()
})
</script>

<style>
/* 保持原有样式不变 */
body { padding: 0; margin: 0; }
.main { background-size: 1200px; background-color: rgba(240, 248, 255); background-position: center; height: 100vh; }
.el-table .warning-row { --el-table-tr-bg-color: var(--el-color-warning-light-9); }
.el-table .success-row { --el-table-tr-bg-color: var(--el-color-success-light-9); }
.el-table .danger-row { --el-table-tr-bg-color: var(--el-color-danger-light-9); }
.el-table .primary-row { --el-table-tr-bg-color: var(--el-color-primary-light-9); }
.member-task-table .el-table__header th:nth-child(1), .member-task-table .el-table__body td:nth-child(1) { width: 11%; }
.member-task-table .el-table__header th:nth-child(2), .member-task-table .el-table__body td:nth-child(2) { width: 17%; }
.member-task-table .el-table__header th:nth-child(3), .member-task-table .el-table__body td:nth-child(3) { width: 17%; }
.member-task-table .el-table__header th:nth-child(4), .member-task-table .el-table__body td:nth-child(4) { width: 23%; }
.member-task-table .el-table__header th:nth-child(5), .member-task-table .el-table__body td:nth-child(5) { width: 24%; }
.member-task-table .el-table__fixed-right .el-table__header th, .member-task-table .el-table__fixed-right .el-table__body td { width: 8%; }
</style>
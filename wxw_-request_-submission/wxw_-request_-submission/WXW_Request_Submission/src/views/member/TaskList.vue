<template>
    <el-main class="main-container">
        <div class="header-operate">
            <span><strong>我的任务列表</strong></span>
            <el-input v-model="input" style="width: 240px ; margin-left: 20px;" placeholder="请输入任务名称" :suffix-icon="Search" />
        </div>
        
        <div class="table-container">
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
                
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleGoDetail(scope.row)">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-container">
            <el-pagination 
                v-model:current-page="currentPage" 
                v-model:page-size="pageSize"
                :background="true" 
                layout="prev, pager, next, jumper" 
                :total="filteredData.length" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
            />
        </div>
    </el-main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus' // 引入消息提示
import { fetchMemberTasks, fetchUserInfo } from '../../api/member' // 引入 fetchUserInfo

const router = useRouter()
const currentFilters = ref({ tag: [] })
const input = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const allTableData = ref([]) 

// 状态映射字典
const statusMap = {
    0: '进行中',
    1: '待审核',
    2: '已完成',
    3: '被打回'
}

// 获取任务列表
async function fetchTaskList() {
    try {
        // 1. 先调用接口获取当前登录干事的真实个人信息
        const userInfoRes = await fetchUserInfo()
        const realName = userInfoRes.data?.username

        if (!realName) {
            ElMessage.error('无法获取您的干事姓名，请重新登录')
            return
        }
        
        // 2. 将真实的中文名作为参数传给后端拉取任务列表
        const response = await fetchMemberTasks(realName)
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
        ElMessage.error('获取任务数据失败，请检查网络')
    }
}

// 跳转到详情页，使用 sessionStorage 缓存当前行数据，避免刷新丢失
const handleGoDetail = (row) => {
    sessionStorage.setItem('currentMemberTask', JSON.stringify(row))
    router.push({ 
        path: '/member/TaskDetail', 
        query: { id: row.id } 
    })
}

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

const filterTag = (value, row) => row.tag === value

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

<style scoped>
.main-container {
    background-color: #f4f6f8;
    min-height: calc(100vh - 60px);
    padding: 20px;
    box-sizing: border-box;
}

.header-operate {
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
}

.table-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

:deep(.el-table .warning-row) {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.el-table .success-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-table .danger-row) {
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

:deep(.el-table .primary-row) {
    --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
</style>
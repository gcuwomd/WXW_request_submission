<template>
    <el-main class="main-container">
        <div class="header-operate">
            <span><strong>受理干事 </strong></span>
            <el-select-v2 
                v-model="value1" 
                filterable 
                clearable
                :options="options1" 
                placeholder="请选择受理干事"
                style="width: 240px ; margin-left: 10px;" 
                @change="handleOfficialChange"
            />
            <el-input v-model="input" style="width: 240px ; margin-left: 30px;" placeholder="请输入任务名称" :suffix-icon="Search" />
        </div>

        <div class="table-container">
            <el-table :data="tableData" :default-sort="{ prop: 'dateLimit', order: 'descending' }"
                class="admin-task-table" style="width: 100%;--el-table-border-color:none;"
                @filter-change="handleFilterChange">  
                <template #empty>
                    <el-empty description="未找到任务信息" />
                </template>
                <el-table-column prop="dateLimit" label="要求时间" sortable />
                <el-table-column prop="taskName" label="任务名称" />
                <el-table-column prop="teacher" label="委托老师" />
                <el-table-column prop="tag" label="状态" :filters="[
                    { text: '待受理', value: '待受理' },
                    { text: '进行中', value: '进行中' },
                    { text: '已完成', value: '已完成' },
                ]" :filter-method="filterTag" filter-placement="bottom-end" column-key="tag">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.tag === '进行中' ? 'primary' : scope.row.tag === '已完成' ? 'success' : 'info'"
                            disable-transitions>
                            {{ scope.row.tag || '未知' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleGoDetail(scope.row)">
                            任务详情
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

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchMainTasks, fetchAllOfficers, fetchUserInfo, fetchMainTasksByOfficial } from '../../api/admin' // 引入新接口

const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(10)
const allTableData = ref([])
const input = ref('')
const currentFilters = ref({})

const options1 = ref([])
// 修改为单选字符串
const value1 = ref('')

const formatStatus = (status) => {
    if (status === 0 || status === '0') return '待受理'
    if (status === 1 || status === '1') return '进行中'
    if (status === 2 || status === '2') return '已完成'
    if (['待受理', '进行中', '已完成'].includes(status)) return status
    return '待受理' 
}

const formatDate = (dateStr) => {
    if (!dateStr) return '暂无'
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
}

const handleGoDetail = (row) => {
    sessionStorage.setItem('currentAdminMainTask', JSON.stringify(row))
    router.push({ 
        path: '/admin/TaskDetail',
        query: { id: row.mainTaskID || row.mainTaskId }
    })
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

const handleFilterChange = (filters) => {
    currentFilters.value = filters
    currentPage.value = 1  
}

// 统一处理任务列表的数据赋值
const updateTableData = (rawData) => {
    allTableData.value = rawData.map(item => {
        return {
            ...item,
            tag: formatStatus(item.tag),
            dateLimit: formatDate(item.dateLimit)
        }
    })
    currentPage.value = 1 // 每次获取新数据后，重置分页到第一页
}

// --- 新增：监听干事下拉框改变事件 ---
const handleOfficialChange = async (officialName) => {
    try {
        let response;
        if (officialName) {
            // 选中某个干事，拉取该干事负责的主任务
            response = await fetchMainTasksByOfficial(officialName)
        } else {
            // 点击清空图标(值为 '' 或 null)，重新拉取所有主任务
            response = await fetchMainTasks()
        }
        updateTableData(response.data || [])
    } catch (error) {
        console.error('根据干事获取任务失败:', error)
        ElMessage.error('查询数据失败')
    }
}
// ------------------------------------

async function getMemberNames() {
    try {
        const userInfoRes = await fetchUserInfo()
        const currentDeptId = userInfoRes.data?.departmentId
        
        if (!currentDeptId) {
            console.error('未获取到部门ID，无法加载干事筛选列表')
            return
        }

        const response = await fetchAllOfficers(currentDeptId)
        if (response.data) {
            options1.value = response.data.map(item => ({
                value: item.username,
                label: item.username,
            }))
        }
    } catch (error) {
        console.error('获取干事失败:', error)
    }
}

async function fetchTaskList() {
    try {
        const response = await fetchMainTasks()
        updateTableData(response.data || [])
    } catch (error) {
        console.error('获取任务列表失败:', error)
    }
}

const filterTag = (value, row) => row.tag === value

const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
}

const handleCurrentChange = (page) => {
    currentPage.value = page
}

onMounted(() => {
    fetchTaskList()
    getMemberNames()
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
</style>
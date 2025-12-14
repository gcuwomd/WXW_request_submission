<!-- 任务列表 -->
<template>
    <el-main class="main">
        <span><strong>受理干事 </strong></span>
        <el-select-v2 v-model="value1" filterable :options="options1" placeholder="请选择受理干事"
            style="width: 240px ; margin-left: 5px;" multiple />
        <el-input v-model="input" style="width: 240px ; margin-left: 30px;" placeholder="请输入任务名称" :suffix-icon="Search" />
        <!-- 任务主列表 !-->
        <div>
            <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
                :row-class-name="tableRowClassName" class="admin-task-table" style="width: 100%;--el-table-border-color:none; margin-top: 20px;"
                @filter-change="handleFilterChange"
                >  <!-- 添加筛选变化监听 -->
            <template #empty>
                <el-empty description="未找到任务信息" />
            </template>
                <el-table-column prop="date" label="日期" sortable />
                <el-table-column prop="taskName" label="任务名称" />
                <el-table-column prop="teacher" label="委托老师" />
                <el-table-column prop="deadline" label="截止时间" />
                <el-table-column prop="tag" label="状态" :filters="[
                    { text: '待受理', value: '待受理' },
                    { text: '已完成', value: '已完成' },
                    { text: '进行中', value: '进行中' },
                ]" :filter-method="filterTag" filter-placement="bottom-end" column-key="tag">  <!-- 添加 column-key -->
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.tag === '进行中' ? 'primary' : scope.row.tag === '已完成' ? 'success' : scope.row.tag === '待受理' ? 'info' : 'danger'"
                            disable-transitions>
                            {{ scope.row.tag }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="详情">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleClick(scope.row)">
                            任务详情
                        </el-button>
                        <FloatWindow v-if="showFloatWindow" :task-data="currentTask" @close="showFloatWindow = false"
                            style="z-index: 10000;" />
                    </template>
                </el-table-column>
            </el-table>

        
        </div>

        <!-- 分页功能实现 -->
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
    </el-main>
</template>

<script lang="ts" setup>
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import FloatWindow from '../../views/admin/AssignTask.vue'
import { fetchMainTasks } from '../../api'
import "../../mock/mock.js"
// import { fetchDetail } from '../../api'
// import { fetchSubTask } from '../../api'

const currentPage = ref(1)
const pageSize = ref(10)
const showFloatWindow = ref(false)
const currentTask = ref(null)
const allTableData = ref([])  //allTableData存储所有数据
const input = ref('')
const currentFilters = ref({})  // 存储当前筛选条件

//分页功能
// 计算过滤后的数据
const filteredData = computed(() => {
    let data = [...allTableData.value]
    
    // 应用状态筛选
    if (currentFilters.value.tag && currentFilters.value.tag.length > 0) {
        data = data.filter(item => currentFilters.value.tag.includes(item.tag))
    }

    //搜索功能
    // 应用搜索筛选
    if (input.value) {
        data = data.filter(item => item.taskName.includes(input.value))
    }
    
    return data
})

// 计算当前页显示的数据（让表格自己处理分页）
const tableData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

// 处理筛选变化
const handleFilterChange = (filters) => {
    currentFilters.value = filters
    currentPage.value = 1  // 筛选后回到第一页
}

//筛选受理干事 受理干事下拉框
const initials = ref([])
const options1 = ref([])
const value1 = ref([])

// 筛选受理干事功能实现 受理干事下拉框的选项（干事名字获取）
async function getMemberNames() {
    try {
        const response = await fetchDetail()
        initials.value = response.data.map(item => item.name)
        
        options1.value = initials.value.map(item => ({
            value: item,
            label: item,
        }))
    } catch (error) {
        console.error('没有获取到受理干事的姓名:', error)
    }
}

// 获取任务列表
async function fetchTaskList() {
    try {
        const response = await fetchMainTasks()
        allTableData.value = response.data  // 存储到 allTableData
    } catch (error) {
        console.error('没有获取到任务列表:', error)
    }
}

//打开弹框 点击任务详情按钮 打开任务详情弹框
const handleClick = (row) => {
    currentTask.value = row
    showFloatWindow.value = true
}


//每一个任务行根据自身状态的不一样 展示不同的背景颜色
const tableRowClassName = ({ row }) => {
    if (row.tag === '已完成') {
        return 'success-row'
    } else if (row.tag === '被打回') {
        return 'danger-row'
    } else if (row.tag === '进行中') {
        return 'primary-row'
    }
    return ''
}


const filterTag = (value, row) => {
    return row.tag === value
}

//分页功能 每一页展示数据条数的调整
const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
}

//分页功能 控制页面的跳转
const handleCurrentChange = (page) => {
    currentPage.value = page
}

//挂载请求功能
onMounted(() => {
    fetchTaskList()
    getMemberNames()
})
</script>

<style>
body {
    padding: 0;
    margin: 0;
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

.el-table .danger-row {
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.el-table .primary-row {
    --el-table-tr-bg-color: var(--el-color-primary-light-9);
}

/* 百分比分配列宽（管理员任务列表） */
.admin-task-table .el-table__header th:nth-child(1),
.admin-task-table .el-table__body td:nth-child(1) {
    width: 11%;
}
.admin-task-table .el-table__header th:nth-child(2),
.admin-task-table .el-table__body td:nth-child(2) {
    width: 17%;
}
.admin-task-table .el-table__header th:nth-child(3),
.admin-task-table .el-table__body td:nth-child(3) {
    width: 17%;
}
.admin-task-table .el-table__header th:nth-child(4),
.admin-task-table .el-table__body td:nth-child(4) {
    width: 23%;
}
.admin-task-table .el-table__header th:nth-child(5),
.admin-task-table .el-table__body td:nth-child(5) {
    width: 24%;
}
/* 右侧固定列（详情）宽度 */
.admin-task-table .el-table__fixed-right .el-table__header th,
.admin-task-table .el-table__fixed-right .el-table__body td {
    width: 8%;
}
</style>
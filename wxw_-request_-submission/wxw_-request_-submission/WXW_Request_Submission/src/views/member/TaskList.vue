<!-- 任务列表 -->
<template>
    <el-main class="main">
        <span><strong>我的任务列表</strong></span>
        <el-input v-model="input" style="width: 240px ; margin-left: 10px;" placeholder="请输入任务名称"  :suffix-icon="Search" />
        <!-- 任务主列表 -->
        <div style="margin-top: 20px;">
            <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
                :row-class-name="tableRowClassName" class="member-task-table" style="width: 100%;--el-table-border-color:none;"
                @filter-change="handleFilterChange"
                >
            <template #empty>
                <el-empty description="未找到任务信息" />
            </template>
                <el-table-column prop="date" label="日期" sortable />
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
                        <el-tag :type="scope.row.tag === '待受理' ? 'info' : scope.row.tag === '已完成' ? 'success' : scope.row.tag === '被打回' ? 'danger' : scope.row.tag === '待审核' ? 'warning' : 'primary'" disable-transitions>
                            {{ scope.row.tag }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="详情">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleClick(scope.row)">
                            任务详情
                        </el-button>
                        <FloatWindow 
                            v-if="showFloatWindow" 
                            :task-data="currentTask"
                            @close="showFloatWindow = false" 
                            style="z-index: 10000;" 
                        />
                    </template>
                </el-table-column>
            </el-table>
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
import { fetchMemberTasks } from '../../api'  // 导入API方法
import "../../mock/mock.js"

const showFloatWindow = ref(false)
const currentFilters = ref({ tag: [] })  // 存储当前筛选条件
const currentTask = ref(null)
const input = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const allTableData = ref([])  //allTableData存储所有数据

// 获取任务列表
async function fetchTaskList() {
 try{
    const responnse = await fetchMemberTasks() 
    allTableData.value = responnse.data
 }
 catch(error){
  console.error('获取任务列表失败:', error)
 }
}

const handleClick = (row) => {
  currentTask.value = row
  showFloatWindow.value = true
}

const tableRowClassName = ({ row }) => {
  if (row.tag === '已完成') {
    return 'success-row'
  } else if (row.tag === '被打回') {
    return 'danger-row'
  } else if (row.tag === '进行中') {
    return 'primary-row'
  } else if (row.tag === '待审核') {
    return 'warning-row'
  }
  return ''
}

const filterTag = (value, row) => {
  return row.tag === value
}

// 处理筛选变化 - 修复这里！
const handleFilterChange = (filters) => {
    currentFilters.value = filters
    currentPage.value = 1  // 筛选后回到第一页
}

//分页功能实现
// 处理页面大小变化 - 重命名避免冲突
const handleSizeChange = (size) =>{
  pageSize.value = size
  currentPage.value = 1
}

// 处理当前页变化 - 重命名避免冲突
const handleCurrentChange = (page) => {
    currentPage.value = page
}

// 计算当前页显示的数据（让表格自己处理分页）
const tableData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

// 计算过滤后的数据
const filteredData = computed(() => {
    let data = [...allTableData.value]
    
    // 应用状态筛选
    if (currentFilters.value.tag && currentFilters.value.tag.length > 0) {
        data = data.filter(item => currentFilters.value.tag.includes(item.tag))
    }
    
    // 应用搜索筛选
    if (input.value) {
        data = data.filter(item => item.taskName.includes(input.value))
    }
    
    return data
})

onMounted(() => {
  fetchTaskList()
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

.member-task-table .el-table__header th:nth-child(1),
.member-task-table .el-table__body td:nth-child(1) {
  width: 11%;
}
.member-task-table .el-table__header th:nth-child(2),
.member-task-table .el-table__body td:nth-child(2) {
  width: 17%;
}
.member-task-table .el-table__header th:nth-child(3),
.member-task-table .el-table__body td:nth-child(3) {
  width: 17%;
}
.member-task-table .el-table__header th:nth-child(4),
.member-task-table .el-table__body td:nth-child(4) {
  width: 23%;
}
.member-task-table .el-table__header th:nth-child(5),
.member-task-table .el-table__body td:nth-child(5) {
  width: 24%;
}
.member-task-table .el-table__fixed-right .el-table__header th,
.member-task-table .el-table__fixed-right .el-table__body td {
  width: 8%;
}
</style>
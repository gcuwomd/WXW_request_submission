<template>
    <el-main class="detail-container">
        <el-card shadow="never" class="header-card">
            <el-page-header @back="goBack" title="返回任务列表">
                <template #content>
                    <span class="text-large font-600 mr-3"> 主任务详情及子任务管理 </span>
                    <el-tag :type="mainTaskData.tag === '已完成' ? 'success' : (mainTaskData.tag === '进行中' ? 'primary' : 'warning')" class="ml-2">
                        {{ mainTaskData.tag || '未知' }}
                    </el-tag>
                </template>
            </el-page-header>
        </el-card>

        <el-card shadow="hover" class="info-card">
            <template #header>
                <div class="card-header flex-between">
                    <span>主任务基本信息</span>
                    <el-button 
                        v-if="mainTaskData.tag === '待受理'" 
                        type="primary" 
                        @click="handleAcceptTask" 
                        :loading="isAccepting">
                        受理任务
                    </el-button>
                </div>
            </template>
            <el-descriptions :column="3" border>
                <el-descriptions-item label="任务名称">{{ mainTaskData.taskName }}</el-descriptions-item>
                <el-descriptions-item label="委托老师">{{ mainTaskData.teacher }}</el-descriptions-item>
                <el-descriptions-item label="要求时间">{{ mainTaskData.dateLimit }}</el-descriptions-item>
                <el-descriptions-item label="联系方式">{{ mainTaskData.phoneNumber }}</el-descriptions-item>
                <el-descriptions-item label="办公地址" :span="2">{{ mainTaskData.officeAddress }}</el-descriptions-item>
            </el-descriptions>
        </el-card>

        <el-card shadow="hover" class="sub-task-card">
            <template #header>
                <div class="card-header flex-between">
                    <span>关联子任务管理</span>
                    <el-button 
                        v-if="mainTaskData.tag === '进行中'" 
                        type="primary" 
                        @click="openCreateDialog">
                        + 发布子任务
                    </el-button>
                </div>
            </template>
            
            <div v-if="mainTaskData.tag === '待受理'" class="unaccepted-state">
                <el-empty description="该任务尚未受理，请先受理后再分配子任务">
                    <el-button type="primary" @click="handleAcceptTask" :loading="isAccepting">立即受理</el-button>
                </el-empty>
            </div>

            <el-table v-else :data="subTasks" style="width: 100%" border v-loading="loading">
                <template #empty><el-empty description="暂无关联的子任务" /></template>
                <el-table-column prop="taskName" label="子任务名称" min-width="150" />
                <el-table-column prop="officer" label="负责干事" width="120" />
                <el-table-column prop="deadline" label="截止时间" width="180" />
                <el-table-column prop="status" label="状态" width="120">
                    <template #default="scope">
                        <el-tag :type="getSubStatusType(scope.row.status)">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="280" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="info" plain @click="viewAttachments(scope.row)">
                            查看干事附件
                        </el-button>
                        <template v-if="scope.row.status !== '已完成'">
                            <el-popconfirm title="确定通过该任务并标记为已完成吗？" @confirm="handleAudit(scope.row, 2)">
                                <template #reference>
                                    <el-button size="small" type="success">通过</el-button>
                                </template>
                            </el-popconfirm>
                            <el-popconfirm title="确定打回该任务吗？" @confirm="handleAudit(scope.row, 0)">
                                <template #reference>
                                    <el-button size="small" type="danger">打回</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="createDialogVisible" title="发布子任务" width="600px" @close="resetCreateForm">
            <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="100px">
                <el-form-item label="子任务名称" prop="taskName">
                    <el-input v-model="createForm.taskName" placeholder="请输入子任务名称" />
                </el-form-item>
                <el-form-item label="任务详情" prop="taskDetail">
                    <el-input type="textarea" :rows="3" v-model="createForm.taskDetail" placeholder="请输入子任务详情描述" />
                </el-form-item>
                <el-form-item label="负责干事" prop="officer">
                    <el-select v-model="createForm.officer" placeholder="请选择负责干事" style="width: 100%;">
                        <el-option 
                            v-for="item in officerList" 
                            :key="item.id" 
                            :label="item.username" 
                            :value="item.username" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="截止时间" prop="deadline">
                    <el-date-picker 
                        v-model="createForm.deadline" 
                        type="datetime" 
                        placeholder="选择截止时间" 
                        value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%;" 
                    />
                </el-form-item>
                <el-form-item label="发布人" prop="administrator">
                    <el-input v-model="createForm.administrator" placeholder="请输入管理员姓名" />
                </el-form-item>
                <el-form-item label="联系电话" prop="adminPhone">
                    <el-input v-model="createForm.adminPhone" placeholder="请输入管理员联系电话" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="createDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="isCreating" @click="submitCreateForm">确定发布</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisible" title="干事提交的附件列表" width="50%">
            <el-table :data="currentAttachments" border>
                <template #empty><el-empty description="该干事尚未提交任何附件" :image-size="60"/></template>
                <el-table-column prop="object" label="文件名" />
                <el-table-column prop="createTime" label="上传时间" width="180">
                    <template #default="scope">
                        {{ formatDate(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-button type="primary" link @click="downloadFile(scope.row.object)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

    </el-main>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
    fetchSubTasks, 
    auditSubTask, 
    fetchReplyAttachments, 
    downloadReplyAttachment,
    createSubTask,
    fetchAllOfficers,
    updateMainStatus,
    fetchUserInfo // 引入新接口
} from '../../api/admin'

const router = useRouter()
const mainTaskData = ref<any>({})
const subTasks = ref([])
const loading = ref(false)

const dialogVisible = ref(false)
const currentAttachments = ref([])

const isAccepting = ref(false)

const createDialogVisible = ref(false)
const isCreating = ref(false)
const createFormRef = ref(null)
const officerList = ref([])

const createForm = reactive({
    taskName: '',
    taskDetail: '',
    officer: '',
    administrator: '',
    adminPhone: '',
    deadline: ''
})

const createRules = reactive({
    taskName: [{ required: true, message: '请输入子任务名称', trigger: 'blur' }],
    taskDetail: [{ required: true, message: '请输入任务详情', trigger: 'blur' }],
    officer: [{ required: true, message: '请选择负责干事', trigger: 'change' }],
    deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
    administrator: [{ required: true, message: '请输入发布人姓名', trigger: 'blur' }],
    adminPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
})

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

const getSubStatusType = (statusText) => {
    if (statusText === '已完成') return 'success'
    if (statusText === '进行中') return 'primary'
    if (statusText === '待受理') return 'info'
    return 'info'
}

onMounted(() => {
    const savedData = sessionStorage.getItem('currentAdminMainTask')
    if (savedData) {
        mainTaskData.value = JSON.parse(savedData)
        mainTaskData.value.dateLimit = formatDate(mainTaskData.value.dateLimit)
        
        if (mainTaskData.value.tag !== '待受理') {
            loadSubTasks()
        }
    } else {
        ElMessage.warning('丢失主任务数据，请重新进入')
        goBack()
    }
})

const goBack = () => {
    sessionStorage.removeItem('currentAdminMainTask')
    router.push('/admin/TaskList')
}

const handleAcceptTask = async () => {
    const mainId = mainTaskData.value.mainTaskID || mainTaskData.value.mainTaskId
    if (!mainId) return
    
    isAccepting.value = true
    try {
        await updateMainStatus(mainId, 1) 
        ElMessage.success('受理成功，现在可以发布子任务了')
        
        mainTaskData.value.tag = '进行中'
        sessionStorage.setItem('currentAdminMainTask', JSON.stringify(mainTaskData.value))
        
        loadSubTasks()
    } catch (error) {
        console.error('受理任务失败', error)
        ElMessage.error('受理任务失败，请检查网络或重试')
    } finally {
        isAccepting.value = false
    }
}

const loadSubTasks = async () => {
    const mainId = mainTaskData.value.mainTaskID || mainTaskData.value.mainTaskId
    if (!mainId) return
    
    loading.value = true
    try {
        const res = await fetchSubTasks(mainId)
        const rawList = res.data || []
        subTasks.value = rawList.map(item => ({
            ...item,
            status: formatStatus(item.status),
            deadline: formatDate(item.deadline)
        }))
    } catch (error) {
        console.error('获取子任务失败', error)
        ElMessage.error('无法加载子任务列表')
    } finally {
        loading.value = false
    }
}

// 修改：打开弹窗时先获取管理员部门，再拉取对应干事
const openCreateDialog = async () => {
    createDialogVisible.value = true
    if (officerList.value.length === 0) {
        try {
            // 1. 获取当前管理员部门 ID
            const userInfoRes = await fetchUserInfo()
            const currentDeptId = userInfoRes.data?.departmentId
            
            if (!currentDeptId) {
                ElMessage.error('未获取到您的部门信息，无法加载干事列表')
                return
            }

            // 2. 根据部门 ID 获取对应的干事
            const res = await fetchAllOfficers(currentDeptId)
            officerList.value = res.data || []
        } catch (error) {
            console.error('获取干事名单失败', error)
            ElMessage.error('获取干事列表失败，请检查网络')
        }
    }
}

const resetCreateForm = () => {
    if (createFormRef.value) {
        createFormRef.value.resetFields()
    }
}

const submitCreateForm = async () => {
    if (!createFormRef.value) return
    
    await createFormRef.value.validate(async (valid) => {
        if (valid) {
            isCreating.value = true
            try {
                const payload = {
                    ...createForm,
                    mainTaskId: mainTaskData.value.mainTaskID || mainTaskData.value.mainTaskId
                }
                
                await createSubTask(payload)
                ElMessage.success('子任务发布成功')
                createDialogVisible.value = false
                loadSubTasks()
            } catch (error) {
                console.error('发布子任务失败', error)
                ElMessage.error('发布失败，请检查填写内容或网络')
            } finally {
                isCreating.value = false
            }
        }
    })
}

const handleAudit = async (row: any, targetStatus: number) => {
    const sonId = row.sonTaskId || row.id
    if (!sonId) return

    try {
        await auditSubTask(sonId, targetStatus)
        ElMessage.success(targetStatus === 2 ? '任务已通过' : '任务已打回')
        loadSubTasks()
    } catch (error) {
        console.error('审核操作失败', error)
        ElMessage.error('操作失败，请重试')
    }
}

const viewAttachments = async (row: any) => {
    const breakdownId = row.sonTaskId || row.id
    if (!breakdownId) return
    
    currentAttachments.value = []
    try {
        const res = await fetchReplyAttachments(breakdownId)
        currentAttachments.value = res.data || []
        dialogVisible.value = true
    } catch (error) {
        console.error('获取回复附件失败', error)
        ElMessage.error('获取附件列表失败')
    }
}

const downloadFile = async (fileName: string) => {
    try {
        const res = await downloadReplyAttachment(fileName, '')
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
        ElMessage.error('文件下载失败')
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
.header-card, .info-card, .sub-task-card {
    margin-bottom: 20px;
    border-radius: 8px;
}
.card-header {
    font-weight: bold;
    font-size: 16px;
    color: #303133;
}
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.unaccepted-state {
    padding: 40px 0;
    display: flex;
    justify-content: center;
    background-color: #fafafa;
    border-radius: 4px;
}
</style>
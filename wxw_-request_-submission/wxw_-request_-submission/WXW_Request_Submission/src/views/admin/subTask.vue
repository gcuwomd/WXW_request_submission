<template>
  <div class="subtask-modal">
    <div class="modal-mask"></div>
    <div class="modal-container">
      <div class="modal-content">
        <h2 class="modal-title">创建子任务</h2>
        
        <el-form ref="ruleFormRef" class="subtask-form" :model="ruleForm" :rules="rules"
                label-width="100px" label-position="left">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入任务名称" />
          </el-form-item>
          
          
          <el-form-item label="被委托干事" prop="assignee" required>
            <el-select 
              v-model="ruleForm.assignee" 
              filterable
              placeholder="请选择被委托干事" 
              style="width: 100%">
              <el-option 
                v-for="item in assigneeOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="截止时间" required>
            <div class="datetime-picker">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择日期"
                style="width: 315px; margin-bottom: 10px;"
              />
              <el-time-picker
                v-model="ruleForm.date2"
                placeholder="选择时间"
                style="width: 317px;"
              />
            </div>
          </el-form-item>
          
          <el-form-item label="任务附件">
            <el-upload
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或<em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="任务描述" prop="desc">
            <el-input 
              v-model="ruleForm.desc" 
              type="textarea" 
              :rows="3"
              placeholder="请输入详细的任务描述和要求..."
              resize="none" />
          </el-form-item>
          
          <div style="text-align: center;">
            <el-button type="primary" @click="submitForm">
              创建
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form>
        <div class="bottom-button-container">
          <el-button type="primary" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { fetchDetail } from '../../api' // 引入与 TaskList 相同的 API

// 表单接口
interface RuleForm {
  name: string
  assignee: string
  date1: string
  date2: string
  desc: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  assignee: '',
  date1: '',
  date2: '',
  desc: '',
})

// 被委托干事选项
const assigneeOptions = ref<Array<{value: string, label: string}>>([])

// 表单规则
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
  ],
  assignee: [
    {
      required: true,
      message: '请选择被委托干事',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: '请选择日期',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: '请输入任务描述', trigger: 'blur' },
  ],
})

// 获取干事名单（与 TaskList 相同的方法）
async function getMemberNames() {
  try {
    const response = await fetchDetail()
    assigneeOptions.value = response.data.map(item => ({
      value: item.name,
      label: item.name,
    }))
  } catch (error) {
    console.error('没有获取到受理干事的姓名:', error)
    assigneeOptions.value = []
  }
}


// 重置表单
const resetForm = () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
}

// 提交表单
const submitForm = () => {
  if (!ruleFormRef.value) return
  
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      console.log('表单数据:', ruleForm)
      // 这里可以添加提交逻辑
      emit('submit', ruleForm)
      close()
    } else {
      console.log('表单验证失败')
    }
  })
}

// 关闭弹窗
const emit = defineEmits(['close', 'submit'])
const close = () => {
  emit('close')
}

// 挂载时获取干事名单
onMounted(() => {
  getMemberNames()
})
</script>

<style scoped>
.subtask-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-title {
  text-align: center;
  margin-bottom: 24px;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.subtask-form {
  width: 100%;
}

.datetime-picker {
  display: flex;
  flex-direction: space-between;
  gap: 20px;
}

.form-actions .el-button {
  margin: 0 8px;
  min-width: 80px;
}

/* 上传区域样式 */
:deep(.el-upload-dragger) {
  width: 650px;
  border-radius: 6px;
}

:deep(.el-upload__tip) {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

/* 表单项样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input) {
  border-radius: 4px;
}

:deep(.el-textarea__inner) {
  border-radius: 4px;
  resize: none;
}

.bottom-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}
</style>
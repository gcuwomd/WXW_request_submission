<template>
  <div class="admin-use-container">
    <!-- 主内容区域 -->
    <el-main class="content-area">
      <h2>管理员使用说明</h2>
      <el-card class="doc-card">
        <!-- 系统简介 -->
        <div class="doc-section">
          <h3 class="section-title">一、系统简介</h3>
          <p class="section-content">
            本系统是学生网络与信息工作委员会需求处理管理系统管理员端，主要用于接收老师提交的任务需求、分配任务给干事、审核任务完成情况以及查看反馈。
          </p>
        </div>

        <!-- 功能模块说明 -->
        <div class="doc-section">
          <h3 class="section-title">二、功能模块说明</h3>
          
          <div class="section-subtitle">2.1 任务列表：</div>
          <p class="section-content">
            展示所有老师提交的任务信息，包括任务名称、委托老师、截止时间、任务状态等。支持按状态筛选（待受理、进行中、已完成）、按任务名称搜索、按受理干事筛选。
          </p>
          
          <div class="section-subtitle">2.2 任务分配：</div>
          <p class="section-content">
            针对"待受理"状态的任务，可分配任务给具体干事。包含设置任务名称、选择任务人数、选择被委托干事、设置任务截止时间、上传任务描述附件、填写详细任务描述等功能。
          </p>
          
          <div class="section-subtitle">2.3 任务详情查看：</div>
          <p class="section-content">
            针对"进行中"状态的任务，可查看已分配的子任务详情，包括各干事的任务进度和状态，并可进入详细审核界面。
          </p>
          
          <div class="section-subtitle">2.4 任务审核：</div>
          <p class="section-content">
            针对干事提交的"待审核"任务，可进行审核操作，通过或打回干事的任务完成申请。
          </p>
        </div>

        <!-- 使用流程 -->
        <div class="doc-section">
          <h3 class="section-title">三、管理员工作流程</h3>
          
          <div class="section-subtitle">3.1 接收并分配新任务：</div>
          <p class="section-content">
            进入任务列表 → 找到"待受理"状态的任务 → 点击"任务详情" → 填写分配表单 → 点击"创建"分配任务
          </p>
          
          <div class="section-subtitle">3.2 查看任务进度：</div>
          <p class="section-content">
            进入任务列表 → 找到"进行中"状态的任务 → 点击"任务详情" → 查看各干事任务状态
          </p>
          
          <div class="section-subtitle">3.3 审核任务完成情况：</div>
          <p class="section-content">
            进入任务列表 → 找到"进行中"状态的任务 → 点击"任务详情" → 点击干事任务的"任务详情" → 审核附件内容 → 点击"通过"或"打回"
          </p>
          
          <div class="section-subtitle">3.4 筛选和搜索任务：</div>
          <p class="section-content">
            在任务列表页面使用状态筛选器、受理干事筛选器或任务名称搜索框快速定位特定任务。
          </p>
        </div>

        <!-- 状态说明 -->
        <div class="doc-section">
          <h3 class="section-title">四、任务状态说明</h3>
          <ul class="status-list">
            <li class="status-item">
              <el-tag type="info">待受理</el-tag> - 老师已提交，等待管理员分配干事
            </li>
            <li class="status-item">
              <el-tag type="primary">进行中</el-tag> - 已分配干事，任务执行中
            </li>
            <li class="status-item">
              <el-tag type="warning">待审核</el-tag> - 干事已提交完成证明，等待管理员审核
            </li>
            <li class="status-item">
              <el-tag type="success">已完成</el-tag> - 管理员已审核通过，任务完成
            </li>
            <li class="status-item">
              <el-tag type="danger">已打回</el-tag> - 管理员打回干事的完成申请，需要重新提交
            </li>
          </ul>
        </div>

        <!-- 注意事项 -->
        <div class="doc-section">
          <h3 class="section-title">五、注意事项</h3>
          <ul class="notice-list">
            <li>1. 只有"待受理"状态的任务才能进行分配操作</li>
            <li>2. 分配任务时需确保选择的干事人数与任务人数设置一致</li>
            <li>3. 任务截止时间必须设置，且应合理考虑任务复杂度</li>
            <li>4. 审核干事任务时，请仔细查看提交的完成证明附件</li>
          </ul>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'AdminUse',
  // 不需要导入 Header 和 Sidebar 组件
}
</script>

<style scoped>
.admin-use-container {
  display: flex;
  flex:1;
  min-height: 100vh;
  background-color: #f1f5f9;
}


.content-area {
  padding: 30px;
  min-height: calc(100vh - 60px);
}

.doc-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #334155;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 28px;
}

.doc-section {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.doc-section:last-child {
  border-bottom: none;
}

.section-title {
  color: #1e40af;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.section-subtitle {
  color: #3b82f6;
  font-size: 16px;
  margin: 15px 0 10px 0;
  font-weight: 500;
}

.section-content {
  color: #475569;
  line-height: 1.8;
  margin-left: 20px;
  margin-bottom: 10px;
}

.status-list, .notice-list {
  margin-left: 20px;
  color: #475569;
}

.status-item, .notice-list li {
  line-height: 1.8;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.status-item .el-tag {
  margin-right: 10px;
  min-width: 60px;
  flex-shrink: 0;
}

.notice-list li {
  list-style-type: decimal;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .content-area {
    padding: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
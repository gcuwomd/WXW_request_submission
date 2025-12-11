<template>
  <div class="member-use-container">
    <!-- 主内容区域 -->
    <el-main class="content-area">
      <h2>干事使用说明</h2>
      <el-card class="doc-card">
        <!-- 系统简介 -->
        <div class="doc-section">
          <h3 class="section-title">一、系统简介</h3>
          <p class="section-content">
            本系统是学生网络与信息工作委员会需求处理管理系统干事端，主要用于查看管理员分配的任务、受理任务、提交任务完成证明以及跟踪任务进度。
          </p>
        </div>

        <!-- 功能模块说明 -->
        <div class="doc-section">
          <h3 class="section-title">二、功能模块说明</h3>
          
          <div class="section-subtitle">2.1 任务列表：</div>
          <p class="section-content">
            展示管理员分配给您的所有任务，包括任务名称、发布者、截止时间、任务状态等。支持按状态筛选（进行中、已完成、被打回）、按任务名称搜索。
          </p>
          
          <div class="section-subtitle">2.2 任务详情：</div>
          <p class="section-content">
            查看任务的完整信息，包括工单ID、任务需求、相关附件、要求时间、发布者等。根据任务状态显示不同的操作按钮。
          </p>
          
          <div class="section-subtitle">2.3 任务受理：</div>
          <p class="section-content">
            针对"待受理"状态的任务，可点击"受理"按钮确认接收任务，任务状态将变为"进行中"。
          </p>
          
          <div class="section-subtitle">2.4 任务提交：</div>
          <p class="section-content">
            针对"进行中"或"被打回"状态的任务，可上传完成证明附件并提交任务，等待管理员审核。
          </p>
          
          <div class="section-subtitle">2.5 进度跟踪：</div>
          <p class="section-content">
            通过进度条直观查看任务当前状态：进行中 → 已完成 → 被打回。
          </p>
        </div>

        <!-- 使用流程 -->
        <div class="doc-section">
          <h3 class="section-title">三、干事工作流程</h3>
          
          <div class="section-subtitle">3.1 受理新任务流程：</div>
          <p class="section-content">
            进入任务列表 → 找到"待受理"状态的任务 → 点击"任务详情" → 点击"受理"按钮 → 任务状态变为"进行中"
          </p>
          
          <div class="section-subtitle">3.2 提交完成任务流程：</div>
          <p class="section-content">
            进入任务列表 → 找到"进行中"状态的任务 → 点击"任务详情" → 上传完成证明附件 → 点击"提交"按钮 → 等待管理员审核
          </p>
          
          <div class="section-subtitle">3.3 重新提交被打回任务：</div>
          <p class="section-content">
            进入任务列表 → 找到"被打回"状态的任务 → 点击"任务详情" → 修改并重新上传附件 → 点击"提交"按钮 → 再次等待审核
          </p>
          
          <div class="section-subtitle">3.4 查看任务进度：</div>
          <p class="section-content">
            进入任务列表 → 点击任意任务的"任务详情" → 查看右侧进度条了解当前状态
          </p>
        </div>

        <!-- 状态说明 -->
        <div class="doc-section">
          <h3 class="section-title">四、任务状态说明</h3>
          <ul class="status-list">
            <li class="status-item">
              <el-tag type="info">待受理</el-tag> - 管理员已分配任务，等待干事确认受理
            </li>
            <li class="status-item">
              <el-tag type="primary">进行中</el-tag> - 干事已受理任务，正在执行中
            </li>
            <li class="status-item">
              <el-tag type="warning">待审核</el-tag> - 干事已提交完成证明，等待管理员审核
            </li>
            <li class="status-item">
              <el-tag type="success">已完成</el-tag> - 管理员已审核通过，任务完成
            </li>
            <li class="status-item">
              <el-tag type="danger">被打回</el-tag> - 管理员审核不通过，需要重新提交
            </li>
          </ul>
        </div>

        <!-- 操作指南 -->
        <div class="doc-section">
          <h3 class="section-title">五、操作指南</h3>
          <ul class="notice-list">
            <li><strong>受理任务</strong>：只有"待受理"状态的任务才能点击"受理"按钮</li>
            <li><strong>提交任务</strong>：只有"进行中"或"被打回"状态的任务才能点击"提交"按钮</li>
            <li><strong>附件上传</strong>：支持拖拽上传，文件格式为 jpg/png，大小需小于500kb</li>
            <li><strong>进度查看</strong>：任务详情页右侧进度条实时显示任务当前状态</li>
            <li><strong>任务筛选</strong>：可通过状态筛选器快速找到特定状态的任务</li>
            <li><strong>任务搜索</strong>：可通过任务名称搜索框快速定位任务</li>
          </ul>
        </div>

        <!-- 注意事项 -->
        <div class="doc-section">
          <h3 class="section-title">六、注意事项</h3>
          <ul class="notice-list">
            <li>1. 请及时受理新分配的任务，避免任务延误</li>
            <li>2. 提交任务前请仔细检查上传的完成证明附件</li>
            <li>3. 任务被打回后请根据管理员反馈及时修改并重新提交</li>
            <li>4. 注意任务的截止时间，合理安排工作进度</li>
            <li>5. 如有问题及时通过系统联系任务发布者</li>
            <li>6. 系统只显示分配给您的任务，其他任务不可见</li>
          </ul>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'MemberUse',
}
</script>

<style scoped>
.member-use-container {
  flex: 1;
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
  list-style-type: none;
}

.notice-list li strong {
  color: #1e40af;
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
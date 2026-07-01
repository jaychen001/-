const state = {
  route: "dashboard",
  currentUserIndex: 0,
  selectedApprovalId: "AP-2026-001",
  selectedProjectId: "PRJ-CONTROL-001",
  selectedChangeId: "PC-2026-0001",
  pendingActionApprovalId: null,
  pendingImports: [],
  controlledProjects: [],
};

const users = [
  { name: "张工", role: "申请人 / 研发负责人", dept: "研发部", avatar: "张" },
  { name: "李工", role: "研发负责人", dept: "研发部", avatar: "李" },
  { name: "王经理", role: "项目经理", dept: "项目部", avatar: "王" },
  { name: "陈主管", role: "管理员", dept: "信息化部", avatar: "陈" },
  { name: "周总", role: "老板 / 管理层", dept: "管理层", avatar: "周" },
];

const titles = {
  dashboard: ["审批工作台", "工程变更、新项目下单和项目资料变更统一流转"],
  mine: ["我发起的", "跟踪本人提交的审批、退回修改和自动归档记录"],
  cc: ["抄送我的", "查看审批完成后的自动抄送和未读提醒"],
  "ecn-list": ["ECN 变更审批", "图纸、BOM、工艺、采购替代等工程变更闭环"],
  "ecn-form": ["发起 ECN 变更审批", "自动编号、自动流转、自动归档并抄送项目经理"],
  "project-list": ["新项目下单审批", "新设备、改造、复制和打样项目启动前确认"],
  "project-form": ["发起新项目下单审批", "审批通过后自动进入待导入项目池"],
  "project-progress": ["项目进度管控", "从已审批项目导入并自动生成标准项目节点"],
  "project-detail": ["项目进度详情", "查看节点时间轴、变更记录和操作记录"],
  "project-change": ["项目信息变更", "项目导入后的关键资料变化必须走审批"],
  "project-change-form": ["发起项目信息变更审批", "自动带出项目原资料并生成变更记录"],
  detail: ["审批详情", "查看业务内容、审批流程时间轴和自动化动作"],
  templates: ["审批流程配置", "维护 ECN、新项目下单、项目信息变更三类流程"],
};

const statusMap = {
  draft: "草稿",
  pending: "审批中",
  approved: "已通过",
  rejected: "已驳回",
  withdrawn: "已撤回",
  overdue: "已逾期",
  returned: "退回修改",
  archived: "已归档",
  unread: "未读",
  read: "已读",
  notStarted: "未开始",
  running: "进行中",
  delayed: "已延期",
  warning: "风险预警",
  completed: "已完成",
};

const approvalTasks = [
  {
    id: "AP-2026-001",
    no: "ECN-2026-0001",
    type: "ECN 变更",
    title: "光模块耦合设备结构变更",
    project: "光模块耦合设备改造项目",
    applicant: "张工",
    node: "研发负责人审批",
    status: "pending",
    startedAt: "2026-07-01 09:20",
    dueAt: "2026-07-02 09:20",
    ownerRole: "研发负责人",
    auto: ["自动编号", "自动流转到研发负责人", "24 小时超时提醒"],
  },
  {
    id: "AP-2026-002",
    no: "PJ-2026-0004",
    type: "新项目下单",
    title: "光学检测设备新项目下单",
    project: "光学检测设备项目",
    applicant: "王经理",
    node: "老板 / 管理层审批",
    status: "pending",
    startedAt: "2026-07-01 10:05",
    dueAt: "2026-07-02 10:05",
    ownerRole: "老板 / 管理层",
    auto: ["审批通过后生成项目编号", "自动进入待导入项目池", "自动抄送负责人"],
  },
  {
    id: "AP-2026-003",
    no: "PC-2026-0001",
    type: "项目信息变更",
    title: "光学耦合设备项目交期变更",
    project: "光学耦合设备项目",
    applicant: "赵工",
    node: "项目经理审批",
    status: "pending",
    startedAt: "2026-06-30 16:40",
    dueAt: "2026-07-01 16:40",
    ownerRole: "项目经理",
    auto: ["审批通过后更新项目交付日期", "自动重新计算未完成节点", "生成变更记录"],
  },
  {
    id: "AP-2026-004",
    no: "ECN-2026-0002",
    type: "ECN 变更",
    title: "夹具定位销尺寸变更",
    project: "XYZ 三轴平台项目",
    applicant: "李工",
    node: "项目经理确认影响",
    status: "overdue",
    startedAt: "2026-06-29 13:30",
    dueAt: "2026-06-30 13:30",
    ownerRole: "项目经理",
    auto: ["超时自动提醒", "逾期标红", "保留审批日志"],
  },
  {
    id: "AP-2026-005",
    no: "PJ-2026-0005",
    type: "新项目下单",
    title: "自动点胶设备项目启动",
    project: "自动点胶设备项目",
    applicant: "张工",
    node: "研发负责人确认资源",
    status: "approved",
    startedAt: "2026-06-28 09:00",
    dueAt: "2026-06-29 09:00",
    ownerRole: "研发负责人",
    auto: ["自动归档", "自动抄送机械/电气/软件负责人", "待导入项目池"],
  },
];

const ecnRecords = [
  {
    id: "ECN-2026-0001",
    project: "光模块耦合设备改造项目",
    title: "光模块耦合设备结构变更",
    type: "设计变更",
    before: "耦合机构固定支架采用单侧定位，装配后存在 0.8mm 干涉。",
    after: "固定支架改为双侧避让结构，安装孔整体右移 1.2mm，并同步更新装配图。",
    reason: "现场装配干涉，影响调试节拍。",
    impact: ["质量", "装配", "交期"],
    status: "pending",
    owner: "王工",
    verifier: "赵工",
    applicant: "张工",
    createdAt: "2026-07-01",
  },
  {
    id: "ECN-2026-0002",
    project: "XYZ 三轴平台项目",
    title: "夹具定位销尺寸变更",
    type: "工艺变更",
    before: "定位销直径 6mm，现场插拔阻力偏大。",
    after: "定位销直径调整为 5.95mm，并增加导入倒角。",
    reason: "降低装配阻力，提高换型效率。",
    impact: ["装配", "质量"],
    status: "overdue",
    owner: "李工",
    verifier: "王工",
    applicant: "李工",
    createdAt: "2026-06-29",
  },
  {
    id: "ECN-2026-0003",
    project: "XYZ 三轴平台项目",
    title: "XYZ 三轴平台采购替代",
    type: "采购替代",
    before: "原导轨品牌 A，交期 35 天。",
    after: "替换为品牌 B 同规格导轨，交期 12 天，需验证安装孔位。",
    reason: "原品牌交期无法满足客户交付节点。",
    impact: ["采购", "交期", "质量"],
    status: "approved",
    owner: "陈工",
    verifier: "赵工",
    applicant: "王经理",
    createdAt: "2026-06-25",
  },
];

const projectRequests = [
  {
    id: "PJ-2026-0004",
    customer: "客户 C",
    name: "光学检测设备新项目下单",
    device: "光学检测设备",
    type: "新设备",
    delivery: "2026-08-10",
    manager: "赵工",
    mech: "王工",
    electric: "李工",
    software: "陈工",
    requirement: "双工位视觉检测，自动扫码追溯，检测节拍小于 4 秒。",
    risk: "视觉算法验证时间紧，需要提前安排样件。",
    status: "pending",
    applicant: "王经理",
  },
  {
    id: "PJ-2026-0005",
    customer: "客户 D",
    name: "自动上下料设备项目启动",
    device: "自动上下料设备",
    type: "复制项目",
    delivery: "2026-09-15",
    manager: "李工",
    mech: "王工",
    electric: "赵工",
    software: "陈工",
    requirement: "兼容三种料盘，自动定位、扫码、上下料。",
    risk: "长周期气缸需提前锁定型号。",
    status: "approved",
    applicant: "张工",
  },
  {
    id: "PJ-2026-0006",
    customer: "客户 E",
    name: "自动点胶设备项目启动",
    device: "自动点胶设备",
    type: "打样项目",
    delivery: "2026-08-25",
    manager: "王经理",
    mech: "李工",
    electric: "赵工",
    software: "陈工",
    requirement: "点胶轨迹可配置，支持视觉定位和胶量检测。",
    risk: "点胶工艺窗口待客户确认。",
    status: "approved",
    applicant: "张工",
  },
];

const basePendingImports = [
  {
    id: "PJ-2026-0001",
    name: "光学耦合设备项目",
    customer: "客户 A",
    device: "光学耦合设备",
    manager: "王工",
    delivery: "2026-08-30",
    approvedAt: "2026-07-01 11:20",
  },
  {
    id: "PJ-2026-0002",
    name: "自动上下料设备项目",
    customer: "客户 B",
    device: "自动上下料设备",
    manager: "李工",
    delivery: "2026-09-15",
    approvedAt: "2026-07-01 12:10",
  },
  {
    id: "PJ-2026-0003",
    name: "光学检测设备项目",
    customer: "客户 C",
    device: "光学检测设备",
    manager: "赵工",
    delivery: "2026-08-10",
    approvedAt: "2026-06-30 17:45",
  },
];

const baseControlledProjects = [
  {
    id: "PRJ-CONTROL-001",
    no: "PJ-2026-0101",
    name: "光模块耦合设备改造项目",
    customer: "客户 A",
    device: "光模块耦合设备",
    manager: "王工",
    mech: "李工",
    electric: "赵工",
    software: "陈工",
    currentNode: "机械设计",
    status: "running",
    delivery: "2026-08-30",
    risk: "safe",
    progress: 36,
    version: "V1.1",
    lastChangedAt: "2026-06-30 17:40",
    lastChangedBy: "王工",
    nodes: [],
    changes: ["V1.0 项目下单审批通过生成", "V1.1 机械负责人调整"],
    logs: ["2026-07-01 张工 修改节点“方案评审”：状态 未开始 → 已完成"],
  },
  {
    id: "PRJ-CONTROL-002",
    no: "PJ-2026-0102",
    name: "XYZ 三轴平台项目",
    customer: "客户 B",
    device: "XYZ 三轴平台",
    manager: "李工",
    mech: "王工",
    electric: "赵工",
    software: "陈工",
    currentNode: "采购下单",
    status: "warning",
    delivery: "2026-08-18",
    risk: "warning",
    progress: 48,
    version: "V1.0",
    lastChangedAt: "2026-06-28 14:20",
    lastChangedBy: "李工",
    nodes: [],
    changes: ["V1.0 项目下单审批通过生成"],
    logs: ["2026-06-30 李工 增加采购风险备注：导轨交期需每日跟进"],
  },
  {
    id: "PRJ-CONTROL-003",
    no: "PJ-2026-0103",
    name: "自动点胶设备项目",
    customer: "客户 E",
    device: "自动点胶设备",
    manager: "王经理",
    mech: "李工",
    electric: "赵工",
    software: "陈工",
    currentNode: "装配",
    status: "delayed",
    delivery: "2026-08-25",
    risk: "danger",
    progress: 62,
    version: "V1.2",
    lastChangedAt: "2026-07-01 08:45",
    lastChangedBy: "赵工",
    nodes: [],
    changes: ["V1.0 项目下单审批通过生成", "V1.1 客户资料补充", "V1.2 调试节点延期"],
    logs: ["2026-07-01 赵工 修改节点“装配”：状态 进行中 → 已延期"],
  },
];

const projectChanges = [
  {
    id: "PC-2026-0001",
    project: "光学耦合设备项目",
    title: "交期变更：新增扫码追溯功能",
    type: "交期变更",
    before: "2026-08-30",
    after: "2026-09-15",
    reason: "客户新增扫码追溯功能，需要补充软件和电气调试时间。",
    impact: ["交期", "调试", "客户验收"],
    status: "pending",
    applicant: "赵工",
    approver: "王经理",
  },
  {
    id: "PC-2026-0002",
    project: "自动上下料设备项目",
    title: "负责人变更：机械负责人调整",
    type: "负责人变更",
    before: "机械负责人王工",
    after: "机械负责人李工",
    reason: "王工支援紧急项目，李工接手后续机械设计。",
    impact: ["设计", "装配"],
    status: "approved",
    applicant: "王经理",
    approver: "李工",
  },
  {
    id: "PC-2026-0003",
    project: "光学检测设备项目",
    title: "技术要求变更：单工位改双工位",
    type: "技术要求变更",
    before: "单工位检测",
    after: "双工位检测",
    reason: "客户产能要求提升，但现有空间和交期无法支撑。",
    impact: ["设计", "调试", "客户验收"],
    status: "rejected",
    applicant: "张工",
    approver: "周总",
  },
];

const templateNodes = [
  {
    name: "ECN 变更审批流程",
    type: "设计变更 / BOM 变更 / 工艺变更 / 采购替代",
    nodes: "申请人提交 → 研发负责人审批 → 项目经理确认影响 → 执行负责人处理 → 验证负责人确认",
    roles: "申请人、研发负责人、项目经理、执行负责人、验证负责人",
    timeout: "24 小时",
    cc: "项目经理 / 项目相关负责人",
    auto: "自动编号、自动流转、自动归档、自动抄送",
  },
  {
    name: "新项目下单审批流程",
    type: "新设备 / 改造项目 / 复制项目 / 打样项目",
    nodes: "申请人提交 → 项目经理确认 → 研发负责人确认资源 → 老板 / 管理层审批",
    roles: "申请人、项目经理、研发负责人、老板 / 管理层",
    timeout: "24 小时",
    cc: "机械、电气、软件负责人",
    auto: "自动生成项目编号、自动进入待导入池、自动创建项目节点",
  },
  {
    name: "项目信息变更审批流程",
    type: "交期变更 / 负责人变更 / 技术要求变更 / 项目范围变更",
    nodes: "申请人提交 → 项目经理审批 → 研发负责人审批 → 老板 / 管理层审批",
    roles: "申请人、项目经理、研发负责人、老板 / 管理层",
    timeout: "24 小时",
    cc: "项目相关负责人",
    auto: "自动更新项目资料、自动生成变更记录、自动重算节点",
  },
];

const approvalFlows = {
  "ECN 变更": ["申请人提交", "研发负责人审批", "项目经理确认影响", "执行负责人处理", "验证负责人确认", "自动归档并抄送"],
  新项目下单: ["申请人提交", "项目经理确认", "研发负责人确认资源", "老板 / 管理层审批", "自动生成项目编号", "自动创建项目节点", "抄送相关负责人"],
  项目信息变更: ["申请人提交", "项目经理审批", "研发负责人审批", "老板 / 管理层审批", "自动更新项目资料", "自动生成变更记录", "抄送相关负责人"],
};

state.pendingImports = [...basePendingImports];
state.controlledProjects = baseControlledProjects.map((project) => ({
  ...project,
  nodes: generateProjectNodes({
    approvedAt: "2026-07-01",
    delivery: project.delivery,
    manager: project.manager,
    mech: project.mech,
    electric: project.electric,
    software: project.software,
  }),
}));

function setRoute(route) {
  state.route = route;
  render();
}

function setApprovalDetail(id) {
  state.selectedApprovalId = id;
  setRoute("detail");
}

function setProjectDetail(id) {
  state.selectedProjectId = id;
  setRoute("project-detail");
}

function setChangeForm(projectId) {
  state.selectedProjectId = projectId || state.selectedProjectId;
  setRoute("project-change-form");
}

function getApproval(id) {
  return approvalTasks.find((item) => item.id === id) || approvalTasks[0];
}

function getApprovalFlow(task) {
  return approvalFlows[task.type] || approvalFlows["ECN 变更"];
}

function getCurrentStepIndex(task) {
  const flow = getApprovalFlow(task);
  if (task.status === "approved" || task.status === "archived") return flow.length - 1;
  if (task.status === "rejected" || task.status === "withdrawn") return Math.max(0, flow.indexOf(task.node));
  const exact = flow.indexOf(task.node);
  if (exact >= 0) return exact;
  const node = task.node || "";
  const fuzzy = flow.findIndex((step) => step.includes(node) || node.includes(step));
  return fuzzy >= 0 ? fuzzy : 1;
}

function getNextManualStepIndex(task) {
  const flow = getApprovalFlow(task);
  let index = getCurrentStepIndex(task) + 1;
  while (index < flow.length && flow[index].startsWith("自动")) {
    task.auto = [...task.auto, flow[index]];
    index += 1;
  }
  return Math.min(index, flow.length - 1);
}

function syncBusinessStatus(task, status) {
  if (task.type === "ECN 变更") {
    const record = ecnRecords.find((item) => item.id === task.no);
    if (record) record.status = status;
  }

  if (task.type === "新项目下单") {
    const record = projectRequests.find((item) => item.id === task.no);
    if (record) record.status = status;
  }

  if (task.type === "项目信息变更") {
    const record = projectChanges.find((item) => item.id === task.no);
    if (record) record.status = status;
  }
}

function statusBadge(status, text = statusMap[status] || status) {
  return `<span class="status ${status}">${text}</span>`;
}

function riskBadge(risk, text) {
  return `<span class="risk ${risk}">${text}</span>`;
}

function actionButton(label, action, cls = "ghost-btn", attrs = "") {
  return `<button class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;
}

function routeButton(label, route, cls = "ghost-btn") {
  return `<button class="${cls}" data-route="${route}">${label}</button>`;
}

function render() {
  const [title, subtitle] = titles[state.route] || titles.dashboard;
  document.querySelector("#page-title").textContent = title;
  document.querySelector("#page-subtitle").textContent = subtitle;

  const user = users[state.currentUserIndex];
  document.querySelector(".avatar").textContent = user.avatar;
  document.querySelector("#current-user-name").textContent = `当前用户：${user.name}`;
  document.querySelector("#current-user-role").textContent = `当前角色：${user.role}`;
  document.querySelector("#current-user-dept").textContent = `所属部门：${user.dept}`;

  const activeRoute = state.route === "detail" ? "dashboard" : state.route === "project-detail" ? "project-progress" : state.route;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.route === activeRoute);
  });

  const views = {
    dashboard: renderDashboard,
    mine: renderMine,
    cc: renderCc,
    "ecn-list": renderEcnList,
    "ecn-form": renderEcnForm,
    "project-list": renderProjectList,
    "project-form": renderProjectForm,
    "project-progress": renderProjectProgress,
    "project-detail": renderProjectDetail,
    "project-change": renderProjectChangeList,
    "project-change-form": renderProjectChangeForm,
    detail: renderApprovalDetail,
    templates: renderTemplates,
  };
  document.querySelector("#view-root").innerHTML = (views[state.route] || renderDashboard)();
}

function renderDashboard() {
  return `
    <div class="automation-strip">
      <div><strong>自动审批能力：</strong>自动编号、自动流转、自动抄送、24 小时超时提醒、审批完成自动归档、新项目自动创建项目节点。</div>
      ${actionButton("查看流程配置", "show-auto", "ghost-btn")}
    </div>
    <div class="summary-grid seven">
      ${metric("待我审批", "5")}
      ${metric("审批中", "9")}
      ${metric("已逾期", "2", "danger")}
      ${metric("本月 ECN", "14")}
      ${metric("本月新项目下单", "6")}
      ${metric("待导入项目", state.pendingImports.length, "warning")}
      ${metric("项目信息变更", "3")}
    </div>
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">审批任务</div>
          <div class="panel-subtitle">按当前角色过滤：${users[state.currentUserIndex].role}</div>
        </div>
        <div class="toolbar">${actionButton("刷新待办", "refresh")}${routeButton("发起审批", "ecn-form", "primary-btn")}</div>
      </div>
      ${renderFilters("approval")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>审批编号</th><th>类型</th><th>标题</th><th>关联项目</th><th>发起人</th><th>当前节点</th><th>当前状态</th><th>发起时间</th><th>截止时间</th><th>操作</th></tr></thead>
          <tbody>
            ${approvalTasks.map((task) => approvalRow(task)).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function approvalRow(task) {
  const flow = getApprovalFlow(task);
  const currentIndex = getCurrentStepIndex(task);
  return `
    <tr>
      <td>${task.no}</td>
      <td>${task.type}</td>
      <td>${task.title}</td>
      <td>${task.project}</td>
      <td>${task.applicant}</td>
      <td>${task.node}</td>
      <td>${statusBadge(task.status)}</td>
      <td>${task.startedAt}</td>
      <td>${task.dueAt}</td>
      <td class="button-row">
        <button class="ghost-btn" data-detail="${task.id}">查看</button>
        ${task.status === "pending" || task.status === "overdue" ? actionButton(`审批 ${currentIndex + 1}/${flow.length}`, "approve", "primary-btn", `data-id="${task.id}"`) : actionButton("已结束", "noop", "ghost-btn subtle")}
      </td>
    </tr>`;
}

function renderMine() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">我发起的审批</div>
          <div class="panel-subtitle">草稿、审批中、已归档记录统一查看</div>
        </div>
        ${actionButton("发起审批", "start-approval", "primary-btn")}
      </div>
      ${renderFilters("approval")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>审批编号</th><th>类型</th><th>标题</th><th>当前状态</th><th>当前节点</th><th>自动动作</th><th>操作</th></tr></thead>
          <tbody>
            ${approvalTasks.map((task) => `
              <tr>
                <td>${task.no}</td><td>${task.type}</td><td>${task.title}</td><td>${statusBadge(task.status)}</td><td>${task.node}</td>
                <td>${task.auto[0]}</td>
                <td class="button-row"><button class="ghost-btn" data-detail="${task.id}">查看</button>${actionButton("撤回", "withdraw")}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderCc() {
  const rows = approvalTasks.filter((task) => ["approved", "overdue"].includes(task.status));
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">自动抄送记录</div>
          <div class="panel-subtitle">审批完成后自动抄送项目经理和相关负责人</div>
        </div>
        ${actionButton("全部标记已读", "read-all")}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>审批编号</th><th>审批标题</th><th>类型</th><th>审批结果</th><th>抄送原因</th><th>阅读状态</th><th>操作</th></tr></thead>
          <tbody>
            ${rows.map((task, index) => `
              <tr>
                <td>${task.no}</td><td>${task.title}</td><td>${task.type}</td><td>${statusBadge(task.status)}</td>
                <td>流程完成后自动抄送</td><td>${statusBadge(index === 0 ? "unread" : "read")}</td>
                <td><button class="ghost-btn" data-detail="${task.id}">查看</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderEcnList() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">ECN 变更记录</div>
          <div class="panel-subtitle">设计、BOM、工艺、客户要求、采购替代统一审批</div>
        </div>
        ${routeButton("发起 ECN 变更", "ecn-form", "primary-btn")}
      </div>
      ${renderFilters("ecn")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>ECN 编号</th><th>关联项目</th><th>变更标题</th><th>变更类型</th><th>影响范围</th><th>执行负责人</th><th>验证负责人</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            ${ecnRecords.map((item) => `
              <tr>
                <td>${item.id}</td><td>${item.project}</td><td>${item.title}</td><td>${item.type}</td><td>${item.impact.join(" / ")}</td>
                <td>${item.owner}</td><td>${item.verifier}</td><td>${statusBadge(item.status)}</td>
                <td class="button-row"><button class="ghost-btn" data-ecn-detail="${item.id}">查看</button>${actionButton("提交", "submit")}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderEcnForm() {
  const project = state.controlledProjects.find((item) => item.id === state.selectedProjectId) || state.controlledProjects[0];
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">ECN 变更表单</div>
          <div class="panel-subtitle">自动编号 ECN-2026-0004，提交后流转到研发负责人</div>
        </div>
        <div class="button-row">${actionButton("保存草稿", "save-draft")}${actionButton("提交审批", "submit", "primary-btn")}${routeButton("返回列表", "ecn-list")}</div>
      </div>
      <div class="form-grid three">
        ${field("ECN 编号", "ECN-2026-0004")}
        ${field("关联项目", project?.name || "光模块耦合设备改造项目")}
        ${field("变更标题", "结构方案局部调整")}
        ${selectField("变更类型", ["设计变更", "BOM 变更", "工艺变更", "客户要求变更", "采购替代"])}
        ${selectField("执行负责人", ["王工", "李工", "赵工", "陈工"])}
        ${selectField("验证负责人", ["赵工", "王工", "李工", "陈工"])}
        ${textareaField("变更原因", "现场装配空间不足，需要调整结构方案。")}
        ${textareaField("变更前内容", "原方案采用单侧固定结构，线缆通过空间不足。")}
        ${textareaField("变更后内容", "改为双侧避让结构，并同步更新图纸和 BOM。")}
        ${checkGroup("影响范围", ["成本", "交期", "质量", "采购", "装配", "电气", "软件"], ["交期", "装配"])}
        ${choiceField("是否影响已采购物料")}
        ${choiceField("是否影响已加工零件")}
        ${choiceField("是否影响客户交期")}
        ${uploadBox("附件上传", ["图纸", "BOM", "截图", "客户邮件"])}
        ${textareaField("备注", "提交后自动抄送项目经理。")}
      </div>
    </section>`;
}

function renderProjectList() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">新项目下单审批</div>
          <div class="panel-subtitle">审批通过后自动生成项目编号并进入待导入项目池</div>
        </div>
        ${routeButton("发起新项目下单", "project-form", "primary-btn")}
      </div>
      ${renderFilters("project")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>项目编号</th><th>客户名称</th><th>项目名称</th><th>设备名称</th><th>项目类型</th><th>预计交付</th><th>项目经理</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            ${projectRequests.map((item) => `
              <tr>
                <td>${item.id}</td><td>${item.customer}</td><td>${item.name}</td><td>${item.device}</td><td>${item.type}</td><td>${item.delivery}</td><td>${item.manager}</td><td>${statusBadge(item.status)}</td>
                <td class="button-row"><button class="ghost-btn" data-project-request="${item.id}">查看</button>${actionButton("提交", "submit")}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderProjectForm() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">新项目下单表单</div>
          <div class="panel-subtitle">自动编号 PJ-2026-0007，审批通过后自动创建项目节点</div>
        </div>
        <div class="button-row">${actionButton("保存草稿", "save-draft")}${actionButton("提交审批", "submit", "primary-btn")}${routeButton("返回列表", "project-list")}</div>
      </div>
      <div class="form-grid three">
        ${field("项目编号", "PJ-2026-0007")}
        ${field("客户名称", "客户 F")}
        ${field("项目名称", "视觉检测分选设备项目")}
        ${field("设备名称", "视觉检测分选设备")}
        ${selectField("项目类型", ["新设备", "改造项目", "复制项目", "打样项目"])}
        ${field("预计交付日期", "2026-09-30", "date")}
        ${selectField("项目经理", ["王经理", "王工", "李工", "赵工"])}
        ${selectField("机械负责人", ["王工", "李工", "赵工"])}
        ${selectField("电气负责人", ["李工", "赵工", "陈工"])}
        ${selectField("软件负责人", ["陈工", "赵工", "李工"])}
        ${textareaField("技术要求说明", "设备需支持自动上料、视觉检测、NG 分选、扫码追溯。")}
        ${uploadBox("客户输入资料", ["技术协议", "客户图纸", "合同资料"])}
        ${textareaField("风险说明", "交期紧，视觉算法和样件验证需提前启动。")}
        ${textareaField("备注", "审批通过后自动抄送机械、电气、软件负责人。")}
      </div>
    </section>`;
}

function renderProjectProgress() {
  return `
    <div class="summary-grid six">
      ${metric("当前项目", state.controlledProjects.length)}
      ${metric("进行中项目", state.controlledProjects.filter((item) => item.status === "running").length)}
      ${metric("延期项目", state.controlledProjects.filter((item) => item.status === "delayed").length, "danger")}
      ${metric("本月交付", "5")}
      ${metric("待导入项目", state.pendingImports.length, "warning")}
      ${metric("风险预警项目", state.controlledProjects.filter((item) => item.status === "warning").length, "warning")}
    </div>
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">项目进度管控</div>
          <div class="panel-subtitle">新项目下单审批通过 → 待导入项目池 → 自动生成标准节点</div>
        </div>
        <div class="toolbar">${actionButton("导入当前项目", "open-import", "primary-btn")}${actionButton("新建临时项目", "temp-project", "ghost-btn subtle")}</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>项目编号</th><th>项目名称</th><th>客户名称</th><th>设备名称</th><th>项目经理</th><th>当前节点</th><th>当前状态</th><th>计划交付日期</th><th>延期风险</th><th>操作</th></tr></thead>
          <tbody>
            ${state.controlledProjects.map((project) => `
              <tr>
                <td>${project.no}</td><td>${project.name}</td><td>${project.customer}</td><td>${project.device}</td><td>${project.manager}</td><td>${project.currentNode}</td>
                <td>${statusBadge(project.status)}</td><td>${project.delivery}</td><td>${riskBadge(project.risk, riskText(project.risk))}</td>
                <td class="button-row">
                  <button class="ghost-btn" data-project-detail="${project.id}">查看进度</button>
                  ${actionButton("编辑节点", "edit-node", "ghost-btn", `data-project="${project.id}"`)}
                  ${actionButton("项目信息变更", "project-change-from-project", "ghost-btn", `data-project="${project.id}"`)}
                  ${actionButton("发起 ECN", "ecn-from-project", "ghost-btn", `data-project="${project.id}"`)}
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderProjectDetail() {
  const project = state.controlledProjects.find((item) => item.id === state.selectedProjectId) || state.controlledProjects[0];
  return `
    <div class="detail-grid project-detail-layout">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">${project.name}</div>
            <div class="panel-subtitle">${project.no} · ${project.customer} · ${project.device}</div>
          </div>
          <div class="button-row">
            ${actionButton("编辑节点", "edit-node", "primary-btn", `data-project="${project.id}"`)}
            ${actionButton("发起项目信息变更", "project-change-from-project", "ghost-btn", `data-project="${project.id}"`)}
            ${actionButton("发起 ECN 变更", "ecn-from-project", "ghost-btn", `data-project="${project.id}"`)}
            ${actionButton("查看变更记录", "show-change-records")}
          </div>
        </div>
        <div class="info-list three-cols">
          ${info("项目经理", project.manager)}
          ${info("机械 / 电气 / 软件", `${project.mech} / ${project.electric} / ${project.software}`)}
          ${info("计划交付日期", project.delivery)}
          ${info("当前版本", project.version)}
          ${info("最近一次变更", `${project.lastChangedAt} · ${project.lastChangedBy}`)}
          ${info("当前状态", statusBadge(project.status))}
        </div>
        <div class="progress-block">
          <div class="progress-info"><span>整体进度</span><strong>${project.progress}%</strong></div>
          <div class="progress-track"><div style="width:${project.progress}%"></div></div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">节点时间轴</div></div>
        <div class="node-strip detail-nodes">
          ${project.nodes.map((node, index) => renderTimeNode(node, index)).join("")}
        </div>
      </section>
      <section class="panel wide">
        <div class="panel-header"><div class="panel-title">项目节点表格</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>节点名称</th><th>计划完成时间</th><th>实际完成时间</th><th>负责人</th><th>当前状态</th><th>是否延期</th><th>备注</th></tr></thead>
            <tbody>
              ${project.nodes.map((node) => `
                <tr><td>${node.name}</td><td>${node.plan}</td><td>${node.actual || "-"}</td><td>${node.owner}</td><td>${statusBadge(node.status)}</td><td>${node.delayed ? "是" : "否"}</td><td>${node.note}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">变更记录</div></div>
        <div class="timeline">${project.changes.map((item) => `<div class="log-item"><div class="log-title">${item}</div><div class="log-meta">自动生成项目资料版本记录</div></div>`).join("")}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">操作记录</div></div>
        <div class="timeline">${project.logs.map((item) => `<div class="log-item"><div class="log-title">${item}</div><div class="log-meta">普通进度信息允许直接编辑，但保留记录</div></div>`).join("")}</div>
      </section>
    </div>`;
}

function renderProjectChangeList() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">项目信息变更</div>
          <div class="panel-subtitle">关键资料不能直接覆盖，必须通过审批生成版本记录</div>
        </div>
        ${routeButton("发起项目信息变更", "project-change-form", "primary-btn")}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>变更编号</th><th>关联项目</th><th>变更标题</th><th>变更类型</th><th>变更前</th><th>变更后</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            ${projectChanges.map((item) => `
              <tr>
                <td>${item.id}</td><td>${item.project}</td><td>${item.title}</td><td>${item.type}</td><td>${item.before}</td><td>${item.after}</td><td>${statusBadge(item.status)}</td>
                <td class="button-row"><button class="ghost-btn" data-change-detail="${item.id}">查看</button>${actionButton("提交", "submit")}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderProjectChangeForm() {
  const project = state.controlledProjects.find((item) => item.id === state.selectedProjectId) || state.controlledProjects[0];
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">项目信息变更表单</div>
          <div class="panel-subtitle">自动编号 PC-2026-0004，审批通过后自动更新项目资料并生成变更记录</div>
        </div>
        <div class="button-row">${actionButton("保存草稿", "save-draft")}${actionButton("提交审批", "submit", "primary-btn")}${routeButton("返回列表", "project-change")}</div>
      </div>
      <div class="form-grid three">
        ${field("变更编号", "PC-2026-0004")}
        ${field("关联项目", project.name)}
        ${field("变更标题", `${project.name} 交付计划调整`)}
        ${selectField("变更类型", ["交期变更", "技术要求变更", "项目范围变更", "负责人变更", "客户资料变更", "其他"])}
        ${textareaField("变更原因", "客户补充功能需求，需要调整未完成节点计划。")}
        ${textareaField("变更前内容", `计划交付日期：${project.delivery}；项目经理：${project.manager}`)}
        ${textareaField("变更后内容", "计划交付日期调整为 2026-09-15；未完成节点重新计算。")}
        ${checkGroup("影响范围", ["成本", "交期", "采购", "设计", "装配", "调试", "客户验收"], ["交期", "调试"])}
        ${choiceField("是否需要重新计算项目节点")}
        ${choiceField("是否需要通知相关负责人")}
        ${uploadBox("附件上传", ["客户邮件", "技术协议", "会议纪要"])}
        ${field("申请人", users[state.currentUserIndex].name)}
        ${selectField("审批人", ["王经理", "李工", "周总"])}
        ${field("抄送人", "机械负责人 / 电气负责人 / 软件负责人")}
        ${textareaField("备注", "小改动直接编辑留记录；关键资料变化走项目信息变更审批；图纸/BOM/设计方案变化走 ECN。")}
      </div>
    </section>`;
}

function renderApprovalDetail() {
  const task = approvalTasks.find((item) => item.id === state.selectedApprovalId) || approvalTasks[0];
  const ecn = ecnRecords[0];
  const change = projectChanges[0];
  const isChange = task.type === "项目信息变更";
  const flow = getApprovalFlow(task);
  const currentIndex = getCurrentStepIndex(task);
  return `
    <div class="detail-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">${task.title}</div>
            <div class="panel-subtitle">${task.no} · ${task.type}</div>
          </div>
          <div class="button-row">
            ${actionButton("通过", "approve", "success-btn")}
            ${actionButton("驳回", "reject", "danger-btn")}
            ${actionButton("转交", "transfer")}
            ${actionButton("加签", "countersign")}
            ${actionButton("评论", "comment")}
          </div>
        </div>
        <div class="info-list">
          ${info("关联项目", task.project)}
          ${info("发起人", task.applicant)}
          ${info("当前节点", task.node)}
          ${info("当前状态", statusBadge(task.status))}
          ${info("发起时间", task.startedAt)}
          ${info("截止时间", task.dueAt)}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">自动化动作</div></div>
        <div class="auto-list">${task.auto.map((item) => `<span>${item}</span>`).join("")}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">${isChange ? "变更前 / 变更后对比" : "变更前后对比"}</div></div>
        <div class="compare-grid">
          <div><div class="compare-label">变更前</div><p>${isChange ? change.before : ecn.before}</p></div>
          <div><div class="compare-label">变更后</div><p>${isChange ? change.after : ecn.after}</p></div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">审批流程时间轴</div></div>
        <div class="steps flow-steps">
          ${flow.map((step, index) => `
            <div class="step ${task.status === "rejected" && index === currentIndex ? "risk" : index < currentIndex || task.status === "approved" ? "done" : index === currentIndex ? "now" : ""}">
              <div class="step-dot">${index + 1}</div><div><div class="step-title">${step}</div><div class="step-meta">${task.status === "rejected" && index === currentIndex ? "已驳回" : index < currentIndex || task.status === "approved" ? "已完成" : index === currentIndex ? "当前节点" : "待流转"}</div></div>
            </div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div class="panel-title">附件资料</div></div>
        <div class="attachment-list">
          <div>图纸：DRW-2026-041-A.pdf</div>
          <div>BOM：BOM-2026-088.xlsx</div>
          <div>客户邮件：客户变更要求.eml</div>
        </div>
      </section>
    </div>`;
}

function renderTemplates() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">审批流程模板</div>
          <div class="panel-subtitle">展示自动流转、超时提醒、自动抄送和自动动作配置</div>
        </div>
        ${actionButton("新增流程", "new-template", "primary-btn")}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>流程名称</th><th>适用类型</th><th>审批节点</th><th>审批角色</th><th>是否启用</th><th>超时提醒</th><th>自动抄送对象</th><th>自动动作</th><th>操作</th></tr></thead>
          <tbody>
            ${templateNodes.map((item) => `
              <tr>
                <td>${item.name}</td><td>${item.type}</td><td class="wrap-cell">${item.nodes}</td><td class="wrap-cell">${item.roles}</td><td>${statusBadge("approved", "启用")}</td>
                <td>${item.timeout}</td><td>${item.cc}</td><td class="wrap-cell">${item.auto}</td><td>${actionButton("编辑", "edit")}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderFilters(type) {
  const placeholder = type === "ecn" ? "ECN 编号 / 变更标题 / 项目名称" : type === "project" ? "项目编号 / 客户名称 / 项目名称" : "审批编号 / 标题 / 发起人";
  return `
    <div class="filters">
      <input placeholder="${placeholder}" />
      <select><option>全部状态</option><option>草稿</option><option>审批中</option><option>已通过</option><option>已驳回</option><option>已逾期</option></select>
      <select><option>全部类型</option><option>ECN 变更</option><option>新项目下单</option><option>项目信息变更</option></select>
      <input type="date" />
      <div class="button-row">${actionButton("查询", "search", "primary-btn")}${actionButton("重置", "reset")}</div>
    </div>`;
}

function metric(label, value, tone = "") {
  return `<div class="metric ${tone}"><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div>`;
}

function field(label, value, type = "text") {
  return `<div class="field"><label>${label}</label><input type="${type}" value="${value}" /></div>`;
}

function selectField(label, options) {
  return `<div class="field"><label>${label}</label><select>${options.map((option) => `<option>${option}</option>`).join("")}</select></div>`;
}

function textareaField(label, value) {
  return `<div class="field full"><label>${label}</label><textarea>${value}</textarea></div>`;
}

function choiceField(label) {
  return `<div class="field"><label>${label}</label><div class="segmented"><button type="button" class="active">是</button><button type="button">否</button></div></div>`;
}

function checkGroup(label, options, active = []) {
  return `
    <div class="field full">
      <label>${label}</label>
      <div class="check-grid">
        ${options.map((option) => `<label class="check-pill"><input type="checkbox" ${active.includes(option) ? "checked" : ""} /> ${option}</label>`).join("")}
      </div>
    </div>`;
}

function uploadBox(label, items) {
  return `
    <div class="field full">
      <label>${label}</label>
      <div class="upload-box">${items.map((item) => `<button type="button" class="ghost-btn">${item}</button>`).join("")}<span>拖拽或点击上传附件</span></div>
    </div>`;
}

function info(label, value) {
  return `<div class="info-item"><div class="info-label">${label}</div><div class="info-value">${value}</div></div>`;
}

function renderTimeNode(node, index) {
  return `
    <div class="time-node ${node.status}">
      <div class="node-index">${index + 1}</div>
      <div class="node-name">${node.name}</div>
      <div class="node-date">${node.plan}</div>
      <div class="node-owner">${node.owner}</div>
    </div>`;
}

function generateProjectNodes(project) {
  const approvedDate = new Date(project.approvedAt || "2026-07-01");
  const deliveryDate = new Date(project.delivery);
  const rules = [
    ["项目下单", 0, project.manager, "completed"],
    ["方案评审", 3, project.manager, "completed"],
    ["机械设计", 10, project.mech || project.manager, "running"],
    ["电气设计", 15, project.electric || project.manager, "notStarted"],
    ["BOM 输出", 18, project.mech || project.manager, "notStarted"],
    ["采购下单", 20, project.manager, "notStarted"],
    ["零件加工", 30, project.manager, "notStarted"],
    ["装配", 40, project.mech || project.manager, "notStarted"],
    ["调试", 50, project.software || project.manager, "notStarted"],
    ["客户验收", -5, project.manager, "notStarted"],
    ["项目交付", 0, project.manager, "notStarted"],
  ];

  return rules.map(([name, offset, owner, status], index) => {
    const date = name === "客户验收" ? addDays(deliveryDate, -5) : name === "项目交付" ? deliveryDate : addDays(approvedDate, offset);
    const delayed = date > deliveryDate;
    return {
      name,
      plan: formatDate(date),
      actual: status === "completed" ? formatDate(date) : "",
      owner,
      status: delayed ? "warning" : status,
      delayed,
      note: index === 0 ? "审批通过自动生成" : delayed ? "计划时间超过交付日期，系统提示风险" : "系统按模板自动生成",
    };
  });
}

function importProject(projectId) {
  const item = state.pendingImports.find((project) => project.id === projectId);
  if (!item) return;
  const newProject = {
    id: `PRJ-CONTROL-${Date.now()}`,
    no: item.id,
    name: item.name,
    customer: item.customer,
    device: item.device,
    manager: item.manager,
    mech: "王工",
    electric: "李工",
    software: "陈工",
    currentNode: "项目下单",
    status: "notStarted",
    delivery: item.delivery,
    risk: "safe",
    progress: 8,
    version: "V1.0",
    lastChangedAt: item.approvedAt,
    lastChangedBy: "系统",
    nodes: generateProjectNodes({ ...item, mech: "王工", electric: "李工", software: "陈工" }),
    changes: ["V1.0 新项目下单审批通过生成"],
    logs: [`${item.approvedAt} 系统从待导入项目池导入，并自动生成 11 个标准节点`],
  };
  state.pendingImports = state.pendingImports.filter((project) => project.id !== projectId);
  state.controlledProjects.unshift(newProject);
  state.selectedProjectId = newProject.id;
  closeModal();
  openModal("导入成功", `<p>${item.name} 已进入项目进度管控列表，系统已自动生成非标自动化项目标准节点模板。</p><div class="button-row"><button class="primary-btn" data-project-detail="${newProject.id}">立即查看进度</button></div>`);
  render();
}

function approveItem(approvalId) {
  const task = getApproval(approvalId || state.selectedApprovalId);
  if (!["pending", "overdue"].includes(task.status)) {
    closeModal();
    openModal("流程已结束", `<p>${task.no} 当前状态为 ${statusMap[task.status]}，不能继续审批。</p>`);
    return;
  }

  const flow = getApprovalFlow(task);
  const currentIndex = getCurrentStepIndex(task);
  const nextIndex = getNextManualStepIndex(task);

  if (nextIndex < flow.length - 1) {
    task.status = "pending";
    task.node = flow[nextIndex];
    task.auto = [...task.auto, `${flow[currentIndex]} 已通过，自动流转到 ${flow[nextIndex]}`];
    syncBusinessStatus(task, "pending");
    closeModal();
    openModal("已流转到下一节点", `<p>${task.no} 已通过“${flow[currentIndex]}”，当前节点变为“${flow[nextIndex]}”。</p>`);
    render();
    return;
  }

  task.status = "approved";
  task.node = "流程完成";
  task.auto = [...task.auto, `${flow[currentIndex]} 已通过`, "审批完成自动归档", "自动抄送相关负责人"];
  syncBusinessStatus(task, "approved");

  if (task.type === "新项目下单" && !state.pendingImports.some((item) => item.id === task.no)) {
    state.pendingImports.unshift({
      id: task.no,
      name: task.project,
      customer: "审批通过客户",
      device: task.project.replace("项目", "设备"),
      manager: "王经理",
      delivery: "2026-09-30",
      approvedAt: "2026-07-01 14:30",
    });
  }

  if (task.type === "项目信息变更") {
    const project = state.controlledProjects[0];
    project.version = project.version === "V1.1" ? "V1.2" : "V1.1";
    project.lastChangedAt = "2026-07-01 14:30";
    project.lastChangedBy = users[state.currentUserIndex].name;
    project.changes.unshift(`${project.version} ${task.title}审批通过，系统自动生成变更记录`);
  }

  closeModal();
  openModal("审批通过", `<p>${task.no} 已通过。系统已自动流转、归档并执行后续动作。</p>`);
  render();
}

function rejectItem(approvalId, reason) {
  const task = getApproval(approvalId || state.selectedApprovalId);
  if (!["pending", "overdue"].includes(task.status)) {
    closeModal();
    openModal("流程已结束", `<p>${task.no} 当前状态为 ${statusMap[task.status]}，不能驳回。</p>`);
    return;
  }
  task.status = "rejected";
  task.node = "流程终止";
  task.auto = [...task.auto, `驳回原因：${reason}`];
  syncBusinessStatus(task, "rejected");
  closeModal();
  openModal("已驳回", `<p>${task.no} 已驳回，原因已写入审批日志：${reason}</p>`);
  render();
}

function submitCurrentForm() {
  const now = "2026-07-01 15:00";
  const due = "2026-07-02 15:00";
  const route = state.route;
  let task;

  if (route === "ecn-form") {
    const nextNo = `ECN-2026-${String(ecnRecords.length + 1).padStart(4, "0")}`;
    ecnRecords.unshift({
      id: nextNo,
      project: "光模块耦合设备改造项目",
      title: "结构方案局部调整",
      type: "设计变更",
      before: "原方案采用单侧固定结构，线缆通过空间不足。",
      after: "改为双侧避让结构，并同步更新图纸和 BOM。",
      reason: "现场装配空间不足，需要调整结构方案。",
      impact: ["交期", "装配"],
      status: "pending",
      owner: "王工",
      verifier: "赵工",
      applicant: users[state.currentUserIndex].name,
      createdAt: "2026-07-01",
    });
    task = {
      id: `AP-2026-${String(approvalTasks.length + 1).padStart(3, "0")}`,
      no: nextNo,
      type: "ECN 变更",
      title: "结构方案局部调整",
      project: "光模块耦合设备改造项目",
      applicant: users[state.currentUserIndex].name,
      node: "研发负责人审批",
      status: "pending",
      startedAt: now,
      dueAt: due,
      ownerRole: "研发负责人",
      auto: ["自动编号", "自动匹配 ECN 流程", "自动流转到研发负责人"],
    };
  }

  if (route === "project-form") {
    const nextNo = `PJ-2026-${String(projectRequests.length + 7).padStart(4, "0")}`;
    projectRequests.unshift({
      id: nextNo,
      customer: "客户 F",
      name: "视觉检测分选设备项目",
      device: "视觉检测分选设备",
      type: "新设备",
      delivery: "2026-09-30",
      manager: "王经理",
      mech: "王工",
      electric: "李工",
      software: "陈工",
      requirement: "自动上料、视觉检测、NG 分选、扫码追溯。",
      risk: "视觉算法和样件验证需提前启动。",
      status: "pending",
      applicant: users[state.currentUserIndex].name,
    });
    task = {
      id: `AP-2026-${String(approvalTasks.length + 1).padStart(3, "0")}`,
      no: nextNo,
      type: "新项目下单",
      title: "视觉检测分选设备项目",
      project: "视觉检测分选设备项目",
      applicant: users[state.currentUserIndex].name,
      node: "项目经理确认",
      status: "pending",
      startedAt: now,
      dueAt: due,
      ownerRole: "项目经理",
      auto: ["自动生成项目编号", "自动匹配新项目下单流程", "自动流转到项目经理"],
    };
  }

  if (route === "project-change-form") {
    const nextNo = `PC-2026-${String(projectChanges.length + 1).padStart(4, "0")}`;
    const project = state.controlledProjects.find((item) => item.id === state.selectedProjectId) || state.controlledProjects[0];
    projectChanges.unshift({
      id: nextNo,
      project: project.name,
      title: `${project.name} 交付计划调整`,
      type: "交期变更",
      before: project.delivery,
      after: "2026-09-15",
      reason: "客户补充功能需求，需要调整未完成节点计划。",
      impact: ["交期", "调试"],
      status: "pending",
      applicant: users[state.currentUserIndex].name,
      approver: "王经理",
    });
    task = {
      id: `AP-2026-${String(approvalTasks.length + 1).padStart(3, "0")}`,
      no: nextNo,
      type: "项目信息变更",
      title: `${project.name} 交付计划调整`,
      project: project.name,
      applicant: users[state.currentUserIndex].name,
      node: "项目经理审批",
      status: "pending",
      startedAt: now,
      dueAt: due,
      ownerRole: "项目经理",
      auto: ["自动生成变更编号", "自动带出项目原资料", "自动流转到项目经理"],
    };
  }

  if (!task) {
    openModal("提交审批", "<p>当前页面没有可提交的审批表单。</p>");
    return;
  }

  approvalTasks.unshift(task);
  state.selectedApprovalId = task.id;
  openModal("提交成功", `<p>${task.no} 已提交审批，当前节点：${task.node}。</p><div class="button-row"><button class="primary-btn" data-route="dashboard">返回审批工作台</button><button class="ghost-btn" data-detail="${task.id}">查看审批详情</button></div>`);
  render();
}

function addOperationLog(projectId) {
  const project = state.controlledProjects.find((item) => item.id === projectId);
  if (!project) return;
  project.logs.unshift(`2026-07-01 ${users[state.currentUserIndex].name} 修改节点“机械设计”：负责人 王工 → 李工，状态 未开始 → 进行中`);
  project.currentNode = "机械设计";
  project.status = "running";
  project.progress = Math.max(project.progress, 42);
  closeModal();
  openModal("节点已更新", "<p>普通进度信息已直接保存，并自动写入操作记录。</p>");
  render();
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function riskText(risk) {
  return risk === "danger" ? "已延期" : risk === "warning" ? "风险预警" : "正常";
}

function openModal(title, body, footer = "") {
  document.querySelector("#modal-title").textContent = title;
  document.querySelector("#modal-body").innerHTML = body;
  document.querySelector(".modal-footer").innerHTML = footer || `<button class="ghost-btn" data-action="close-modal">取消</button><button class="primary-btn" data-action="close-modal">确认</button>`;
  document.querySelector("#modal").classList.remove("hidden");
}

function closeModal() {
  document.querySelector("#modal").classList.add("hidden");
}

function openStartApproval() {
  openModal(
    "请选择审批类型",
    `<div class="choice-list">
      <button data-route="ecn-form">ECN 变更审批</button>
      <button data-route="project-form">新项目下单审批</button>
      <button data-route="project-change-form">项目信息变更审批</button>
    </div>`,
    `<button class="ghost-btn" data-action="close-modal">关闭</button>`,
  );
}

function openImportModal() {
  openModal(
    "导入当前项目",
    `<p>只显示来自新项目下单审批、已通过且尚未导入进度管控的项目。</p>
    <div class="table-wrap modal-table">
      <table>
        <thead><tr><th>项目编号</th><th>项目名称</th><th>客户名称</th><th>设备名称</th><th>项目经理</th><th>预计交付</th><th>审批通过时间</th><th>操作</th></tr></thead>
        <tbody>
          ${state.pendingImports.map((item) => `
            <tr><td>${item.id}</td><td>${item.name}</td><td>${item.customer}</td><td>${item.device}</td><td>${item.manager}</td><td>${item.delivery}</td><td>${item.approvedAt}</td><td><button class="primary-btn" data-import="${item.id}">导入</button></td></tr>`).join("") || `<tr><td colspan="8">暂无待导入项目</td></tr>`}
        </tbody>
      </table>
    </div>`,
    `<button class="ghost-btn" data-action="close-modal">关闭</button>`,
  );
}

function openEditNode(projectId) {
  const project = state.controlledProjects.find((item) => item.id === projectId) || state.controlledProjects[0];
  openModal(
    "编辑项目节点",
    `<div class="form-grid modal-form">
      ${selectField("节点名称", project.nodes.map((node) => node.name))}
      ${selectField("节点状态", ["未开始", "进行中", "已完成", "已延期", "风险预警"])}
      ${selectField("负责人", ["王工", "李工", "赵工", "陈工"])}
      ${field("实际完成时间", "2026-07-01", "date")}
      ${textareaField("节点备注", "普通进度信息可直接编辑，保存后自动生成操作记录。")}
    </div>`,
    `<button class="ghost-btn" data-action="close-modal">取消</button><button class="primary-btn" data-save-node="${project.id}">保存节点</button>`,
  );
}

function openRejectModal() {
  state.pendingActionApprovalId = state.pendingActionApprovalId || state.selectedApprovalId;
  openModal(
    "审批驳回",
    `<p>驳回必须填写原因，确认后流程终止并写入审批日志。</p><textarea id="reject-reason" placeholder="请输入驳回原因"></textarea><div id="reject-error" class="form-error"></div>`,
    `<button class="ghost-btn" data-action="close-modal">取消</button><button class="danger-btn" data-action="confirm-reject">确认驳回</button>`,
  );
}

function openApproveModal(approvalId) {
  state.pendingActionApprovalId = approvalId || state.selectedApprovalId;
  const task = getApproval(state.pendingActionApprovalId);
  openModal(
    "审批通过",
    `<p>${task.no} ${task.title}</p><p>确认通过后，系统将自动流转到下一节点；如果当前为最终节点，将自动归档并执行抄送或项目导入准备。</p><textarea placeholder="审批意见">同意，按流程继续执行。</textarea>`,
    `<button class="ghost-btn" data-action="close-modal">取消</button><button class="success-btn" data-action="confirm-approve">确认通过</button>`,
  );
}

function openEcnDetail(ecnId) {
  const item = ecnRecords.find((record) => record.id === ecnId) || ecnRecords[0];
  openModal(
    "ECN 变更详情",
    `<div class="info-list">
      ${info("ECN 编号", item.id)}
      ${info("关联项目", item.project)}
      ${info("变更类型", item.type)}
      ${info("状态", statusBadge(item.status))}
      ${info("执行负责人", item.owner)}
      ${info("验证负责人", item.verifier)}
    </div>
    <div class="compare-grid">
      <div><div class="compare-label">变更前</div><p>${item.before}</p></div>
      <div><div class="compare-label">变更后</div><p>${item.after}</p></div>
    </div>
    <div class="auto-list">${item.impact.map((tag) => `<span>影响范围：${tag}</span>`).join("")}</div>`,
  );
}

function openProjectRequestDetail(projectId) {
  const item = projectRequests.find((record) => record.id === projectId) || projectRequests[0];
  openModal(
    "新项目下单详情",
    `<div class="info-list">
      ${info("项目编号", item.id)}
      ${info("客户名称", item.customer)}
      ${info("项目名称", item.name)}
      ${info("设备名称", item.device)}
      ${info("项目类型", item.type)}
      ${info("预计交付", item.delivery)}
      ${info("项目经理", item.manager)}
      ${info("状态", statusBadge(item.status))}
    </div>
    <div class="auto-list"><span>审批通过后自动生成项目编号</span><span>自动进入待导入项目池</span><span>导入后自动生成 11 个标准节点</span></div>
    <div class="attachment-list"><div>技术要求：${item.requirement}</div><div>风险说明：${item.risk}</div></div>`,
  );
}

function openChangeDetail(changeId) {
  const item = projectChanges.find((record) => record.id === changeId) || projectChanges[0];
  openModal(
    "项目信息变更详情",
    `<div class="info-list">
      ${info("变更编号", item.id)}
      ${info("关联项目", item.project)}
      ${info("变更类型", item.type)}
      ${info("状态", statusBadge(item.status))}
      ${info("申请人", item.applicant)}
      ${info("审批人", item.approver)}
    </div>
    <div class="compare-grid">
      <div><div class="compare-label">变更前</div><p>${item.before}</p></div>
      <div><div class="compare-label">变更后</div><p>${item.after}</p></div>
    </div>
    <div class="attachment-list"><div>变更原因：${item.reason}</div><div>影响范围：${item.impact.join(" / ")}</div></div>`,
  );
}

function switchUser() {
  state.currentUserIndex = (state.currentUserIndex + 1) % users.length;
  render();
  openModal("身份已切换", `<p>当前演示身份：${users[state.currentUserIndex].name}，${users[state.currentUserIndex].role}。</p>`);
}

document.addEventListener("click", (event) => {
  const detail = event.target.closest("[data-detail]");
  if (detail) {
    setApprovalDetail(detail.dataset.detail);
    return;
  }

  const ecnDetail = event.target.closest("[data-ecn-detail]");
  if (ecnDetail) {
    openEcnDetail(ecnDetail.dataset.ecnDetail);
    return;
  }

  const requestDetail = event.target.closest("[data-project-request]");
  if (requestDetail) {
    openProjectRequestDetail(requestDetail.dataset.projectRequest);
    return;
  }

  const changeDetail = event.target.closest("[data-change-detail]");
  if (changeDetail) {
    openChangeDetail(changeDetail.dataset.changeDetail);
    return;
  }

  const projectDetail = event.target.closest("[data-project-detail]");
  if (projectDetail) {
    closeModal();
    setProjectDetail(projectDetail.dataset.projectDetail);
    return;
  }

  const importButton = event.target.closest("[data-import]");
  if (importButton) {
    importProject(importButton.dataset.import);
    return;
  }

  const saveNode = event.target.closest("[data-save-node]");
  if (saveNode) {
    addOperationLog(saveNode.dataset.saveNode);
    return;
  }

  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    closeModal();
    setRoute(routeTarget.dataset.route);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  if (action === "close-modal") return closeModal();
  if (action === "start-approval") return openStartApproval();
  if (action === "switch-user") return switchUser();
  if (action === "open-import") return openImportModal();
  if (action === "approve") return openApproveModal(actionTarget.dataset.id);
  if (action === "confirm-approve") return approveItem(state.pendingActionApprovalId);
  if (action === "reject") {
    state.pendingActionApprovalId = actionTarget.dataset.id || state.selectedApprovalId;
    return openRejectModal();
  }
  if (action === "confirm-reject") {
    const value = document.querySelector("#reject-reason")?.value.trim();
    if (!value) {
      document.querySelector("#reject-error").textContent = "请先填写驳回原因。";
      return;
    }
    return rejectItem(state.pendingActionApprovalId, value);
  }
  if (action === "submit") return submitCurrentForm();

  const projectId = actionTarget.dataset.project || state.selectedProjectId;
  if (action === "edit-node") return openEditNode(projectId);
  if (action === "project-change-from-project") return setChangeForm(projectId);
  if (action === "ecn-from-project") {
    state.selectedProjectId = projectId;
    return setRoute("ecn-form");
  }

  const modalCopy = {
    transfer: ["转交审批", "可将当前节点转交给同角色人员处理，并保留转交日志。"],
    countersign: ["加签", "可临时增加相关负责人确认，第一阶段作为演示按钮。"],
    comment: ["评论", "评论将进入审批日志，便于后续追溯。"],
    "save-draft": ["保存草稿", "当前表单内容已保存为草稿。"],
    "show-auto": ["自动审批能力", "自动编号、自动流转、自动抄送、自动提醒、自动归档、自动创建项目节点、自动生成变更记录。"],
    "show-change-records": ["项目变更记录", "关键资料变更审批通过后，项目版本号自动递增并保留历史版本。"],
    "read-all": ["已读完成", "抄送记录已全部标记为已读。"],
    refresh: ["刷新完成", "待办列表已按当前身份刷新。"],
    search: ["查询", "筛选条件已应用。"],
    reset: ["重置", "筛选条件已清空。"],
    "temp-project": ["新建临时项目", "临时项目入口已弱化，正式项目建议从新项目下单审批导入。"],
    "new-template": ["新增流程", "可配置流程节点、角色、超时提醒、自动抄送和自动动作。"],
    edit: ["编辑", "进入编辑状态。关键项目信息需要走项目信息变更审批。"],
    withdraw: ["撤回审批", "申请人可撤回审批中单据，并保留撤回日志。"],
  };
  const [title, message] = modalCopy[action] || ["功能按钮", "该按钮已预留演示交互，后续可接入真实功能。"];
  openModal(title, `<p>${message}</p>`);
});

document.addEventListener("click", (event) => {
  const segmentedButton = event.target.closest(".segmented button");
  if (!segmentedButton) return;
  segmentedButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
  segmentedButton.classList.add("active");
});

render();

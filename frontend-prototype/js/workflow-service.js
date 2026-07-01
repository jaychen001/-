const WorkflowService = (() => {
  const NOW = "2026-07-01 15:00";
  const DUE = "2026-07-02 15:00";
  const COMPLETED_AT = "2026-07-01 14:30";

  function nextSerial(prefix, count, width = 4, offset = 1) {
    return `${prefix}${String(count + offset).padStart(width, "0")}`;
  }

  function createProjectFromImport(item, nodes) {
    return {
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
      nodes,
      changes: ["V1.0 新项目下单审批通过生成"],
      logs: [`${item.approvedAt} 系统从待导入项目池导入，并自动生成 11 个标准节点`],
    };
  }

  function createCcRecord(task, count) {
    return {
      id: `CC-2026-${String(count + 1).padStart(3, "0")}`,
      approvalId: task.id,
      no: task.no,
      title: task.title,
      type: task.type,
      result: "approved",
      reason: "审批完成后自动抄送相关负责人",
      readStatus: "unread",
      createdAt: "2026-07-01 15:30",
    };
  }

  function createPendingImport(task) {
    return {
      id: task.no,
      name: task.project,
      customer: "审批通过客户",
      device: task.project.replace("项目", "设备"),
      manager: "王经理",
      delivery: "2026-09-30",
      approvedAt: COMPLETED_AT,
    };
  }

  function createProjectChangeResult(task, project, approverName) {
    const version = project.version === "V1.1" ? "V1.2" : "V1.1";
    return {
      version,
      lastChangedAt: COMPLETED_AT,
      lastChangedBy: approverName,
      changeLog: `${version} ${task.title}审批通过，系统自动生成变更记录`,
    };
  }

  function createSubmission(route, context) {
    const { approvalCount, ecnCount, projectRequestCount, projectChangeCount, selectedProject, userName } = context;
    const approvalId = `AP-2026-${String(approvalCount + 1).padStart(3, "0")}`;

    if (route === "ecn-form") {
      const no = nextSerial("ECN-2026-", ecnCount);
      return {
        businessList: "ecnRecords",
        businessRecord: {
          id: no,
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
          applicant: userName,
          createdAt: "2026-07-01",
        },
        task: {
          id: approvalId,
          no,
          type: "ECN 变更",
          title: "结构方案局部调整",
          project: "光模块耦合设备改造项目",
          applicant: userName,
          node: "研发负责人审批",
          status: "pending",
          startedAt: NOW,
          dueAt: DUE,
          ownerRole: "研发负责人",
          auto: ["自动编号", "自动匹配 ECN 流程", "自动流转到研发负责人"],
        },
      };
    }

    if (route === "project-form") {
      const no = nextSerial("PJ-2026-", projectRequestCount, 4, 7);
      return {
        businessList: "projectRequests",
        businessRecord: {
          id: no,
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
          applicant: userName,
        },
        task: {
          id: approvalId,
          no,
          type: "新项目下单",
          title: "视觉检测分选设备项目",
          project: "视觉检测分选设备项目",
          applicant: userName,
          node: "项目经理确认",
          status: "pending",
          startedAt: NOW,
          dueAt: DUE,
          ownerRole: "项目经理",
          auto: ["自动生成项目编号", "自动匹配新项目下单流程", "自动流转到项目经理"],
        },
      };
    }

    if (route === "project-change-form" && selectedProject) {
      const no = nextSerial("PC-2026-", projectChangeCount);
      return {
        businessList: "projectChanges",
        businessRecord: {
          id: no,
          project: selectedProject.name,
          title: `${selectedProject.name} 交付计划调整`,
          type: "交期变更",
          before: selectedProject.delivery,
          after: "2026-09-15",
          reason: "客户补充功能需求，需要调整未完成节点计划。",
          impact: ["交期", "调试"],
          status: "pending",
          applicant: userName,
          approver: "王经理",
        },
        task: {
          id: approvalId,
          no,
          type: "项目信息变更",
          title: `${selectedProject.name} 交付计划调整`,
          project: selectedProject.name,
          applicant: userName,
          node: "项目经理审批",
          status: "pending",
          startedAt: NOW,
          dueAt: DUE,
          ownerRole: "项目经理",
          auto: ["自动生成变更编号", "自动带出项目原资料", "自动流转到项目经理"],
        },
      };
    }

    return null;
  }

  function applyNodeEdit(project, userName) {
    project.logs.unshift(`2026-07-01 ${userName} 修改节点“机械设计”：负责人 王工 → 李工，状态 未开始 → 进行中`);
    project.currentNode = "机械设计";
    project.status = "running";
    project.progress = Math.max(project.progress, 42);
  }

  return {
    createProjectFromImport,
    createCcRecord,
    createPendingImport,
    createProjectChangeResult,
    createSubmission,
    applyNodeEdit,
  };
})();

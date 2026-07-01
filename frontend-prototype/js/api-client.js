const ApprovalApi = (() => {
  const MODE = "mock";
  const BASE_URL = "/api";
  const STORAGE_KEY = "engineeringApprovalApiCalls";

  const endpoints = {
    submitApproval: "POST /api/approvals/submit",
    approveApproval: "POST /api/approvals/{id}/approve",
    rejectApproval: "POST /api/approvals/{id}/reject",
    returnApproval: "POST /api/approvals/{id}/return",
    withdrawApproval: "POST /api/approvals/{id}/withdraw",
    markCcRead: "POST /api/approvals/cc/{id}/read",
    createEcnRequest: "POST /api/ecn-requests",
    submitEcnRequest: "POST /api/ecn-requests/{id}/submit",
    createProjectOrderRequest: "POST /api/project-order-requests",
    submitProjectOrderRequest: "POST /api/project-order-requests/{id}/submit",
    importProject: "POST /api/project-control/import",
    updateProjectNode: "PUT /api/project-control/nodes/{id}",
  };

  function fillPath(template, params = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(params[key] ?? ""));
  }

  function makeResponse(data = {}) {
    return {
      success: true,
      mode: MODE,
      data,
    };
  }

  function record(endpointKey, params = {}, payload = {}) {
    const [method, pathTemplate] = endpoints[endpointKey].split(" ");
    const entry = {
      method,
      path: fillPath(pathTemplate, params),
      payload,
      createdAt: "2026-07-01 15:00",
    };

    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      history.unshift(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
    } catch (error) {
      console.warn("API call history skipped", error);
    }

    return makeResponse(entry);
  }

  function submitApproval(task) {
    return record("submitApproval", {}, { businessType: task.type, businessId: task.no });
  }

  function approveApproval(id, comment = "同意") {
    return record("approveApproval", { id }, { comment });
  }

  function rejectApproval(id, comment) {
    return record("rejectApproval", { id }, { comment });
  }

  function returnApproval(id, comment) {
    return record("returnApproval", { id }, { comment });
  }

  function withdrawApproval(id, comment = "申请人主动撤回") {
    return record("withdrawApproval", { id }, { comment });
  }

  function markCcRead(id) {
    return record("markCcRead", { id });
  }

  function createBusinessRequest(listName, recordData) {
    const endpointKey = listName === "ecnRecords" ? "createEcnRequest" : "createProjectOrderRequest";
    return record(endpointKey, {}, recordData);
  }

  function submitBusinessRequest(task) {
    const endpointKey = task.type === "ECN 变更" ? "submitEcnRequest" : "submitProjectOrderRequest";
    return record(endpointKey, { id: task.no }, { approvalNo: task.id });
  }

  function importProject(projectId) {
    return record("importProject", {}, { projectId });
  }

  function updateProjectNode(projectId, nodeName) {
    return record("updateProjectNode", { id: projectId }, { nodeName });
  }

  return {
    BASE_URL,
    MODE,
    endpoints,
    submitApproval,
    approveApproval,
    rejectApproval,
    returnApproval,
    withdrawApproval,
    markCcRead,
    createBusinessRequest,
    submitBusinessRequest,
    importProject,
    updateProjectNode,
  };
})();

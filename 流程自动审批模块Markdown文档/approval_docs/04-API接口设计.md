# API 接口设计

## 1. 接口设计说明

本接口设计面向流程自动审批模块。

第一阶段包含：

1. 通用审批接口
2. ECN 变更审批接口
3. 新项目下单审批接口
4. 审批配置接口

接口路径建议统一使用：

```text
/api
```

## 2. 通用审批接口

### 2.1 提交审批

```http
POST /api/approvals/submit
```

请求参数：

```json
{
  "businessType": "ECN_APPROVAL",
  "businessId": 1
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "approvalInstanceId": 1001,
    "status": "pending"
  }
}
```

说明：

- 根据 businessType 查找审批模板。
- 根据模板生成审批实例和节点。
- 激活第一个审批节点。

### 2.2 审批通过

```http
POST /api/approvals/{id}/approve
```

请求参数：

```json
{
  "comment": "同意"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "approvalInstanceId": 1001,
    "status": "pending",
    "currentNodeName": "研发负责人审批"
  }
}
```

说明：

- id 为审批实例 ID。
- 当前用户必须是当前节点审批人。
- 当前节点通过后自动流转到下一个节点。
- 如果没有下一个节点，则流程完成。

### 2.3 审批驳回

```http
POST /api/approvals/{id}/reject
```

请求参数：

```json
{
  "comment": "资料不完整，请补充后重新提交"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "approvalInstanceId": 1001,
    "status": "rejected"
  }
}
```

### 2.4 退回修改

```http
POST /api/approvals/{id}/return
```

请求参数：

```json
{
  "comment": "请补充影响范围说明"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "approvalInstanceId": 1001,
    "status": "returned"
  }
}
```

### 2.5 撤回审批

```http
POST /api/approvals/{id}/withdraw
```

请求参数：

```json
{
  "comment": "申请人主动撤回"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "approvalInstanceId": 1001,
    "status": "withdrawn"
  }
}
```

### 2.6 查看审批详情

```http
GET /api/approvals/{id}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "id": 1001,
    "businessType": "ECN_APPROVAL",
    "businessId": 1,
    "title": "ECN变更审批-ECN20260001",
    "status": "pending",
    "applicant": {
      "id": 1,
      "name": "张三"
    },
    "nodes": [
      {
        "id": 1,
        "nodeName": "研发负责人审批",
        "approverName": "李四",
        "status": "pending",
        "comment": null,
        "approvedAt": null
      }
    ],
    "logs": []
  }
}
```

### 2.7 查看审批日志

```http
GET /api/approvals/{id}/logs
```

### 2.8 我的待审批

```http
GET /api/approvals/todo
```

查询参数：

| 参数 | 说明 |
|---|---|
| businessType | 业务类型，可选 |
| page | 页码 |
| pageSize | 每页数量 |

说明：

- 查询当前登录用户作为审批人，且节点状态为 pending 的审批。

### 2.9 我发起的审批

```http
GET /api/approvals/mine
```

查询参数：

| 参数 | 说明 |
|---|---|
| status | 审批状态，可选 |
| businessType | 业务类型，可选 |
| page | 页码 |
| pageSize | 每页数量 |

### 2.10 抄送我的审批

```http
GET /api/approvals/cc
```

### 2.11 标记抄送已读

```http
POST /api/approvals/cc/{id}/read
```

## 3. ECN 变更审批接口

### 3.1 创建 ECN 申请

```http
POST /api/ecn-requests
```

请求参数：

```json
{
  "projectName": "XX光模块耦合设备",
  "productName": "耦合机构",
  "changeType": "drawing",
  "changeReason": "现场装配干涉",
  "changeContent": "修改安装孔位置",
  "impactScope": "影响支架零件和装配图",
  "affectedDrawings": ["DRW-001", "DRW-002"],
  "affectedBom": ["BOM-001"],
  "affectedMaterials": [],
  "costImpact": false,
  "deliveryImpact": true,
  "inventoryImpact": false,
  "attachmentUrls": []
}
```

### 3.2 修改 ECN 申请

```http
PUT /api/ecn-requests/{id}
```

说明：

- 只有草稿或退回修改状态允许修改。

### 3.3 查看 ECN 详情

```http
GET /api/ecn-requests/{id}
```

### 3.4 查看 ECN 列表

```http
GET /api/ecn-requests
```

查询参数：

| 参数 | 说明 |
|---|---|
| status | 状态 |
| projectName | 项目名称 |
| ecnNo | ECN 编号 |
| page | 页码 |
| pageSize | 每页数量 |

### 3.5 提交 ECN 审批

```http
POST /api/ecn-requests/{id}/submit
```

说明：

该接口内部可以调用通用审批提交接口。

内部参数：

```json
{
  "businessType": "ECN_APPROVAL",
  "businessId": 1
}
```

## 4. 新项目下单审批接口

### 4.1 创建新项目下单申请

```http
POST /api/project-order-requests
```

请求参数：

```json
{
  "projectName": "XX自动化设备项目",
  "customerName": "某某客户",
  "productName": "自动上下料设备",
  "projectType": "non_standard",
  "orderAmount": 500000,
  "expectedDeliveryDate": "2026-08-30",
  "paymentTerms": "30%预付款，60%发货前，10%验收后",
  "technicalRequirements": "实现自动上料、定位、检测、下料",
  "isNonStandard": true,
  "needSample": false,
  "needLongCycleMaterial": true,
  "riskDescription": "交期较紧，部分物料周期较长",
  "customerAttachmentUrls": [],
  "technicalAgreementUrls": [],
  "contractAttachmentUrls": []
}
```

### 4.2 修改新项目下单申请

```http
PUT /api/project-order-requests/{id}
```

说明：

- 只有草稿或退回修改状态允许修改。

### 4.3 查看新项目下单详情

```http
GET /api/project-order-requests/{id}
```

### 4.4 查看新项目下单列表

```http
GET /api/project-order-requests
```

查询参数：

| 参数 | 说明 |
|---|---|
| status | 状态 |
| projectName | 项目名称 |
| customerName | 客户名称 |
| projectNo | 项目编号 |
| page | 页码 |
| pageSize | 每页数量 |

### 4.5 提交新项目下单审批

```http
POST /api/project-order-requests/{id}/submit
```

说明：

该接口内部可以调用通用审批提交接口。

内部参数：

```json
{
  "businessType": "PROJECT_ORDER_APPROVAL",
  "businessId": 1
}
```

## 5. 审批配置接口

### 5.1 查看审批模板列表

```http
GET /api/approval-templates
```

### 5.2 创建审批模板

```http
POST /api/approval-templates
```

### 5.3 修改审批模板

```http
PUT /api/approval-templates/{id}
```

### 5.4 启用或停用审批模板

```http
POST /api/approval-templates/{id}/toggle-active
```

### 5.5 创建审批节点

```http
POST /api/approval-templates/{id}/nodes
```

### 5.6 修改审批节点

```http
PUT /api/approval-template-nodes/{id}
```

### 5.7 删除审批节点

```http
DELETE /api/approval-template-nodes/{id}
```

## 6. 统一错误码建议

| 错误码 | 说明 |
|---|---|
| APPROVAL_TEMPLATE_NOT_FOUND | 未配置审批模板 |
| APPROVAL_TEMPLATE_DISABLED | 审批模板未启用 |
| APPROVAL_NODE_NOT_FOUND | 审批节点不存在 |
| APPROVER_NOT_FOUND | 审批人未配置 |
| NOT_CURRENT_APPROVER | 当前用户不是审批人 |
| APPROVAL_STATUS_INVALID | 当前状态不允许操作 |
| BUSINESS_RECORD_NOT_FOUND | 业务单据不存在 |
| BUSINESS_STATUS_INVALID | 业务单据状态不允许操作 |
| PERMISSION_DENIED | 无权限操作 |

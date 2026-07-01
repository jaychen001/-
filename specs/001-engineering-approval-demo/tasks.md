# Tasks: 工程审批软件前端 Demo

**Input**: `specs/001-engineering-approval-demo/spec.md`

## Workflow Setup

- [x] T001 创建 `.specify/memory/constitution.md`
- [x] T002 创建 `.specify/templates/` 基础模板
- [x] T003 创建 `specs/001-engineering-approval-demo/spec.md`
- [x] T004 创建 `specs/001-engineering-approval-demo/plan.md`
- [x] T005 创建 `specs/001-engineering-approval-demo/tasks.md`

## Implementation Tasks

- [x] T006 将首页升级为审批工作台
- [x] T007 增加 ECN、新项目下单、项目信息变更三类审批入口
- [x] T008 增加项目进度管控和待导入项目池
- [x] T009 实现导入项目后自动生成节点的前端演示
- [x] T010 实现项目详情、节点编辑、变更记录和操作记录演示
- [x] T011 实现审批流程配置展示
- [x] T012 保持资金类字段不出现在界面中

## Next Tasks

- [x] T013 修正 `index.html`，确保主入口直接加载 `styles.css` 和 `app.js`
- [x] T014 增加审批通过、审批驳回、项目导入和节点编辑的前端状态变化
- [x] T015 增加 ECN、新项目下单、项目信息变更的详情弹窗演示
- [ ] T016 拆分真实前端应用结构
- [ ] T017 增加持久化模拟数据或接入后端 API
- [ ] T018 补充自动化 UI 回归测试

## Validation

- [x] JavaScript syntax check passes
- [x] No amount-related text appears
- [x] Core demo paths are represented in route handlers and mock data

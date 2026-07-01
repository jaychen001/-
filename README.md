# 工程审批软件 Demo

这是一个面向非标自动化公司的工程审批前端原型。

当前阶段使用纯前端静态文件实现，不依赖后端接口。

## 演示入口

```text
frontend-prototype/index.html
```

## 当前功能

- 审批工作台
- ECN 变更审批
- 新项目下单审批
- 项目进度管控
- 项目信息变更
- 抄送我的
- 我发起的
- 审批流程配置

## Spec Kit Plus 工作流

当前项目已按 `chenziyang110/spec-kit-plus` 的规格驱动方式导入工作流文件：

```text
.specify/
  memory/
    constitution.md
  templates/
    spec-template.md
    plan-template.md
    tasks-template.md

specs/
  001-engineering-approval-demo/
    spec.md
    plan.md
    tasks.md
```

后续开发规则：

1. 先更新 `specs/<feature>/spec.md`
2. 再更新 `plan.md`
3. 拆分 `tasks.md`
4. 最后修改代码
5. 修改后执行检查

## 本地检查

```text
node --check frontend-prototype/app.js
```

当前业务约束：界面不展示资金类字段和相关功能。

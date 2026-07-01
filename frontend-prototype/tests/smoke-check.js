const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = {
  html: path.join(root, "index.html"),
  styles: path.join(root, "styles.css"),
  app: path.join(root, "app.js"),
  api: path.join(root, "js", "api-client.js"),
  workflow: path.join(root, "js", "workflow-service.js"),
};

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const html = read(files.html);
const app = read(files.app);
const api = read(files.api);
const workflow = read(files.workflow);
const combinedFrontend = [html, read(files.styles), app, api, workflow].join("\n");

const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((match) => match[1]);
assert(
  scripts.join("|") === "./js/api-client.js|./js/workflow-service.js|./app.js",
  "入口脚本加载顺序必须是 api-client -> workflow-service -> app",
);

[
  "dashboard",
  "ecn-list",
  "ecn-form",
  "project-list",
  "project-form",
  "project-progress",
  "project-change",
  "templates",
].forEach((route) => {
  assert(html.includes(`data-route="${route}"`) || app.includes(`${route}:`), `缺少核心页面入口：${route}`);
});

[
  "approveApproval",
  "rejectApproval",
  "returnApproval",
  "withdrawApproval",
  "submitApproval",
  "markCcRead",
].forEach((apiName) => {
  assert(api.includes(apiName), `API 适配层缺少方法：${apiName}`);
  assert(app.includes(`ApprovalApi.${apiName}`), `页面动作未接入 API 方法：${apiName}`);
});

[
  "createSubmission",
  "createProjectFromImport",
  "createCcRecord",
  "applyNodeEdit",
].forEach((serviceName) => {
  assert(workflow.includes(serviceName), `流程服务缺少方法：${serviceName}`);
  assert(app.includes(`WorkflowService.${serviceName}`), `页面动作未接入流程服务：${serviceName}`);
});

const forbiddenWords = /金额|预算|报价|价款|合同额|￥|¥|quote|budget|amount|cost|price/i;
assert(!forbiddenWords.test(combinedFrontend), "前端文件不能出现金额相关字段");

console.log("Frontend smoke check passed");

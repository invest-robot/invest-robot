import { Streamdown } from '@/components/ui/streamdown';

const guideContent = `
# 开发指南

## 概述

OpenClaw 是一个开源的 AI 编程助手框架，支持多种 AI 模型和开发工具集成。本指南将帮助你快速了解 OpenClaw 的核心能力、安装配置和最佳实践。

### 核心特性

- **多模型支持**：兼容 OpenAI、Anthropic、MiniMax 等主流 AI 模型
- **工具调用**：内置代码执行、文件操作、网络搜索等能力
- **上下文管理**：智能管理对话上下文，支持长对话历史
- **插件扩展**：支持自定义插件和工具扩展

---

## 快速安装

### 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- macOS / Linux / Windows

### 安装步骤

**第一步：安装 OpenClaw CLI**

\`\`\`bash
curl -fsSL https://openclaw.bot/install.sh | bash
\`\`\`

**第二步：验证安装**

\`\`\`bash
openclaw --version
\`\`\`

**第三步：初始化项目**

\`\`\`bash
mkdir my-agent && cd my-agent
openclaw init
\`\`\`

---

## 核心能力

### 1. 代码执行

OpenClaw 内置安全的代码执行环境，支持多种编程语言：

- **JavaScript/TypeScript**：原生支持，无需NPM 生态
- **Python**：数据科学、自动化脚本
- **Shell**：系统操作、文件管理

**使用示例：**

\`\`\`javascript
// 让 Agent 执行代码
const result = await agent.execute(\`
  const sum = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);
  console.log('总和:', sum);
\`);
\`\`\`

### 2. 网络搜索

内置网络搜索能力，支持实时信息获取：

- **实时搜索**：获取最新信息
- **网页抓取**：解析网页内容
- **API 调用**：调用外部 API 获取数据

### 3. 文件操作

安全的文件读写和管理能力：

- **读取文件**：支持多种文件格式
- **写入文件**：生成代码、文档等
- **文件管理**：创建、删除、重命名

### 4. 识图能力

支持图片理解和分析：

- **图片描述**：生成图片文字描述
- **OCR 识别**：提取图片中的文字
- **图表分析**：分析数据图表

---

## 配置指南

### API Key 配置

在项目根目录创建 \`.env\` 文件：

\`\`\`env
# OpenAI
OPENAI_API_KEY=sk-xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# MiniMax
MINIMAX_API_KEY=xxx
\`\`\`

### 模型选择

在 \`config.json\` 中配置默认模型：

\`\`\`json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 4096,
  "tools": ["code_execution", "web_search", "file_ops"]
}
\`\`\`

### 工具配置

启用或禁用特定工具：

\`\`\`json
{
  "tools": {
    "code_execution": {
      "enabled": true,
      "timeout": 30000,
      "allowedLanguages": ["javascript", "python"]
    },
    "web_search": {
      "enabled": true,
      "provider": "google"
    }
  }
}
\`\`\`

---

## 最佳实践

### 1. 提示词设计

**好的提示词示例：**

> "请帮我写一个 Python 函数，接收一个列表，返回其中的最大值和最小值。要求包含类型注解和文档字符串。"

**避免的提示词：**

> "写个代码"

### 2. 上下文管理

- **保持简洁**：只保留必要的上下文信息
- **及时清理**：定期清理过期的对话历史
- **分段处理**：复杂任务拆分为多个小步骤

### 3. 安全建议

- **沙箱执行**：代码执行必须在沙箱环境中进行
- **权限控制**：限制文件操作的访问范围
- **API Key 保护**：不要将 API Key 提交到代码仓库

### 4. 性能优化

- **缓存结果**：重复请求使用缓存
- **批量处理**：多个小任务合并处理
- **异步执行**：使用异步操作提高并发能力

---

## 常见问题

### Q: 如何自定义工具？

创建自定义工具插件，继承 \`BaseTool\` 类并实现 \`execute\` 方法。

### Q: 支持哪些模型？

支持 OpenAI GPT 系列、Anthropic Claude、MiniMax M 系列等主流模型。

### Q: 如何调试 Agent？

使用 \`openclaw debug\` 命令启动调试模式，查看详细日志。
`;

export default function DevGuidePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Streamdown>{guideContent}</Streamdown>
    </div>
  );
}

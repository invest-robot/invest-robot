# AI一人公司创业工具 - 技术支持与培训网站需求拆解文档

## 产品概述

- **产品类型**: 技术支持与培训文档站
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 一人公司创业者、AI工具使用者、内部测试人员
- **核心价值**: 提供清晰、极简的Agent使用指南、实战案例与框架说明，降低学习门槛，支持内容灵活维护与二次填充
- **界面语言**: 中文
- **主题偏好**: 浅色 (Apple 极简风格：大留白、圆角卡片、清晰排版层级、毛玻璃导航栏、SF字体风格排版)
- **导航模式**: 路径导航
- **导航布局**: Sidebar (左侧固定分类导航，右侧为内容阅读区)

---

## 页面结构总览

> **说明**：此表为页面生成的唯一数据源，包含所有页面（一级+二级）

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 首页/概览 | `HomePage.tsx` | `/` | 一级 | 导航 |
| 快速开始 | `QuickStartPage.tsx` | `/quick-start` | 一级 | 导航 |
| Agent指南 | `AgentGuidesPage.tsx` | `/agents` | 一级 | 导航 |
| 案例与试验 | `CasesPage.tsx` | `/cases` | 一级 | 导航 |
| 框架与模板 | `FrameworkPage.tsx` | `/framework` | 一级 | 导航 |

> **页面类型说明**：
> - **一级页面**：出现在导航中，用户可直接访问
> - **二级页面**：不在导航中，从一级页面跳转进入（本需求为精简文档站，采用页面内锚点或折叠面板组织子内容，不额外拆分路由以保持精简）

---

## 导航配置

> **说明**：此表为导航生成的数据源，路由需与页面结构总览完全一致

- **导航布局**: Sidebar (左侧固定，支持分类折叠与高亮当前路由)
- **导航项**（仅一级页面）:
  | 导航文字 | 路由 | 图标(可选) |
  |---------|------|-----------|
  | 首页 | `/` | Home |
  | 快速开始 | `/quick-start` | Rocket |
  | Agent指南 | `/agents` | Users |
  | 案例与试验 | `/cases` | Flask |
  | 框架与模板 | `/framework` | Code |

---

## 功能列表

> **说明**：每个页面/区块的功能点，供页面生成使用（导航已在全局配置中定义，此处不重复列出）

- **页面/区块**: 首页/概览 (`HomePage.tsx`)
  - **页面目标**: 建立产品认知，提供全局导航入口，展示最新培训动态
  - **功能点**:
    - **Hero 介绍区**: 展示项目名称、核心价值主张（AI辅助一人公司创业）、快速跳转按钮
    - **核心模块卡片网格**: 以 Apple 风格卡片展示“快速开始”、“四大数字员工”、“实战案例”、“底层框架”入口，点击跳转对应路由
    - **内容更新日志**: 列表展示文档/案例的最新更新记录与版本号，保持内容时效性感知

- **页面/区块**: 快速开始 (`QuickStartPage.tsx`)
  - **页面目标**: 引导新用户完成环境配置与首次运行，实现“5分钟上手”
  - **功能点**:
    - **环境准备清单**: 分步骤展示依赖要求、API Key 配置路径、终端安装命令（支持一键复制）
    - **初始化向导**: 图文结合展示项目克隆、配置文件 (`config.json`) 修改、服务启动流程
    - **首次运行验证**: 提供标准控制台输出示例与常见报错排查指引，确保用户跑通第一个 Agent 任务

- **页面/区块**: Agent指南 (`AgentGuidesPage.tsx`)
  - **页面目标**: 详细说明 IT、运营、财务、行政四大数字员工的职责、配置与交互方式
  - **功能点**:
    - **角色切换面板**: 采用标签页 (Tabs) 或侧边锚点导航，清晰划分四大 Agent 的能力边界与适用场景
    - **配置与 Prompt 模板**: 提供各 Agent 的系统提示词示例、参数调节说明（如温度、上下文长度），支持代码块高亮
    - **交互演示占位区**: 预留对话流展示区域，用于后续填充典型任务（如“IT部署网站”、“财务生成报表”）的输入输出过程
    - **Markdown 内容渲染引擎**: 集成轻量级 Markdown 解析器，所有说明文本通过外部 `.md` 文件或 JSON 注入，方便非开发人员直接修改填充

- **页面/区块**: 案例与试验 (`CasesPage.tsx`)
  - **页面目标**: 通过真实场景复盘与试验数据，验证工具价值并提供可复用的操作路径
  - **功能点**:
    - **案例分类筛选**: 按业务类型（如“独立站搭建”、“自媒体运营”、“成本核算”）提供标签过滤，快速定位案例
    - **步骤拆解时间线**: 以垂直时间轴形式还原案例执行全过程，标注关键决策点与 Agent 介入环节
    - **资源一键获取区**: 提供案例配套的 Prompt 包、配置文件模板或数据样本的下载/复制按钮
    - **试验反馈入口**: 预留用户提交自身试验结果或改进建议的静态表单/外部链接区域

- **页面/区块**: 框架与模板 (`FrameworkPage.tsx`)
  - **页面目标**: 解析 OpenClaw 框架与阿里 Copaw 模板的技术原理，支持高级用户二次开发
  - **功能点**:
    - **架构拓扑展示**: 使用 SVG/Canvas 绘制 OpenClaw 核心组件、Agent 通信链路、Copaw 模板加载机制
    - **模板扩展指南**: 详细列出 Copaw 模板的目录结构、扩展钩子 (Hooks) 位置、自定义插件接入方法
    - **开发者 FAQ 折叠面板**: 针对框架集成、性能调优、多 Agent 并发调度等高频技术问题提供结构化解答，支持展开/收起
    - **全局代码交互优化**: 统一应用语法高亮、行号显示、一键复制及深色代码块主题，提升技术文档阅读体验

---

## 数据共享配置

[无跨页面复杂状态共享需求，内容数据建议通过本地 Markdown 文件或 JSON 配置管理，便于非技术人员直接填充修改]

```ts
// 预留内容配置接口示例（供后续内容管理系统扩展使用）
interface IDocConfig {
  title: string;
  content: string; // 支持 Markdown 格式，用于页面动态渲染
  lastUpdated: string;
  tags?: string[];
}

-------

# UI 设计指南

> **场景类型**: <scene_type>prototype-app</scene_type>（应用架构设计）
> **确认检查**: 本指南适用于多页面技术支持与培训文档站。采用左侧固定 Sidebar + 右侧内容阅读区的经典文档架构，内容数据通过 Markdown/JSON 注入，便于非开发人员维护。

> ℹ️ Section 1-2 为设计意图与决策上下文。Code agent 实现时以 Section 3 及之后的具体参数为准。

## 1. Design Archetype (设计原型)

### 1.1 内容理解
- **目标用户**: 一人公司创业者、AI 工具使用者、内部测试人员。心理预期：希望快速上手、获取可靠指引，对复杂技术文档有畏难情绪。
- **核心目的**: 提供清晰、极简的 Agent 使用指南、实战案例与底层框架说明，降低学习门槛，同时支持内容灵活填充。
- **期望情绪**: 专注、信任、从容、专业。
- **需避免的感受**: 信息过载、排版拥挤、廉价模板感、技术术语堆砌造成的焦虑。

### 1.2 设计语言
- **Aesthetic Direction**: Apple 极简主义技术文档风格。以大量留白建立呼吸感，用毛玻璃导航与精细边框替代厚重色块，依靠严格的字号/字重层级驱动阅读节奏。
- **Visual Signature**: 
  1. `backdrop-blur-xl` 半透明侧边栏与顶部导航，内容滚动时产生微妙层次。
  2. 严格 8pt 网格系统，区块间距 ≥ `space-y-12`，内容区最大宽度锁定。
  3. 卡片采用纯白底色 + `rounded-xl` + 极细半透明边框，摒弃重度阴影。
  4. 代码块统一深色高对比主题，与浅色文档流形成清晰视觉断点。
- **Emotional Tone**: 克制、清晰、现代。像一本精装技术手册，而非杂乱 Wiki。
- **Design Style**: `Frosted Glass 毛玻璃` + `Editorial 经典排版` — 毛玻璃提供现代应用质感，经典排版确保长文阅读舒适度与层级分明。
- **Application Type**: Documentation/Training App - 决定采用 Sidebar 持久导航 + 单列文档流布局。

## 2. Design Principles (设计理念)
1. **内容即界面 (Content as UI)**: 减少装饰性元素，让排版、留白与代码高亮成为视觉主角。所有组件服务于信息传递效率。
2. **模块化可维护 (Modular & Swappable)**: 页面结构严格解耦，正文内容全部通过 Markdown/JSON 注入。设计系统需保证不同长度/类型的文本注入后依然保持网格对齐。
3. **层级驱动而非颜色驱动 (Hierarchy over Color)**: 通过字号、字重、间距建立信息主次。强调色仅用于交互锚点（链接、按钮、当前路由），避免满屏高亮导致视觉疲劳。
4. **一致性与克制 (Consistency & Restraint)**: 全局统一圆角、边框透明度、行高与组件状态。任何新增页面不得突破既定设计契约。

## 3. Color System (色彩系统)

> **⚠️ App 场景配色规则**：本场景为 `prototype-app`，**禁止使用**共用预设配色方案库。以下配色基于 Apple 极简美学与内容理解自主推导，严格遵循 HSL 衍生规则。

**配色设计理由**: 采用冷调中性灰作为基底，降低长时间阅读的视觉压力；主交互色选用 Apple 标志性蓝，传递可靠与科技感；整体低饱和度确保代码块、图表与高亮文本成为视觉焦点。

### 3.1 主题颜色

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|-----|---------|----------------|--------|---------|
| bg | `--background` | `bg-background` | `hsl(210 20% 98%)` | 极浅冷灰，提供柔和底色，避免纯白刺眼 |
| surface | `--card` | `bg-card` | `hsl(0 0% 100%)` | 内容容器与卡片纯白背景，与 bg 形成 2% 明度差 |
| text | `--foreground` | `text-foreground` | `hsl(210 10% 15%)` | 深灰近黑，正文阅读对比度 > 12:1，舒适不刺眼 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | `hsl(210 10% 50%)` | 次要说明、元数据、占位文本 |
| primary | `--primary` | `bg-primary` | `hsl(211 90% 48%)` | Apple 蓝，用于主按钮、链接、当前路由高亮 |
| primary-foreground | `--primary-foreground` | `text-primary-foreground` | `hsl(0 0% 100%)` | 主色背景上的文字/图标 |
| accent | `--accent` | `bg-accent` | `hsl(211 90% 96%)` | 极浅蓝，用于 Hover/Focus/Skeleton 背景反馈 |
| accent-foreground | `--accent-foreground` | `text-accent-foreground` | `hsl(211 90% 48%)` | 强调区域文字色 |
| border | `--border` | `border-border` | `hsl(210 10% 90%)` | 极细浅灰边框，替代阴影划分层级 |

> **Color Token 语义速查（供 code agent 参考）**:
> - `primary` → 主行动：按钮填充、激活态高亮、关键操作 CTA
> - `accent` → 状态反馈：Ghost/Outline 按钮 hover、DropdownMenu focus、Toggle 激活、Skeleton 占位背景
> - `muted` → 静态非交互：禁用态背景、次级说明背景、占位文字色（`text-muted-foreground`）

### 3.2 Sidebar 颜色（仅当使用 Sidebar 导航时定义）

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|-----|---------|----------------|--------|---------|
| sidebar | `--sidebar` | `bg-sidebar` | `hsla(0 0% 100% / 0.85)` | 配合 `backdrop-blur-xl` 实现毛玻璃效果 |
| sidebar-foreground | `--sidebar-foreground` | `text-sidebar-foreground` | `hsl(210 10% 15%)` | 导航文字，对比度 ≥ 4.5:1 |
| sidebar-primary | `--sidebar-primary` | `bg-sidebar-primary` | `hsl(211 90% 48%)` | 当前路由激活态背景色 |
| sidebar-primary-foreground | `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `hsl(0 0% 100%)` | 激活态文字色 |
| sidebar-accent | `--sidebar-accent` | `bg-sidebar-accent` | `hsl(211 90% 96%)` | Hover 态背景反馈 |
| sidebar-accent-foreground | `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `hsl(211 90% 48%)` | Hover 态文字色 |
| sidebar-border | `--sidebar-border` | `border-sidebar-border` | `hsl(210 10% 88%)` | 右侧分割线，极细透明 |
| sidebar-ring | `--sidebar-ring` | `ring-sidebar-ring` | `hsl(211 90% 70%)` | 键盘导航聚焦环 |

## 4. Typography (字体排版)
- **Heading**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Body**: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Code/数字**: `"SF Mono", "JetBrains Mono", "Fira Code", "Menlo", Consolas, monospace`
- **字体导入**: 使用系统字体栈，**禁止引入 Google Fonts**。依赖操作系统原生渲染保证极致清晰与加载速度。
- **层级规范**:
  - H1: `text-3xl font-semibold tracking-tight` (仅页面主标题)
  - H2: `text-2xl font-semibold mt-10 mb-4 tracking-tight`
  - H3: `text-xl font-medium mt-8 mb-3`
  - Body: `text-base leading-relaxed text-foreground`
  - Small/Caption: `text-sm leading-snug text-muted-foreground`

## 5. Global Layout Structure (全局布局结构)

### 5.1 Page Content Zones (页面区块配置)

**布局架构**: 左侧固定 Sidebar (`w-64`) + 右侧主内容区 (`flex-1`)。顶部无独立 Topbar，导航功能完全集成于 Sidebar。

**Standard Content Zone（全页面统一）**:
- **Maximum Width**: `max-w-4xl` (约 896px)。技术文档最佳阅读行长为 60-80 字符，此宽度保证长文阅读舒适度。
- **Padding**: `px-6 md:px-10 py-12` (内容区内边距)
- **Alignment**: 居中对齐于右侧滚动容器内
- **Vertical Spacing**: 章节间距 `space-y-10`，段落间距 `mb-4`，保持 8px 倍数一致性

**宽内容溢出策略**: 架构图、宽表格或长代码块超出 `max-w-4xl` 时，外层包裹 `overflow-x-auto`，禁止放大容器宽度。

**Hero/Banner 区块**（仅首页适用）:
- **Width**: `w-full` (背景全宽)
- **Padding**: `py-16 md:py-20 px-6 md:px-10`
- **Background**: `bg-gradient-to-b from-accent/50 to-transparent` (极淡渐变过渡至页面背景)

## 6. Visual Effects & Motion (视觉效果与动效)

- **Header/Hero 视觉方案**: 首页 Hero 采用 `bg-gradient-to-b from-[hsl(211_90%_96%)] to-transparent`，配合大字号标题与副标题建立视觉锚点。
- **装饰手法**: 无冗余装饰。依赖毛玻璃侧边栏、精细边框 (`border-[hsl(210_10%_90%)]`) 与排版留白构建层次。
- **圆角**: `rounded-xl` (12px) 用于卡片、容器、弹窗；`rounded-lg` (8px) 用于按钮、输入框、标签；`rounded-full` 用于头像与状态指示点。
- **阴影**: `shadow-sm` 仅用于悬浮卡片或模态框；常规内容区依靠边框与背景色差分层，保持 `shadow-none`。
- **复杂背景文字处理**:
  - 渐变背景: 标题使用 `text-foreground`，对比度 > 10:1，无需额外遮罩。
  - 图片背景: 不适用（本设计为纯排版与代码驱动）。
  - 有色背景: 所有交互态文字明确指定 `text-primary-foreground` 或 `text-foreground`。

### 6.1 动效意图
- **整体动效风格**: 克制、短促、以 `opacity` + 微位移为主。追求“无感但跟手”的响应体验。
- **页面入场**: 路由切换时，右侧内容区以极短时长（~150ms）淡入并轻微上移，避免突兀闪烁。
- **滚动揭示**: 无。文档站内容按自然流加载，不依赖滚动触发动画以保持专业感与性能。
- **列表项动效 · 变更模式**: `整批替换` (筛选/搜索/路由切换) / `增量增删` (日志更新)
- **列表项动效 · 意图**: 列表更新时采用快速淡入淡出（~200ms），无 stagger，确保信息同步效率。
- **对话框/弹层**: 打开时轻微缩放 (`scale-95` → `scale-100`) + 淡入，关闭时快速淡出，退场比入场略快。
- **关键交互微动效**: 按钮按下时 `scale-[0.98]` 提供触觉反馈；侧边栏路由切换时高亮条平滑滑动（CSS transition，非 JS 动画）。

## 7. Components (组件指南)

> 所有色值严格引用 Section 3 定义的 CSS 变量。

### Buttons
- **Primary**: 背景 `bg-primary` / 文字 `text-primary-foreground` / 圆角 `rounded-lg` / Hover `bg-primary/90` / Focus `ring-2 ring-primary/30` / Disabled `bg-muted text-muted-foreground cursor-not-allowed`
- **Secondary**: 背景 `bg-card` / 边框 `border border-border` / 文字 `text-foreground` / Hover `bg-accent text-accent-foreground` / Focus `ring-2 ring-border` / Disabled `opacity-50`
- **Ghost**: 背景 `transparent` / 文字 `text-foreground` / Hover `bg-accent text-accent-foreground` / Focus `ring-2 ring-border`
- **Link**: 文字 `text-primary underline-offset-4 hover:underline` / 无背景

### Form Elements
- **输入框**: 背景 `bg-card` / 边框 `border border-border` / 圆角 `rounded-lg` / 内边距 `px-3 py-2` / Focus `border-primary ring-2 ring-primary/20` / Placeholder `text-muted-foreground`
- **下拉选择/搜索框**: 同输入框，右侧添加 `ChevronDown` 图标，展开时背景 `bg-card shadow-lg border-border`

### Cards
- **背景**: `bg-card` / **边框**: `border border-border` / **圆角**: `rounded-xl` / **阴影**: `shadow-sm` / **内边距**: `p-6`
- **Hover**: 边框色微调至 `border-primary/30`，无位移或阴影加重，保持克制。

### Menu / Dropdown
- **容器**: `bg-card border border-border rounded-lg shadow-lg p-1`
- **菜单项 Focus/Hover**: `bg-accent text-accent-foreground rounded-md`
- **分隔线**: `border-t border-border my-1`

### Code Blocks (核心组件)
- **容器**: 深色背景 `bg-[hsl(210_10%_12%)]` / 圆角 `rounded-xl` / 边框 `border border-white/10`
- **头部**: 显示语言标签与 `Copy` 按钮，背景 `bg-white/5`，圆角继承
- **内容**: `font-mono text-sm leading-relaxed`，语法高亮使用 `shiki` 或 `prism` 的 `github-dark` 变体
- **交互**: `Copy` 按钮 Hover 时背景 `bg-white/10`，点击后切换为 `✓ Copied` 状态 2s

### Sidebar Navigation
- **容器**: `w-64 h-screen sticky top-0 bg-sidebar backdrop-blur-xl border-r border-sidebar-border`
- **分组标题**: `text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 mt-4`
- **链接项**: `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors`
- **默认**: `text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`
- **激活**: `bg-sidebar-primary text-sidebar-primary-foreground`
- **图标**: 16x16，默认 `opacity-70`，激活时 `opacity-100`

## 8. Flexibility Note (灵活性说明)

> **一致性优先原则**：多页文档应用中，所有页面共享相同的 Sidebar 宽度、内容区 `max-w-4xl`、圆角、阴影与排版层级。
>
> **允许的微调范围**（code agent 可自行判断）：
> - 响应式断点适配：移动端 (`<md`) Sidebar 转为顶部抽屉式导航，内容区 `px-4`。
> - 页面内部的局部间距：根据 Markdown 注入内容的段落长度，微调 `space-y-8` ~ `space-y-12`。
> - 代码块/架构图宽度：使用 `w-full overflow-x-auto` 横向滚动，不破坏主网格。
>
> **禁止的随意变更**：
> - ❌ 不同页面使用不同的内容区最大宽度或排版基准字号
> - ❌ 在正文区域使用高饱和度背景色块或彩虹渐变
> - ❌ 为侧边栏添加折叠动画外的多余装饰（如背景图、复杂纹理）

## 9. Signature & Constraints (设计签名与禁区)

### DO (视觉签名)
1. **毛玻璃导航契约**: Sidebar 必须使用 `bg-[hsla(0_0%_100%_/_0.85)] backdrop-blur-xl`，确保内容滚动时透出模糊底色。
2. **排版呼吸感**: 所有 H2 标题上方必须保留 `mt-10`，正文段落 `leading-relaxed`，禁止紧凑堆砌。
3. **极细边框分层**: 使用 `border-[hsl(210_10%_90%)]` 替代阴影划分卡片与背景，保持界面扁平而精致。
4. **代码块深色断点**: 技术内容必须使用 `bg-[hsl(210_10%_12%)]` 深色块包裹，与浅色文档流形成明确视觉分区。

### DON'T (禁止做法)
> 通用约束参见「通用约束」。以下为 Prototype 特有：
- ❌ 使用 `w-full` 让正文内容在大屏幕上无限延伸（必须限制在 `max-w-4xl`）
- ❌ 在文档正文中使用 `bg-blue-50` 等 Tailwind 预设色，必须使用语义化变量或精确 HSL
- ❌ 为侧边栏添加背景图片或复杂几何装饰，破坏 Apple 极简质感
- ❌ 使用高对比度彩虹色或霓虹渐变作为页面主背景或卡片底色
- ❌ 将 Markdown 内容硬编码在组件中，必须预留 `props.content` 或 JSON/Markdown 注入接口
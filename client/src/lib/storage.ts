// localStorage 存储封装：案例、更新日志、试验模板、Agent 配置的增删改查

export interface ICaseStep {
  title: string;
  agent: string;
  description: string;
}

export interface ICompanyCaseStep {
  id: string;
  title: string;
  agentName: string;
  agentIcon: string;
  intro: string;
  prompt: string;
  responseHtml: string;
  codeBlock?: { label: string; content: string };
  tableData?: { headers: string[]; rows: string[][] };
  callout?: { type: 'info' | 'warning'; content: string };
}

export interface ICompanyCase {
  id: string;
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  readTime: string;
  steps: ICompanyCaseStep[];
}

export interface ICaseResource {
  title: string;
  type: 'prompt' | 'config' | 'data';
  content: string;
}

export interface ICase {
  id: string;
  title: string;
  category: 'website' | 'social' | 'finance' | 'automation';
  description: string;
  steps: ICaseStep[];
  resources?: ICaseResource[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateLog {
  id: string;
  version: string;
  title: string;
  description: string;
  date: string;
  type: 'case' | 'doc' | 'demo';
}

export interface ITemplate {
  id: string;
  title: string;
  type: 'prompt' | 'config' | 'data';
  content: string;
  isDefault: boolean;
  createdAt: string;
}

export interface IAgentConfig {
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

const CASES_KEY = 'jiuzhang-ai-cases';
const LOGS_KEY = 'jiuzhang-ai-logs';
const TEMPLATES_KEY = 'jiuzhang-ai-templates';
const AGENT_CONFIG_KEY = 'jiuzhang-ai-agent-config';
const COMPANY_CASES_KEY = 'jiuzhang-ai-company-cases';
const ADMIN_PASSWORD_KEY = 'jiuzhang-ai-admin-auth';
const DEFAULT_ADMIN_PASSWORD = 'jiuzhang2026';

// ===== 示例数据 =====

const sampleCompanyCases: ICompanyCase[] = [
  {
    id: 'cc-001',
    slug: 'photography-course',
    title: 'OPC一人教培公司',
    description: '利用 4 名数字员工完成课程从大纲策划、合规协议、定价测算到网站上线的全流程闭环。',
    updatedAt: '2026-05-23',
    readTime: '8 分钟',
    steps: [
      {
        id: 'step1',
        title: '第一步：通过"运营经理"生成课程大纲',
        agentName: '运营经理',
        agentIcon: '📈',
        intro: '首先，我们需要利用 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@运营经理</span> 强大的市场分析能力，针对小白用户设计痛点课程。',
        prompt: '"我想做一门给\'零基础小白\'看的手机摄影课。请帮我分析这类人群的痛点，并写一个吸引人的 3 天课程大纲，要求每一天都有具体能落地的技能。"',
        responseHtml: '<strong>核心痛点分析：</strong><br>1. 拍风景像"游客照"，没有美感。<br>2. 给女朋友拍照总被嫌弃腿短、脸大。<br>3. 买了很贵的手机，只会用默认模式，浪费了功能。<br><br><strong>《3天手机摄影速成营》大纲建议：</strong><br>Day 1: <b>参数调校</b> - 搞懂这 3 个隐藏按钮，画质提升 5 倍。<br>Day 2: <b>构图美学</b> - 黄金分割法，让废片瞬间变大片。<br>Day 3: <b>后期魔法</b> - 不用电脑，手机自带修图全攻略。',
      },
      {
        id: 'step2',
        title: '第二步：通过"行政助理"生成服务协议',
        agentName: '行政助理',
        agentIcon: '👔',
        intro: '为了避免后续的退款纠纷，我们需要 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@行政助理</span> 起草一份严谨的法律声明。',
        prompt: '"请帮我写一份\'学员服务协议\'。核心条款：课程为虚拟数字产品，一经购买不退不换；遇到播放问题可联系客服。"',
        responseHtml: '<h3 style="font-size:16px;margin:0 0 8px;">SoloOS 课程学员服务协议</h3><p style="margin:0 0 8px;"><strong>第1条 [服务内容]</strong> 本课程为数字化在线内容...</p><p style="margin:0;"><strong>第2条 [退费政策]</strong> 鉴于知识产品的特殊性（可复制性），您购买成功即视为服务已交付，<strong>不支持七天无理由退款</strong>。</p>',
      },
      {
        id: 'step3',
        title: '第三步：通过"财务顾问"测算定价与利润',
        agentName: '财务顾问',
        agentIcon: '💰',
        intro: '使用 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@财务顾问</span> 的数据模型，我们来反推要卖出多少课才能赚到 1 万元。',
        prompt: '"假设目标纯利润 1 万元，单课售价 99 元，获客成本 30 元/人，支付手续费 0.6%，请帮我测算盈亏平衡点。"',
        responseHtml: '',
        callout: { type: 'warning', content: '<strong>注意：</strong>不同的支付渠道（微信/支付宝/Stripe）手续费率不同，本案例按微信支付 0.6% 计算。' },
        tableData: {
          headers: ['项目', '金额/参数', '说明'],
          rows: [
            ['目标纯利润', '¥ 10,000.00', '如果不含税'],
            ['单课售价', '¥ 99.00', '市场建议价'],
            ['获客成本 (CAC)', '¥ 30.00', '预估投放成本/人'],
            ['<strong>盈亏平衡点</strong>', '<strong>147 份</strong>', '需达到的最小销量'],
          ],
        },
      },
      {
        id: 'step4',
        title: '第四步：通过"IT总监"生成销售网页',
        agentName: 'IT总监',
        agentIcon: '💻',
        intro: '最后，我们将所有内容交给 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@IT总监</span>，让它直接写出可部署的 HTML 代码。',
        prompt: '"请根据以上课程大纲和定价，生成一个销售网页的 HTML 代码，包含课程介绍、大纲展示和购买按钮。"',
        responseHtml: '',
        codeBlock: {
          label: 'index.html',
          content: `<!DOCTYPE html>
<html>
<head>
    <title>手机摄影速成课</title>
    <style>
        body { font-family: sans-serif; padding: 40px; text-align: center; }
        .buy-btn { background: #007AFF; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; }
    </style>
</head>
<body>
    <h1>3天掌握手机摄影神技</h1>
    <p>告别废片，朋友圈获赞无数。</p>
    <a href="#" class="buy-btn">立即购买 ¥99</a>
</body>
</html>`,
        },
      },
    ],
  },
  {
    id: 'cc-002',
    slug: 'toy-company',
    title: 'OPC一人潮玩公司',
    description: '从品牌定位到网站上线，4 名数字员工协同完成潮玩创业全流程。',
    updatedAt: '2026-05-22',
    readTime: '10 分钟',
    steps: [
      {
        id: 'step1',
        title: '第一步：通过"运营经理"确定品牌定位',
        agentName: '运营经理',
        agentIcon: '📈',
        intro: '首先，我们需要利用 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@运营经理</span> 的市场洞察力，确定潮玩品牌的差异化定位。',
        prompt: '"我想做一个面向年轻人的潮玩品牌，主打\'治愈系小怪兽\'概念。请帮我分析目标用户画像、竞品差异化和品牌故事。"',
        responseHtml: '<strong>目标用户画像：</strong><br>1. 18-28 岁大学生及初入职场白领<br>2. 喜欢收集盲盒、手办，注重情绪价值<br>3. 月可支配收入 3000-8000 元，愿意为"可爱"买单<br><br><strong>差异化定位：</strong><br>• 竞品多为"酷/拽"风格，我们主打"治愈/温暖"<br>• 每个角色附带一个情绪小故事，增强情感连接<br>• 包装采用环保材质，传递"温柔对待世界"理念<br><br><strong>品牌故事建议：</strong><br>"在城市的角落，住着一群小怪兽。它们不吓人，只是有点孤单……"',
      },
      {
        id: 'step2',
        title: '第二步：通过"IT总监"搭建电商网站',
        agentName: 'IT总监',
        agentIcon: '💻',
        intro: '品牌定位确定后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@IT总监</span> 负责搭建一个高颜值的潮玩电商网站。',
        prompt: '"请帮我搭建一个潮玩品牌电商网站，要求：1. 首页有品牌故事展示 2. 商品列表支持筛选 3. 购物车和结算流程 4. 移动端适配。使用 Next.js + Tailwind CSS。"',
        responseHtml: '',
        codeBlock: {
          label: 'pages/index.tsx',
          content: `import { ProductGrid } from '@/components/ProductGrid';
import { BrandStory } from '@/components/BrandStory';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <BrandStory
        title="城市里的小怪兽"
        subtitle="它们不吓人，只是有点孤单"
      />
      <ProductGrid
        categories={["盲盒", "手办", "周边"]}
        sortOptions={["新品", "热销", "价格"]}
      />
    </main>
  );
}`,
        },
      },
      {
        id: 'step3',
        title: '第三步：通过"财务顾问"测算定价与成本',
        agentName: '财务顾问',
        agentIcon: '💰',
        intro: '产品设计和网站都就绪后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@财务顾问</span> 帮我们算清楚每只小怪兽的成本和定价。',
        prompt: '"潮玩盲盒的生产成本约 15 元/个，包装 5 元，物流 8 元。如果我想保持 60% 毛利率，定价应该是多少？首批生产 500 个需要多少启动资金？"',
        responseHtml: '',
        callout: { type: 'warning', content: '<strong>注意：</strong>潮玩行业存在库存积压风险，建议首批小批量试产，根据市场反馈调整产量。' },
        tableData: {
          headers: ['项目', '金额', '说明'],
          rows: [
            ['单个生产成本', '¥ 15.00', '开模 + 注塑 + 涂装'],
            ['单个包装成本', '¥ 5.00', '盲盒 + 外盒 + 说明书'],
            ['单个物流成本', '¥ 8.00', '快递费（包邮）'],
            ['单个总成本', '¥ 28.00', ''],
            ['建议售价（60%毛利）', '<strong>¥ 69.00</strong>', '市场盲盒均价区间'],
            ['首批 500 个启动资金', '<strong>¥ 14,000.00</strong>', '28 × 500'],
          ],
        },
      },
      {
        id: 'step4',
        title: '第四步：通过"行政助理"完成合规与资质',
        agentName: '行政助理',
        agentIcon: '👔',
        intro: '最后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@行政助理</span> 帮我们梳理开店所需的各类资质和合规要求。',
        prompt: '"我要在淘宝和微信小程序上卖潮玩盲盒，需要办理哪些资质？请列出完整的合规清单。"',
         responseHtml: '<strong>必备资质清单：</strong><br>1. <b>营业执照</b> — 经营范围需包含"玩具销售"或"工艺品销售"<br>2. <b>3C 认证</b> — 潮玩属于塑胶玩具类别，需通过 CCC 认证<br>3. <b>质检报告</b> — 每批次产品需提供第三方检测报告<br>4. <b>商标注册</b> — 品牌名称和 Logo 需提前注册商标<br><br><strong>平台入驻要求：</strong><br>• 淘宝个人店：身份证 + 营业执照即可<br>• 微信小程序：需额外提供 ICP 备案 + 支付商户号<br><br><strong>盲盒合规特别提醒：</strong><br>根据《盲盒经营行为规范》，需公示抽取概率、设置购买上限、提供售后保障。',
      },
    ],
  },
  {
    id: 'cc-003',
    slug: '3d-printing-design',
    title: 'OPC一人3D打印设计公司',
    description: '从创意建模到在线售卖，4 名数字员工协同完成 3D 打印产品设计全流程。',
    updatedAt: '2026-05-24',
    readTime: '12 分钟',
    steps: [
      {
        id: 'step1',
        title: '第一步：通过"运营经理"分析市场需求',
        agentName: '运营经理',
        agentIcon: '📈',
        intro: '首先，利用 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@运营经理</span> 的市场洞察能力，找到 3D 打印产品的蓝海赛道。',
        prompt: '"我想做 3D 打印产品设计并在线售卖（如 Etsy、淘宝）。请帮我分析目前最受欢迎的 3D 打印品类、定价区间和目标用户画像。"',
        responseHtml: '<strong>热门 3D 打印品类分析：</strong><br>1. <b>桌面收纳类</b> — 笔筒、耳机架、化妆品收纳，均价 ¥39-89<br>2. <b>创意灯具类</b> — 月球灯、几何台灯，均价 ¥69-159<br>3. <b>植物花盆类</b> — 几何造型、自浇水设计，均价 ¥29-79<br>4. <b>桌游配件类</b> — 棋子收纳、骰子塔，均价 ¥49-129<br><br><strong>推荐赛道：创意灯具类</strong><br>• 溢价空间大（成本 ¥8，售价 ¥89+）<br>• 社交媒体传播性强（"氛围感"标签）<br>• 设计壁垒适中，适合个人设计师',
      },
      {
        id: 'step2',
        title: '第二步：通过"IT总监"生成 3D 建模代码',
        agentName: 'IT总监',
        agentIcon: '💻',
        intro: '确定产品方向后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@IT总监</span> 帮我们生成参数化的 3D 模型代码。',
        prompt: '"请帮我用 OpenSCAD 代码生成一个"几何多面体台灯"的 3D 模型。要求：1. 底座直径 80mm 2. 灯罩为二十面体结构 3. 预留 E12 灯座接口 4. 壁厚 2mm 适合 FDM 打印。"',
        responseHtml: '',
        codeBlock: {
          label: 'geometric_lamp.scad',
          content: `// 几何多面体台灯 - OpenSCAD 参数化模型
// 适用于 FDM 3D 打印，壁厚 2mm

$fn = 60;  // 圆滑度

// 底座模块
module base() {
    cylinder(h = 8, d = 80);
    cylinder(h = 4, d = 72);
}

// 二十面体灯罩
module shade() {
    difference() {
        // 外轮廓
        sphere(d = 100);
        // 内部空心（壁厚 2mm）
        sphere(d = 96);
        // 底部开口
        translate([0, 0, -30])
            cylinder(h = 60, d = 50);
    }
}

// E12 灯座接口
module socket_mount() {
    cylinder(h = 12, d = 28);
    translate([0, 0, 12])
        cylinder(h = 4, d = 24);
}

// 组装
base();
translate([0, 0, 8]) shade();
translate([0, 0, 6]) socket_mount();`,
        },
      },
      {
        id: 'step3',
        title: '第三步：通过"财务顾问"测算成本与定价',
        agentName: '财务顾问',
        agentIcon: '💰',
        intro: '模型就绪后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@财务顾问</span> 帮我们算清楚单件成本和最优定价。',
        prompt: '"3D 打印几何台灯：PLA 材料约 120g（¥3/个），打印时长 6 小时（电费 ¥1.5），包装 ¥4，快递 ¥8。如果我想保持 70% 毛利率，定价应该是多少？"',
        responseHtml: '',
        callout: { type: 'info', content: '<strong>提示：</strong>3D 打印产品适合"小批量定制 + 按需生产"模式，无需囤货，降低库存风险。' },
        tableData: {
          headers: ['项目', '金额', '说明'],
          rows: [
            ['PLA 材料成本', '¥ 3.00', '120g × ¥25/kg'],
            ['打印电费', '¥ 1.50', '6 小时 × 0.25 元/时'],
            ['包装成本', '¥ 4.00', '气泡袋 + 飞机盒'],
            ['快递费用', '¥ 8.00', '全国包邮均价'],
            ['单个总成本', '¥ 16.50', ''],
            ['建议售价（70%毛利）', '<strong>¥ 55.00</strong>', 'Etsy 同类均价 $12-18'],
            ['单个净利润', '<strong>¥ 38.50</strong>', '毛利率 70%'],
          ],
        },
      },
      {
        id: 'step4',
        title: '第四步：通过"行政助理"生成产品详情页文案',
        agentName: '行政助理',
        agentIcon: '👔',
        intro: '最后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@行政助理</span> 帮我们撰写吸引人的产品描述和购买页面文案。',
        prompt: '"请帮我写一段 3D 打印几何台灯的产品详情页文案，用于 Etsy/淘宝销售。要求：1. 突出"设计师原创"和"氛围感" 2. 包含产品规格参数 3. 附带使用场景描述 4. 语气温暖有质感。"',
        responseHtml: '<h3 style="font-size:16px;margin:0 0 12px;">🌙 几何多面体台灯 — 把星空放在床头</h3><p style="margin:0 0 12px;">每一盏灯，都是独一无二的几何艺术品。<br>采用环保 PLA 材料，经 3D 打印层层堆叠成型，表面呈现细腻的层理质感——这不是流水线产品，而是有温度的手工感设计。</p><p style="margin:0 0 12px;"><strong>产品规格：</strong><br>• 尺寸：底座直径 8cm，总高约 12cm<br>• 材质：环保 PLA（可降解）<br>• 光源：E12 接口，兼容 LED 小灯泡（需另购）<br>• 重量：约 120g，轻盈不占空间</p><p style="margin:0;"><strong>使用场景：</strong><br>床头氛围灯 · 书桌装饰 · 拍摄道具 · 礼物赠送</p>',
      },
    ],
  },
  {
    id: 'cc-004',
    slug: 'indie-game-dev',
    title: 'OPC一人游戏开发公司',
    description: '从创意策划到上架 Steam，4 名数字员工协同完成独立游戏开发全流程。',
    updatedAt: '2026-05-25',
    readTime: '15 分钟',
    steps: [
      {
        id: 'step1',
        title: '第一步：通过"运营经理"确定游戏创意',
        agentName: '运营经理',
        agentIcon: '📈',
        intro: '首先，利用 <span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@运营经理</span> 的市场分析能力，找到适合一人开发的独立游戏赛道。',
        prompt: '"我想一个人开发一款独立游戏上架 Steam。请帮我分析：1. 目前 Steam 上适合单人开发的游戏类型 2. 开发周期 3-6 个月的品类 3. 定价策略和预期销量。"',
        responseHtml: '<strong>适合单人开发的 Steam 游戏品类：</strong><br>1. <b>叙事解谜类</b> — 如《The Room》风格，开发周期 3-4 个月，定价 ¥18-28<br>2. <b>放置经营类</b> — 如《冒险村物语》，开发周期 2-3 个月，定价 ¥12-18<br>3. <b>文字冒险类</b> — 如视觉小说，开发周期 1-2 个月，定价 ¥6-12<br>4. <b>休闲肉鸽类</b> — 如《吸血鬼幸存者》简化版，开发周期 4-6 个月，定价 ¥22-36<br><br><strong>推荐：叙事解谜类</strong><br>• 资产需求少（场景固定、角色少）<br>• 玩家付费意愿强（"好故事"溢价高）<br>• 适合 AI 辅助生成剧情文本和谜题设计<br><br><strong>预期数据：</strong><br>• 首月销量：500-2000 份<br>• 年收入：¥30,000-100,000<br>• 好评率目标：85%+',
      },
      {
        id: 'step2',
        title: '第二步：通过"IT总监"搭建游戏框架',
        agentName: 'IT总监',
        agentIcon: '💻',
        intro: '确定游戏类型后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@IT总监</span> 帮我们搭建游戏开发框架和核心系统。',
        prompt: '"请帮我用 Godot 4 + GDScript 搭建一个叙事解谜游戏的基础框架。要求：1. 场景切换系统 2. 物品交互系统（拾取/使用/组合）3. 对话系统 4. 存档系统。请给出核心代码。"',
        responseHtml: '',
        codeBlock: {
          label: 'game_manager.gd',
          content: `extends Node

# 游戏管理器 — 叙事解谜游戏核心框架
var inventory: Array[String] = []
var current_scene: String = "start"
var dialogue_state: Dictionary = {}
var save_data: Dictionary = {}

# 场景切换
func change_scene(scene_name: String) -> void:
    current_scene = scene_name
    get_tree().change_scene_to_file("res://scenes/%s.tscn" % scene_name)

# 物品系统
func add_item(item_id: String) -> void:
    if not inventory.has(item_id):
        inventory.append(item_id)
        print("获得物品: %s" % item_id)

func has_item(item_id: String) -> bool:
    return inventory.has(item_id)

# 存档系统
func save_game(slot: int = 1) -> void:
    save_data = {
        "scene": current_scene,
        "inventory": inventory,
        "dialogue": dialogue_state,
        "timestamp": Time.get_unix_time_from_system()
    }
    var file = FileAccess.open("user://save_%d.json" % slot, FileAccess.WRITE)
    file.store_string(JSON.stringify(save_data))
    file.close()

func load_game(slot: int = 1) -> bool:
    if not FileAccess.file_exists("user://save_%d.json" % slot):
        return false
    var file = FileAccess.open("user://save_%d.json" % slot, FileAccess.READ)
    save_data = JSON.parse_string(file.get_as_text())
    file.close()
    current_scene = save_data["scene"]
    inventory = save_data["inventory"]
    dialogue_state = save_data["dialogue"]
    return true`,
        },
      },
      {
        id: 'step3',
        title: '第三步：通过"财务顾问"规划预算与定价',
        agentName: '财务顾问',
        agentIcon: '💰',
        intro: '技术框架就绪后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@财务顾问</span> 帮我们规划开发预算和 Steam 定价策略。',
        prompt: '"我计划开发一款叙事解谜游戏，开发周期 4 个月。请帮我规划：1. 开发成本预算（软件、素材、音乐等）2. Steam 定价策略（国区/美区）3. 预期收入测算（保守/乐观两种情况）。"',
        responseHtml: '',
        callout: { type: 'warning', content: '<strong>注意：</strong>Steam 平台抽成 30%，定价时需计入。此外需预留 10-15% 预算用于退款和促销折扣。' },
        tableData: {
          headers: ['项目', '金额', '说明'],
          rows: [
            ['Godot 引擎', '¥ 0', '开源免费'],
            ['美术素材包', '¥ 500', 'itch.io / Unity Asset Store'],
            ['背景音乐', '¥ 300', 'AI 生成 + 人工混音'],
            ['Steam 上架费', '¥ 700', '$100 一次性押金'],
            ['总开发成本', '<strong>¥ 1,500</strong>', ''],
            ['国区定价', '<strong>¥ 22</strong>', '独立游戏主流价位'],
            ['美区定价', '<strong>$4.99</strong>', '约 ¥36'],
            ['保守销量（首年）', '800 份', '自然流量'],
            ['乐观销量（首年）', '3,000 份', '获编辑推荐/直播曝光'],
          ],
        },
      },
      {
        id: 'step4',
        title: '第四步：通过"行政助理"准备上架材料',
        agentName: '行政助理',
        agentIcon: '👔',
        intro: '最后，<span style="color:#1664FF;background:#E8F3FF;padding:2px 6px;border-radius:4px;">@行政助理</span> 帮我们准备 Steam 上架所需的各类文案和材料。',
        prompt: '"请帮我准备 Steam 游戏上架所需的文案材料：1. 游戏简介（300 字以内）2. 特色功能列表（5 条）3. 系统配置要求（最低/推荐）4. 标签建议（最多 15 个）。游戏类型：叙事解谜，主题："在废弃图书馆中寻找失踪妹妹的真相"。"',
        responseHtml: '<strong>📖 游戏简介：</strong><br>你收到妹妹的最后一条消息："我在市立图书馆的地下室，发现了不该看的东西..." 随后她彻底失联。<br>走进这座已经废弃三年的图书馆，你将通过解谜、拼凑线索、解读隐藏文字，一步步揭开妹妹失踪的真相。每一个选择都将改变故事的走向——你准备好面对真相了吗？<br><br><strong>✨ 游戏特色：</strong><br>1. 沉浸式叙事 — 多分支剧情，3 种结局<br>2. 环境解谜 — 利用图书馆场景中的书籍、密码锁、隐藏机关推进流程<br>3. 氛围音效 — 脚步声、翻书声、低语声构建紧张感<br>4. 手绘美术 — 复古色调 + 细腻光影<br>5. 2-3 小时流程 — 适合一个周末的完整体验<br><br><strong>💻 系统配置：</strong><br>最低：Win 10 / 4GB RAM / 集成显卡 / 500MB 存储<br>推荐：Win 11 / 8GB RAM / 独立显卡 / 500MB SSD<br><br><strong>🏷️ 标签建议：</strong><br>解谜 · 叙事 · 悬疑 · 独立游戏 · 氛围 · 剧情丰富 · 探索 · 手绘 · 单人开发 · 短篇 · 多结局 · 恐怖 · 步行模拟 · 女性主角 · 图书馆',
      },
    ],
  },
];

const sampleCases: ICase[] = [
  {
    id: 'case-001',
    title: '用 AI 搭建个人博客网站',
    category: 'website',
    description: '零代码基础也能上手！让 IT Agent 帮你生成博客模板，30 分钟部署上线，拥有属于自己的个人网站。',
    steps: [
      { title: '告诉 Agent 你的想法', agent: 'IT Agent', description: '输入"我想做一个个人博客，展示我的作品和经历"，Agent 会自动生成网站框架' },
      { title: '选择喜欢的风格', agent: 'IT Agent', description: 'Agent 提供 3 种风格模板（简约/文艺/科技感），选一个最顺眼的' },
      { title: '填充你的内容', agent: '运营 Agent', description: '把个人简介、作品描述发给运营 Agent，它帮你润色成吸引人的文案' },
      { title: '一键发布上线', agent: 'IT Agent', description: 'Agent 自动部署到免费平台，生成专属网址，分享给朋友就能访问' },
    ],
    resources: [
      { title: '个人博客 Prompt 模板', type: 'prompt', content: '请帮我生成一个个人博客网站，要求：1. 简约现代风格 2. 包含首页、关于我、作品展示三个页面 3. 支持手机端访问' },
      { title: '网站部署配置', type: 'config', content: '{\n  "platform": "vercel",\n  "framework": "nextjs",\n  "template": "personal-blog"\n}' },
    ],
    createdAt: '2026-05-24',
    updatedAt: '2026-05-24',
  },
  {
    id: 'case-002',
    title: '小红书涨粉 1000 实操',
    category: 'social',
    description: '不会写文案？让运营 Agent 当你的内容助手，7 天从 0 到 1000 粉的真实操作复盘。',
    steps: [
      { title: '确定你的定位', agent: '运营 Agent', description: '告诉 Agent 你的兴趣领域（如校园生活、学习干货），它帮你分析目标受众' },
      { title: '生成首周内容', agent: '运营 Agent', description: 'Agent 一次性输出 7 篇爆款文案，包含标题、正文、话题标签，直接复制就能发' },
      { title: '优化发布时间', agent: '行政 Agent', description: '行政 Agent 分析最佳发布时间段，设置提醒避免错过流量高峰' },
      { title: '复盘数据调整', agent: '运营 Agent', description: '一周后查看数据，Agent 分析哪些内容受欢迎，调整下周方向' },
    ],
    resources: [
      { title: '爆款文案 Prompt', type: 'prompt', content: '请帮我写一篇小红书爆款笔记，主题：大学生期末复习干货。要求：1. 标题吸引眼球 2. 正文分点清晰 3. 附带 10 个热门话题标签' },
    ],
    createdAt: '2026-05-24',
    updatedAt: '2026-05-24',
  },
  {
    id: 'case-003',
    title: '大学生兼职收入记账',
    category: 'finance',
    description: '家教、设计兼职赚了多少？花在哪了？财务 Agent 帮你自动生成收支表，一目了然。',
    steps: [
      { title: '录入收入记录', agent: '财务 Agent', description: '把每笔兼职收入告诉 Agent（如"5 月 10 日家教 200 元"），它自动分类记录' },
      { title: '记录日常开销', agent: '财务 Agent', description: '吃饭、交通、买书...随手记，Agent 按类别自动统计' },
      { title: '查看月度报表', agent: '财务 Agent', description: '月底一键生成收支报表，收入多少、支出多少、结余多少，清清楚楚' },
    ],
    resources: [
      { title: '记账 Prompt 模板', type: 'prompt', content: '请帮我记录一笔收入：[日期] [来源] [金额]。例如：5月10日 家教 200元。请自动分类并更新我的月度收支表。' },
    ],
    createdAt: '2026-05-24',
    updatedAt: '2026-05-24',
  },
  {
    id: 'case-004',
    title: '社团活动自动化流程',
    category: 'automation',
    description: '办一场校园活动要做什么？让行政 Agent 当你的项目管家，协调 IT + 运营一键搞定。',
    steps: [
      { title: '活动策划分工', agent: '行政 Agent', description: '告诉 Agent 活动主题和规模，它自动生成任务清单：海报设计、报名页、场地申请...' },
      { title: '生成活动海报', agent: '运营 Agent', description: '提供活动信息，运营 Agent 生成海报文案 + 设计建议，直接给到设计工具使用' },
      { title: '搭建报名页面', agent: 'IT Agent', description: 'Agent 自动生成在线报名表，收集姓名、联系方式、参与意愿，数据实时汇总' },
      { title: '活动后复盘', agent: '行政 Agent', description: '活动结束后，Agent 汇总参与人数、反馈评分，生成复盘报告供下次参考' },
    ],
    resources: [
      { title: '活动策划 Prompt', type: 'prompt', content: '请帮我策划一场校园活动：主题是 AI 技术分享，预计 50 人参加。请生成完整的任务清单，包括海报、报名页、场地、流程安排。' },
      { title: '报名表配置模板', type: 'config', content: '{\n  "formTitle": "AI 技术分享活动报名",\n  "fields": ["姓名", "学院", "手机号", "是否首次参加"],\n  "maxCapacity": 50\n}' },
    ],
    createdAt: '2026-05-24',
    updatedAt: '2026-05-24',
  },
];

const sampleLogs: IUpdateLog[] = [
  {
    id: 'log-001',
    version: 'v1.2.0',
    title: '新增实践与试验模块',
    description: '上线案例库、一键试验模板功能，支持用户上传自定义模板。',
    date: '2026-05-23',
    type: 'case',
  },
  {
    id: 'log-002',
    version: 'v1.1.0',
    title: '新增数字员工指南',
    description: '补充四大数字员工的详细说明、Prompt 模板与交互演示。',
    date: '2026-05-18',
    type: 'doc',
  },
  {
    id: 'log-003',
    version: 'v1.0.0',
    title: '初始版本发布',
    description: '九章数智AI+ 技术文档学习中心上线，聚焦 Agent 使用指南与实战案例。',
    date: '2026-05-10',
    type: 'doc',
  },
];

const sampleTemplates: ITemplate[] = [
  {
    id: 'tpl-001',
    title: 'OpenClaw 基础配置模板',
    type: 'config',
    content: `{\n  "framework": "openclaw",\n  "version": "1.0",\n  "agents": [\n    { "name": "IT", "model": "gpt-4o", "temperature": 0.5 },\n    { "name": "运营", "model": "gpt-4o", "temperature": 0.8 },\n    { "name": "财务", "model": "gpt-4o", "temperature": 0.3 },\n    { "name": "行政", "model": "gpt-4o", "temperature": 0.5 }\n  ],\n  "port": 3000,\n  "logLevel": "info"\n}`,
    isDefault: true,
    createdAt: '2026-05-10',
  },
  {
    id: 'tpl-002',
    title: 'IT Agent 系统提示词',
    type: 'prompt',
    content: `你是一个专业的 IT 技术专家 Agent，负责一人公司的技术基础设施搭建与维护。\n\n职责范围：\n1. 网站/应用开发（前端、后端、部署）\n2. 服务器配置与运维\n3. 数据库设计与优化\n4. 自动化脚本编写\n\n工作原则：\n- 优先使用成熟、开源的技术栈\n- 代码必须包含注释和错误处理\n- 提供可执行的命令和配置示例`,
    isDefault: true,
    createdAt: '2026-05-10',
  },
  {
    id: 'tpl-003',
    title: '运营 Agent 内容生成模板',
    type: 'prompt',
    content: `你是一个资深运营专家 Agent，负责一人公司的内容创作、社交媒体运营与用户增长。\n\n职责范围：\n1. 文案撰写（公众号、小红书、抖音）\n2. SEO 优化与关键词策略\n3. 内容日历规划\n4. 用户增长策略\n\n工作原则：\n- 内容风格贴合目标平台调性\n- 提供可直接发布的成品文案\n- 附带 SEO 标签和发布建议`,
    isDefault: true,
    createdAt: '2026-05-10',
  },
];

const sampleAgentConfigs: IAgentConfig[] = [
  {
    name: 'IT Agent',
    systemPrompt: '你是一个专业的 IT 技术专家 Agent，负责一人公司的技术基础设施搭建与维护。',
    temperature: 0.5,
    maxTokens: 4096,
    model: 'gpt-4o',
  },
  {
    name: '运营 Agent',
    systemPrompt: '你是一个资深运营专家 Agent，负责内容创作、社交媒体运营与用户增长。',
    temperature: 0.8,
    maxTokens: 4096,
    model: 'gpt-4o',
  },
  {
    name: '财务 Agent',
    systemPrompt: '你是一个财务分析专家 Agent，负责成本核算、预算管理与财务报表生成。',
    temperature: 0.3,
    maxTokens: 2048,
    model: 'gpt-4o',
  },
  {
    name: '行政 Agent',
    systemPrompt: '你是一个行政协调专家 Agent，负责流程管理、资源调度与跨部门协作。',
    temperature: 0.5,
    maxTokens: 2048,
    model: 'gpt-4o',
  },
];

function initSampleData() {
  if (!localStorage.getItem(CASES_KEY)) {
    localStorage.setItem(CASES_KEY, JSON.stringify(sampleCases));
  }
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(sampleLogs));
  }
  if (!localStorage.getItem(TEMPLATES_KEY)) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(sampleTemplates));
  }
  if (!localStorage.getItem(AGENT_CONFIG_KEY)) {
    localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(sampleAgentConfigs));
  }
  // 公司案例：如果本地数据少于示例数据，说明有新案例需要补充
  const localCases: ICompanyCase[] = JSON.parse(localStorage.getItem(COMPANY_CASES_KEY) || '[]');
  if (localCases.length === 0 || localCases.length < sampleCompanyCases.length) {
    localStorage.setItem(COMPANY_CASES_KEY, JSON.stringify(sampleCompanyCases));
  }
}

// 初始化：首次访问写入示例数据
initSampleData();

// ===== 案例 CRUD =====

export function getCases(): ICase[] {
  try {
    const data = localStorage.getItem(CASES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCases(cases: ICase[]): void {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

export function addCase(caseData: Omit<ICase, 'id' | 'createdAt' | 'updatedAt'>): ICase {
  const cases = getCases();
  const newCase: ICase = {
    ...caseData,
    id: `case-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  cases.unshift(newCase);
  saveCases(cases);
  return newCase;
}

export function updateCase(id: string, updates: Partial<ICase>): ICase | null {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cases[index] = { ...cases[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
  saveCases(cases);
  return cases[index];
}

export function deleteCase(id: string): boolean {
  const cases = getCases();
  const filtered = cases.filter((c) => c.id !== id);
  if (filtered.length === cases.length) return false;
  saveCases(filtered);
  return true;
}

// ===== 日志 CRUD =====

export function getLogs(): IUpdateLog[] {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs: IUpdateLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function addLog(logData: Omit<IUpdateLog, 'id'>): IUpdateLog {
  const logs = getLogs();
  const newLog: IUpdateLog = {
    ...logData,
    id: `log-${Date.now()}`,
  };
  logs.unshift(newLog);
  saveLogs(logs);
  return newLog;
}

export function updateLog(id: string, updates: Partial<IUpdateLog>): IUpdateLog | null {
  const logs = getLogs();
  const index = logs.findIndex((l) => l.id === id);
  if (index === -1) return null;
  logs[index] = { ...logs[index], ...updates };
  saveLogs(logs);
  return logs[index];
}

export function deleteLog(id: string): boolean {
  const logs = getLogs();
  const filtered = logs.filter((l) => l.id !== id);
  if (filtered.length === logs.length) return false;
  saveLogs(filtered);
  return true;
}

// ===== 模板 CRUD =====

export function getTemplates(): ITemplate[] {
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTemplates(templates: ITemplate[]): void {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function addTemplate(templateData: Omit<ITemplate, 'id' | 'createdAt'>): ITemplate {
  const templates = getTemplates();
  const newTemplate: ITemplate = {
    ...templateData,
    id: `tpl-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  templates.unshift(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

export function updateTemplate(id: string, updates: Partial<ITemplate>): ITemplate | null {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return null;
  templates[index] = { ...templates[index], ...updates };
  saveTemplates(templates);
  return templates[index];
}

export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const filtered = templates.filter((t) => t.id !== id);
  if (filtered.length === templates.length) return false;
  saveTemplates(filtered);
  return true;
}

// ===== Agent 配置 CRUD =====

export function getAgentConfigs(): IAgentConfig[] {
  try {
    const data = localStorage.getItem(AGENT_CONFIG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAgentConfigs(configs: IAgentConfig[]): void {
  localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(configs));
}

export function updateAgentConfig(name: string, updates: Partial<IAgentConfig>): IAgentConfig | null {
  const configs = getAgentConfigs();
  const index = configs.findIndex((c) => c.name === name);
  if (index === -1) return null;
  configs[index] = { ...configs[index], ...updates };
  saveAgentConfigs(configs);
  return configs[index];
}

export function resetAgentConfigs(): void {
  localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(sampleAgentConfigs));
}

// ===== 公司案例 CRUD =====

export function getCompanyCases(): ICompanyCase[] {
  try {
    const data = localStorage.getItem(COMPANY_CASES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCompanyCases(cases: ICompanyCase[]): void {
  localStorage.setItem(COMPANY_CASES_KEY, JSON.stringify(cases));
}

// ===== 管理员认证 =====

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) === 'true';
}

export function authenticateAdmin(password: string): boolean {
  if (password === DEFAULT_ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_PASSWORD_KEY);
}

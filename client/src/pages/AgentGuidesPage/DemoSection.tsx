import { useState, useEffect } from 'react';
import { MessageSquareIcon, BotIcon, UserIcon, ArrowRightIcon, SparklesIcon, ClockIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAgentConfigs, type IAgentConfig } from '@/lib/storage';

interface IDemoMessage {
  id: string;
  role: 'user' | 'agent';
  agentName?: string;
  content: string;
  timestamp?: string;
}

const demoScenarios = [
  {
    id: 'scenario-1',
    title: '独立站搭建任务',
    description: 'IT Agent + 运营 Agent 协同完成跨境电商网站搭建',
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: '帮我搭建一个跨境电商独立站，预算控制在每月 500 元以内。',
        timestamp: '10:00',
      },
      {
        id: '2',
        role: 'agent' as const,
        agentName: 'IT Agent',
        content: '收到需求。基于你的预算，我推荐以下方案：\n\n1. **技术栈**：Next.js + Tailwind CSS（免费开源）\n2. **部署平台**：Vercel 免费版（每月 100GB 流量）\n3. **域名**：Namecheap 注册，约 ¥60/年\n4. **总成本**：首年约 ¥120，月均 ¥10\n\n我现在开始初始化项目脚手架，预计 15 分钟完成基础框架。',
        timestamp: '10:01',
      },
      {
        id: '3',
        role: 'user' as const,
        content: '好的，同时帮我生成首页的产品文案和 SEO 配置。',
        timestamp: '10:05',
      },
      {
        id: '4',
        role: 'agent' as const,
        agentName: '运营 Agent',
        content: '已接手内容任务。我将完成：\n\n• 首页 Hero 文案（中英双语）\n• 3 个核心产品详情页描述\n• SEO Title / Description / Keywords 配置\n• 站点地图 sitemap.xml\n\n内容将在 IT Agent 完成部署后同步填充。',
        timestamp: '10:06',
      },
      {
        id: '5',
        role: 'agent' as const,
        agentName: '财务 Agent',
        content: '成本核算已完成：\n\n| 项目 | 费用 |\n|------|------|\n| 域名 | ¥60/年 |\n| 服务器 | ¥0（Vercel 免费） |\n| SSL 证书 | ¥0（Let\'s Encrypt） |\n| **总计** | **¥60/年** |\n\n预算使用率仅 10%，剩余空间可扩展 CDN 或备份服务。',
        timestamp: '10:08',
      },
    ],
  },
  {
    id: 'scenario-2',
    title: '自媒体矩阵运营',
    description: '运营 Agent 主导多平台内容规划与发布',
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: '帮我规划小红书和公众号的首月内容日历。',
        timestamp: '14:00',
      },
      {
        id: '2',
        role: 'agent' as const,
        agentName: '运营 Agent',
        content: '已生成首月内容日历：\n\n**小红书（每周 3 篇）**\n- 周一：产品使用技巧\n- 周三：行业干货分享\n- 周五：用户案例故事\n\n**公众号（每周 1 篇深度）**\n- 周四：行业趋势分析 / 产品深度评测\n\n需要我先生成第一周的详细文案吗？',
        timestamp: '14:02',
      },
      {
        id: '3',
        role: 'user' as const,
        content: '好的，同时帮我配置 SEO 关键词策略。',
        timestamp: '14:10',
      },
      {
        id: '4',
        role: 'agent' as const,
        agentName: '行政 Agent',
        content: '已协调资源：\n\n1. 已创建内容审核流程\n2. 配置了发布排期提醒\n3. 建立了数据追踪看板\n\n运营 Agent 生成文案后，我将自动安排审核与发布。',
        timestamp: '14:12',
      },
    ],
  },
];

const agentColorMap: Record<string, string> = {
  'IT Agent': 'bg-blue-100 text-blue-700 border-blue-200',
  '运营 Agent': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '财务 Agent': 'bg-amber-100 text-amber-700 border-amber-200',
  '行政 Agent': 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function DemoSection() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [agentConfigs, setAgentConfigs] = useState<IAgentConfig[]>([]);

  useEffect(() => {
    setAgentConfigs(getAgentConfigs());
  }, []);

  const scenario = demoScenarios[activeScenario];
  const visibleMessages = scenario.messages.slice(0, visibleCount);
  const hasMore = visibleCount < scenario.messages.length;

  return (
    <section className="w-full">
      <Card>
        <CardContent className="p-0">
          {/* 场景切换头部 */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <SparklesIcon className="size-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{scenario.title}</h3>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden md:inline-flex">
              演示模式
            </Badge>
          </div>

          {/* 场景切换按钮 */}
          <div className="flex gap-2 border-b border-border px-6 py-3 bg-muted/30">
            {demoScenarios.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScenario(idx);
                  setVisibleCount(2);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeScenario === idx
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* 对话内容区 */}
          <div className="px-6 py-5 space-y-4 max-h-[420px] overflow-y-auto">
            {visibleMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* 头像 */}
                {msg.role === 'agent' ? (
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                    msg.agentName ? agentColorMap[msg.agentName]?.split(' ').filter(c => c.startsWith('bg-')).join(' ') || 'bg-accent border-border' : 'bg-accent border-border'
                  }`}>
                    <BotIcon className={`size-3.5 ${
                      msg.agentName ? agentColorMap[msg.agentName]?.split(' ').filter(c => c.startsWith('text-')).join(' ') || 'text-accent-foreground' : 'text-accent-foreground'
                    }`} />
                  </div>
                ) : (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent border border-border">
                    <UserIcon className="size-3.5 text-accent-foreground" />
                  </div>
                )}

                {/* 消息气泡 */}
                <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-foreground border border-border'
                }`}>
                  {msg.role === 'agent' && msg.agentName && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[11px] ${
                        agentColorMap[msg.agentName] || 'bg-muted text-muted-foreground border-border'
                      }`}>
                        <BotIcon className="size-3 mr-1" />
                        {msg.agentName}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="text-[11px] text-primary-foreground/70 mb-1 flex items-center gap-1">
                      <UserIcon className="size-3" />
                      用户 · {msg.timestamp}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部操作区 */}
          <div className="flex items-center justify-between border-t border-border px-6 py-3 bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquareIcon className="size-3.5" />
              <span>共 {scenario.messages.length} 条消息，已展示 {visibleCount} 条</span>
            </div>
            {hasMore ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount(prev => prev + 2)}
                className="gap-1.5 text-xs h-7"
              >
                加载更多
                <ArrowRightIcon className="size-3.5" />
              </Button>
            ) : (
              <Badge variant="outline" className="text-xs">
                演示结束
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent 配置状态提示 */}
      {agentConfigs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {agentConfigs.map((config) => (
            <div
              key={config.name}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs"
            >
              <div className={`size-2 rounded-full ${
                config.name === 'IT Agent' ? 'bg-blue-500' :
                config.name === '运营 Agent' ? 'bg-emerald-500' :
                config.name === '财务 Agent' ? 'bg-amber-500' :
                'bg-purple-500'
              }`} />
              <span className="font-medium text-foreground">{config.name}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{config.model}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">T={config.temperature}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>此区域为演示占位，后续可通过管理后台填充真实对话记录</span>
      </div>
    </section>
  );
}

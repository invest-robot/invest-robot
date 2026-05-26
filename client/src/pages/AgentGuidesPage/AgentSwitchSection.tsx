import { useState, useEffect } from 'react';
import { BotIcon, SettingsIcon, CodeIcon, BarChart3Icon, ClipboardListIcon, CopyIcon, CheckIcon, ThermometerIcon, MaximizeIcon, CpuIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAgentConfigs, type IAgentConfig } from '@/lib/storage';
import { logger } from '@lark-apaas/client-toolkit/logger';

const agentIcons: Record<string, React.ElementType> = {
  'IT Agent': CodeIcon,
  '运营 Agent': BarChart3Icon,
  '财务 Agent': SettingsIcon,
  '行政 Agent': ClipboardListIcon,
};

const agentColorMap: Record<string, string> = {
  'IT Agent': 'bg-blue-100 text-blue-700 border-blue-200',
  '运营 Agent': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '财务 Agent': 'bg-amber-100 text-amber-700 border-amber-200',
  '行政 Agent': 'bg-purple-100 text-purple-700 border-purple-200',
};

const agentDescriptions: Record<string, string> = {
  'IT Agent': '技术基础设施搭建与维护，负责网站开发、服务器配置、数据库设计与自动化脚本编写。',
  '运营 Agent': '内容创作、社交媒体运营与用户增长，负责文案撰写、SEO 优化、内容日历规划。',
  '财务 Agent': '成本核算、预算管理与财务报表生成，负责数据分析、利润计算与风险评估。',
  '行政 Agent': '流程管理、资源调度与跨部门协作，负责需求分析、项目协调与行政事务处理。',
};

const agentResponsibilities: Record<string, string[]> = {
  'IT Agent': [
    '网站/应用开发（前端、后端、部署）',
    '服务器配置与运维监控',
    '数据库设计与性能优化',
    '自动化脚本与 CI/CD 流程',
    'API 接口开发与集成',
  ],
  '运营 Agent': [
    '多平台文案撰写（公众号、小红书、抖音）',
    'SEO 关键词策略与优化',
    '内容日历规划与发布管理',
    '用户增长策略与数据分析',
    '品牌视觉规范与内容调性把控',
  ],
  '财务 Agent': [
    '成本核算与预算编制',
    '财务报表生成与趋势分析',
    '利润率计算与风险评估',
    '税务规划与合规检查',
    '现金流管理与预测',
  ],
  '行政 Agent': [
    '需求分析与技术选型建议',
    '项目进度跟踪与资源调度',
    '跨部门协作与流程优化',
    '文档管理与知识沉淀',
    '行政事务处理与后勤保障',
  ],
};

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      logger.error('复制失败');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <CheckIcon className="size-3.5 text-success" />
          已复制
        </>
      ) : (
        <>
          <CopyIcon className="size-3.5" />
          复制
        </>
      )}
    </Button>
  );
}

export default function AgentSwitchSection() {
  const [configs, setConfigs] = useState<IAgentConfig[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>('IT Agent');

  useEffect(() => {
    const data = getAgentConfigs();
    setConfigs(data);
    if (data.length > 0) {
      setActiveAgent(data[0].name);
    }
  }, []);

  const activeConfig = configs.find((c) => c.name === activeAgent);
  const ActiveIcon = agentIcons[activeAgent] || BotIcon;

  return (
    <section className="w-full space-y-8">
      {/* 页面标题区 */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">数字员工指南</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          详细了解四大数字员工的职责边界、配置参数与交互方式
        </p>
      </div>

      {/* 角色切换按钮组 */}
      <div className="flex flex-wrap gap-3">
        {configs.map((config) => {
          const Icon = agentIcons[config.name] || BotIcon;
          const isActive = config.name === activeAgent;
          const colorClass = agentColorMap[config.name] || 'bg-muted text-muted-foreground border-border';

          return (
            <button
              key={config.name}
              onClick={() => setActiveAgent(config.name)}
              className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? `${colorClass} border shadow-sm`
                  : 'bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="size-4" />
              {config.name}
            </button>
          );
        })}
      </div>

      {/* 当前 Agent 详情 */}
      {activeConfig && (
        <div className="space-y-6">
          {/* 角色定位 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-lg ${agentColorMap[activeAgent] || 'bg-accent'}`}>
                  <ActiveIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{activeConfig.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{agentDescriptions[activeAgent]}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">职责范围</h4>
                  <ul className="space-y-2">
                    {agentResponsibilities[activeAgent]?.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 size-1.5 rounded-full bg-primary/40 shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系统提示词模板 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">系统提示词模板</CardTitle>
                <CopyButton content={activeConfig.systemPrompt} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-[hsl(210_10%_12%)] p-4">
                <pre className="text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] whitespace-pre-wrap">
                  {activeConfig.systemPrompt}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* 参数配置 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">参数配置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <ThermometerIcon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                    <div className="text-lg font-semibold text-foreground">{activeConfig.temperature}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <MaximizeIcon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Max Tokens</div>
                    <div className="text-lg font-semibold text-foreground">{activeConfig.maxTokens.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <CpuIcon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Model</div>
                    <div className="text-lg font-semibold text-foreground font-mono">{activeConfig.model}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 协同工作流 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">协同工作流</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {configs.filter((c) => c.name !== activeAgent).map((other) => {
                  const OtherIcon = agentIcons[other.name] || BotIcon;
                  return (
                    <div key={other.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className={`flex size-8 items-center justify-center rounded-md ${agentColorMap[other.name] || 'bg-accent'}`}>
                        <OtherIcon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{other.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{agentDescriptions[other.name]}</div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">可协同</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

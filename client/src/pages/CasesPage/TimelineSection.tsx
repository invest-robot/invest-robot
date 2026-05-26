import { useState, useEffect } from 'react';
import {
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  BotIcon,
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  SparklesIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCases, type ICase } from '@/lib/storage';

const agentColorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'IT Agent': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  '运营 Agent': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  '财务 Agent': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  '行政 Agent': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
};

const defaultAgentStyle = { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', dot: 'bg-muted-foreground' };

const categoryLabels: Record<string, string> = {
  website: '独立站搭建',
  social: '自媒体运营',
  finance: '成本核算',
  automation: '流程自动化',
};

interface ITimelineStep {
  title: string;
  agent: string;
  description: string;
  isDecisionPoint?: boolean;
  decisionNote?: string;
}

function StepNode({ step, index, isLast }: { step: ITimelineStep; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const colors = agentColorMap[step.agent] || defaultAgentStyle;

  return (
    <div className="relative">
      {/* 时间轴线 */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
      )}

      <div className="flex gap-4">
        {/* 节点圆点 */}
        <div className="relative flex flex-col items-center">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${colors.border} ${colors.bg}`}>
            {step.isDecisionPoint ? (
              <AlertTriangleIcon className={`size-4 ${colors.text}`} />
            ) : (
              <BotIcon className={`size-4 ${colors.text}`} />
            )}
          </div>
          <div className="mt-2 flex size-6 items-center justify-center rounded-full bg-card border border-border">
            <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
          </div>
        </div>

        {/* 内容卡片 */}
        <div className="flex-1 min-w-0 pb-6">
          <Card className="border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                      <BotIcon className="size-3 mr-1" />
                      {step.agent}
                    </Badge>
                    {step.isDecisionPoint && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                        <AlertTriangleIcon className="size-3 mr-1" />
                        关键决策点
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {step.isDecisionPoint && step.decisionNote && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-accent transition-colors"
                  >
                    {expanded ? (
                      <ChevronUpIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>

              {/* 决策点详情 */}
              {expanded && step.isDecisionPoint && step.decisionNote && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-start gap-2">
                    <SparklesIcon className="size-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">决策说明</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.decisionNote}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const [cases, setCases] = useState<ICase[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>('');

  useEffect(() => {
    const data = getCases();
    setCases(data);
    if (data.length > 0) {
      setActiveCaseId(data[0].id);
    }
  }, []);

  const activeCase = cases.find((c) => c.id === activeCaseId);

  if (cases.length === 0) {
    return (
      <section className="w-full">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ClockIcon className="mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">暂无案例数据，请在管理后台添加案例</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      {/* 案例切换器 */}
      <div className="flex flex-wrap gap-2">
        {cases.map((caseItem) => (
          <button
            key={caseItem.id}
            onClick={() => setActiveCaseId(caseItem.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCaseId === caseItem.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {caseItem.title}
          </button>
        ))}
      </div>

      {/* 当前案例信息 */}
      {activeCase && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{activeCase.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[activeCase.category] || activeCase.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activeCase.steps.length} 个步骤
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  更新于 {activeCase.updatedAt}
                </span>
              </div>
            </div>
          </div>

          {/* 时间轴 */}
          <div className="pt-4">
            {activeCase.steps.map((step, index) => (
              <StepNode
                key={index}
                step={{
                  title: step.title,
                  agent: step.agent,
                  description: step.description,
                  isDecisionPoint: index === 0 || index === activeCase.steps.length - 1,
                  decisionNote: index === 0
                    ? '项目启动阶段，需明确业务方向与技术选型，此决策影响后续所有开发路径。'
                    : index === activeCase.steps.length - 1
                    ? '上线前需完成最终验收，确认所有功能符合预期，此决策决定项目是否可交付。'
                    : undefined,
                }}
                index={index}
                isLast={index === activeCase.steps.length - 1}
              />
            ))}
          </div>

          {/* 完成状态 */}
          <div className="flex items-center justify-center gap-2 pt-4 pb-2">
            <CheckCircle2Icon className="size-5 text-success" />
            <span className="text-sm font-medium text-success">案例执行完成</span>
          </div>
        </>
      )}
    </section>
  );
}

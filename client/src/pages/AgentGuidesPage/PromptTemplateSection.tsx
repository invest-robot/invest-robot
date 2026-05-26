import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CopyIcon, CheckIcon, BotIcon, SlidersIcon, InfoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAgentConfigs, type IAgentConfig } from '@/lib/storage';

const agentIcons: Record<string, string> = {
  'IT Agent': '💻',
  '运营 Agent': '📱',
  '财务 Agent': '💰',
  '行政 Agent': '📋',
};

const agentColorMap: Record<string, string> = {
  'IT Agent': 'bg-blue-100 text-blue-700 border-blue-200',
  '运营 Agent': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '财务 Agent': 'bg-amber-100 text-amber-700 border-amber-200',
  '行政 Agent': 'bg-purple-100 text-purple-700 border-purple-200',
};

function CopyButton({ content, label }: { content: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${label} 已复制`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动选择复制');
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

function CodeBlock({ code, language, label }: { code: string; language: string; label: string }) {
  return (
    <div className="rounded-xl bg-[hsl(210_10%_12%)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
        </div>
        <CopyButton content={code} label={label} />
      </div>
      <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParameterCard({ config }: { config: IAgentConfig }) {
  const params = [
    {
      label: 'Temperature',
      value: config.temperature,
      description: '控制输出随机性。值越高（0.8-1.0）输出越创意，值越低（0.1-0.3）输出越精确。',
      range: '0.0 - 1.0',
    },
    {
      label: 'Max Tokens',
      value: config.maxTokens,
      description: '单次响应最大 token 数。影响输出长度，IT/运营建议 4096，财务/行政建议 2048。',
      range: '1024 - 8192',
    },
    {
      label: 'Model',
      value: config.model,
      description: '使用的 LLM 模型。gpt-4o 适合复杂任务，gpt-4o-mini 适合快速响应。',
      range: 'gpt-4o / gpt-4o-mini',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SlidersIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">参数调节说明</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {params.map((param) => (
          <Card key={param.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{param.label}</span>
                <Badge variant="secondary" className="text-xs font-mono">
                  {param.value}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{param.description}</p>
              <p className="mt-2 text-[11px] text-muted-foreground/60">推荐范围: {param.range}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PromptTemplateSection() {
  const [configs, setConfigs] = useState<IAgentConfig[]>([]);
  const [activeAgent, setActiveAgent] = useState('IT Agent');

  useEffect(() => {
    const data = getAgentConfigs();
    setConfigs(data);
    if (data.length > 0) {
      setActiveAgent(data[0].name);
    }
  }, []);

  const currentConfig = configs.find((c) => c.name === activeAgent);

  if (configs.length === 0) {
    return (
      <section className="w-full">
        <div className="flex items-center gap-2 mb-6">
          <BotIcon className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">配置与 Prompt 模板</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <InfoIcon className="mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">暂无 Agent 配置，请在后台管理中添加</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <BotIcon className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight text-foreground">配置与 Prompt 模板</h2>
      </div>

      <Tabs value={activeAgent} onValueChange={setActiveAgent} className="w-full">
        <TabsList className="mb-6">
          {configs.map((config) => (
            <TabsTrigger key={config.name} value={config.name} className="gap-2">
              <span>{agentIcons[config.name] || '🤖'}</span>
              <span>{config.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {configs.map((config) => (
          <TabsContent key={config.name} value={config.name} className="mt-0 space-y-6">
            {/* 系统提示词 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agentIcons[config.name] || '🤖'}</span>
                    <CardTitle className="text-base font-medium">{config.name} 系统提示词</CardTitle>
                  </div>
                  <Badge variant="outline" className={agentColorMap[config.name] || 'bg-muted text-muted-foreground border-border'}>
                    {config.model}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={config.systemPrompt}
                  language="prompt"
                  label={`${config.name} 提示词`}
                />
              </CardContent>
            </Card>

            {/* 参数调节说明 */}
            <ParameterCard config={config} />

            {/* 使用建议 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">使用建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <InfoIcon className="size-4 mt-0.5 shrink-0 text-primary" />
                    <p>
                      <strong className="text-foreground">Temperature 调节</strong>：
                      {config.name === 'IT Agent' && 'IT 任务建议 0.3-0.5，确保代码准确性和逻辑严谨性。'}
                      {config.name === '运营 Agent' && '运营任务建议 0.7-0.9，激发创意内容和多样化表达。'}
                      {config.name === '财务 Agent' && '财务任务建议 0.1-0.3，保证数据计算精确无误。'}
                      {config.name === '行政 Agent' && '行政任务建议 0.4-0.6，平衡流程规范与灵活处理。'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <InfoIcon className="size-4 mt-0.5 shrink-0 text-primary" />
                    <p>
                      <strong className="text-foreground">上下文长度</strong>：
                      复杂任务（如代码生成、长文案）建议设置 maxTokens 为 4096 以上，简单问答可降至 2048 以节省成本。
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <InfoIcon className="size-4 mt-0.5 shrink-0 text-primary" />
                    <p>
                      <strong className="text-foreground">模型选择</strong>：
                      gpt-4o 适合需要深度推理的复杂任务，gpt-4o-mini 适合快速响应和成本敏感场景。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

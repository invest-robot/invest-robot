import { useState } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle2Icon,
  CopyIcon,
  CheckIcon,
  TerminalIcon,
  KeyIcon,
  PackageIcon,
  PlayIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RocketIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// 环境要求清单
const envRequirements = [
  { label: 'Node.js', version: '>= 18.0', icon: PackageIcon },
  { label: 'npm', version: '>= 9.0', icon: PackageIcon },
  { label: 'Git', version: '>= 2.30', icon: PackageIcon },
];

// 安装命令
const installCommands = [
  { label: '克隆项目', command: 'git clone https://github.com/your-org/ai-one-person-company.git' },
  { label: '进入目录', command: 'cd ai-one-person-company' },
  { label: '安装依赖', command: 'npm install' },
];

// 配置文件示例
const configExample = `{
  "agents": [
    { "name": "IT", "temperature": 0.5 },
    { "name": "运营", "temperature": 0.8 },
    { "name": "财务", "temperature": 0.3 },
    { "name": "行政", "temperature": 0.5 }
  ],
  "port": 3000
}`;

// 预期输出
const expectedOutput = `✓ 环境检查通过
✓ API Key 验证成功
✓ Agent 面板已启动: http://localhost:3000
✓ 加载 4 个数字员工: IT, 运营, 财务, 行政`;

// FAQ 数据
const faqs = [
  {
    question: 'API Key 无效怎么办？',
    answer: '检查 .env 文件中 OPENAI_API_KEY 是否正确复制，确保没有多余空格。可以访问 OpenAI 控制台验证 Key 是否有效。',
  },
  {
    question: '端口 3000 被占用？',
    answer: '修改 config.json 中的 port 字段，或运行 lsof -i :3000 查看占用进程并关闭。',
  },
  {
    question: 'npm install 报错？',
    answer: '尝试清除缓存后重新安装：npm cache clean --force && rm -rf node_modules package-lock.json && npm install',
  },
];

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

export default function QuickStartPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full space-y-12 md:space-y-16">
      {/* 页面标题区 */}
      <section className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <RocketIcon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">快速开始</h1>
            <p className="text-sm text-muted-foreground">5 分钟完成环境配置，跑通第一个 Agent 任务</p>
          </div>
        </div>
      </section>

      {/* 步骤 1: 环境准备清单 */}
      <section className="w-full space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="size-7 rounded-full p-0 flex items-center justify-center text-xs font-bold">1</Badge>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">环境准备清单</h2>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">系统要求</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {envRequirements.map((req) => (
                <div
                  key={req.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <req.icon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{req.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">{req.version}</div>
                  </div>
                  <CheckCircle2Icon className="ml-auto size-4 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">API Key 配置</CardTitle>
            <p className="text-sm text-muted-foreground">在项目根目录创建 .env 文件</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-[hsl(210_10%_12%)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <KeyIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">.env</span>
                </div>
                <CopyButton content={`# OpenAI API 配置
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o

# 可选：其他 LLM 配置
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx`} label=".env 配置" />
              </div>
              <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto">
                <code>
                  <span className="text-[hsl(210_10%_45%)]"># OpenAI API 配置</span>
                  {'\n'}OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
                  {'\n'}OPENAI_MODEL=gpt-4o
                  {'\n'}
                  {'\n'}<span className="text-[hsl(210_10%_45%)]"># 可选：其他 LLM 配置</span>
                  {'\n'}ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 步骤 2: 初始化向导 */}
      <section className="w-full space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="size-7 rounded-full p-0 flex items-center justify-center text-xs font-bold">2</Badge>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">初始化向导</h2>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">安装命令</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {installCommands.map((cmd, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">{cmd.label}</div>
                    <div className="rounded-lg bg-[hsl(210_10%_12%)] px-4 py-2.5 font-mono text-sm text-[hsl(210_10%_92%)] overflow-x-auto">
                      <TerminalIcon className="size-3.5 inline mr-2 text-[hsl(210_10%_45%)]" />
                      {cmd.command}
                    </div>
                  </div>
                  <CopyButton content={cmd.command} label={cmd.label} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">配置文件修改</CardTitle>
            <p className="text-sm text-muted-foreground">编辑 config.json，设置 Agent 参数</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-[hsl(210_10%_12%)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <PackageIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">config.json</span>
                </div>
                <CopyButton content={configExample} label="config.json" />
              </div>
              <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto">
                <code>
                  {'{'}
                  {'\n'}  <span className="text-[hsl(46_100%_60%)]">"agents"</span>: [
                  {'\n'}    {'{'} <span className="text-[hsl(46_100%_60%)]">"name"</span>: <span className="text-[hsl(46_100%_60%)]">"IT"</span>, <span className="text-[hsl(46_100%_60%)]">"temperature"</span>: 0.5 {'}'},
                  {'\n'}    {'{'} <span className="text-[hsl(46_100%_60%)]">"name"</span>: <span className="text-[hsl(46_100%_60%)]">"运营"</span>, <span className="text-[hsl(46_100%_60%)]">"temperature"</span>: 0.8 {'}'},
                  {'\n'}    {'{'} <span className="text-[hsl(46_100%_60%)]">"name"</span>: <span className="text-[hsl(46_100%_60%)]">"财务"</span>, <span className="text-[hsl(46_100%_60%)]">"temperature"</span>: 0.3 {'}'},
                  {'\n'}    {'{'} <span className="text-[hsl(46_100%_60%)]">"name"</span>: <span className="text-[hsl(46_100%_60%)]">"行政"</span>, <span className="text-[hsl(46_100%_60%)]">"temperature"</span>: 0.5 {'}'}
                  {'\n'}  ],
                  {'\n'}  <span className="text-[hsl(46_100%_60%)]">"port"</span>: 3000
                  {'\n'}{'}'}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">启动服务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-[hsl(210_10%_12%)] px-4 py-3 font-mono text-sm text-[hsl(210_10%_92%)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayIcon className="size-4 text-[hsl(174_77%_60%)]" />
                <span>npm run dev</span>
              </div>
              <CopyButton content="npm run dev" label="启动命令" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 步骤 3: 首次运行验证 */}
      <section className="w-full space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="size-7 rounded-full p-0 flex items-center justify-center text-xs font-bold">3</Badge>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">首次运行验证</h2>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">预期输出</CardTitle>
            <p className="text-sm text-muted-foreground">服务启动成功后，终端应显示以下内容</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-[hsl(210_10%_12%)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">terminal</span>
                </div>
                <CopyButton content={expectedOutput} label="预期输出" />
              </div>
              <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)]">
                <code>
                  <span className="text-[hsl(130_54%_60%)]">✓ 环境检查通过</span>
                  {'\n'}<span className="text-[hsl(130_54%_60%)]">✓ API Key 验证成功</span>
                  {'\n'}<span className="text-[hsl(130_54%_60%)]">✓ Agent 面板已启动: http://localhost:3000</span>
                  {'\n'}<span className="text-[hsl(130_54%_60%)]">✓ 加载 4 个数字员工: IT, 运营, 财务, 行政</span>
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">常见问题排查</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircleIcon className="size-4 text-warning" />
                      <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    </div>
                    {openFaq === index ? (
                      <ChevronUpIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed pl-6">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  PackageIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCases, type ICase, type ICaseResource } from '@/lib/storage';

const resourceTypeConfig: Record<ICaseResource['type'], { label: string; icon: React.ElementType; color: string }> = {
  prompt: {
    label: 'Prompt 包',
    icon: FileTextIcon,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  config: {
    label: '配置文件',
    icon: FileJsonIcon,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  data: {
    label: '数据样本',
    icon: FileCodeIcon,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
};

function CopyButton({ content, label }: { content: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${label} 已复制到剪贴板`);
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

function ResourceCard({ resource }: { resource: ICaseResource }) {
  const [expanded, setExpanded] = useState(false);
  const config = resourceTypeConfig[resource.type];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${config.color}`}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">{resource.title}</span>
              <Badge variant="outline" className={`text-[11px] shrink-0 ${config.color}`}>
                {config.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {resource.content.length} 字符
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CopyButton content={resource.content} label={resource.title} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border">
          <div className="rounded-none bg-[hsl(210_10%_12%)]">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-xs text-muted-foreground font-mono">{resource.type}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const blob = new Blob([resource.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${resource.title}.${resource.type === 'config' ? 'json' : resource.type === 'prompt' ? 'txt' : 'csv'}`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(`${resource.title} 已下载`);
                }}
                className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <DownloadIcon className="size-3.5" />
                下载
              </Button>
            </div>
            <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto max-h-48">
              <code>{resource.content}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResourcesSection() {
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
  const resources = activeCase?.resources || [];

  if (cases.length === 0) {
    return (
      <section className="w-full">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PackageIcon className="mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">暂无案例资源，请在后台管理中添加案例</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center gap-2">
        <PackageIcon className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight text-foreground">资源一键获取</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        提供案例配套的 Prompt 包、配置文件模板或数据样本，支持一键复制与下载
      </p>

      {/* 案例选择器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cases
          .filter((c) => (c.resources?.length || 0) > 0)
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCaseId === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {c.title}
            </button>
          ))}
      </div>

      {/* 资源列表 */}
      {resources.length > 0 ? (
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <ResourceCard key={`${activeCaseId}-${index}`} resource={resource} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FileTextIcon className="mb-2 size-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">该案例暂无配套资源</p>
          </CardContent>
        </Card>
      )}

      {/* 批量操作 */}
      {resources.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            共 {resources.length} 个资源
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allContent = resources
                .map((r) => `# ${r.title}\n\n${r.content}`)
                .join('\n\n---\n\n');
              navigator.clipboard.writeText(allContent);
              toast.success('所有资源已复制到剪贴板');
            }}
            className="gap-1.5 text-xs h-8"
          >
            <CopyIcon className="size-3.5" />
            一键复制全部
          </Button>
        </div>
      )}
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  CopyIcon,
  CheckIcon,
  UploadIcon,
  FileTextIcon,
  CodeIcon,
  DatabaseIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
  FolderOpenIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getTemplates,
  addTemplate,
  deleteTemplate,
  type ITemplate,
} from '@/lib/storage';

const typeConfig: Record<ITemplate['type'], { label: string; icon: React.ElementType; color: string }> = {
  prompt: { label: 'Prompt', icon: FileTextIcon, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  config: { label: 'Config', icon: CodeIcon, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  data: { label: 'Data', icon: DatabaseIcon, color: 'bg-amber-100 text-amber-700 border-amber-200' },
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

function TemplateCard({
  template,
  onDelete,
}: {
  template: ITemplate;
  onDelete?: (id: string) => void;
}) {
  const config = typeConfig[template.type];
  const Icon = config.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/60 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate">
                {template.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-[11px] ${config.color}`}>
                  {config.label}
                </Badge>
                {template.isDefault && (
                  <Badge variant="secondary" className="text-[11px]">
                    默认
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <CopyButton content={template.content} label={template.title} />
            {onDelete && !template.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(template.id)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <TrashIcon className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          <div className="rounded-lg bg-[hsl(210_10%_12%)] overflow-hidden">
            <pre className={`p-3 text-xs font-mono leading-relaxed text-[hsl(210_10%_85%)] overflow-x-auto ${
              expanded ? 'max-h-[300px]' : 'max-h-[60px]'
            }`}>
              <code>{template.content}</code>
            </pre>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground text-center">
            {expanded ? '点击收起' : '点击展开完整内容'}
          </div>
        </button>
      </CardContent>
    </Card>
  );
}

function UploadModal({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (template: Omit<ITemplate, 'id' | 'createdAt'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ITemplate['type']>('prompt');
  const [content, setContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'json') setType('config');
      else if (ext === 'csv' || ext === 'json') setType('data');
      else setType('prompt');
    };
    reader.readAsText(file);
  }, [title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('请输入模板标题');
      return;
    }
    if (!content.trim()) {
      toast.error('请输入模板内容或上传文件');
      return;
    }
    onUpload({ title: title.trim(), type, content: content.trim(), isDefault: false });
    setTitle('');
    setType('prompt');
    setContent('');
    onClose();
    toast.success('模板上传成功');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 rounded-xl bg-card border border-border shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">上传试验模板</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">模板标题</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：IT Agent 部署配置"
              className="h-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">模板类型</label>
            <div className="flex gap-2">
              {(['prompt', 'config', 'data'] as const).map((t) => {
                const cfg = typeConfig[t];
                const Icon = cfg.icon;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      type === t
                        ? `${cfg.color} border`
                        : 'bg-card border border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">上传文件</label>
            <div
              className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50 hover:bg-accent/30'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="mx-auto size-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                拖拽文件到此处，或 <span className="text-primary">点击选择</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                支持 .txt、.json、.md、.csv 格式
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json,.md,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              模板内容 {content && <span className="text-muted-foreground font-normal text-xs">（已自动填充）</span>}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴或手动输入模板内容..."
              className="w-full min-h-[120px] rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            <PlusIcon className="size-3.5 mr-1" />
            添加模板
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ExperimentSection() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filter, setFilter] = useState<'all' | ITemplate['type']>('all');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleUpload = (templateData: Omit<ITemplate, 'id' | 'createdAt'>) => {
    const newTemplate = addTemplate(templateData);
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success('模板已删除');
  };

  const filtered = templates.filter((t) => {
    const matchType = filter === 'all' || t.type === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">试验模板库</h2>
          <p className="text-sm text-muted-foreground mt-1">
            一键获取预设模板，或上传自定义试验配置
          </p>
        </div>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <UploadIcon className="size-3.5 mr-1.5" />
          上传模板
        </Button>
      </div>

      {/* 筛选与搜索 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(['all', 'prompt', 'config', 'data'] as const).map((f) => {
            const cfg = f === 'all' ? { label: '全部', color: '' } : typeConfig[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索模板..."
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* 模板列表 */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpenIcon className="mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {search ? '未找到匹配的模板' : '暂无模板，点击"上传模板"添加'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 上传弹窗 */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </section>
  );
}

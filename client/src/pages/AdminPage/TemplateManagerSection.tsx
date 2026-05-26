import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  FileTextIcon,
  CodeIcon,
  DatabaseIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getTemplates,
  updateTemplate,
  deleteTemplate,
  addTemplate,
  type ITemplate,
} from '@/lib/storage';
import { showConfirm } from '@lark-apaas/client-toolkit';

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
      toast.error('复制失败');
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

function TemplateRow({
  template,
  onEdit,
  onDelete,
  onToggleDefault,
}: {
  template: ITemplate;
  onEdit: (template: ITemplate) => void;
  onDelete: (id: string) => void;
  onToggleDefault: (id: string, isDefault: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[template.type];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${config.color}`}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground truncate">{template.title}</span>
              <Badge variant="outline" className={`text-[11px] shrink-0 ${config.color}`}>
                {config.label}
              </Badge>
              {template.isDefault && (
                <Badge variant="secondary" className="text-[11px] shrink-0">
                  <ShieldCheckIcon className="size-3 mr-1" />
                  默认模板
                </Badge>
              )}
              {!template.isDefault && (
                <Badge variant="outline" className="text-[11px] shrink-0 bg-muted text-muted-foreground border-border">
                  <AlertTriangleIcon className="size-3 mr-1" />
                  待审核
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{template.content.length} 字符</span>
              <span>·</span>
              <span>创建于 {template.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CopyButton content={template.content} label={template.title} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(template)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
          >
            <EditIcon className="size-3.5" />
          </Button>
          {!template.isDefault && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleDefault(template.id, true)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-success"
                title="设为默认模板"
              >
                <ShieldCheckIcon className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(template.id)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </>
          )}
          {template.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleDefault(template.id, false)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-warning"
              title="取消默认"
            >
              <XIcon className="size-3.5" />
            </Button>
          )}
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
              <span className="text-xs text-muted-foreground font-mono">{template.type}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const blob = new Blob([template.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${template.title}.${template.type === 'config' ? 'json' : template.type === 'prompt' ? 'txt' : 'csv'}`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(`${template.title} 已下载`);
                }}
                className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                下载
              </Button>
            </div>
            <pre className="p-4 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto max-h-64">
              <code>{template.content}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function EditModal({
  open,
  onClose,
  onSave,
  template,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (template: ITemplate) => void;
  template: ITemplate | null;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ITemplate['type']>('prompt');
  const [content, setContent] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setType(template.type);
      setContent(template.content);
      setIsDefault(template.isDefault);
    } else {
      setTitle('');
      setType('prompt');
      setContent('');
      setIsDefault(false);
    }
  }, [template]);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('请输入模板标题');
      return;
    }
    if (!content.trim()) {
      toast.error('请输入模板内容');
      return;
    }
    onSave({
      id: template?.id || `tpl-${Date.now()}`,
      title: title.trim(),
      type,
      content: content.trim(),
      isDefault,
      createdAt: template?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-4 rounded-xl bg-card border border-border shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            {template ? '编辑模板' : '新增模板'}
          </h3>
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
            <label className="block text-sm font-medium text-foreground mb-1.5">模板内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴或手动输入模板内容..."
              className="w-full min-h-[200px] rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="size-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is-default" className="text-sm text-foreground">
              设为默认模板（用户可直接使用）
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            <CheckIcon className="size-3.5 mr-1" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TemplateManagerSection() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filter, setFilter] = useState<'all' | 'default' | 'pending' | ITemplate['type']>('all');
  const [search, setSearch] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(null);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleSave = useCallback((template: ITemplate) => {
    if (templates.find((t) => t.id === template.id)) {
      updateTemplate(template.id, template);
      toast.success('模板已更新');
    } else {
      addTemplate({
        title: template.title,
        type: template.type,
        content: template.content,
        isDefault: template.isDefault,
      });
      toast.success('模板已添加');
    }
    setTemplates(getTemplates());
    setEditModalOpen(false);
    setEditingTemplate(null);
  }, [templates]);

  const handleDelete = useCallback(async (id: string) => {
    if (!await showConfirm('确定删除此模板？')) return;
    deleteTemplate(id);
    setTemplates(getTemplates());
    toast.success('模板已删除');
  }, []);

  const handleToggleDefault = useCallback((id: string, isDefault: boolean) => {
    updateTemplate(id, { isDefault });
    setTemplates(getTemplates());
    toast.success(isDefault ? '已设为默认模板' : '已取消默认');
  }, []);

  const handleEdit = useCallback((template: ITemplate) => {
    setEditingTemplate(template);
    setEditModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingTemplate(null);
    setEditModalOpen(true);
  }, []);

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchSearch;
    if (filter === 'default') return matchSearch && t.isDefault;
    if (filter === 'pending') return matchSearch && !t.isDefault;
    
    return matchSearch && t.type === filter;
  });

  const stats = {
    total: templates.length,
    default: templates.filter((t) => t.isDefault).length,
    pending: templates.filter((t) => !t.isDefault).length,
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">模板管理</h2>
          <p className="text-sm text-muted-foreground mt-1">
            管理试验模板，支持默认模板编辑、用户上传模板审核
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <PlusIcon className="size-3.5 mr-1.5" />
          新增模板
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">模板总数</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-success">{stats.default}</div>
            <div className="text-sm text-muted-foreground">默认模板</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-warning">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">待审核</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选与搜索 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: '全部' },
            { key: 'default', label: '默认模板' },
            { key: 'pending', label: '待审核' },
            { key: 'prompt', label: 'Prompt' },
            { key: 'config', label: 'Config' },
            { key: 'data', label: 'Data' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
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
            <FileTextIcon className="mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {search ? '未找到匹配的模板' : '暂无模板，点击"新增模板"添加'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((template) => (
            <TemplateRow
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleDefault={handleToggleDefault}
            />
          ))}
        </div>
      )}

      {/* 编辑弹窗 */}
      <EditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSave}
        template={editingTemplate}
      />
    </section>
  );
}

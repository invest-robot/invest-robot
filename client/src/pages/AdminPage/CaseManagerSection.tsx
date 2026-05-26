import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
  BotIcon,
  GripVerticalIcon,
  FileTextIcon,
  FileJsonIcon,
  FileCodeIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TiptapEditorComplete } from '@/components/business-ui/tiptap-editor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCases, addCase, updateCase, deleteCase, type ICase, type ICaseStep, type ICaseResource } from '@/lib/storage';

interface ICaseManagerSectionProps {
  // 无 props，数据由 Section 自己管理
}

const categoryOptions = [
  { value: 'website', label: '独立站搭建' },
  { value: 'social', label: '自媒体运营' },
  { value: 'finance', label: '成本核算' },
  { value: 'automation', label: '流程自动化' },
];

const categoryColorMap: Record<string, string> = {
  website: 'bg-blue-100 text-blue-700 border-blue-200',
  social: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  finance: 'bg-amber-100 text-amber-700 border-amber-200',
  automation: 'bg-purple-100 text-purple-700 border-purple-200',
};

const resourceTypeOptions: { value: ICaseResource['type']; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'prompt', label: 'Prompt 包', icon: FileTextIcon, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'config', label: '配置文件', icon: FileJsonIcon, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'data', label: '数据样本', icon: FileCodeIcon, color: 'bg-amber-100 text-amber-700 border-amber-200' },
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

function ResourceItem({
  resource,
  onEdit,
  onDelete,
}: {
  resource: ICaseResource;
  onEdit: (resource: ICaseResource) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = resourceTypeOptions.find((o) => o.value === resource.type);
  const Icon = typeConfig?.icon || FileTextIcon;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${typeConfig?.color || 'bg-muted text-muted-foreground border-border'}`}>
            <Icon className="size-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground truncate">{resource.title}</span>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${typeConfig?.color || 'bg-muted text-muted-foreground border-border'}`}>
            {typeConfig?.label || resource.type}
          </Badge>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <CopyButton content={resource.content} label={resource.title} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(resource)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <EditIcon className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border">
          <pre className="p-3 text-xs font-mono leading-relaxed text-[hsl(210_10%_85%)] bg-[hsl(210_10%_12%)] overflow-x-auto max-h-40">
            <code>{resource.content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function CaseManagerSection() {
  const [cases, setCases] = useState<ICase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ICase | null>(null);

  // 表单状态
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ICase['category']>('website');
  const [formDescription, setFormDescription] = useState('');
  const [formSteps, setFormSteps] = useState<ICaseStep[]>([]);
  const [formResources, setFormResources] = useState<ICaseResource[]>([]);

  // 资源编辑状态
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ICaseResource | null>(null);
  const [resourceFormTitle, setResourceFormTitle] = useState('');
  const [resourceFormType, setResourceFormType] = useState<ICaseResource['type']>('prompt');
  const [resourceFormContent, setResourceFormContent] = useState('');

  useEffect(() => {
    setCases(getCases());
  }, []);

  const refreshCases = () => setCases(getCases());

  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const openCreateDialog = () => {
    setEditingCase(null);
    setFormTitle('');
    setFormCategory('website');
    setFormDescription('');
    setFormSteps([]);
    setFormResources([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (caseItem: ICase) => {
    setEditingCase(caseItem);
    setFormTitle(caseItem.title);
    setFormCategory(caseItem.category);
    setFormDescription(caseItem.description);
    setFormSteps([...caseItem.steps]);
    setFormResources([...(caseItem.resources || [])]);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error('请输入案例标题');
      return;
    }
    if (!formDescription.trim()) {
      toast.error('请输入案例描述');
      return;
    }

    if (editingCase) {
      updateCase(editingCase.id, {
        title: formTitle,
        category: formCategory,
        description: formDescription,
        steps: formSteps,
        resources: formResources,
      });
      toast.success('案例已更新');
    } else {
      addCase({
        title: formTitle,
        category: formCategory,
        description: formDescription,
        steps: formSteps,
        resources: formResources,
      });
      toast.success('案例已创建');
    }

    setIsDialogOpen(false);
    refreshCases();
  };

  const handleDelete = (id: string) => {
    deleteCase(id);
    toast.success('案例已删除');
    refreshCases();
  };

  const addStep = () => {
    setFormSteps((prev) => [...prev, { title: '', agent: '', description: '' }]);
  };

  const updateStep = (index: number, field: keyof ICaseStep, value: string) => {
    setFormSteps((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeStep = (index: number) => {
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  };

  // 资源管理
  const openResourceCreateDialog = () => {
    setEditingResource(null);
    setResourceFormTitle('');
    setResourceFormType('prompt');
    setResourceFormContent('');
    setIsResourceDialogOpen(true);
  };

  const openResourceEditDialog = (resource: ICaseResource) => {
    setEditingResource(resource);
    setResourceFormTitle(resource.title);
    setResourceFormType(resource.type);
    setResourceFormContent(resource.content);
    setIsResourceDialogOpen(true);
  };

  const handleResourceSave = () => {
    if (!resourceFormTitle.trim()) {
      toast.error('请输入资源标题');
      return;
    }
    if (!resourceFormContent.trim()) {
      toast.error('请输入资源内容');
      return;
    }

    const newResource: ICaseResource = {
      title: resourceFormTitle.trim(),
      type: resourceFormType,
      content: resourceFormContent.trim(),
    };

    if (editingResource) {
      setFormResources((prev) =>
        prev.map((r, idx) => {
          // 通过引用比较找到正在编辑的资源
          return r === editingResource ? newResource : r;
        })
      );
      toast.success('资源已更新');
    } else {
      setFormResources((prev) => [...prev, newResource]);
      toast.success('资源已添加');
    }

    setIsResourceDialogOpen(false);
  };

  const handleResourceDelete = (resource: ICaseResource) => {
    setFormResources((prev) => prev.filter((r) => r !== resource));
    toast.success('资源已删除');
  };

  return (
    <section className="w-full space-y-6">
      {/* 头部操作区 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">案例管理</h2>
          <p className="mt-1 text-sm text-muted-foreground">管理培训案例内容，支持富文本编辑、步骤管理与资源配置</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <PlusIcon className="size-4" />
          新增案例
        </Button>
      </div>

      {/* 筛选与搜索 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索案例标题或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 案例列表 */}
      {filteredCases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BotIcon className="mb-3 size-10 text-muted-foreground/40" />
            <h3 className="text-base font-medium text-foreground">暂无案例</h3>
            <p className="mt-1 text-sm text-muted-foreground">点击"新增案例"创建第一个培训案例</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((caseItem) => {
            const catInfo = categoryColorMap[caseItem.category] || 'bg-muted text-muted-foreground border-border';
            const catLabel = categoryOptions.find((o) => o.value === caseItem.category)?.label || caseItem.category;
            const resourceCount = caseItem.resources?.length || 0;

            return (
              <Card key={caseItem.id} className="transition-colors hover:border-primary/30">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{caseItem.title}</h3>
                        <Badge variant="secondary" className={`text-xs border ${catInfo}`}>
                          {catLabel}
                        </Badge>
                        {resourceCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {resourceCount} 个资源
                          </Badge>
                        )}
                      </div>
                      <div
                        className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: caseItem.description }}
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>{caseItem.steps.length} 个步骤</span>
                        <span>创建于 {caseItem.createdAt}</span>
                        {caseItem.updatedAt !== caseItem.createdAt && <span>更新于 {caseItem.updatedAt}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEditDialog(caseItem)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(caseItem.id)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 新增/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCase ? '编辑案例' : '新增案例'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* 标题 */}
            <div className="space-y-2">
              <Label>案例标题</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="例如：独立站搭建全流程"
              />
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label>案例分类</Label>
              <Select value={formCategory} onValueChange={(v) => setFormCategory(v as ICase['category'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 描述（富文本编辑） */}
            <div className="space-y-2">
              <Label>案例描述</Label>
              <TiptapEditorComplete
                value={formDescription}
                onValueChange={setFormDescription}
                placeholder="简要描述案例背景与成果..."
                className="w-full min-h-[120px]"
              />
            </div>

            {/* 步骤列表 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>执行步骤</Label>
                <Button variant="outline" size="sm" onClick={addStep} className="gap-1.5 text-xs">
                  <PlusIcon className="size-3.5" />
                  添加步骤
                </Button>
              </div>

              {formSteps.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">暂无步骤，点击"添加步骤"开始编辑</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formSteps.map((step, index) => (
                    <Card key={index} className="border-border/60">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVerticalIcon className="size-4 text-muted-foreground/40" />
                            <span className="text-xs font-medium text-muted-foreground">步骤 {index + 1}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeStep(index)}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            placeholder="步骤标题"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                          />
                          <Input
                            placeholder="负责 Agent（如：IT Agent）"
                            value={step.agent}
                            onChange={(e) => updateStep(index, 'agent', e.target.value)}
                          />
                        </div>
                        <Textarea
                          placeholder="步骤描述..."
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 资源配置 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>配套资源</Label>
                <Button variant="outline" size="sm" onClick={openResourceCreateDialog} className="gap-1.5 text-xs">
                  <PlusIcon className="size-3.5" />
                  添加资源
                </Button>
              </div>

              {formResources.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">暂无资源，点击"添加资源"上传 Prompt 包、配置文件或数据样本</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formResources.map((resource, index) => (
                    <ResourceItem
                      key={`${resource.title}-${index}`}
                      resource={resource}
                      onEdit={openResourceEditDialog}
                      onDelete={() => handleResourceDelete(resource)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>{editingCase ? '保存修改' : '创建案例'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 资源编辑对话框 */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? '编辑资源' : '添加资源'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* 资源标题 */}
            <div className="space-y-2">
              <Label>资源标题</Label>
              <Input
                value={resourceFormTitle}
                onChange={(e) => setResourceFormTitle(e.target.value)}
                placeholder="例如：OpenClaw 部署配置模板"
              />
            </div>

            {/* 资源类型 */}
            <div className="space-y-2">
              <Label>资源类型</Label>
              <div className="flex gap-2">
                {resourceTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setResourceFormType(opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                        resourceFormType === opt.value
                          ? `${opt.color} shadow-sm`
                          : 'bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 资源内容 */}
            <div className="space-y-2">
              <Label>资源内容</Label>
              <Textarea
                value={resourceFormContent}
                onChange={(e) => setResourceFormContent(e.target.value)}
                placeholder="粘贴或输入资源内容（Prompt、配置 JSON、数据样本等）..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleResourceSave}>{editingResource ? '保存修改' : '添加资源'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

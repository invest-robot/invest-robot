import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PlusIcon, PencilIcon, Trash2Icon, ClockIcon, FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { IUpdateLog } from '@/lib/storage';
import { getLogs, addLog, updateLog, deleteLog } from '@/lib/storage';

const typeOptions = [
  { value: 'case', label: '案例' },
  { value: 'doc', label: '文档' },
  { value: 'demo', label: '演示' },
] as const;

const typeConfig: Record<string, { label: string; color: string }> = {
  case: { label: '案例', color: 'bg-primary/10 text-primary' },
  doc: { label: '文档', color: 'bg-accent text-accent-foreground' },
  demo: { label: '演示', color: 'bg-muted text-muted-foreground' },
};

interface ILogFormData {
  version: string;
  title: string;
  description: string;
  date: string;
  type: 'case' | 'doc' | 'demo';
}

const emptyForm: ILogFormData = {
  version: '',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  type: 'doc',
};

export default function LogManagerSection() {
  const [logs, setLogs] = useState<IUpdateLog[]>(() => getLogs());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<IUpdateLog | null>(null);
  const [formData, setFormData] = useState<ILogFormData>(emptyForm);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const refreshLogs = () => {
    setLogs(getLogs());
  };

  const openCreate = () => {
    setEditingLog(null);
    setFormData({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setDialogOpen(true);
  };

  const openEdit = (log: IUpdateLog) => {
    setEditingLog(log);
    setFormData({
      version: log.version,
      title: log.title,
      description: log.description,
      date: log.date,
      type: log.type,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.version.trim()) {
      toast.error('请填写版本号和标题');
      return;
    }

    if (editingLog) {
      const updated = updateLog(editingLog.id, formData);
      if (updated) {
        refreshLogs();
        toast.success('日志已更新');
      }
    } else {
      addLog(formData);
      refreshLogs();
      toast.success('日志已添加');
    }

    setDialogOpen(false);
    setEditingLog(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    refreshLogs();
    toast.success('日志已删除');
  };

  return (
    <section className="w-full space-y-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">更新日志管理</h2>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <PlusIcon className="size-4" />
          新增日志
        </Button>
      </div>

      {/* 日志列表 */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <FileTextIcon className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">暂无更新日志，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {logs.map((log) => {
            const config = typeConfig[log.type] || typeConfig.doc;
            return (
              <div
                key={log.id}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileTextIcon className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      {log.version}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <h3 className="mt-1 text-sm font-medium text-foreground">{log.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {log.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <ClockIcon className="size-3" />
                  <span>{log.date}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => openEdit(log)}
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 新增/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLog ? '编辑日志' : '新增日志'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">版本号</label>
                <Input
                  placeholder="如 v1.0.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">日期</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">标题</label>
              <Input
                placeholder="更新内容标题"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">类型</label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  setFormData({ ...formData, type: v as 'case' | 'doc' | 'demo' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">描述</label>
              <Textarea
                placeholder="简要描述更新内容..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>{editingLog ? '保存修改' : '添加日志'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

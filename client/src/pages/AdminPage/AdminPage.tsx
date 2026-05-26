import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpenIcon, ClockIcon, FileBoxIcon, LockIcon } from 'lucide-react';
import CaseManagerSection from './CaseManagerSection';
import LogManagerSection from './LogManagerSection';
import TemplateManagerSection from './TemplateManagerSection';
import { isAdminAuthenticated, authenticateAdmin } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

function AdminAuthScreen() {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (authenticateAdmin(password)) {
      toast.success('管理员登录成功');
      window.location.reload();
    } else {
      toast.error('密码错误，请重试');
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent">
            <LockIcon className="size-6 text-accent-foreground" />
          </div>
          <CardTitle className="text-xl">管理员验证</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">请输入管理员密码以访问管理后台</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="请输入管理员密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="h-10"
            autoFocus
          />
          <Button onClick={handleLogin} className="w-full">登录</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cases');

  if (!isAdminAuthenticated()) {
    return <AdminAuthScreen />;
  }

  return (
    <div className="w-full space-y-8">
      {/* 页面标题区 */}
      <section className="w-full">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">管理后台</h1>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            管理培训案例、更新日志与试验模板内容，所有修改实时保存至本地
          </p>
        </div>
      </section>

      {/* Tabs 切换区 */}
      <section className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="cases" className="gap-2">
              <FolderOpenIcon className="size-4" />
              案例管理
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <ClockIcon className="size-4" />
              日志管理
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileBoxIcon className="size-4" />
              模板管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="mt-0">
            <CaseManagerSection />
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <LogManagerSection />
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <TemplateManagerSection />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

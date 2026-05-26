import { useEffect, useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { HomeIcon, RocketIcon, UsersIcon, FlagIcon, SettingsIcon, LogOutIcon, CodeIcon, LockIcon, UnlockIcon, Building2Icon, FileTextIcon, ChevronRightIcon, BookOpenIcon, StarIcon } from "lucide-react";
import { useCurrentUserProfile } from "@lark-apaas/client-toolkit/hooks/useCurrentUserProfile";
import { getDataloom } from "@lark-apaas/client-toolkit/dataloom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { isAdminAuthenticated, authenticateAdmin, logoutAdmin, getCompanyCases } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated());
  const [companyCases, setCompanyCases] = useState<{ slug: string; title: string }[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setCompanyCases(getCompanyCases().map(c => ({ slug: c.slug, title: c.title })));
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith('/company-cases/') && !expandedGroups.has('公司案例')) {
      setExpandedGroups(prev => new Set(prev).add('公司案例'));
    }
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  const isCompanyCasesActive = pathname.startsWith('/company-cases');

  const navGroups = [
    {
      title: '公司案例',
      isExpandable: true,
      items: companyCases.map(c => ({
        path: `/company-cases/${c.slug}`,
        label: c.title,
        icon: FileTextIcon,
      })),
    },
    {
      title: '快速入门',
      items: [
        { path: '/quick-start', label: '快速开始', icon: RocketIcon },
        { path: '/dev-guide', label: '开发指南', icon: BookOpenIcon },
      ],
    },
    {
      title: '学习指南',
      items: [
        { path: '/agents', label: '数字员工', icon: UsersIcon },
        { path: '/cases', label: '实践测试', icon: FlagIcon },
      ],
    },
    ...(isAdmin ? [{ title: '系统', items: [{ path: '/admin', label: '后台管理', icon: SettingsIcon }] }] : []),
  ];

  return (
    <Sidebar collapsible="icon" className="!border-r-0 bg-white">
      <SidebarHeader className="!border-b-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-2xl bg-[#D8EC9D] text-[#1A1A1A]">
                  <CodeIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-[#1A1A1A]">九章数智AI+</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* 首页独立导航项 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname === '/'} className="rounded-2xl">
                  <Link to="/">
                    <HomeIcon className="size-4" />
                    <span>首页</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 分组导航 */}
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.title);
          return (
            <SidebarGroup key={group.title}>
              {'isExpandable' in group ? (
                <>
                    <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F6F7F2] rounded-2xl transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-lg text-[#2b37aa]">
                      {'title' in group && group.title === '公司案例' && (
                        <StarIcon className="size-3.5 text-amber-500 fill-amber-500" />
                      )}
                      {group.title}
                    </span>
                    <ChevronRightIcon
                      className={`size-3.5 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>
                   {isExpanded && (
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton asChild isActive={pathname === item.path} className="rounded-2xl">
                              <Link to={item.path}>
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </>
              ) : (
                <>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton asChild isActive={pathname === item.path} className="rounded-2xl">
                            <Link to={item.path}>
                              <item.icon className="size-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AdminAuthButton onAuthChange={() => setIsAdmin(isAdminAuthenticated())} />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminAuthButton({ onAuthChange }: { onAuthChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const isAdmin = isAdminAuthenticated();

  const handleLogin = () => {
    if (authenticateAdmin(password)) {
      toast.success("管理员登录成功");
      setOpen(false);
      setPassword("");
      onAuthChange();
    } else {
      toast.error("密码错误，请重试");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.info("已退出管理员模式");
    onAuthChange();
  };

  if (isAdmin) {
    return (
      <SidebarMenuButton onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
        <UnlockIcon className="size-4" />
        <span>退出管理</span>
      </SidebarMenuButton>
    );
  }

  return (
    <>
      <SidebarMenuButton onClick={() => setOpen(true)} className="text-muted-foreground hover:text-foreground">
        <LockIcon className="size-4" />
        <span>管理员登录</span>
      </SidebarMenuButton>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>管理员验证</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="请输入管理员密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="h-10"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={handleLogin}>登录</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UserMenu() {
  const userInfo = useCurrentUserProfile();
  const displayName = userInfo?.name || "用户";

  const handleLogout = async () => {
    const dataloom = await getDataloom();
    await dataloom.service.session.signOut();
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <UserIcon className="size-4" />
          <span className="truncate">{displayName}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LayoutContent() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <AppSidebar />
      <main className="flex min-h-svh flex-1 flex-col overflow-y-auto px-6 py-10 md:px-10">
        <header className="mb-8 flex items-center gap-2">
          <SidebarTrigger />
        </header>
        <Outlet />
      </main>
    </>
  );
}

const Layout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default Layout;

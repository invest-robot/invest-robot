import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RocketIcon, UsersIcon, FlaskConicalIcon, SettingsIcon, ArrowRightIcon, Building2Icon, BookOpenIcon } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/storage';

interface IModuleCard {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
}

const baseModules: IModuleCard[] = [
  {
    title: '快速开始',
    description: '5 分钟完成环境配置，跑通第一个 Agent 任务',
    icon: RocketIcon,
    path: '/quick-start',
  },
  {
    title: '开发指南',
    description: 'OpenClaw 框架安装、配置与核心能力使用指南',
    icon: BookOpenIcon,
    path: '/dev-guide',
  },
  {
    title: '数字员工',
    description: 'IT、运营、财务、行政 Agent 的职责边界与配置指南',
    icon: UsersIcon,
    path: '/agents',
  },
  {
    title: '实践测试',
    description: '大学生 & 新手友好的 AI 实战案例，跟着做就能学会',
    icon: FlaskConicalIcon,
    path: '/cases',
  },
  {
    title: '公司案例',
    description: '真实企业场景最佳实践，多 Agent 协同完成复杂业务',
    icon: Building2Icon,
    path: '/company-cases/photography-course',
  },
];

const adminModule: IModuleCard = {
  title: '后台管理',
  description: '管理案例、日志、模板与 Agent 配置内容',
  icon: SettingsIcon,
  path: '/admin',
};

export default function ModuleCardsSection() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
  }, []);

  const modules = isAdmin ? [...baseModules, adminModule] : baseModules;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.path}
              to={mod.path}
              className="group relative overflow-hidden rounded-[40px] bg-[#F6F7F2] p-10 transition-all duration-300 hover:bg-[#F3F4F6]"
            >
              <div className="relative z-10 flex flex-col justify-between h-[280px]">
                {/* 图标容器 */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-[#1A1A1A] transition-transform group-hover:scale-110">
                  <mod.icon className="size-6" />
                </div>

                <div className="flex-1 mt-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{mod.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#9CA3AF]">{mod.description}</p>
                </div>

                {/* 底部箭头 */}
                <div className="flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-all group-hover:bg-[#D8EC9D]">
                    <ArrowRightIcon className="size-4 text-[#9CA3AF] transition-colors group-hover:text-[#1A1A1A]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

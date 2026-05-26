import { useState } from 'react';
import { MessageSquareIcon, BotIcon, UserIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface IDemoMessage {
  id: string;
  role: 'user' | 'agent';
  agentType?: string;
  content: string;
}

const demoConversation: IDemoMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我搭建一个跨境电商独立站，预算控制在每月 500 元以内。',
  },
  {
    id: '2',
    role: 'agent',
    agentType: 'IT Agent',
    content: '收到需求。基于你的预算，我推荐以下方案：\n\n1. **技术栈**：Next.js + Tailwind CSS（免费开源）\n2. **部署平台**：Vercel 免费版（每月 100GB 流量）\n3. **域名**：Namecheap 注册，约 ¥60/年\n4. **总成本**：首年约 ¥120，月均 ¥10\n\n我现在开始初始化项目脚手架，预计 15 分钟完成基础框架。',
  },
  {
    id: '3',
    role: 'user',
    content: '好的，同时帮我生成首页的产品文案和 SEO 配置。',
  },
  {
    id: '4',
    role: 'agent',
    agentType: '运营 Agent',
    content: '已接手内容任务。我将完成：\n\n• 首页 Hero 文案（中英双语）\n• 3 个核心产品详情页描述\n• SEO Title / Description / Keywords 配置\n• 站点地图 sitemap.xml\n\n内容将在 IT Agent 完成部署后同步填充。',
  },
];

const agentColorMap: Record<string, string> = {
  'IT Agent': 'bg-[#D8EC9D]/30 text-[#B3D166]',
  '运营 Agent': 'bg-[#1A1A1A] text-white',
  '财务 Agent': 'bg-[#F6F7F2] text-[#9CA3AF]',
  '行政 Agent': 'bg-white text-[#1A1A1A] border border-[#1A1A1A]/10',
};

export default function AgentDemoSection() {
  const [visibleCount, setVisibleCount] = useState(2);

  const visibleMessages = demoConversation.slice(0, visibleCount);
  const hasMore = visibleCount < demoConversation.length;

  return (
    <section className="w-full">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="size-5 text-[#B3D166]" />
            <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Agent 操作演示</h2>
          </div>
          <p className="text-base text-[#9CA3AF]">
            查看真实任务场景下，数字员工如何协同完成工作
          </p>
        </div>
        <span className="hidden md:inline-flex items-center rounded-full bg-[#F6F7F2] px-4 py-1.5 text-xs font-bold text-[#9CA3AF]">
          演示模式
        </span>
      </div>

      <div className="w-full rounded-[40px] bg-[#F6F7F2] overflow-hidden">
        {/* 对话头部 */}
        <div className="flex items-center gap-3 px-8 py-6 bg-white">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#D8EC9D]/30">
            <BotIcon className="size-5 text-[#B3D166]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#1A1A1A]">独立站搭建任务</span>
            <p className="text-xs text-[#9CA3AF]">IT Agent · 运营 Agent 协同</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-[#B3D166]" />
            <span className="text-xs text-[#9CA3AF]">进行中</span>
          </div>
        </div>

        {/* 对话内容 */}
        <div className="px-8 py-8 space-y-6 max-h-[480px] overflow-y-auto">
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'agent' && (
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                  msg.agentType ? agentColorMap[msg.agentType]?.split(' ').filter(c => c.startsWith('bg-')).join(' ') || 'bg-[#F6F7F2]' : 'bg-[#F6F7F2]'
                }`}>
                  <BotIcon className={`size-3.5 ${
                    msg.agentType ? agentColorMap[msg.agentType]?.split(' ').filter(c => c.startsWith('text-')).join(' ') || 'text-[#9CA3AF]' : 'text-[#9CA3AF]'
                  }`} />
                </div>
              )}

              <div className={`max-w-[80%] rounded-[32px] px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#1A1A1A]'
              }`}>
                {msg.role === 'agent' && msg.agentType && (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold mb-2 ${
                    agentColorMap[msg.agentType] || 'bg-[#F6F7F2] text-[#9CA3AF]'
                  }`}>
                    {msg.agentType}
                  </span>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {msg.role === 'user' && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D8EC9D]/30">
                  <UserIcon className="size-3.5 text-[#B3D166]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between px-8 py-5 bg-white">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <MessageSquareIcon className="size-3.5" />
            <span>共 {demoConversation.length} 条消息，已展示 {visibleCount} 条</span>
          </div>
          {hasMore ? (
            <button
              onClick={() => setVisibleCount(prev => prev + 2)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] hover:text-[#B3D166] transition-colors"
            >
              加载更多
              <ArrowRightIcon className="size-3.5" />
            </button>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#F6F7F2] px-3 py-1 text-xs font-bold text-[#9CA3AF]">
              演示结束
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#9CA3AF]">
        <span>此区域为演示占位，后续可通过管理后台填充真实对话记录</span>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { TagIcon, ChevronDownIcon, ChevronUpIcon, BotIcon, ClockIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCases, type ICase } from '@/lib/storage';

const categoryConfig: Record<string, { label: string; color: string }> = {
  all: { label: '全部案例', color: '' },
  website: { label: '独立站搭建', color: 'bg-[#D8EC9D]/30 text-[#B3D166]' },
  social: { label: '自媒体运营', color: 'bg-[#1A1A1A] text-white' },
  finance: { label: '成本核算', color: 'bg-[#F6F7F2] text-[#9CA3AF]' },
  automation: { label: '流程自动化', color: 'bg-white text-[#1A1A1A] border border-[#1A1A1A]/10' },
};

const agentColorMap: Record<string, string> = {
  'IT Agent': 'bg-[#D8EC9D]/30 text-[#B3D166]',
  '运营 Agent': 'bg-[#1A1A1A] text-white',
  '财务 Agent': 'bg-[#F6F7F2] text-[#9CA3AF]',
  '行政 Agent': 'bg-white text-[#1A1A1A] border border-[#1A1A1A]/10',
};

export default function CasesSection() {
  const [cases, setCases] = useState<ICase[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const data = getCases();
    setCases(data);
  }, []);

  const filteredCases = activeFilter === 'all' 
    ? cases 
    : cases.filter((c) => c.category === activeFilter);

  return (
    <section className="w-full space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">培训案例库</h2>
        <p className="mt-2 text-base leading-relaxed text-[#9CA3AF]">
          真实场景复盘与试验数据，提供可复用的操作路径
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex items-center gap-2">
        <TagIcon className="size-4 text-[#9CA3AF]" />
        <span className="text-sm font-medium text-[#9CA3AF]">案例筛选</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
              activeFilter === key
                ? 'bg-[#D8EC9D] text-[#1A1A1A]'
                : 'bg-[#F6F7F2] text-[#1A1A1A] hover:bg-[#F3F4F6]'
            }`}
          >
            {config.label}
            <span className={`text-xs ${activeFilter === key ? 'text-[#1A1A1A]/60' : 'text-[#9CA3AF]'}`}>
              {key === 'all' ? cases.length : cases.filter((c) => c.category === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 案例卡片列表 */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="text-center py-12 text-[#9CA3AF]">
            暂无案例，请在管理后台添加
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            const isExpanded = expandedId === caseItem.id;
            const catConfig = categoryConfig[caseItem.category] || categoryConfig.all;

            return (
              <div
                key={caseItem.id}
                className="cursor-pointer rounded-[40px] bg-[#F6F7F2] p-10 transition-all duration-300 hover:bg-[#F3F4F6]"
                onClick={() => setExpandedId(isExpanded ? null : caseItem.id)}
              >
                {/* 卡片头部 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${catConfig.color}`}>
                        {catConfig.label}
                      </span>
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        {caseItem.updatedAt}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">{caseItem.title}</h3>
                    <p className="mt-2 text-sm text-[#9CA3AF] line-clamp-2">
                      {caseItem.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUpIcon className="size-5 text-[#9CA3AF]" />
                    ) : (
                      <ChevronDownIcon className="size-5 text-[#9CA3AF]" />
                    )}
                  </div>
                </div>

                {/* 展开时间轴 */}
                {isExpanded && caseItem.steps && caseItem.steps.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-[#1A1A1A]/5">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-6">执行步骤</h4>
                    <div className="relative pl-6 space-y-6">
                      {/* 时间轴线 */}
                      <div className="absolute left-2 top-2 bottom-2 w-px bg-[#D8EC9D]" />
                      
                      {caseItem.steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* 时间轴节点 */}
                          <div className="absolute -left-6 top-1.5 size-4 rounded-full bg-[#D8EC9D]/30 border-2 border-[#B3D166] flex items-center justify-center">
                            <div className="size-1.5 rounded-full bg-[#B3D166]" />
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-[#1A1A1A]">{step.title}</span>
                                {step.agent && (
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${agentColorMap[step.agent] || 'bg-[#F6F7F2] text-[#9CA3AF]'}`}>
                                    <BotIcon className="size-3 mr-1" />
                                    {step.agent}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#9CA3AF]">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

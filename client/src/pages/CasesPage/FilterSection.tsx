import { useState, useEffect, useCallback } from 'react';
import { FilterIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCases, type ICase } from '@/lib/storage';

const categoryConfig: Record<ICase['category'], { label: string; color: string }> = {
  website: { label: '个人网站', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  social: { label: '社交运营', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  finance: { label: '记账理财', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  automation: { label: '自动化工具', color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

interface IFilterSectionProps {
  onFilterChange?: (filteredCases: ICase[], activeCategory: ICase['category'] | 'all') => void;
}

export default function FilterSection({ onFilterChange }: IFilterSectionProps) {
  const [cases, setCases] = useState<ICase[]>([]);
  const [activeCategory, setActiveCategory] = useState<ICase['category'] | 'all'>('all');

  useEffect(() => {
    setCases(getCases());
  }, []);

  const handleFilter = useCallback((category: ICase['category'] | 'all') => {
    setActiveCategory(category);
    const filtered = category === 'all' ? cases : cases.filter((c) => c.category === category);
    onFilterChange?.(filtered, category);
  }, [cases, onFilterChange]);

  const handleReset = useCallback(() => {
    handleFilter('all');
  }, [handleFilter]);

  const categories: { key: ICase['category'] | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    ...Object.entries(categoryConfig).map(([key, config]) => ({
      key: key as ICase['category'],
      label: config.label,
    })),
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {/* 筛选头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">筛选案例</h3>
          </div>
          {activeCategory !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
              清除筛选
            </Button>
          )}
        </div>

        {/* 标签按钮组 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat.key === activeCategory;
            const config = cat.key !== 'all' ? categoryConfig[cat.key] : null;

            return (
              <button
                key={cat.key}
                onClick={() => handleFilter(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? config
                      ? `${config.color} border shadow-sm`
                      : 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {cat.label}
                {isActive && cat.key !== 'all' && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[16px] justify-center">
                    {cases.filter((c) => c.category === cat.key).length}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* 筛选结果提示 */}
        {activeCategory !== 'all' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>已筛选：</span>
            <Badge variant="outline" className={categoryConfig[activeCategory]?.color || ''}>
              {categoryConfig[activeCategory]?.label || activeCategory}
            </Badge>
            <span>共 {cases.filter((c) => c.category === activeCategory).length} 个案例</span>
          </div>
        )}
      </div>
    </section>
  );
}

import React from 'react';
import FilterSection from './FilterSection';
import TimelineSection from './TimelineSection';
import ResourcesSection from './ResourcesSection';
import ExperimentSection from './ExperimentSection';

const CasesPage: React.FC = () => {
  return (
    <div className="w-full space-y-12">
      <section className="w-full">
        <div className="mb-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">实践测试</h1>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            通过真实场景复盘与试验数据，验证工具价值并提供可复用的操作路径
          </p>
        </div>
      </section>

      <section className="w-full">
        <FilterSection />
      </section>

      <section className="w-full">
        <TimelineSection />
      </section>

      <section className="w-full">
        <ResourcesSection />
      </section>

      <section className="w-full">
        <ExperimentSection />
      </section>
    </div>
  );
};

export default CasesPage;

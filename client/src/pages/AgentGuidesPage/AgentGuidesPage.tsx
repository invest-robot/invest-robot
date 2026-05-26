import AgentSwitchSection from './AgentSwitchSection';
import PromptTemplateSection from './PromptTemplateSection';
import DemoSection from './DemoSection';

export default function AgentGuidesPage() {
  return (
    <div className="w-full space-y-12">
      <section className="w-full">
        <AgentSwitchSection />
      </section>

      <section className="w-full">
        <PromptTemplateSection />
      </section>

      <section className="w-full">
        <DemoSection />
      </section>
    </div>
  );
}

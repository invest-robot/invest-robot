import HeroSection from './HeroSection';
import ModuleCardsSection from './ModuleCardsSection';

export default function HomePage() {
  return (
    <div className="w-full space-y-20 md:space-y-24">
      <section className="w-full">
        <HeroSection />
      </section>
      <section className="w-full">
        <ModuleCardsSection />
      </section>
    </div>
  );
}

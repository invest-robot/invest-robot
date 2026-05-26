import { ArrowRightIcon } from 'lucide-react';

export default function HeroSection() {

  return (
    <section className="w-full">
      <div className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* 品牌标签 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F6F7F2] px-4 py-1.5 text-xs font-medium text-[#9CA3AF]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#B3D166]" />
            九章数智AI+
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl font-medium tracking-tight text-[#f6c105] md:text-5xl lg:text-6xl">AI 学习中心</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#9CA3AF] md:text-xl">AI 员工辅助一人创业，打造万人梦想</p>
        </div>
      </div>
    </section>
  );
}

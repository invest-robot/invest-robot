import React, { useState, useEffect } from 'react';
import { ClockIcon, FileTextIcon } from 'lucide-react';
import { getLogs, type IUpdateLog } from '@/lib/storage';

const typeConfig: Record<IUpdateLog['type'], { label: string; color: string }> = {
  doc: { label: '文档', color: 'bg-[#D8EC9D]/30 text-[#B3D166]' },
  case: { label: '案例', color: 'bg-[#1A1A1A] text-white' },
  demo: { label: '演示', color: 'bg-[#F6F7F2] text-[#9CA3AF]' },
};

export default function UpdateLogSection() {
  const [logs, setLogs] = useState<IUpdateLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  if (logs.length === 0) {
    return (
      <section className="w-full">
        <div className="mb-6 flex items-center gap-2">
          <ClockIcon className="size-5 text-[#9CA3AF]" />
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">内容更新日志</h2>
        </div>
        <div className="w-full rounded-[40px] bg-[#F6F7F2] p-10 text-center">
          <FileTextIcon className="mx-auto size-8 text-[#9CA3AF]/40" />
          <p className="mt-2 text-sm text-[#9CA3AF]">暂无更新记录</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-8 flex items-center gap-2">
        <ClockIcon className="size-5 text-[#9CA3AF]" />
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">内容更新日志</h2>
      </div>

      <div className="w-full space-y-4">
        {logs.map((log) => {
          const config = typeConfig[log.type];
          return (
            <div
              key={log.id}
              className="group flex items-start gap-4 rounded-[40px] bg-[#F6F7F2] p-8 transition-colors hover:bg-[#F3F4F6]"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1A1A1A]">
                <FileTextIcon className="size-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#9CA3AF]">
                    {log.version}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
                  >
                    {config.label}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold text-[#1A1A1A]">
                  {log.title}
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-[#9CA3AF] line-clamp-2">
                  {log.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1 text-xs text-[#9CA3AF]">
                <ClockIcon className="size-3" />
                <span>{log.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

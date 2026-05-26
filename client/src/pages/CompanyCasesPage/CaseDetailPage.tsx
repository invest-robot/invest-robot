import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getCompanyCases, type ICompanyCase } from '@/lib/storage';

function CopyButton({ content, label }: { content: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${label} 已复制`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动选择复制');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-0 right-0 bg-white border border-[#E5E6EB] border-t-0 border-r-0 rounded-bl-lg px-3 py-1 text-xs text-[#86909C] hover:text-[#1D2129] transition-colors"
    >
      {copied ? (
        <span className="flex items-center gap-1"><CheckIcon className="size-3 text-green-600" />已复制</span>
      ) : (
        <span className="flex items-center gap-1"><CopyIcon className="size-3" />复制</span>
      )}
    </button>
  );
}

function AgentInteractionBlock({ step }: { step: ICompanyCase['steps'][0] }) {
  return (
    <div className="border border-[#E5E6EB] rounded-lg my-6 overflow-hidden">
      <div className="bg-[#FAFAFB] px-5 py-3 border-b border-[#E5E6EB] flex items-center gap-2.5 text-sm font-semibold text-[#1D2129]">
        <span>{step.agentIcon}</span>
        <span>{step.agentName}</span>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <span className="text-[#1664FF] font-medium text-sm block mb-3">用户指令 (Prompt)：</span>
          {step.codeBlock ? (
            <div className="relative rounded-lg bg-[#F2F3F5] border border-[#E5E6EB] p-5 font-mono text-[13px] text-[#333] leading-relaxed">
              <CopyButton content={step.prompt} label="Prompt" />
              <pre className="whitespace-pre-wrap">{step.prompt}</pre>
            </div>
          ) : (
            <div className="relative rounded-lg bg-[#F2F3F5] border border-[#E5E6EB] p-5 font-mono text-[13px] text-[#333] leading-relaxed">
              <CopyButton content={step.prompt} label="Prompt" />
              <pre className="whitespace-pre-wrap">{step.prompt}</pre>
            </div>
          )}
        </div>
        {step.responseHtml && (
          <div>
            <span className="text-[#4E5969] font-medium text-sm block mb-3">Agent 输出结果：</span>
            <div
              className="text-[#4E5969] text-[14px] bg-[#F9F9F9] p-4 rounded-lg border-l-[3px] border-[#86909C] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: step.responseHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="relative rounded-xl bg-[hsl(210_10%_12%)] overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        <CopyButton content={content} label={label} />
      </div>
      <pre className="p-5 text-sm font-mono leading-relaxed text-[hsl(210_10%_92%)] overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse my-6 text-[14px]">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-[#E5E6EB] px-4 py-3 text-left font-semibold text-[#1D2129] bg-[#F7F8FA]"
              dangerouslySetInnerHTML={{ __html: h }}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                className="border border-[#E5E6EB] px-4 py-3 text-[#4E5969]"
                dangerouslySetInnerHTML={{ __html: cell }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Callout({ type, content }: { type: 'info' | 'warning'; content: string }) {
  const bgColor = type === 'warning' ? '#FFF7E8' : '#E8F3FF';
  const borderColor = type === 'warning' ? '#FF7D00' : '#1664FF';
  return (
    <div
      className="border-l-4 rounded-md px-5 py-4 my-6 text-[14px] text-[#4E5969]"
      style={{ background: bgColor, borderLeftColor: borderColor }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const cases = getCompanyCases();
  const currentCase = cases.find(c => c.slug === caseId);

  if (!currentCase) {
    return (
      <div className="w-full space-y-6">
        <Link to="/company-cases" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeftIcon className="size-4" />
          返回案例列表
        </Link>
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">未找到该案例</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 面包屑 */}
      <nav className="text-[13px] text-[#86909C] mb-6">
        <Link to="/" className="hover:text-[#1664FF] transition-colors">文档中心</Link>
        <span className="mx-2">/</span>
        <Link to="/company-cases" className="hover:text-[#1664FF] transition-colors">公司案例</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1D2129]">案例详情</span>
      </nav>

      {/* 标题 */}
      <h1 className="text-[32px] font-semibold leading-[1.3] text-[#1D2129] mb-4">{currentCase.title}</h1>

      {/* 元信息 */}
      <div className="text-[13px] text-[#86909C] mb-10 flex gap-5">
        <span>更新时间：{currentCase.updatedAt}</span>
        <span>预计阅读时间：{currentCase.readTime}</span>
      </div>

      {/* 简介 */}
      <p className="text-[15px] leading-[1.7] text-[#4E5969] mb-6 text-justify">{currentCase.description}</p>

      {/* 前置条件 Callout */}
      <Callout
        type="info"
        content='<strong>🚀 前置条件：</strong>请确保您已在控制台激活了 OpenClaw 基础版，并拥有"Team Leader"权限。'
      />

      {/* 步骤 */}
      {currentCase.steps.map((step, index) => (
        <section key={step.id} className={index > 0 ? 'mt-12' : 'mt-12'}>
          <h2 className="text-[24px] font-semibold mt-12 mb-6 pb-3 border-b border-[#E5E6EB] text-[#1D2129]">
            {step.title}
          </h2>

          <p
            className="text-[15px] leading-[1.7] text-[#4E5969] mb-4"
            dangerouslySetInnerHTML={{ __html: step.intro }}
          />

          <AgentInteractionBlock step={step} />

          {step.callout && <Callout type={step.callout.type} content={step.callout.content} />}

          {step.tableData && <DataTable headers={step.tableData.headers} rows={step.tableData.rows} />}

          {step.codeBlock && <CodeBlock label={step.codeBlock.label} content={step.codeBlock.content} />}
        </section>
      ))}

      {/* 底部导航 */}
      <div className="mt-16 pt-8 border-t border-[#E5E6EB] flex justify-between">
        {(() => {
          const idx = cases.findIndex(c => c.slug === caseId);
          const prev = idx > 0 ? cases[idx - 1] : null;
          const next = idx < cases.length - 1 ? cases[idx + 1] : null;
          return (
            <>
              {prev ? (
                <Link to={`/company-cases/${prev.slug}`} className="text-sm text-primary hover:underline">
                  ← {prev.title}
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/company-cases/${next.slug}`} className="text-sm text-primary hover:underline">
                  {next.title} →
                </Link>
              ) : <div />}
            </>
          );
        })()}
      </div>
    </div>
  );
}

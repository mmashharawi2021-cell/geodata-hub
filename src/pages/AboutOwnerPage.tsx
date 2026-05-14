import { Map, Mail, ExternalLink, Globe } from "lucide-react";

export function AboutOwnerPage() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">منفذ المشروع</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              التصميم والتطوير والهندسة
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
            <Map className="h-5 w-5 text-[#22d3ee]" />
          </div>
        </div>

        {/* Owner Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-right sm:items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#0b7285] text-3xl font-extrabold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              م
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold mb-1">
                مهند أنور خليل المشهراوي
              </h2>
              <p className="text-sm font-bold text-[#22d3ee] mb-3">
                مهندس نظم معلومات جغرافية
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                متخصص في نظم المعلومات الجغرافية، الخرائط التفاعلية،
                كتالوجات البيانات المفتوحة، ولوحات المتابعة المكانية.
              </p>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                هذا المشروع تم بناؤه كمنصة عربية لإدارة واستعراض مصادر
                البيانات الجغرافية المفتوحة.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
          <h3 className="text-base font-extrabold mb-4">معلومات التواصل</h3>
          <div className="space-y-3">
            <a
              href="mailto:mmashharawi2021@gmail.com"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] transition-colors hover:border-[rgba(34,211,238,0.2)] hover:bg-[rgba(34,211,238,0.04)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
                <Mail className="h-4 w-4 text-[#22d3ee]" />
              </div>
              <span className="font-semibold" dir="ltr">mmashharawi2021@gmail.com</span>
            </a>
            <a
              href="https://github.com/mmashharawi2021-cell"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] transition-colors hover:border-[rgba(34,211,238,0.2)] hover:bg-[rgba(34,211,238,0.04)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
                <ExternalLink className="h-4 w-4 text-[#22d3ee]" />
              </div>
              <span className="font-semibold">GitHub</span>
              <span className="text-[var(--muted)]" dir="ltr">mmashharawi2021-cell</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mmashharawi/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] transition-colors hover:border-[rgba(34,211,238,0.2)] hover:bg-[rgba(34,211,238,0.04)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
                <ExternalLink className="h-4 w-4 text-[#22d3ee]" />
              </div>
              <span className="font-semibold">LinkedIn</span>
              <span className="text-[var(--muted)]">قابل للتعديل</span>
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-extrabold mb-4">عن المشروع</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">GeoData Hub</strong> هي منصة
            رقمية عربية متكاملة لإدارة واستعراض وتحميل البيانات الجغرافية المكانية،
            مبنية بأحدث تقنيات الويب (React 19، MapLibre GL JS، TypeScript 6،
            Tailwind CSS 4) وتعمل بمصادر بيانات مفتوحة بالكامل.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
            جميع أعمال التصميم والتطوير الخاصة بواجهة GeoData Hub من تنفيذ
            مهند أنور المشهراوي، مع اعتماد مصادر بيانات مفتوحة مذكورة داخل المنصة.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[0.65rem] text-[var(--muted)]">
            <Globe className="h-3.5 w-3.5" />
            الإصدار الحالي: 0.1.0 — جمادى الأولى 1447 / أيار 2026
          </div>
        </div>
      </div>
    </div>
  );
}

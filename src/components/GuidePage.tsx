import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Save,
  RotateCcw,
  X,
} from "lucide-react";
import { fetchGenerationGuide, saveGenerationGuide } from "../lib/guideApi";
import { DEFAULT_GENERATION_GUIDE } from "../lib/guideContentDefaults";
import type { GuideBlock, GenerationGuideContent, GuideSection } from "../lib/guideTypes";

function bodyParagraphs(body: string | undefined) {
  if (!body?.trim()) return null;
  return body.split(/\n\n+/).map((p, i) => (
    <p key={i} className="whitespace-pre-wrap">
      {p.trim()}
    </p>
  ));
}

function AccordionPanel({
  title,
  open,
  onToggle,
  level,
  children,
}: {
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  level: 0 | 1 | 2;
  children: React.ReactNode;
}) {
  const pad = level === 0 ? "p-4 sm:p-5" : level === 1 ? "px-4 py-3" : "px-3 py-2.5";
  const border =
    level === 0
      ? "rounded-2xl border border-slate-200 bg-white shadow-sm"
      : level === 1
        ? "rounded-xl border border-slate-100 bg-slate-50/80"
        : "rounded-lg border border-slate-100 bg-white";

  return (
    <div className={border}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 text-left ${pad} ${
          level === 0 ? "font-bold text-slate-900 text-base sm:text-lg" : "font-semibold text-slate-800 text-sm"
        }`}
      >
        <span className="min-w-0">{title}</span>
        {open ? (
          <ChevronUp size={level === 0 ? 20 : 16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={level === 0 ? 20 : 16} className="text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div
          className={`${level === 0 ? "px-4 sm:px-5 pb-4 sm:pb-5 pt-0" : level === 1 ? "px-4 pb-3 pt-0" : "px-3 pb-2.5 pt-0"} space-y-2`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ViewBlock({
  block,
  depth,
  defaultOpen = false,
}: {
  block: GuideBlock;
  depth: 1 | 2;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = (block.children?.length ?? 0) > 0;

  if (hasChildren) {
    return (
      <AccordionPanel
        title={block.title}
        open={open}
        onToggle={() => setOpen((o) => !o)}
        level={depth}
      >
        {block.body && (
          <div className="text-sm text-slate-600 leading-relaxed space-y-2 mb-3">{bodyParagraphs(block.body)}</div>
        )}
        <div className="space-y-2 pl-0 sm:pl-1">
          {block.children!.map((child) => (
            <ViewBlock key={child.id} block={child} depth={2} />
          ))}
        </div>
      </AccordionPanel>
    );
  }

  return (
    <AccordionPanel title={block.title} open={open} onToggle={() => setOpen((o) => !o)} level={depth}>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{bodyParagraphs(block.body)}</div>
    </AccordionPanel>
  );
}

function EditBlock({
  block,
  onChange,
}: {
  block: GuideBlock;
  onChange: (next: GuideBlock) => void;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-2">
      <input
        type="text"
        value={block.title}
        onChange={(e) => onChange({ ...block, title: e.target.value })}
        className="w-full text-sm font-semibold px-2 py-1.5 border border-slate-200 rounded-lg"
        placeholder="Antraštė"
      />
      <textarea
        value={block.body ?? ""}
        onChange={(e) => onChange({ ...block, body: e.target.value })}
        rows={4}
        className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-lg font-mono"
        placeholder="Tekstas (pastraipos — tuščia eilutė)"
      />
      {block.children?.map((child, i) => (
        <div key={child.id} className="ml-3 border-l-2 border-amber-200 pl-3">
          <EditBlock
            block={child}
            onChange={(next) => {
              const children = [...(block.children ?? [])];
              children[i] = next;
              onChange({ ...block, children });
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ViewSection({ section }: { section: GuideSection }) {
  const [open, setOpen] = useState(section.defaultOpen);

  return (
    <AccordionPanel title={section.title} open={open} onToggle={() => setOpen((o) => !o)} level={0}>
      <div className="space-y-2">
        {section.blocks.map((block) => (
          <ViewBlock key={block.id} block={block} depth={1} />
        ))}
      </div>
    </AccordionPanel>
  );
}

function EditSection({
  section,
  onChange,
}: {
  section: GuideSection;
  onChange: (next: GuideSection) => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-white p-4 space-y-3">
      <input
        type="text"
        value={section.title}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
        className="w-full font-bold text-lg px-2 py-1.5 border border-slate-200 rounded-lg"
      />
      {section.blocks.map((block, i) => (
        <EditBlock
          key={block.id}
          block={block}
          onChange={(next) => {
            const blocks = [...section.blocks];
            blocks[i] = next;
            onChange({ ...section, blocks });
          }}
        />
      ))}
    </div>
  );
}

interface GuidePageProps {
  isAdmin?: boolean;
}

export function GuidePage({ isAdmin }: GuidePageProps) {
  const [content, setContent] = useState<GenerationGuideContent | null>(null);
  const [draft, setDraft] = useState<GenerationGuideContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const g = await fetchGenerationGuide();
        if (!cancelled) {
          setContent(g);
          setDraft(g);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startEdit = () => {
    setDraft(content ? structuredClone(content) : structuredClone(DEFAULT_GENERATION_GUIDE));
    setEditing(true);
    setSaveError(null);
    setSaveOk(false);
  };

  const cancelEdit = () => {
    setDraft(content);
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      await saveGenerationGuide(draft);
      setContent(draft);
      setEditing(false);
      setSaveOk(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Nepavyko išsaugoti.");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    if (!confirm("Atstatyti numatytąjį turinį? Neišsaugoti pakeitimai bus prarasti.")) return;
    setDraft(structuredClone(DEFAULT_GENERATION_GUIDE));
  };

  const display = editing ? draft : content;

  if (loading && !display) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!display) return null;

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600">
          <BookOpen size={24} />
        </div>
        {editing ? (
          <div className="space-y-2 text-left max-w-xl mx-auto">
            <label className="block text-xs font-semibold text-slate-500 uppercase">Puslapio pavadinimas</label>
            <input
              type="text"
              value={draft?.pageTitle ?? ""}
              onChange={(e) => setDraft((d) => (d ? { ...d, pageTitle: e.target.value } : d))}
              className="w-full text-xl font-bold px-3 py-2 border border-slate-200 rounded-xl"
            />
            <label className="block text-xs font-semibold text-slate-500 uppercase">Įvadas</label>
            <textarea
              value={draft?.pageIntro ?? ""}
              onChange={(e) => setDraft((d) => (d ? { ...d, pageIntro: e.target.value } : d))}
              rows={2}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{display.pageTitle}</h1>
            {display.pageIntro && <p className="text-slate-500 text-base">{display.pageIntro}</p>}
          </>
        )}
      </div>

      {isAdmin && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700"
            >
              <Pencil size={16} />
              Redaguoti turinį
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Išsaugoti
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <X size={16} />
                Atšaukti
              </button>
              <button
                type="button"
                onClick={resetDefaults}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100"
              >
                <RotateCcw size={16} />
                Numatyta
              </button>
            </>
          )}
          {saveError && <p className="w-full text-center text-sm text-red-600">{saveError}</p>}
          {saveOk && !editing && (
            <p className="w-full text-center text-sm text-emerald-600">Išsaugota.</p>
          )}
        </div>
      )}

      <div className="space-y-4 max-w-2xl mx-auto">
        {editing && draft
          ? draft.sections.map((section, si) => (
              <EditSection
                key={section.id}
                section={section}
                onChange={(next) => {
                  const sections = [...draft.sections];
                  sections[si] = next;
                  setDraft({ ...draft, sections });
                }}
              />
            ))
          : display.sections.map((section) => <ViewSection key={section.id} section={section} />)}
      </div>
    </div>
  );
}

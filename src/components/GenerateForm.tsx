import React, { useRef, useState, useCallback } from "react";
import { Loader2, ImagePlus, X, Image as ImageIcon, PenLine, TrendingUp } from "lucide-react";
import type { Difficulty } from "../lib/types";

interface GenerateFormProps {
  grade: number;
  taskCount: number;
  prompt: string;
  difficulty: Difficulty;
  imagePreview: string | null;
  withDiagram: boolean;
  withGraph: boolean;
  loading: boolean;
  onGradeChange: (v: number) => void;
  onTaskCountChange: (v: number) => void;
  onPromptChange: (v: string) => void;
  onDifficultyChange: (v: Difficulty) => void;
  onImageChange: (base64: string | null) => void;
  onWithDiagramChange: (v: boolean) => void;
  onWithGraphChange: (v: boolean) => void;
  onSubmit: () => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: "lengvos", label: "Lengvos", desc: "Baziniai skaičiavimai" },
  { value: "vidutinės", label: "Vidutinės", desc: "Keli sprendimo žingsniai" },
  { value: "sunkios", label: "Sunkios", desc: "Sudėtingi sprendimai" },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  lengvos: "bg-emerald-500 shadow-emerald-200",
  vidutinės: "bg-amber-500 shadow-amber-200",
  sunkios: "bg-red-500 shadow-red-200",
};

const DIFFICULTY_ACTIVE: Record<Difficulty, string> = {
  lengvos: "border-emerald-400 bg-emerald-50 text-emerald-700",
  vidutinės: "border-amber-400 bg-amber-50 text-amber-700",
  sunkios: "border-red-400 bg-red-50 text-red-700",
};

// Resize image to max 1024px on longest side and compress to JPEG ~80% quality.
// This reduces base64 payload from potentially 2–4 MB to ~100–200 KB before sending.
const MAX_DIM = 1024;
const JPEG_QUALITY = 0.8;

function resizeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, MAX_DIM / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function GenerateForm({
  grade,
  taskCount,
  prompt,
  difficulty,
  imagePreview,
  withDiagram,
  withGraph,
  loading,
  onGradeChange,
  onTaskCountChange,
  onPromptChange,
  onDifficultyChange,
  onImageChange,
  onWithDiagramChange,
  onWithGraphChange,
  onSubmit,
}: GenerateFormProps) {
  const grades = Array.from({ length: 12 }, (_, i) => i + 1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const b64 = await resizeImageToBase64(file);
    onImageChange(b64);
  }, [onImageChange]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((i) => i.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) await processFile(file);
    }
  }, [processFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  }, [processFile]);

  const canSubmit = !loading && (prompt.trim().length >= 3 || !!imagePreview);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-7">
      {/* Row: Grade + Task count */}
      <div className="grid grid-cols-2 gap-6">
        {/* Grade selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Klasė
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGradeChange(g)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  grade === g
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Task count — input only */}
        <div className="space-y-2">
          <label
            htmlFor="task-count"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-widest"
          >
            Užduočių skaičius
          </label>
          <input
            id="task-count"
            type="number"
            min={1}
            max={30}
            value={taskCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1 && v <= 30) onTaskCountChange(v);
            }}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
          />
          <p className="text-xs text-slate-400">Nuo 1 iki 30</p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Sunkumo lygis
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => onDifficultyChange(d.value)}
              className={`relative py-3 px-4 rounded-xl border-2 text-left transition-all duration-150 ${
                difficulty === d.value
                  ? `${DIFFICULTY_ACTIVE[d.value]} border-2`
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    difficulty === d.value ? DIFFICULTY_COLORS[d.value] : "bg-slate-300"
                  }`}
                />
                <span className="text-sm font-semibold">{d.label}</span>
              </div>
              <p className="text-xs opacity-70 pl-4">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Diagram toggle — only for grade 7+ (gpt-4o) */}
      {grade >= 7 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={withDiagram}
            onClick={() => onWithDiagramChange(!withDiagram)}
            className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              withDiagram ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                withDiagram ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <PenLine size={14} className={withDiagram ? "text-blue-600" : "text-slate-400"} />
            <span className={`text-sm font-medium ${withDiagram ? "text-blue-700" : "text-slate-500"}`}>
              Generuoti su brėžiniu
            </span>
            <span className="text-xs text-slate-400">(geometrijos užduotims)</span>
          </div>
        </div>
      )}

      {/* Function graph toggle — only for grade 9+ */}
      {grade >= 9 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={withGraph}
            onClick={() => onWithGraphChange(!withGraph)}
            className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              withGraph ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                withGraph ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className={withGraph ? "text-blue-600" : "text-slate-400"} />
            <span className={`text-sm font-medium ${withGraph ? "text-blue-700" : "text-slate-500"}`}>
              Generuoti su grafiku
            </span>
            <span className="text-xs text-slate-400">(funkcijų užduotims)</span>
          </div>
        </div>
      )}

      {/* Prompt + image upload */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Užduoties aprašymas arba nuotrauka
        </label>

        {/* Image preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Įkelta užduotis"
              className="max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-50"
            />
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Textarea with drag-and-drop + paste */}
        <div
          className={`relative rounded-xl border-2 transition-all duration-150 ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              imagePreview
                ? "Papildomai galite aprašyti, ko norite (nebūtina)..."
                : `Aprašykite norimą užduotį arba įklijuokite pavyzdinę užduotį...\n\nPvz.: Jonukas turi 24 obuolius. Jis padovanojo 1/3 draugams. Kiek obuolių liko?`
            }
            rows={5}
            className="w-full px-4 py-3 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none rounded-xl bg-transparent"
          />

          {/* Drag overlay hint */}
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-50/80 pointer-events-none">
              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                <ImageIcon size={18} />
                Numeskite nuotrauką čia
              </div>
            </div>
          )}
        </div>

        {/* Image upload actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <ImagePlus size={14} />
            Įkelti nuotrauką
          </button>
          <span className="text-xs text-slate-400">
            arba nuvilkite / įklijuokite nuotrauką (Ctrl+V)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await processFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-base shadow-lg shadow-blue-100 hover:shadow-blue-200 disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generuojama...
          </>
        ) : (
          "Generuoti"
        )}
      </button>
    </div>
  );
}

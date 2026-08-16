import { ArrowLeft, Printer, Lock, Eye, EyeOff } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { CuratedPrintItem } from "../lib/types";

interface PrintCollectionViewProps {
  items: CuratedPrintItem[];
  canPrint: boolean;
  onToggleEnabled: (id: string) => void;
  onSetAllEnabled: (enabled: boolean) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onLockedAction: (featureName: string) => void;
}

export function PrintCollectionView({
  items,
  canPrint,
  onToggleEnabled,
  onSetAllEnabled,
  onRemove,
  onBack,
  onLockedAction,
}: PrintCollectionViewProps) {
  const enabledCount = items.filter((i) => i.enabled).length;
  let printNumber = 0;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="font-bold text-slate-800 text-base leading-none">
            Spausdinimo sąrašas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {enabledCount} iš {items.length} užduočių spausdinime · be atsakymų
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {items.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => onSetAllEnabled(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
              >
                Pažymėti visus
              </button>
              <span className="text-slate-300 text-xs">·</span>
              <button
                type="button"
                onClick={() => onSetAllEnabled(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1"
              >
                Nežymėti nieko
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
            </>
          )}
          <button
            onClick={() => (canPrint ? window.print() : onLockedAction("Spausdinimas"))}
            disabled={enabledCount === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 disabled:opacity-40 ${
              canPrint
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            {canPrint ? <Printer size={13} /> : <Lock size={12} />}
            Spausdinti
          </button>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all duration-150"
          >
            <ArrowLeft size={13} />
            Grįžti
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          Sąrašas tuščias. Pasirinkite užduotis iš ankstesnių generavimų.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const displayIndex = item.enabled ? printNumber++ : -1;
            return (
              <div
                key={item.id}
                data-print-include={item.enabled ? "true" : "false"}
                className={`relative ${item.enabled ? "" : "opacity-45"}`}
              >
                <div className="no-print absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleEnabled(item.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                    title={item.enabled ? "Neįtraukti į spausdinimą" : "Įtraukti į spausdinimą"}
                  >
                    {item.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    {item.enabled ? "Spausdinime" : "Išjungta"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="px-2 py-1 rounded-lg text-[11px] font-medium bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 shadow-sm"
                  >
                    Pašalinti
                  </button>
                </div>

                <p className="no-print text-[10px] text-slate-400 mb-1 px-1 truncate">
                  {item.sessionGrade} kl. · {item.sessionPrompt}
                </p>

                <TaskCard
                  task={item.task}
                  index={displayIndex >= 0 ? displayIndex : 0}
                  showAnswers={false}
                  showSolutions={false}
                  grade={item.sessionGrade}
                  hideNumberBadge={displayIndex < 0}
                  displayNumber={displayIndex >= 0 ? displayIndex + 1 : undefined}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

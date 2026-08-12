import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Crown, X, ArrowRight } from 'lucide-react';

export type PlanTier = 'free' | 'pro' | 'unlimited';

function isPaidPlan(plan: string | undefined): boolean {
  return plan === 'pro' || plan === 'unlimited';
}

export function usePlan() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const rawPlan = profile?.plan ?? "free";
  const plan = user ? (isAdmin ? "unlimited" : rawPlan) : "free";
  const tier: PlanTier =
    plan === "unlimited" ? "unlimited" : plan === "pro" ? "pro" : "free";

  const hasProFeatures = isAdmin || isPaidPlan(plan);
  const isPro = tier === 'pro';
  const isUnlimited = tier === 'unlimited';
  const isFree = tier === 'free';

  const canUploadImage = hasProFeatures;
  const canEditTasks = hasProFeatures;
  const canExport = hasProFeatures;
  const canPrint = hasProFeatures;
  const maxTasksPerGeneration = hasProFeatures ? 15 : 1;

  return {
    tier,
    isPro,
    isUnlimited,
    isFree,
    hasProFeatures,
    canUploadImage,
    canEditTasks,
    canExport,
    canPrint,
    maxTasksPerGeneration,
    isLoggedIn: !!user,
    isAdmin,
  };
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

export function UpgradeModal({ open, onClose, onUpgrade, featureName }: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
            <Crown size={26} className="text-blue-600" />
          </div>

          <h3 className="text-xl font-bold text-slate-800">Ši funkcija reikalauja PRO arba Unlimited plano</h3>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Jūsų dabartinis planas nepalaiko: <strong className="text-slate-700">{featureName}</strong>.
            Atnaujinkite planą ir gaukite visas funkcijas.
          </p>

          <div className="mt-6 w-full space-y-2 text-left">
            {[
              'Nuotraukų įkėlimas',
              'Užduočių redagavimas',
              'Word (.docx) eksportas (tik užduotys)',
              'Spausdinimas',
              'Iki 15 užduočių per generaciją',
              'Prioritetinis AI generavimas',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 text-[10px] font-bold">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>

          <button
            onClick={onUpgrade}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            Peržiūrėti planus
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="mt-2 text-sm text-slate-400 hover:text-slate-600 transition"
          >
            Ne dabar
          </button>
        </div>
      </div>
    </div>
  );
}

export function useUpgradeGate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [featureName, setFeatureName] = useState('');

  const gate = useCallback((allowed: boolean, name: string, onAllowed?: () => void) => {
    if (allowed) {
      onAllowed?.();
    } else {
      setFeatureName(name);
      setModalOpen(true);
    }
  }, []);

  const modal = (onUpgrade: () => void) => (
    <UpgradeModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      onUpgrade={() => {
        setModalOpen(false);
        onUpgrade();
      }}
      featureName={featureName}
    />
  );

  return { gate, modal, modalOpen, setModalOpen, setFeatureName };
}

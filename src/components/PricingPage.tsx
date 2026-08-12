import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createCheckoutSession, type CheckoutPlan } from '../lib/api';
import {
  Check,
  X,
  Plus,
  Calendar,
  Loader2,
} from 'lucide-react';

type PlanKey = 'free' | 'pro' | 'unlimited';

const PlanCard: React.FC<{
  name: string;
  tagline: string;
  price: string;
  period?: string;
  note?: string;
  features: { text: string; included: boolean }[];
  highlight?: boolean;
  accent?: 'blue' | 'violet';
  current?: boolean;
  badge?: string;
  onAction?: () => void;
  actionLabel: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
}> = ({ name, tagline, price, period, note, features, highlight, accent = 'blue', current, badge, onAction, actionLabel, actionDisabled, actionLoading }) => {
  const isViolet = accent === 'violet';
  const cardRing = highlight
    ? isViolet
      ? 'border-violet-500 shadow-xl shadow-violet-100 scale-[1.02] ring-2 ring-violet-500/20'
      : 'border-blue-500 shadow-xl shadow-blue-100 scale-[1.02] ring-2 ring-blue-500/20'
    : 'border-slate-200 shadow-sm hover:shadow-md';
  const titleClass = highlight
    ? isViolet
      ? 'text-violet-700'
      : 'text-blue-700'
    : 'text-slate-800';
  const badgeBg = isViolet ? 'bg-violet-600' : 'bg-blue-600';
  const btnActive = isViolet
    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm';

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white transition-all duration-300 ${cardRing}`}
    >
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white ${badgeBg} shadow-sm`}>
          {badge}
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-bold ${titleClass}`}>{name}</h3>
          {current && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
              DABARTINIS
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">{tagline}</p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-800">{price}</span>
          {period && <span className="text-sm text-slate-500">{period}</span>}
        </div>
        {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}

        <ul className="mt-5 space-y-2.5 flex-1">
          {features.map((f) => (
            <li key={f.text} className="flex items-start gap-2 text-sm">
              {f.included ? (
                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
              )}
              <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.text}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled || actionLoading}
          className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
            actionDisabled || actionLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : highlight
              ? btnActive
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {actionLoading && <Loader2 size={16} className="animate-spin" />}
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

function resolveCurrentPlan(profilePlan: string | undefined, loggedIn: boolean): PlanKey | null {
  if (!loggedIn) return null;
  if (profilePlan === 'unlimited') return 'unlimited';
  if (profilePlan === 'pro') return 'pro';
  return 'free';
}

export const PricingPage: React.FC = () => {
  const { user, profile, signInWithGoogle } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<CheckoutPlan | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showProCheckout, setShowProCheckout] = useState(false);
  const [showUnlimitedCheckout, setShowUnlimitedCheckout] = useState(false);

  const currentPlan = resolveCurrentPlan(profile?.plan, !!user);

  const startCheckout = useCallback(async (plan: CheckoutPlan) => {
    setCheckoutError(null);

    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (currentPlan === 'unlimited') return;
    if (plan === 'PRO mėnesinis' && currentPlan === 'pro') return;

    setCheckoutLoading(plan);
    try {
      const url = await createCheckoutSession(plan);
      window.location.assign(url);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Nepavyko pradėti mokėjimo.');
      setCheckoutLoading(null);
    }
  }, [user, currentPlan, signInWithGoogle]);

  const freeFeatures = [
    { text: '3 užklausos per dieną', included: true },
    { text: '10 užklausų per mėnesį', included: true },
    { text: 'Po 1 užduotį per generaciją', included: true },
    { text: 'Geometrijos brėžiniai', included: true },
    { text: 'GeoGebra grafikai', included: true },
    { text: 'Nuotraukos įkėlimas', included: false },
    { text: 'Užduočių redagavimas', included: false },
    { text: 'Spausdinimas / eksportas', included: false },
  ];

  const proFeatures = [
    { text: 'Be dienos limito', included: true },
    { text: '100 užklausų / 300 užduočių per mėn.', included: true },
    { text: 'Iki 15 užduočių per generaciją', included: true },
    { text: 'Nuotraukos įkėlimas', included: true },
    { text: 'Užduočių redagavimas', included: true },
    { text: 'Word (.docx) eksportas', included: true },
    { text: 'Prioritetinis AI generavimas', included: true },
  ];

  const unlimitedFeatures = [
    { text: 'Neribotos užklausos ir užduotys', included: true },
    { text: 'Iki 15 užduočių per generaciją', included: true },
    { text: 'Visos PRO funkcijos', included: true },
  ];

  return (
    <div className="py-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-slate-800">Planai ir kainos</h1>
        <p className="text-slate-500 mt-3 text-lg">
          Generavimui reikia prisijungti. Pasirinkite FREE, PRO arba Unlimited planą.
        </p>
      </div>

      {checkoutError && (
        <div className="mt-6 max-w-2xl mx-auto px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 text-center">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <PlanCard
          name="FREE"
          tagline="Prisijungusiems nemokamai"
          price="0 €"
          period="nemokamai"
          features={freeFeatures}
          current={currentPlan === 'free'}
          actionLabel={
            !user
              ? 'Prisijungti'
              : currentPlan === 'free'
                ? 'Dabartinis planas'
                : 'Dabartinis planas'
          }
          actionDisabled={!!user}
          onAction={!user ? () => void signInWithGoogle() : undefined}
        />

        <PlanCard
          name="PRO"
          tagline="Visos funkcijos su mėnesiniais limitais"
          price="6,99 €"
          period="/ mėn."
          features={proFeatures}
          highlight
          badge="POPULARIAUSIAS"
          current={currentPlan === 'pro'}
          actionLabel={
            currentPlan === 'pro'
              ? 'Dabartinis planas'
              : currentPlan === 'unlimited'
                ? 'Įtraukta į Unlimited'
                : showProCheckout
                  ? 'Slėpti'
                  : 'Užsisakyti'
          }
          actionDisabled={currentPlan === 'pro' || currentPlan === 'unlimited'}
          onAction={() => {
            if (currentPlan === 'pro' || currentPlan === 'unlimited') return;
            setShowUnlimitedCheckout(false);
            setShowProCheckout((v) => !v);
          }}
        />

        <PlanCard
          name="UNLIMITED"
          tagline="Be mėnesinių limitų"
          price="9,99 €"
          period="/ mėn."
          features={unlimitedFeatures}
          highlight
          accent="violet"
          current={currentPlan === 'unlimited'}
          actionLabel={
            currentPlan === 'unlimited'
              ? 'Dabartinis planas'
              : showUnlimitedCheckout
                ? 'Slėpti'
                : 'Užsisakyti'
          }
          actionDisabled={currentPlan === 'unlimited'}
          onAction={() => {
            if (currentPlan === 'unlimited') return;
            setShowProCheckout(false);
            setShowUnlimitedCheckout((v) => !v);
          }}
        />
      </div>

      {showProCheckout && currentPlan !== 'pro' && currentPlan !== 'unlimited' && (
        <div className="mt-8 max-w-xl mx-auto">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
              <Calendar size={22} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Mėnesinis PRO</h4>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                6,99 € <span className="text-sm font-normal text-slate-500">/ mėn.</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">Galioja 30 dienų nuo pirkimo. Automatiškai atsinaujina.</p>
            </div>
            <button
              type="button"
              disabled={checkoutLoading !== null}
              onClick={() => startCheckout('PRO mėnesinis')}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition flex items-center justify-center gap-2"
            >
              {checkoutLoading === 'PRO mėnesinis' ? <Loader2 size={16} className="animate-spin" /> : null}
              Pasirinkti ir mokėti
            </button>
          </div>
        </div>
      )}

      {showUnlimitedCheckout && currentPlan !== 'unlimited' && (
        <div className="mt-8 max-w-xl mx-auto">
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100 text-violet-600 flex-shrink-0">
              <Calendar size={22} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Mėnesinis Unlimited</h4>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                9,99 € <span className="text-sm font-normal text-slate-500">/ mėn.</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">Galioja 30 dienų nuo pirkimo. Automatiškai atsinaujina.</p>
            </div>
            <button
              type="button"
              disabled={checkoutLoading !== null}
              onClick={() => startCheckout('UNLIMITED mėnesinis')}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 transition flex items-center justify-center gap-2"
            >
              {checkoutLoading === 'UNLIMITED mėnesinis' ? <Loader2 size={16} className="animate-spin" /> : null}
              Pasirinkti ir mokėti
            </button>
          </div>
        </div>
      )}

      <div id="limit-topup" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
            <Plus size={22} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800">Papildomas limitų paketas</h4>
            <p className="text-sm text-slate-600 mt-1">
              Pasibaigus PRO mėnesiniams limitams galite įsigyti papildomą paketą. Likę kreditai perkeliami į kitą mėnesį.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              disabled
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-200 text-amber-700 cursor-not-allowed"
            >
              Jau greitai
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-10">
        Kainos nurodytos su PVM. Mokėjimai apdorojami per Stripe.
      </p>
    </div>
  );
};

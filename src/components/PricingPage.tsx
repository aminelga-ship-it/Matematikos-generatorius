import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  FileText,
  FileType2,
  Pencil,
  Zap,
  Triangle,
  LineChart,
  Plus,
  ArrowLeft,
  Calendar,
  Infinity as InfinityIcon,
} from 'lucide-react';

type PlanKey = 'guest' | 'free' | 'pro';

interface FeatureRow {
  label: string;
  guest: string | boolean;
  free: string | boolean;
  pro: string | boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  { label: 'Prisijungimas', guest: 'Nereikia', free: 'Reikalingas', pro: 'Reikalingas' },
  { label: 'Užklausų limitas', guest: '3 iš viso', free: '3 per dieną', pro: 'Be dienos limito' },
  { label: 'Mėnesinis limitas', guest: '—', free: '10 užklausų / mėn.', pro: '100 užklausų / mėn.' },
  { label: 'Užduočių limitas', guest: '1 per generaciją', free: '1 per generatiją', pro: '30 per generaciją' },
  { label: 'Mėnesinis užduočių limitas', guest: '—', free: '—', pro: '300 užduočių / mėn.' },
  { label: 'Geometrijos brėžiniai', guest: true, free: true, pro: true },
  { label: 'GeoGebra grafikai', guest: true, free: true, pro: true },
  { label: 'Nuotraukos įkėlimas', guest: false, free: false, pro: true },
  { label: 'Užduočių redagavimas', guest: false, free: false, pro: true },
  { label: 'PDF eksportas', guest: false, free: false, pro: true },
  { label: 'Word (.docx) eksportas', guest: false, free: false, pro: true },
  { label: 'Prioritetinis AI generavimas', guest: false, free: false, pro: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={16} className="text-emerald-500" />;
  if (value === false) return <X size={16} className="text-slate-300" />;
  return <span className="text-sm text-slate-600">{value}</span>;
}

const PlanCard: React.FC<{
  name: string;
  tagline: string;
  price: string;
  period?: string;
  note?: string;
  features: { text: string; included: boolean }[];
  highlight?: boolean;
  current?: boolean;
  badge?: string;
  onAction?: () => void;
  actionLabel: string;
  actionDisabled?: boolean;
}> = ({ name, tagline, price, period, note, features, highlight, current, badge, onAction, actionLabel, actionDisabled }) => {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white transition-all duration-300 ${
        highlight
          ? 'border-blue-500 shadow-xl shadow-blue-100 scale-[1.02] ring-2 ring-blue-500/20'
          : 'border-slate-200 shadow-sm hover:shadow-md'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600 shadow-sm">
          {badge}
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-bold ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>{name}</h3>
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
          onClick={onAction}
          disabled={actionDisabled}
          className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-sm transition ${
            actionDisabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : highlight
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export const PricingPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, profile } = useAuth();

  const currentPlan: PlanKey = !user ? 'guest' : profile?.plan === 'pro' ? 'pro' : 'free';

  const guestFeatures = [
    { text: 'Iki 3 užklausų iš viso', included: true },
    { text: 'Po 1 užduotį per generatiją', included: true },
    { text: 'Geometrijos brėžiniai', included: true },
    { text: 'GeoGebra grafikai', included: true },
    { text: 'Nuotraukos įkėlimas', included: false },
    { text: 'Užduočių redagavimas', included: false },
    { text: 'Spausdinimas / eksportas', included: false },
  ];

  const freeFeatures = [
    { text: '3 užklausos per dieną', included: true },
    { text: '10 užklausų per mėnesį', included: true },
    { text: 'Po 1 užduotį per generatiją', included: true },
    { text: 'Geometrijos brėžiniai', included: true },
    { text: 'GeoGebra grafikai', included: true },
    { text: 'Nuotraukos įkėlimas', included: false },
    { text: 'Užduočių redagavimas', included: false },
    { text: 'Spausdinimas / eksportas', included: false },
  ];

  const proFeatures = [
    { text: 'Be dienos limito', included: true },
    { text: '100 užklausų / 300 užduočių per mėn.', included: true },
    { text: 'Iki 30 užduočių per generatiją', included: true },
    { text: 'Nuotraukos įkėlimas', included: true },
    { text: 'Užduočių redagavimas', included: true },
    { text: 'PDF eksportas', included: true },
    { text: 'Word (.docx) eksportas', included: true },
    { text: 'Prioritetinis AI generavimas', included: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition"
        >
          <ArrowLeft size={18} />
          Atgal
        </button>
        <span className="text-lg font-bold text-indigo-600">MatematikaAI</span>
        <div className="w-16" />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-slate-800">Planai ir kainos</h1>
          <p className="text-slate-500 mt-3 text-lg">
            Pasirink tinkamiausią planą. Galite pradėti nemokamai ir bet kada atsinaujinti į PRO.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <PlanCard
            name="GUEST"
            tagline="Neprisijungusiems"
            price="0 €"
            period="nemokamai"
            features={guestFeatures}
            current={currentPlan === 'guest'}
            actionLabel={currentPlan === 'guest' ? 'Dabartinis planas' : 'Nereikia prisijungti'}
            actionDisabled={true}
          />

          <PlanCard
            name="FREE"
            tagline="Prisijungusiems nemokamai"
            price="0 €"
            period="nemokamai"
            features={freeFeatures}
            current={currentPlan === 'free'}
            actionLabel={currentPlan === 'free' ? 'Dabartinis planas' : currentPlan === 'guest' ? 'Prisijungti' : 'Dabartinis planas'}
            actionDisabled={currentPlan !== 'guest'}
            onAction={currentPlan === 'guest' ? onBack : undefined}
          />

          <PlanCard
            name="PRO"
            tagline="Visos funkcijos be apribojimų"
            price="6.99 €"
            period="/ mėn."
            note="Mokslo metų planas: 29.99 € (galioja iki 2027-06-30)"
            features={proFeatures}
            highlight
            badge="POPULARIAUSIAS"
            current={currentPlan === 'pro'}
            actionLabel={currentPlan === 'pro' ? 'Dabartinis planas' : 'Atnaujinti į PRO'}
            actionDisabled={currentPlan === 'pro'}
          />
        </div>

        {/* PRO payment options */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Calendar size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Mėnesinis PRO</h4>
              <p className="text-2xl font-bold text-slate-800 mt-1">6.99 € <span className="text-sm font-normal text-slate-500">/ mėn.</span></p>
              <p className="text-sm text-slate-500 mt-1">Galioja 30 dienų nuo pirkimo datos. Automatiškai atsinaujina.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <Calendar size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Mokslo metų PRO</h4>
              <p className="text-2xl font-bold text-slate-800 mt-1">29.99 € <span className="text-sm font-normal text-slate-500">/ mokslo metus</span></p>
              <p className="text-sm text-slate-500 mt-1">Fiksuota galiojimo data: 2027-06-30, nepriklausomai nuo pirkimo datos.</p>
            </div>
          </div>
        </div>

        {/* Top-up / additional credits */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
              <Plus size={22} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Papildomas limitų paketas</h4>
              <p className="text-sm text-slate-600 mt-1">
                Pasibaigus mėnesiniams limitams galite bet kada įsigyti papildomą paketą už <strong>6.99 €</strong>.
                Likę kreditai susikaupia ir perkeliami į kitą mėnesį — galėsite naudoti po 1, 2, 3 ar daugiau mėnesių.
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

        {/* Comparison table */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Funkcijų palyginimas</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Funkcija</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">GUEST</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">FREE</th>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-700 text-center bg-blue-50/50">PRO</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{row.label}</td>
                    <td className="px-6 py-3.5 text-center"><CellValue value={row.guest} /></td>
                    <td className="px-6 py-3.5 text-center"><CellValue value={row.free} /></td>
                    <td className="px-6 py-3.5 text-center bg-blue-50/30"><CellValue value={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
};

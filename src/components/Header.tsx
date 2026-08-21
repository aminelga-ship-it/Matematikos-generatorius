import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PLAN_LIMITS } from '../lib/planLimits';
import { Crown, Tag, Loader2, Mail, LogIn, Shield, HelpCircle, Pi } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-2.5 tracking-tight">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Pi size={20} className="text-white" strokeWidth={2.25} />
      </div>
      <span className="text-xl font-bold">
        <span className="text-slate-800">Matematika</span>
        <span className="text-violet-600">AI</span>
      </span>
    </div>
  );
}

function getFirstName(fullName: string | null, email: string | null): string {
  if (fullName && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }
  if (email) {
    const localPart = email.split('@')[0];
    const cleaned = localPart
      .replace(/[._0-9]/g, ' ')
      .trim()
      .split(/\s+/)[0];
    if (cleaned) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return localPart;
  }
  return 'Naudotojau';
}

function usageDayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function usageMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function profileUsageLabel(profile: {
  plan: string;
  role?: string | null;
  used_requests: number;
  used_tasks: number;
  requests_today?: number;
  usage_day?: string | null;
  requests_month?: number;
  tasks_month?: number;
  usage_month?: string | null;
  secondary_month?: number;
  bonus_requests?: number;
  bonus_tasks?: number;
  bonus_secondary?: number;
}): { primary: string; secondary: string; bonus?: string } {
  const today = usageDayKey();
  const month = usageMonthKey();
  const reqToday = profile.usage_day === today ? (profile.requests_today ?? 0) : 0;
  const reqMonth =
    profile.usage_month === month
      ? (profile.requests_month ?? 0)
      : 0;
  const tasksMonth =
    profile.usage_month === month
      ? (profile.tasks_month ?? 0)
      : 0;
  const secondaryMonth =
    profile.usage_month === month
      ? (profile.secondary_month ?? 0)
      : 0;

  if (profile.plan === "unlimited" || profile.role === "admin") {
    return {
      primary: "Neriboti generavimai",
      secondary: "Antriniai: neriboti",
    };
  }

  if (profile.plan === "pro") {
    const bonusReq = profile.bonus_requests ?? 0;
    const bonusTasks = profile.bonus_tasks ?? 0;
    const bonusSec = profile.bonus_secondary ?? 0;
    const hasBonus = bonusReq > 0 || bonusTasks > 0 || bonusSec > 0;

    return {
      primary: `Užklausos: ${reqMonth}/${PLAN_LIMITS.pro.maxRequestsPerMonth} (mėn.)`,
      secondary: `Antriniai: ${secondaryMonth}/${PLAN_LIMITS.pro.maxSecondaryPerMonth} · Užduotys: ${tasksMonth}/${PLAN_LIMITS.pro.maxTasksPerMonth}`,
      bonus: hasBonus
        ? `Papildomi: ${bonusReq} užklausos · ${bonusTasks} užduotys · ${bonusSec} antriniai`
        : undefined,
    };
  }
  return {
    primary: `Šiandien: ${reqToday}/${PLAN_LIMITS.free.maxRequestsPerDay}`,
    secondary: `Mėnuo: ${reqMonth}/${PLAN_LIMITS.free.maxRequestsPerMonth} · Antriniai: ${secondaryMonth}/${PLAN_LIMITS.free.maxSecondaryPerMonth}`,
  };
}

function LoginMenu({ onClose }: { onClose: () => void }) {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSending(true);
    try {
      await signInWithEmail(email);
      setEmailSent(true);
    } catch (err) {
      setEmailSent(false);
      setEmailError(err instanceof Error ? err.message : 'Nepavyko išsiųsti nuorodos.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-slate-200 bg-white shadow-lg p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Pasirinkite būdą
      </p>
      <button
        type="button"
        onClick={() => {
          void signInWithGoogle();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-lg font-medium text-sm transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Google
      </button>

      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] text-slate-400 font-medium">arba</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-2">
        <div className="relative">
          <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="email"
            autoComplete="email"
            placeholder="El. paštas"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailSent(false);
              setEmailError(null);
            }}
            disabled={emailSending}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <button
          type="submit"
          disabled={emailSending || !email.trim()}
          className="w-full py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition flex items-center justify-center gap-1.5"
        >
          {emailSending ? <Loader2 size={14} className="animate-spin" /> : null}
          Siųsti prisijungimo nuorodą
        </button>
      </form>

      {emailSent && (
        <p className="text-xs text-emerald-600 mt-2">Nuoroda išsiųsta — patikrinkite el. paštą.</p>
      )}
      {emailError && <p className="text-xs text-red-600 mt-2">{emailError}</p>}
    </div>
  );
}

export const Header: React.FC<{
  onOpenPricing?: () => void;
  pricingOpen?: boolean;
  onOpenGuide?: () => void;
  guideOpen?: boolean;
  onOpenAdmin?: () => void;
  adminOpen?: boolean;
}> = ({ onOpenPricing, pricingOpen, onOpenGuide, guideOpen, onOpenAdmin, adminOpen }) => {
  const { user, profile, signOut, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loginOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [loginOpen]);

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <Logo />
        <div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />
      </header>
    );
  }

  const isLoggedIn = !!user;
  const firstName = getFirstName(profile?.full_name ?? null, profile?.email ?? user?.email ?? null);
  const planLabel = !user
    ? '—'
    : profile?.role === 'admin'
      ? 'UNLIMITED'
      : profile?.plan === 'unlimited'
        ? 'UNLIMITED'
        : profile?.plan === 'pro'
          ? 'PRO'
          : 'FREE';
  const isUnlimitedBadge =
    profile?.role === 'admin' || profile?.plan === 'unlimited';
  const isProBadge = profile?.plan === 'pro' && profile?.role !== 'admin';
  const badgeClass = isUnlimitedBadge
    ? 'bg-violet-100 text-violet-700'
    : isProBadge
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-gray-200 text-gray-700';
  const showUsageStats = profile && !isUnlimitedBadge;

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Logo />
        <button
          type="button"
          onClick={onOpenPricing}
          className={`ml-1 sm:ml-2 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
            pricingOpen
              ? 'text-indigo-700 bg-indigo-50'
              : 'text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50'
          }`}
        >
          <Tag size={13} />
          {pricingOpen ? 'Generatorius' : 'Planai'}
        </button>
        {onOpenGuide && (
          <>
          <button
            type="button"
            onClick={onOpenGuide}
            title="Kaip tinkamai generuoti užduotis?"
            className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition max-w-[11rem] md:max-w-none ${
              guideOpen
                ? 'text-blue-700 bg-blue-50'
                : 'text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50'
            }`}
          >
            <HelpCircle size={13} className="flex-shrink-0" />
            <span className="truncate md:whitespace-normal">
              {guideOpen ? 'Generatorius' : 'Kaip tinkamai generuoti užduotis?'}
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenGuide}
            title="Kaip tinkamai generuoti užduotis?"
            className={`sm:hidden flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
              guideOpen
                ? 'text-blue-700 bg-blue-50'
                : 'text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50'
            }`}
          >
            <HelpCircle size={13} />
            {guideOpen ? 'Generatorius' : 'Pagalba'}
          </button>
          </>
        )}
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
              adminOpen
                ? 'text-violet-700 bg-violet-50'
                : 'text-slate-500 hover:text-violet-600 bg-slate-100 hover:bg-violet-50'
            }`}
          >
            <Shield size={13} />
            {adminOpen ? 'Generatorius' : 'Admin'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 min-w-0">
        {isLoggedIn ? (
          <div className="flex items-center gap-3 sm:gap-4 text-sm min-w-0">
            {profile && (
              isUnlimitedBadge ? (
                <span
                  className={`hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}
                >
                  <Crown size={11} />
                  {planLabel}
                </span>
              ) : (
                <div className="hidden lg:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}>
                    {isProBadge && <Crown size={11} />}
                    {planLabel}
                  </span>
                  {showUsageStats && (() => {
                    const u = profileUsageLabel(profile);
                    return (
                      <>
                        <span>{u.primary}</span>
                        <span className="text-gray-300">|</span>
                        <span>{u.secondary}</span>
                        {u.bonus && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-amber-700 font-medium">{u.bonus}</span>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              )
            )}

            <span className="text-gray-700 font-medium flex items-center gap-2 truncate">
              <span className="hidden sm:inline">Sveikas,</span>
              <span className="text-indigo-600 font-semibold truncate">{firstName}</span>
              <span className={`lg:hidden flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${badgeClass}`}>
                {(isProBadge || isUnlimitedBadge) && <Crown size={11} />}
                {planLabel}
              </span>
            </span>

            <button
              type="button"
              onClick={signOut}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium transition flex-shrink-0"
            >
              Atsijungti
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative" ref={loginRef}>
              <button
                type="button"
                onClick={() => setLoginOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <LogIn size={16} />
                Prisijungti
              </button>
              {loginOpen && <LoginMenu onClose={() => setLoginOpen(false)} />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

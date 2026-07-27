import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Crown, Tag } from 'lucide-react';

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

export const Header: React.FC<{ onOpenPricing?: () => void }> = ({ onOpenPricing }) => {
  const { user, profile, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <span className="text-xl font-bold text-indigo-600">MatematikaAI</span>
        <div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />
      </header>
    );
  }

  const isLoggedIn = !!user;
  const firstName = getFirstName(profile?.full_name ?? null, profile?.email ?? user?.email ?? null);
  const planLabel = !user ? 'GUEST' : profile?.plan === 'pro' ? 'PRO' : 'FREE';
  const isPro = profile?.plan === 'pro';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-indigo-600">MatematikaAI</span>
        <button
          onClick={onOpenPricing}
          className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition"
        >
          <Tag size={13} />
          Planai
        </button>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4 text-sm">
            {profile && (
              <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {isPro && <Crown size={11} />}
                  {planLabel}
                </span>
                <span>
                  Užklausos: <strong>{profile.used_requests}</strong>/{isPro ? 100 : 3}
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  Užduotys: <strong>{profile.used_tasks}</strong>/{isPro ? 300 : 3}
                </span>
              </div>
            )}

            <span className="text-gray-700 font-medium flex items-center gap-2">
              Sveikas, <span className="text-indigo-600 font-semibold">{firstName}</span>!
              <span className={`md:hidden flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {isPro && <Crown size={11} />}
                {planLabel}
              </span>
            </span>

            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium transition"
            >
              Atsijungti
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
              {planLabel}
            </span>
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Prisijungti su Google
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

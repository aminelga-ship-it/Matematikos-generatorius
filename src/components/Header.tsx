import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, profile, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-indigo-600">MatematikaAI</span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4 text-sm">
            {/* Limitų rodymas pagal tavo taisykles */}
            {profile && (
              <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-3 text-gray-700">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  profile.plan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {profile.plan.toUpperCase()}
                </span>
                <span>
                  Užklausos: <strong>{profile.used_requests}</strong>/{profile.plan === 'pro' ? 100 : 3}
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  Užduotys: <strong>{profile.used_tasks}</strong>/{profile.plan === 'pro' ? 300 : 3}
                </span>
              </div>
            )}

            {profile?.email && (
              <span className="text-gray-600 hidden sm:inline">{profile.email}</span>
            )}

            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium transition"
            >
              Atsijungti
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:inline">Svečio režimas</span>
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
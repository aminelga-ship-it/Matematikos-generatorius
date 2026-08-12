import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getAuthRedirectUrl, getSupabaseProjectRef } from '../lib/siteUrl';
import type { User } from '@supabase/supabase-js';

import type { UserRole } from '../lib/types';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: 'free' | 'pro' | 'unlimited';
  used_requests: number;
  used_tasks: number;
  requests_today?: number;
  usage_day?: string | null;
  requests_month?: number;
  tasks_month?: number;
  usage_month?: string | null;
  role: UserRole | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Klaida gaunant profilį:', error);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data);
    } else {
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Klaida kuriant profilį:', insertError);
        setProfile(null);
      } else {
        setProfile(created);
      }
    }
  };

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await fetchProfile(session.user.id);
        })();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const redirectTo = getAuthRedirectUrl();

    if (import.meta.env.DEV) {
      const ref = getSupabaseProjectRef();
      console.info(
        `[MatematikaAI] Google OAuth redirectTo: ${redirectTo}` +
          (ref ? ` | Supabase projektas: ${ref}` : "") +
          " — šis URL turi būti Redirect URLs sąraše Supabase dashboard.",
      );
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: false,
      },
    });
    if (error) throw error;

    if (import.meta.env.DEV && data?.url && !data.url.includes(encodeURIComponent(redirectTo))) {
      console.warn(
        "[MatematikaAI] OAuth URL galimai neįtraukia redirectTo — patikrinkite Supabase Redirect URLs.",
        data.url,
      );
    }
  };

  const signInWithEmail = async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      throw new Error("Įveskite el. pašto adresą.");
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    refetchProfile: () => user && fetchProfile(user.id),
  };
}

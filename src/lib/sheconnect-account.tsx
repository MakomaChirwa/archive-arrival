import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const AccountContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    let generation = 0;
    async function verify() {
      const current = ++generation;
      const { data } = await supabase.auth.getUser();
      if (active && current === generation) { setUser(data.user); setLoading(false); }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(event)) return;
      if (event === 'SIGNED_OUT') {
        generation++;
        setUser(null); setLoading(false);
        void queryClient.cancelQueries().then(() => queryClient.clear());
        void router.invalidate();
      } else {
        // Keep network requests outside the auth callback's lock.
        window.setTimeout(() => { void verify().then(() => { void router.invalidate(); void queryClient.invalidateQueries(); }); }, 0);
      }
    });
    void verify();
    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient, router]);
  return <AccountContext.Provider value={{ user, loading }}>{children}</AccountContext.Provider>;
}
export function useAccount() { return useContext(AccountContext); }
export function usePersonalData() {
  const { user } = useAccount();
  const profile = useQuery({ queryKey: ['profile', user?.id], enabled: Boolean(user), queryFn: async () => {
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return data;
  } });
  const progress = useQuery({ queryKey: ['progress', user?.id], enabled: Boolean(user), queryFn: async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('learning_progress').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data;
  } });
  return { profile, progress };
}
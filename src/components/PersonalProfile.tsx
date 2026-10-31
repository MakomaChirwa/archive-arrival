import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAccount, usePersonalData } from '@/lib/sheconnect-account';
import { useLanguage, parseLanguage } from '@/lib/sheconnect-language';
import { supabase } from '@/integrations/supabase/client';
import { curriculum, completionPercent, type PathId } from '@/lib/learning';

export function PersonalProfile({ openPath, saver, setSaver }: { openPath: (id: PathId) => void; saver: boolean; setSaver: (v: boolean) => void }) {
  const { user, loading } = useAccount(); const { profile, progress } = usePersonalData(); const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate(); const queryClient = useQueryClient(); const [name, setName] = useState(''); const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (profile.data) { setName(profile.data.display_name); setLanguage(parseLanguage(profile.data.language)); setSaver(profile.data.data_saver); } }, [profile.data]);
  if (loading || (user && (profile.isLoading || progress.isLoading))) return <p role="status">{t('Please wait…')}</p>;
  if (!user) return <div className="narrow-page"><div className="page-head"><h1>{t('Profile & progress')}</h1></div><Button onClick={() => navigate({ to: '/auth' })}>{t('Log in')}</Button><Button variant="link" onClick={() => navigate({ to: '/auth', search: { mode: 'register' } })}>{t('Create your free profile')}</Button></div>;
  const rows = progress.data ?? [];
  return <div><div className="profile-head"><div className="profile-avatar">{(name || user.email || 'S').slice(0, 2).toUpperCase()}</div><div><span className="eyebrow">{t('MY PROFILE')}</span><h1>{t('Hi')}, {name || t('Welcome')}</h1></div></div>
    {(profile.error || progress.error) && <p role="alert" className="error-message">{t('Could not load your saved data. Please try again.')} <Button variant="link" onClick={() => { void profile.refetch(); void progress.refetch(); }}>{t('Try again')}</Button></p>}
    <div className="stat-grid"><div className="card"><strong>{rows.length}</strong><span>{t('Steps completed')}</span></div><div className="card"><strong>{Math.round(rows.length / 12 * 100)}%</strong><span>{t('Overall progress')}</span></div><div className="card"><strong>{curriculum.filter(p => completionPercent(rows, p.id) === 100).length}</strong><span>{t('Paths completed')}</span></div></div>
    <section className="section-block"><h2>{t('Learning progress')}</h2><div className="learning-list">{curriculum.map(path => { const value = completionPercent(rows, path.id); return <div className="card learning-card" key={path.id}><div className="learning-copy"><h3>{t(path.title)} {t('foundations')}</h3><progress className="w-full accent-primary" max={100} value={value} aria-label={t(path.title)} /><p>{value}% · {value / 25}/4 {t('Steps completed')}</p></div><Button className="button button-secondary whitespace-normal h-auto" onClick={() => openPath(path.id)}>{t('Track progress')}</Button></div>; })}</div></section>
    <section className="section-block"><h2>{t('Settings')}</h2><form className="form-card" onSubmit={async e => { e.preventDefault(); setBusy(true); setStatus(''); const { error } = await supabase.from('profiles').update({ display_name: name.trim(), language, data_saver: saver }).eq('id', user.id); setBusy(false); setStatus(t(error ? 'Could not save your profile. Please try again.' : 'Profile saved.')); if (!error) void queryClient.invalidateQueries({ queryKey: ['profile', user.id] }); }}>
      <label className="field"><span>{t('Name or nickname')}</span><input value={name} onChange={e => setName(e.target.value)} required maxLength={80} /></label>
      <label className="field"><span>{t('Language')}</span><select value={language} onChange={e => setLanguage(parseLanguage(e.target.value))}><option value="English">English</option><option value="Sepedi">Sepedi</option></select></label>
      <label><input type="checkbox" checked={saver} onChange={e => setSaver(e.target.checked)} /> {t('Data saver mode')}</label>
      <p role="status">{status}</p><Button type="submit" disabled={busy}>{t('Save profile')}</Button>
    </form></section><Button variant="outline" onClick={async () => { setStatus(''); await queryClient.cancelQueries(); queryClient.clear(); const { error } = await supabase.auth.signOut(); if (error) { setStatus(t(error.message)); return; } await navigate({ to: '/auth', replace: true }); }}>{t('Log out')}</Button>
  </div>;
}
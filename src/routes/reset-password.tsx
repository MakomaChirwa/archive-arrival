import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/sheconnect-language';
export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [{ title: 'Reset your password — SheConnect' }, { name: 'description', content: 'Securely reset your SheConnect account password.' }, { property: 'og:title', content: 'SheConnect password reset' }, { property: 'og:description', content: 'Choose a new password for your account.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const { t } = useLanguage(); const [recovery, setRecovery] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  useEffect(() => { setRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); }, []);
  return <div className="app"><main className="narrow-page p-6"><h1>{t('Reset your password')}</h1>{!recovery ? <p>{t('Open the password reset link from your email.')} <Link to="/auth">{t('Log in')}</Link></p> : <form className="form-card" onSubmit={async e => {
    e.preventDefault(); const fields = new FormData(e.currentTarget); const password = String(fields.get('password')); if (password !== fields.get('confirm')) { setMessage(t('Passwords do not match.')); return; }
    setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setBusy(false); setMessage(t(error?.message ?? 'Your password has been updated.')); setDone(!error);
  }}><label className="field"><span>{t('New password')}</span><input name="password" type="password" required minLength={8} autoComplete="new-password" /></label><label className="field"><span>{t('Confirm password')}</span><input name="confirm" type="password" required minLength={8} autoComplete="new-password" /></label><p role="status">{message}</p><Button type="submit" disabled={busy || done}>{t('Save password')}</Button>{done && <Link to="/profile">{t('View my profile & progress')}</Link>}</form>}</main></div>;
}
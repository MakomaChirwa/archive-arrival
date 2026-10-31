import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useLanguage } from '@/lib/sheconnect-language';
import '@lovable.dev/cloud-auth-js/styles.css';

export function AccountForm({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email') ?? '').trim();
    const password = String(fields.get('password') ?? '');
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage(t('Check your email for a password reset link.'));
      } else if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: {
          display_name: String(fields.get('name') ?? '').trim(), education: fields.get('education'), interests: fields.getAll('interests'), language,
        } } });
        if (error) throw error;
        if (data.session) await navigate({ to: '/profile' });
        else setMessage(t('Check your email to confirm your account, then log in.'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: '/profile' });
      }
    } catch (e) { setError(e instanceof Error ? t(e.message) : t('Something went wrong. Please try again.')); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'lovable') {
    setError(''); setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: '/profile' });
    } catch (e) { setError(e instanceof Error ? t(e.message) : t('Something went wrong. Please try again.')); }
    finally { setBusy(false); }
  }
  return <div className="app"><main className="narrow-page p-6"><Link to="/" className="back-link">← SheConnect</Link><div className="page-head"><h1>{t(mode === 'register' ? 'Create your free profile' : mode === 'forgot' ? 'Reset your password' : 'Log in')}</h1></div>
    <form className="form-card" onSubmit={submit}>
      {mode === 'register' && <><label className="field"><span>{t('Name or nickname')}</span><input name="name" required autoComplete="nickname" maxLength={80} /></label><label className="field"><span>{t('Where are you in your journey?')}</span><select name="education" defaultValue=""><option value="">{t('Choose your education level')}</option>{['Grade 10–12', 'University or college student', 'Graduate or looking for work', 'Early in my career'].map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label><fieldset><legend>{t('What are you interested in?')}</legend><div className="check-grid">{['Design & creativity', 'Solving problems', 'Working with data', 'Helping people', 'Building things', 'I’m not sure yet'].map(value => <label key={value}><input type="checkbox" name="interests" value={value} /> {t(value)}</label>)}</div></fieldset></>}
      <label className="field"><span>{t('Email')}</span><input name="email" type="email" required autoComplete="email" /></label>
      {mode !== 'forgot' && <label className="field"><span>{t('Password')}</span><input name="password" type="password" required minLength={8} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>}
      {mode === 'register' && <label className="consent"><input type="checkbox" required /><span>{t('I agree to SheConnect using my answers to personalise my experience.')}</span></label>}
      {error && <p role="alert" className="error-message">{error}</p>}{message && <p role="status">{message}</p>}
      <Button type="submit" disabled={busy} className="button button-primary full whitespace-normal h-auto">{t(busy ? 'Please wait…' : mode === 'register' ? 'Register' : mode === 'forgot' ? 'Send reset link' : 'Log in')}</Button>
      {mode !== 'forgot' && <><Button type="button" variant="outline" disabled={busy} className="full" onClick={() => social('google')}>{t('Continue with Google')}</Button><Button type="button" variant="ghost" disabled={busy} className="lovable-auth-button full" onClick={() => social('lovable')}>{t('Continue with Lovable')}</Button></>}
      <Button type="button" variant="link" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); setMessage(''); }}>{t(mode === 'register' ? 'Already registered? Log in' : 'Create your free profile')}</Button>
      {mode === 'login' && <Button type="button" variant="link" onClick={() => { setMode('forgot'); setMessage(''); setError(''); }}>{t('Forgot password?')}</Button>}
    </form></main></div>;
}
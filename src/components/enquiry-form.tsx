'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { validateEnquiry } from '@/lib/enquiry';
export function EnquiryForm({ email }: { email: string }) {
  const [status,setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [errors,setErrors] = useState<Record<string,string>>({});
  const [message,setMessage] = useState('');
  const [mailLink,setMailLink] = useState('mailto:' + email);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const checked = validateEnquiry(values);
    setErrors(checked.errors);
    if (!checked.data) {
      setStatus('error'); setMessage('Check the highlighted fields.');
      const first = form.elements.namedItem(Object.keys(checked.errors)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    const data = checked.data;
    setMailLink('mailto:' + email + '?subject=' + encodeURIComponent(data.interest + ' enquiry from ' + data.name) + '&body=' + encodeURIComponent(data.message + '\n\nFrom: ' + data.name + '\nEmail: ' + data.email));
    setStatus('sending'); setMessage('');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(15_000) });
      const result = await response.json();
      if (!response.ok) { setErrors(result.errors || {}); throw new Error(result.message || 'Could not send. Please try again or email directly.'); }
      setStatus('success'); setMessage(result.message); form.reset();
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Could not send. Please email directly.'); }
  }
  return <form className="enquiry-form" onSubmit={submit} noValidate><h2>Project enquiry</h2>
    <div className="form-field"><label htmlFor="enquiry-name">Your name</label><input id="enquiry-name" name="name" autoComplete="name" required maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <p className="form-error" id="name-error">{errors.name}</p>}</div>
    <div className="form-field"><label htmlFor="enquiry-email">Email address</label><input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <p className="form-error" id="email-error">{errors.email}</p>}</div>
    <fieldset><legend>Project interest</legend><div className="interest-options">{['Architecture','Interiors','BIM','Other'].map((interest,i) => <label key={interest}><input type="radio" name="interest" value={interest} defaultChecked={i===0} />{interest}</label>)}</div></fieldset>
    <div className="form-field"><label htmlFor="enquiry-message">Message</label><textarea id="enquiry-message" name="message" rows={5} required maxLength={4000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <p className="form-error" id="message-error">{errors.message}</p>}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="enquiry-website">Website</label><input id="enquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-submit"><button className="button" type="submit" disabled={status==='sending'}>{status==='sending' ? 'Sending…' : 'Send enquiry'}<ArrowUpRight size={20} strokeWidth={1.2} /></button><small>Your details are used to respond to your enquiry.</small></div>
    <div aria-live="polite" aria-atomic="true">{message && <p className={'form-status ' + status}>{message}{status==='error' && <><br /><a href={mailLink}>Email directly ↗</a></>}</p>}</div>
  </form>;
}

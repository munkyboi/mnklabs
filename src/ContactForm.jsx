import { useRef, useState } from 'react';

export function ContactForm() {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const submission = useRef(null);
  const feedback = useRef(null);
  async function submit(event) {
    event.preventDefault();
    if (state === 'sending') return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const signature = JSON.stringify(values);
    if (submission.current?.signature !== signature) submission.current = { signature, id: crypto.randomUUID() };
    setState('sending'); setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submission.current.id }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'We couldn’t send your enquiry. Please try again.');
      setState('sent'); form.reset(); submission.current = null;
    } catch (failure) { setState('error'); setError(failure.name === 'TimeoutError' ? 'We couldn’t confirm your enquiry. Try again; your message will not be duplicated.' : failure.message); }
    requestAnimationFrame(() => feedback.current?.focus());
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-field"><label htmlFor="contact-name">Your name <span>(required)</span></label><input id="contact-name" name="name" autoComplete="name" minLength={2} maxLength={100} required/></div>
    <div className="form-field"><label htmlFor="contact-email">Email address <span>(required)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required/></div>
    <div className="form-field"><label htmlFor="contact-company">Company <span>(optional)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength={150}/></div>
    <div className="form-field"><label htmlFor="contact-message">Tell us about your project <span>(required)</span></label><textarea id="contact-message" name="message" rows={6} minLength={20} maxLength={5000} required aria-describedby="message-hint"/><p id="message-hint" className="field-hint">Share your idea, the problem you’re solving, and what you want to achieve.</p></div>
    <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <p className="form-privacy">We’ll use these details to respond to your enquiry.</p>
    <button className="btn primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending your enquiry…' : 'Send enquiry'}</button>
    <div ref={feedback} tabIndex={-1} className={`form-feedback ${state}`} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">{state === 'sent' ? 'Thank you. Your enquiry has been sent to MNK Labs.' : error}</div>
  </form>;
}

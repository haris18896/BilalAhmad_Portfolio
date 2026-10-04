import { validateEnquiry } from '@/lib/enquiry';

// ponytail: per-process abuse protection; use a shared limiter when deploying across instances.
const requests = new Map<string,{ count: number; reset: number }>();
export async function POST(request: Request) {
  const allowedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (request.headers.get('origin') !== allowedOrigin) return Response.json({ message: 'This request could not be verified.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ message: 'Expected a JSON request.' }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ message: 'Enter your enquiry details.' }, { status: 400 });
  let raw = '', size = 0;
  const decoder = new TextDecoder();
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.length;
    if (size > 8192) { await reader.cancel(); return Response.json({ message: 'Your enquiry is too long.' }, { status: 413 }); }
    raw += decoder.decode(chunk.value, { stream: true });
  }
  raw += decoder.decode();
  let input;
  try { input = JSON.parse(raw); } catch { return Response.json({ message: 'Check your enquiry details.' }, { status: 400 }); }
  if (input?.website) return Response.json({ message: 'This request could not be verified.' }, { status: 400 });
  const validated = validateEnquiry(input);
  if (!validated.data) return Response.json({ errors: validated.errors, message: 'Check the highlighted fields.' }, { status: 400 });
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) return Response.json({ message: 'Please email directly to send your enquiry. Your message has been kept below.' }, { status: 503 });
  let url: URL;
  try { url = new URL(endpoint); } catch { return Response.json({ message: 'Please email directly. Your message has been kept below.' }, { status: 503 }); }
  if (url.protocol !== 'https:') return Response.json({ message: 'Please email directly. Your message has been kept below.' }, { status: 503 });
  const now = Date.now();
  for (const [key,entry] of requests) if (entry.reset <= now) requests.delete(key);
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const entry = requests.get(key) || { count: 0, reset: now+15*60_000 };
  if (entry.count >= 5 || requests.size >= 10_000) return Response.json({ message: 'Please wait before trying again, or email directly.' }, { status: 429, headers: { 'Retry-After': '900' } });
  entry.count++; requests.set(key,entry);
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: 'Bearer ' + process.env.CONTACT_WEBHOOK_TOKEN } : {}) },
      body: JSON.stringify(validated.data), signal: AbortSignal.timeout(10_000), cache: 'no-store',
    });
    if (!response.ok) throw new Error('Delivery was not accepted');
    return Response.json({ message: 'Thank you. Your enquiry has been received.' });
  } catch {
    return Response.json({ message: 'Could not send. Please try again or email directly. Your message has been kept below.' }, { status: 502 });
  }
}

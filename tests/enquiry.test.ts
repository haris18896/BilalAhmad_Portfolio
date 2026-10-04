import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from '../src/lib/enquiry';
import { POST } from '../src/app/api/enquiry/route';

test('enquiries reject invalid fields and preserve valid, trimmed content', () => {
  assert.equal(validateEnquiry(null).data, undefined);
  assert.equal(validateEnquiry({ name: 'Bilal', email: 'wrong', interest: '__proto__', message: 'short' }).data, undefined);
  const input = { name: ' Visitor ', email: 'visitor@example.com', interest: 'BIM', message: 'Please discuss this BIM project.' };
  assert.equal(validateEnquiry(input).data?.name, 'Visitor');
  assert.equal(validateEnquiry({ ...input, message: 'x'.repeat(4001) }).data, undefined);
});
test('delivery rejects foreign origins and never claims success without a delivery endpoint', async () => {
  const body = JSON.stringify({ name: 'Visitor', email: 'visitor@example.com', interest: 'Architecture', message: 'A sample enquiry for local verification.' });
  const makeRequest = (origin: string) => new Request('http://localhost:3000/api/enquiry', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body });
  assert.equal((await POST(makeRequest('https://untrusted.example'))).status, 403);
  const old = process.env.CONTACT_WEBHOOK_URL;
  delete process.env.CONTACT_WEBHOOK_URL;
  try { assert.equal((await POST(makeRequest('http://localhost:3000'))).status, 503); }
  finally { if (old) process.env.CONTACT_WEBHOOK_URL = old; }
});

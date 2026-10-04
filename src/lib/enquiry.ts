export type Enquiry = { name: string; email: string; interest: string; message: string };
export function validateEnquiry(value: unknown): { data?: Enquiry; errors: Record<string,string> } {
  const input = value && typeof value === 'object' ? value as Record<string,unknown> : {};
  const data = Object.fromEntries(['name','email','interest','message'].map(key => [key, typeof input[key] === 'string' ? input[key].trim() : ''])) as Enquiry;
  const errors: Record<string,string> = {};
  if (data.name.length < 2 || data.name.length > 100) errors.name = 'Enter your name (2–100 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254) errors.email = 'Enter a valid email address.';
  if (!['Architecture','Interiors','BIM','Other'].includes(data.interest)) errors.interest = 'Choose a project interest.';
  if (data.message.length < 10 || data.message.length > 4000) errors.message = 'Enter a message (10–4,000 characters).';
  return Object.keys(errors).length ? { errors } : { data, errors };
}

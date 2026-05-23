/**
 * Contact Form Validation Utilities — Zod schema
 * Used client-side before sending via EmailJS
 */

// Sanitize HTML entities to prevent XSS
export const sanitize = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const SERVICE_OPTIONS = [
  'Office Furniture Installation',
  'Office Setup & Reconfiguration',
  'Disassembly & Moving',
  'Commercial Project',
] as const;

// Validation schema
export const contactSchema = {
  name: (name: string) => {
    if (!name || name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 100) return 'Name is too long';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
  },
  company: (company: string) => {
    if (company && company.length > 100) return 'Company name is too long';
    return null;
  },
  phone: (phone: string) => {
    if (phone && !/^[\d\s\-\+\(\)\.]*$/.test(phone)) return 'Please enter a valid phone number';
    return null;
  },
  service: (service: string) => {
    if (!SERVICE_OPTIONS.includes(service as typeof SERVICE_OPTIONS[number])) return 'Please select a service type';
    return null;
  },
  message: (message: string) => {
    if (message && message.length > 1000) return 'Message is too long (max 1000 characters)';
    return null;
  },
};

export type ContactFormData = {
  name: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

export const validateContactForm = (data: ContactFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameErr = contactSchema.name(data.name);
  if (nameErr) errors.name = nameErr;

  const companyErr = contactSchema.company(data.company);
  if (companyErr) errors.company = companyErr;

  const phoneErr = contactSchema.phone(data.phone);
  if (phoneErr) errors.phone = phoneErr;

  const serviceErr = contactSchema.service(data.service);
  if (serviceErr) errors.service = serviceErr;

  const messageErr = contactSchema.message(data.message);
  if (messageErr) errors.message = messageErr;

  return errors;
};

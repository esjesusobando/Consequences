'use server';

/**
 * Contact Form Server Action — Zod validation + sanitize
 * SECURITY: Always validate server-side, never trust client input
 */

import { z } from 'zod';

// Sanitize HTML entities to prevent XSS
const sanitize = (str: string): string => {
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
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  company: z.string()
    .max(100, 'Company name is too long')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)\.]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  service: z.enum(SERVICE_OPTIONS, { message: 'Please select a service type' }),
  message: z.string()
    .max(1000, 'Message is too long (max 1000 characters)')
    .optional()
    .or(z.literal('')),
});

export type ContactFormState = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitContactForm(formData: FormData): Promise<ContactFormState> {
  // 1. Extract raw data
  const name = formData.get('name')?.toString().trim() ?? '';
  const company = formData.get('company')?.toString().trim() ?? '';
  const phone = formData.get('phone')?.toString().trim() ?? '';
  const service = formData.get('service')?.toString() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';

  const raw = { name, company, phone, service, message };

  // 2. Validate with Zod
  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    }
    return { success: false, errors, message: 'Please fix the errors above.' };
  }

  // 3. Sanitize validated data
  const validated = {
    name: sanitize(result.data.name),
    company: sanitize(result.data.company ?? ''),
    phone: sanitize(result.data.phone ?? ''),
    service: result.data.service,
    message: sanitize(result.data.message ?? ''),
  };

  // 4. TODO: Send email via Resend/SendGrid/EmailJS
  // For now, log to console (replace with real email service)
  console.log('📧 Contact form submission:', validated);

  return {
    success: true,
    message: 'Thank you! We\'ll be in touch within 24 hours.',
  };
}
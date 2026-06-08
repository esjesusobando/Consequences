'use client';

/**
 * ContactForm — taste-skill + Apple HIG SOTA
 * DESIGN_VARIANCE: 8 — Split layout: light form left, dark navy info right
 * MOTION_INTENSITY: 6 — Staggered scroll reveal
 * VISUAL_DENSITY: 4 — Spacious, clean inputs
 * Apple HIG: labels 12px, inputs 15px, focus ring 2px yellow/25
 */

import { useState, useRef, useEffect } from 'react';

interface ContactFormProps {
  lang: 'en' | 'es';
}

const copy = {
  en: {
    label: 'Contact',
    heading: "Let's build your workspace.",
    sub: 'Our service area includes Atlanta, Marietta, Alpharetta, Lawrenceville, and surrounding suburbs.',
    fields: {
      name: 'Name',
      namePh: 'Your full name',
      company: 'Company',
      companyPh: 'Your company name',
      phone: 'Phone',
      phonePh: '(000) 000-0000',
      service: 'Service Type',
      message: 'Additional Details (Optional)',
      messagePh: 'Briefly explain your inquiry or specific requirement...',
      submit: 'Request Quote',
      sending: 'Sending...',
      success: "Message sent! We'll be in touch soon.",
    },
    services: [
      'Office Furniture Installation',
      'Office Setup & Reconfiguration',
      'Disassembly & Moving',
      'Commercial Project',
    ],
    info: {
      location: '3715 Northcrest Rd Suite 19\nAtlanta, GA 30340',
      phone: '+1 (470) 595-0121',
      email: 'oiminstallllc@gmail.com',
      instagram: '@oimayen',
      area: 'Atlanta and Surrounding Area',
      areaSub: 'Providing professional installation services across the entire state of Georgia, reaching the borders of Florida, Alabama, and Tennessee.',
      hq: 'Headquarters',
      hqAddr: '3715 Northcrest Rd, Suite 19\nAtlanta, GA 30340',
      reach: 'Regional Reach',
      reachSub: 'Serving all of Georgia, reaching borders with Florida, Alabama, and Tennessee.',
      direct: 'Direct Line',
    },
  },
  es: {
    label: 'Contacto',
    heading: 'Construyamos tu espacio de trabajo.',
    sub: 'Nuestro área de servicio incluye Atlanta, Marietta, Alpharetta, Lawrenceville y suburbios.',
    fields: {
      name: 'Nombre',
      namePh: 'Tu nombre completo',
      company: 'Empresa',
      companyPh: 'Tu empresa',
      phone: 'Teléfono',
      phonePh: '(000) 000-0000',
      service: 'Tipo de Servicio',
      message: 'Detalles adicionales (opcional)',
      messagePh: 'Describí brevemente tu consulta...',
      submit: 'Solicitar Cotización',
      sending: 'Enviando...',
      success: '¡Mensaje enviado! Nos ponemos en contacto pronto.',
    },
    services: [
      'Instalación de Muebles',
      'Configuración de Oficina',
      'Desmontaje y Traslado',
      'Proyecto Comercial',
    ],
    info: {
      location: '3715 Northcrest Rd Suite 19\nAtlanta, GA 30340',
      phone: '+1 (470) 595-0121',
      email: 'oiminstallllc@gmail.com',
      instagram: '@oimayen',
      area: 'Atlanta y Área Circundante',
      areaSub: 'Brindamos servicios profesionales en todo el estado de Georgia, llegando a los límites con Florida, Alabama y Tennessee.',
      hq: 'Sede',
      hqAddr: '3715 Northcrest Rd, Suite 19\nAtlanta, GA 30340',
      reach: 'Alcance Regional',
      reachSub: 'Servicio en todo Georgia, llegando a Florida, Alabama y Tennessee.',
      direct: 'Línea Directa',
    },
  },
};

export default function ContactForm({ lang }: ContactFormProps) {
  const t = copy[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [form, setForm] = useState({ name: '', company: '', phone: '', service: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-animate]').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 80);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('success');
  };

  // Apple HIG: label 12px above, input 15px, focus ring yellow
  const labelCls = 'block text-[12px] font-semibold text-[#0d1b2a]/55 mb-1.5 uppercase tracking-[0.04em]';
  const inputCls = 'w-full bg-white border border-[#dde1e6] rounded-xl px-4 py-[11px] text-[15px] text-[#0d1b2a] placeholder:text-[#0d1b2a]/28 focus:outline-none focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 transition-colors';

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-white px-6 md:px-10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* taste-skill: split layout — light left / dark right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-[#dde1e6]">

          {/* LEFT — Form on light bg */}
          <div
            data-animate
            className="bg-[#f4f6f8] px-8 md:px-12 py-12"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
              {t.label}
            </p>
            <h2
              className="text-[28px] md:text-[34px] font-bold text-[#0d1b2a] leading-[1.1] mb-2"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}
            >
              {t.heading}
            </h2>
            <p className="text-[14px] text-[#0d1b2a]/48 leading-[1.5] mb-8 max-w-[40ch]">
              {t.sub}
            </p>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F5C518]/15 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-[16px] font-semibold text-[#0d1b2a]">{t.fields.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t.fields.name}</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder={t.fields.namePh} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.fields.company}</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} placeholder={t.fields.companyPh} className={inputCls} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>{t.fields.phone}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t.fields.phonePh} className={inputCls} />
                </div>

                {/* Service */}
                <div>
                  <label className={labelCls}>{t.fields.service}</label>
                  <select name="service" value={form.service} onChange={handleChange} className={inputCls}>
                    <option value="">{t.services[0]}</option>
                    {t.services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className={labelCls}>{t.fields.message}</label>
                  <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder={t.fields.messagePh} className={`${inputCls} resize-none`} />
                </div>

                {/* Submit — Apple HIG: 44px min, yellow bg, navy text */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-xl bg-[#F5C518] px-6 py-[13px] text-[15px] font-semibold text-[#0d1b2a] transition-all hover:bg-[#d4a800] active:scale-[0.98] disabled:opacity-50"
                >
                  {status === 'sending' ? t.fields.sending : t.fields.submit}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — Dark navy info + map */}
          <div
            data-animate
            className="bg-[#0d1b2a] px-8 md:px-12 py-12 flex flex-col gap-8"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s' }}
          >
            {/* Contact info rows */}
            <div className="space-y-5">
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ),
                  label: lang === 'en' ? 'Location' : 'Ubicación',
                  value: t.info.location,
                  href: 'https://maps.google.com/?q=3715+Northcrest+Rd+Suite+19+Atlanta+GA+30340',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.05 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  ),
                  label: lang === 'en' ? 'Phone' : 'Teléfono',
                  value: t.info.phone,
                  href: 'tel:+14705950121',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  ),
                  label: lang === 'en' ? 'Email' : 'Correo',
                  value: t.info.email,
                  href: 'mailto:oiminstallllc@gmail.com',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  ),
                  label: 'Instagram',
                  value: t.info.instagram,
                  href: 'https://instagram.com/oimayen',
                },
              ].map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0 text-[#F5C518] group-hover:bg-white/10 transition-colors mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-white/35 mb-0.5">{label}</p>
                    <p className="text-[14px] text-white/70 group-hover:text-white transition-colors leading-snug whitespace-pre-line">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map embed */}
            <div className="rounded-xl overflow-hidden border border-white/8 flex-1" style={{ minHeight: '200px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.5!2d-84.3244!3d33.8922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f508b!2s3715+Northcrest+Rd%2C+Atlanta%2C+GA+30340!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '200px', filter: 'invert(0.85) hue-rotate(180deg) saturate(0.6)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OIM Office — 3715 Northcrest Rd, Atlanta GA 30340"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

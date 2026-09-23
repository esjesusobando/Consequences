import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const { content, language } = useLanguage();
  const { contact, formLabels: labels } = content;
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log form data for now (backend deferred)
    const formData = new FormData(e.target as HTMLFormElement);
    console.log('Form submission:', {
      name: formData.get('name'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    });
    
    setIsSubmitting(true);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
                {content.navigation.contact}
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full" />
            </div>

            <p className="text-lg text-on-surface-variant leading-relaxed">
              Ready to transform your workspace? Contact us for a free quote and consultation.
            </p>

            {/* Contact details */}
            <div className="space-y-6">
              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Address</div>
                  <div className="font-medium text-on-surface">{contact.address}</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Phone</div>
                  <div className="font-medium text-on-surface">(404) 555-0123</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email</div>
                  <div className="font-medium text-on-surface">info@oimatlanta.com</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-surface-container-lowest p-8 lg:p-10 rounded-2xl shadow-xl relative overflow-hidden"
            >
              {/* Success state */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-surface-container-lowest/95 backdrop-blur-xl z-10 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-headline text-on-surface mb-2">{labels.success}</h3>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                {/* Name & Company */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      {labels.name}
                    </label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm placeholder:text-on-surface-variant/40"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      {labels.company}
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm placeholder:text-on-surface-variant/40"
                      placeholder="Company Inc."
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {labels.phone}
                  </label>
                  <input 
                    required
                    type="tel"
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm placeholder:text-on-surface-variant/40"
                    placeholder="(404) 555-0123"
                  />
                </div>

                {/* Service */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {labels.service}
                  </label>
                  <select 
                    required
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm text-on-surface"
                  >
                    <option value="">Select a service</option>
                    {content.services.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {labels.message}
                  </label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm placeholder:text-on-surface-variant/40 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? labels.submitting || 'Sending...' : labels.submit}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
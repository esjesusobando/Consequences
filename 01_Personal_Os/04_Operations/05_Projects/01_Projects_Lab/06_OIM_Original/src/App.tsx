/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Armchair, 
  PenTool, 
  Network, 
  Truck,
  ArrowUpRight
} from 'lucide-react';

// --- Helpers ---
const scrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-on-surface font-headline">OIM</div>
        <div className="hidden md:flex items-center gap-10">
          {['Portfolio', 'Services', 'Process', 'Insights', 'Contact'].map((item, i) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={(e) => scrollTo(e, item.toLowerCase())}
              className={`relative group font-medium font-headline tracking-tight transition-colors duration-300 text-sm ${i === 0 ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(179, 39, 45, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => scrollTo(e, 'contact')}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-full text-sm font-semibold tracking-tight transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 pt-32 pb-20 lg:pt-40 lg:pb-32 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Precision Office Engineering</span>
        </motion.div>
        
        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter text-on-surface leading-[0.95]">
          Workspace design, <br/>
          <span className="text-primary-container">reimagined.</span>
        </motion.h1>
        
        <motion.p variants={fadeInUp} className="text-lg text-on-surface-variant max-w-lg leading-relaxed font-body">
          Transforming corporate environments through technical precision, seamless logistics, and human-centric design. We don't just install furniture; we engineer productivity.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-4">
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-semibold shadow-xl shadow-primary/20 hover:scale-105 transition-transform max-w-fit">
            Start Project
          </button>
          <a href="#portfolio" className="group flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors">
            View Portfolio
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Modern architectural interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-container/20 blur-3xl -z-10 rounded-full"></div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-container/10 blur-3xl -z-10 rounded-full"></div>
      </motion.div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="bg-surface-container-low py-12">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 mb-10">Trusted by Global Innovators</p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {[32, 24, 40, 28, 36].map((w, i) => (
            <div key={i} className={`h-6 w-${w} bg-on-surface-variant/30 rounded-full`}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: Armchair, title: "Amueblamiento", desc: "Expert procurement and installation of high-performance ergonomic workspace solutions.", color: "bg-primary-fixed", text: "text-primary" },
    { icon: PenTool, title: "Diseño", desc: "Conceptualizing spatial flows that enhance collaboration and employee well-being.", color: "bg-secondary-fixed", text: "text-secondary" },
    { icon: Network, title: "Gestión", desc: "End-to-end project management ensuring deadlines and quality standards are exceeded.", color: "bg-surface-container-highest", text: "text-on-surface" },
    { icon: Truck, title: "Logística", desc: "Precision handling and worldwide distribution network for office infrastructure.", color: "bg-primary-fixed-dim", text: "text-on-primary-fixed-variant" }
  ];

  return (
    <section id="services" className="max-w-7xl mx-auto px-8 py-32">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="mb-20"
      >
        <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Precision Services</h2>
        <div className="w-12 h-1 bg-primary mt-4 rounded-full"></div>
      </motion.div>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {services.map((s, i) => (
          <motion.div key={i} variants={fadeInUp} className="p-8 bg-surface-container-lowest rounded-xxl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center ${s.text} mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-headline mb-3 text-on-surface">{s.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{s.desc}</p>
            <a href="#" className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              Learn more <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { value: "150+", label: "Global Clients", highlight: false },
    { value: "8+", label: "International Offices", highlight: true },
    { value: "98%", label: "Retention Rate", highlight: false },
    { value: "500+", label: "Completed Projects", highlight: false }
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <div className={`text-5xl font-extrabold font-headline mb-2 ${s.highlight ? 'text-primary' : 'text-on-surface'}`}>{s.value}</div>
            <div className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const RecentWork = () => {
  const projects = [
    { span: "col-span-12 md:col-span-8", aspect: "aspect-video", img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop", title: "Corporate HQ Atlanta", desc: "Full Floor Precision Installation" },
    { span: "col-span-12 md:col-span-4", aspect: "aspect-square md:aspect-auto", img: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop", title: "Tech Campus SV", desc: "Design & Logistics" },
    { span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop", title: "Creative Hub", desc: "London, UK" },
    { span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop", title: "Wall Street Plaza", desc: "New York, NY" },
    { span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1518481612222-68bab828fd1d?q=80&w=2070&auto=format&fit=crop", title: "EcoLab Berlin", desc: "Sustainable Re-Fit" }
  ];

  return (
    <section id="portfolio" className="bg-surface-container-low py-32">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-6">Recent Work</h2>
            <p className="text-on-surface-variant">A curated selection of our most challenging and innovative corporate transformations.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => scrollTo(e, 'portfolio')}
            className="border border-outline-variant px-6 py-2 rounded-full text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            View All Case Studies
          </motion.button>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-12 gap-6"
        >
          {projects.map((p, i) => (
            <motion.div key={i} variants={fadeInUp} className={`${p.span} group overflow-hidden rounded-xxl relative ${p.aspect} cursor-pointer bg-surface`}>
              <img src={p.img} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full flex justify-between items-end">
                  <div>
                    <h4 className="text-xl font-bold font-headline">{p.title}</h4>
                    <p className="text-sm opacity-90 mt-1">{p.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const EngineeringFocus = () => {
  return (
    <section id="process" className="max-w-7xl mx-auto px-8 py-32 grid lg:grid-cols-2 gap-24 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="order-2 lg:order-1"
      >
        <div className="grid grid-cols-2 gap-6">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="Team collaborating" referrerPolicy="no-referrer" className="rounded-2xl aspect-square object-cover shadow-lg" />
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" alt="Precision work" referrerPolicy="no-referrer" className="rounded-2xl aspect-square object-cover shadow-lg mt-12" />
        </div>
      </motion.div>
      
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        className="order-1 lg:order-2 space-y-10"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Engineering Focus</motion.h2>
        <motion.p variants={fadeInUp} className="text-on-surface-variant leading-relaxed">
          With over two decades of technical expertise, OIM approaches every installation as a precision engineering challenge. Our methodology integrates advanced architectural principles with logistical excellence.
        </motion.p>
        
        <div className="space-y-8">
          {[
            { num: "01", title: "Precisión", desc: "Millimeter-perfect alignment in every furniture module and AV integration." },
            { num: "02", title: "Compromiso", desc: "Zero-downtime philosophy ensuring your team stays productive through transitions." },
            { num: "03", title: "Innovación", desc: "Utilizing the latest workplace technologies to future-proof your investment." }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-sm font-bold font-headline">
                {item.num}
              </div>
              <div>
                <h4 className="font-bold text-on-surface mb-2 font-headline">{item.title}</h4>
                <p className="text-sm text-on-surface-variant">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const Insights = () => {
  const articles = [
    { title: "The Future of Ergonomics in Tech Hubs", category: "Design", date: "Oct 2024", img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop" },
    { title: "Sustainable Materials in Corporate Fit-outs", category: "Sustainability", date: "Sep 2024", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop" },
    { title: "Maximizing ROI through Spatial Efficiency", category: "Strategy", date: "Aug 2024", img: "https://images.unsplash.com/photo-1497215848143-221d4ba11c2a?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <section id="insights" className="bg-surface-container-low py-32">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mb-20"
        >
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-6">Latest Insights</h2>
          <div className="w-12 h-1 bg-primary mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {articles.map((article, i) => (
            <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
              <div className="aspect-[3/2] bg-surface-variant rounded-2xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-primary mb-3">
                <span>{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-on-surface-variant">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold font-headline text-on-surface group-hover:text-primary transition-colors">{article.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="bg-surface-container-low py-32 px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-4">Start a Conversation</h2>
          <p className="text-on-surface-variant">Request a consultation with our engineering consultants.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm relative overflow-hidden"
        >
          {submitted && (
            <div className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface">Inquiry Sent</h3>
                <p className="text-sm text-on-surface-variant mt-2">We'll be in touch shortly.</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Full Name</label>
              <input required className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-sm placeholder:text-on-surface-variant/40" placeholder="John Doe" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Company Email</label>
              <input required className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-sm placeholder:text-on-surface-variant/40" placeholder="john@company.com" type="email"/>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Service Required</label>
            <select className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-sm text-on-surface-variant">
              <option>Amueblamiento Integral</option>
              <option>Diseño de Espacios</option>
              <option>Gestión de Proyectos</option>
              <option>Logística Global</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Project Brief</label>
            <textarea required className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-sm placeholder:text-on-surface-variant/40 resize-none" placeholder="Tell us about your workspace goals..." rows={4}></textarea>
          </div>
          <div className="flex justify-center pt-4">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(179, 39, 45, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-12 py-4 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all w-full md:w-auto"
            >
              Send Inquiry
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest w-full rounded-t-[3rem] mt-20 border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12 py-20 max-w-7xl mx-auto">
        <div>
          <div className="text-2xl font-bold text-on-surface mb-6 font-headline tracking-tighter">OIM</div>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs font-body">
            Engineering high-performance environments for the world's most innovative companies since 2004.
          </p>
        </div>
        <div className="space-y-6">
          <h4 className="text-on-surface font-bold text-sm font-headline">Services</h4>
          <div className="flex flex-col gap-3">
            {['Installation', 'Design Strategy', 'Asset Management', 'Relocation'].map(link => (
              <a key={link} href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">{link}</a>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-on-surface font-bold text-sm font-headline">Company</h4>
          <div className="flex flex-col gap-3">
            {['Portfolio', 'Insights', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => scrollTo(e, link.toLowerCase())} className="text-on-surface-variant text-sm hover:text-primary transition-colors">{link}</a>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-on-surface font-bold text-sm font-headline">Global Locations</h4>
          <div className="flex flex-col gap-3">
            {['Munich, Germany', 'New York, USA', 'Atlanta, USA', 'London, UK'].map(loc => (
              <span key={loc} className="text-on-surface-variant text-sm">{loc}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <p className="text-on-surface-variant/60 text-[10px] font-bold tracking-widest uppercase">© 2024 Office Installations Mayen. Technical Precision in Workspace Design.</p>
        <div className="flex gap-8">
          <a href="#" className="text-on-surface-variant/60 text-[10px] font-bold tracking-widest uppercase hover:text-on-surface transition-colors">Privacy Policy</a>
          <a href="#" className="text-on-surface-variant/60 text-[10px] font-bold tracking-widest uppercase hover:text-on-surface transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <Stats />
        <RecentWork />
        <EngineeringFocus />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

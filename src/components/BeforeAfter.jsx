import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Activity, Sparkle } from 'lucide-react';

const categories = ['All Treatments', 'Teeth Whitening', 'Dental Implants', 'Orthodontics', 'Veneers'];

const transformations = [
  {
    id: 1,
    title: 'Teeth Whitening',
    category: 'Teeth Whitening',
    description: 'Brighten your smile and remove years of stains in just one session.',
    beforeImage: '/before_whitening.png',
    afterImage: '/after_whitening.png',
    icon: <Sparkle className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 2,
    title: 'Dental Implants',
    category: 'Dental Implants',
    description: 'Restore missing teeth with strong, natural-looking dental implants.',
    beforeImage: '/before_implants.png',
    afterImage: '/after_implants.png',
    icon: <Shield className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: 3,
    title: 'Orthodontic Treatment',
    category: 'Orthodontics',
    description: 'Straighten your teeth and improve your bite for a perfect smile.',
    beforeImage: '/before_ortho.png',
    afterImage: '/after_ortho.png',
    icon: <Activity className="w-5 h-5 text-indigo-500" />,
  },
];

// Counter component for animated statistics
function Counter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const target = parseInt(value.replace(/[^0-9]/g, ''));
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, value, duration]);

  const formatOutput = () => {
    let out = count;
    if (value.includes('K')) out = `${count}K`;
    if (value.includes('%')) out = `${count}%`;
    if (value.includes('+')) out = `${out}+`;
    return out;
  };

  return <span ref={elementRef}>{formatOutput()}</span>;
}

// Range-slider based Before/After comparison card
function SliderCard({ title, description, beforeImage, afterImage, icon }) {
  const [sliderPos, setSliderPos] = useState(50);
  const cardRef = useRef(null);

  // Auto-demo animation when card enters viewport
  useEffect(() => {
    let t1, t2, t3;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t1 = setTimeout(() => setSliderPos(20), 500);
          t2 = setTimeout(() => setSliderPos(80), 1300);
          t3 = setTimeout(() => setSliderPos(50), 2100);
        }
      },
      { threshold: 0.25 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="interactive-card glass-card p-5 rounded-[32px] border border-white hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-500 flex flex-col gap-5 text-left"
    >
      {/* Slider Container */}
      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden select-none bg-slate-100 shadow-inner group">
        
        {/* AFTER IMAGE (Underlay) */}
        <img 
          src={afterImage} 
          alt="After treatment" 
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute bottom-3 right-4 bg-primary text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full z-20 shadow-sm pointer-events-none">
          After
        </div>

        {/* BEFORE IMAGE (Overlay with CSS Clip-path) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img 
            src={beforeImage} 
            alt="Before treatment" 
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        </div>
        <div className="absolute bottom-3 left-4 bg-slate-900/60 backdrop-blur-md text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full z-20 shadow-sm pointer-events-none">
          Before
        </div>

        {/* Real Native Range Input for 100% bug-free mouse/touch slider dragging */}
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />

        {/* VISUAL DIVIDER LINE AND HANDLE */}
        <div 
          className="absolute top-0 bottom-0 w-[2.5px] bg-white pointer-events-none z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform duration-300">
            <span className="text-[10px] font-bold">⇄</span>
          </div>
        </div>

      </div>

      {/* Title & Desc */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{title}</h4>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

    </div>
  );
}

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState('All Treatments');

  const filteredTransformations = activeTab === 'All Treatments'
    ? transformations
    : transformations.filter(t => t.category === activeTab);

  return (
    <section id="transformations" className="relative py-24 px-6 lg:px-12 overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BEFORE & AFTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Real Transformations, <br />
            <span className="text-gradient relative inline-block">
              Real Confidence!
              <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30 fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            See the incredible smiles we've created. Our advanced treatments deliver real results and lasting confidence.
          </p>
        </motion.div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 border ${activeTab === cat ? 'bg-primary text-white border-primary shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredTransformations.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <SliderCard 
                  title={item.title}
                  description={item.description}
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  icon={item.icon}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stats Grid Section */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 border-t border-slate-100 pt-16">
          {[
            { label: 'Smiles Transformed', value: '10K+', desc: 'Changing lives with beautiful smiles.' },
            { label: 'Patient Satisfaction', value: '98%', desc: 'Trusted by thousands of happy patients.' },
            { label: 'Years of Excellence', value: '15+', desc: 'Delivering outstanding dental care.' },
            { label: 'Happy Patients', value: '25K+', desc: 'A growing community of smiling patients.' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="interactive-card glass-card p-6 rounded-2xl border border-white hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
                <Counter value={stat.value} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{stat.label}</h4>
              <p className="text-slate-400 text-[10px] leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

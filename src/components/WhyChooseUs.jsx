import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smile, DollarSign, Calendar, User, Phone, Mail, Award, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'Experienced Professionals',
    description: 'Our team of highly skilled dentists ensures the best care for your smile.',
    icon: <Award className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Advanced Technology',
    description: 'We use cutting-edge equipment for precise diagnosis and effective treatments.',
    icon: <Sparkles className="w-5 h-5 text-sky-500" />,
  },
  {
    title: 'Comfortable Environment',
    description: 'Relax in our modern, clean, and patient-friendly clinic.',
    icon: <Smile className="w-5 h-5 text-emerald-500" />,
  },
  {
    title: 'Affordable Care',
    description: 'Quality dental care that fits your budget with flexible payment options.',
    icon: <DollarSign className="w-5 h-5 text-indigo-500" />,
  },
];

const getInitialTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'morning';
};

const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMinDateString = () => {
  const today = new Date();
  const currentHour = today.getHours();
  if (currentHour >= 20) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return getLocalDateString();
};

export default function WhyChooseUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: getMinDateString(),
    time: getInitialTime(),
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mimic API post
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      const todayStr = getLocalDateString();
      const minDateStr = getMinDateString();

      // 1. Ensure selected date is not prior to the minimum allowed date
      if (updated.date && updated.date < minDateStr) {
        updated.date = minDateStr;
      }

      // 2. If date is today, ensure time slot is valid
      if (updated.date === todayStr && updated.time) {
        const currentHour = new Date().getHours();
        let isSlotValid = true;

        if (updated.time === 'morning' && currentHour >= 12) {
          isSlotValid = false;
        } else if (updated.time === 'afternoon' && currentHour >= 17) {
          isSlotValid = false;
        } else if (updated.time === 'evening' && currentHour >= 20) {
          isSlotValid = false;
        }

        if (!isSlotValid) {
          // Find next available slot for today
          let nextAvailable = '';
          if (currentHour < 12) {
            nextAvailable = 'morning';
          } else if (currentHour < 17) {
            nextAvailable = 'afternoon';
          } else if (currentHour < 20) {
            nextAvailable = 'evening';
          }
          
          updated.time = nextAvailable;
        }
      }

      return updated;
    });
  };

  return (
    <section id="about" className="relative py-24 px-6 lg:px-16 overflow-hidden bg-slate-50/50">
      
      {/* Grid overlay background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
            <Award className="w-3.5 h-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Why Choose <span className="text-primary">FIDA DENTAL CLINIC?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            We combine advanced technology, skilled professionals, and a patient-first approach to deliver exceptional dental care.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3D Dentist Character */}
          <motion.div 
            className="lg:col-span-5 relative flex justify-center items-center h-[350px] lg:h-[450px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background glowing circle */}
            <div className="absolute w-[80%] aspect-square bg-gradient-to-tr from-primary/10 to-sky-300/10 rounded-full animate-spin-slow blur-sm" />
            
            {/* Outline glass ring */}
            <div className="absolute w-[70%] aspect-square rounded-full border border-white/80 glass-card shadow-inner" />
            
            {/* Dentist Avatar image */}
            <img 
              src="/dentist_thumbs.png" 
              alt="Thumbs Up Dentist" 
              loading="lazy"
              decoding="async"
              className="absolute bottom-0 max-h-[105%] object-contain drop-shadow-[0_20px_40px_rgba(0,102,255,0.2)] animate-float"
            />
          </motion.div>

          {/* Right Column: Feature Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="interactive-card flex gap-4 p-5 rounded-2xl glass-card border border-white/60 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-11 h-11 shrink-0 bg-white shadow-md rounded-xl flex items-center justify-center border border-slate-50 animate-float-fast">
                  {feat.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-slate-800 text-base leading-snug">{feat.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

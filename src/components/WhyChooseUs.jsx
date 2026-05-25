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
          viewport={{ once: false, margin: '-100px' }}
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
            className="lg:col-span-4 relative flex justify-center items-center h-[350px] lg:h-[450px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2 }}
          >
            {/* Background glowing circle */}
            <div className="absolute w-[80%] aspect-square bg-gradient-to-tr from-primary/10 to-sky-300/10 rounded-full animate-spin-slow blur-sm" />
            
            {/* Outline glass ring */}
            <div className="absolute w-[70%] aspect-square rounded-full border border-white/80 glass-card shadow-inner" />
            
            {/* Dentist Avatar image */}
            <img 
              src="/dentist_thumbs.png" 
              alt="Thumbs Up Dentist" 
              className="absolute bottom-0 max-h-[105%] object-contain drop-shadow-[0_20px_40px_rgba(0,102,255,0.2)] animate-float"
            />
          </motion.div>

          {/* Middle Column: Feature Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
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

          {/* Right Column: Appointment Form */}
          <motion.div 
            id="booking"
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card-dark p-6 sm:p-8 rounded-[32px] border border-blue-500/10 shadow-2xl relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-4 text-left"
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Header */}
                    <div className="mb-2">
                      <h3 className="text-xl font-extrabold text-slate-800 leading-tight">Book Your Appointment</h3>
                      <p className="text-xs text-slate-400 mt-1">Take the first step towards a healthier smile.</p>
                    </div>

                    {/* Inputs */}
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your Full Name" 
                        className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Phone Number" 
                        className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Email Address" 
                        className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Services Select */}
                      <div className="relative">
                        <select 
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-3 bg-white/60 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all text-slate-500"
                        >
                          <option value="">Select Service</option>
                          <option value="general">General Dentistry</option>
                          <option value="cosmetic">Cosmetic Dentistry</option>
                          <option value="implants">Dental Implants</option>
                          <option value="orthodontics">Orthodontics</option>
                          <option value="whitening">Teeth Whitening</option>
                        </select>
                      </div>

                      {/* Time Select */}
                      <div className="relative">
                        <select 
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-3 bg-white/60 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all text-slate-500"
                        >
                          <option value="">Select Time</option>
                          <option 
                            value="morning"
                            disabled={formData.date === getLocalDateString() && new Date().getHours() >= 12}
                          >
                            Morning
                          </option>
                          <option 
                            value="afternoon"
                            disabled={formData.date === getLocalDateString() && new Date().getHours() >= 17}
                          >
                            Afternoon
                          </option>
                          <option 
                            value="evening"
                            disabled={formData.date === getLocalDateString() && new Date().getHours() >= 20}
                          >
                            Evening
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={getMinDateString()}
                        className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all text-slate-400"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="2" 
                        placeholder="Message (Optional)" 
                        className="w-full p-4 bg-white/60 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white shadow-sm transition-all placeholder:text-slate-400 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
                      
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Book Appointment</span>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400">Your information is safe & secure with us.</p>

                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 drop-shadow-md animate-bounce" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Requested!</h3>
                    <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed mb-6">
                      Thank you, <span className="font-semibold text-primary">{formData.name}</span>. Our representative will contact you shortly to confirm your schedule.
                    </p>

                    <div className="flex flex-col items-center mb-6">
                      <span className="text-[10px] text-slate-400 font-medium mb-3">Click to call & confirm instantly</span>
                      
                      <a 
                        href="tel:+923214043448" 
                        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer mb-3"
                        title="Call +92 321 4043448"
                      >
                        <Phone className="w-6 h-6 fill-white animate-phone-ring" />
                      </a>
                      
                      <span className="text-xs font-bold text-primary tracking-wide">+92 321 4043448</span>
                    </div>

                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ 
                          name: '', 
                          phone: '', 
                          email: '', 
                          service: '', 
                          date: getMinDateString(), 
                          time: getInitialTime(), 
                          message: '' 
                        });
                      }}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Book Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

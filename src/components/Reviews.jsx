import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Sparkles, Check, Smile } from 'lucide-react';

const renderStars = (rating, sizeClass = "w-3.5 h-3.5") => {
  const stars = [];
  const fullStars = Math.floor(rating);
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className={`${sizeClass} fill-amber-400 text-amber-400`} />);
    } else if (i === fullStars + 1 && (rating % 1 > 0)) {
      const percentage = (rating % 1) * 100;
      stars.push(
        <div key={i} className={`relative ${sizeClass} inline-block`}>
          <Star className={`absolute top-0 left-0 ${sizeClass} text-slate-200 fill-slate-200`} />
          <div className={`absolute top-0 left-0 ${sizeClass} overflow-hidden`} style={{ width: `${percentage}%` }}>
            <Star className={`${sizeClass} text-amber-400 fill-amber-400`} />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className={`${sizeClass} text-slate-200 fill-slate-200`} />);
    }
  }
  return stars;
};

const reviewsData = [
  {
    name: 'Usman Tariq',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    rating: 5,
    date: '2 days ago',
    text: 'I had an amazing experience at FIDA DENTAL CLINIC. The staff is so professional and the clinic is equipped with the latest technology. My smile has never looked better!',
  },
  {
    name: 'Ayesha Malik',
    location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    rating: 4.5,
    date: '1 week ago',
    text: 'The teeth whitening treatment gave me instant results. The dentist was so gentle and explained everything in detail. Highly recommended!',
  },
  {
    name: 'Bilal Ahmed',
    location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    rating: 5,
    date: '2 weeks ago',
    text: "I got my dental implant done here and I'm fully satisfied. The procedure was smooth and painless. Great environment and great team!",
  },
  {
    name: 'Sana Khan',
    location: 'Rawalpindi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    rating: 4.3,
    date: '2 weeks ago',
    text: 'The best dental care clinic in Pakistan! They truly care about their patients. My braces journey has been so comfortable. Thank you FIDA DENTAL CLINIC team!',
  },
  {
    name: 'Hamza Ali',
    location: 'Faisalabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
    rating: 4.5,
    date: '3 weeks ago',
    text: 'The doctors are highly professional and the clinic is super clean and modern. I felt comfortable from the moment I walked in.',
  },
  {
    name: 'Mehwish Raza',
    location: 'Multan, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    rating: 4.8,
    date: '1 month ago',
    text: 'Amazing experience! The root canal treatment was completely pain-free. I highly recommend FIDA DENTAL CLINIC.',
  },
];

// Single Review Card with custom 3D tilt
function ReviewCard({ review, idx }) {
  let cardEl = null;

  const handleMouseMove = (e, el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Tilt calculations
    const rotateY = ((x - xc) / xc) * 6; // Max 6 deg
    const rotateX = -((y - yc) / yc) * 5; // Max 5 deg
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    el.style.boxShadow = '0 20px 40px rgba(0, 102, 255, 0.08)';
  };

  const handleMouseLeave = (el) => {
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    el.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.02)';
  };

  return (
    <motion.div
      ref={(el) => (cardEl = el)}
      onMouseMove={(e) => handleMouseMove(e, cardEl)}
      onMouseLeave={() => handleMouseLeave(cardEl)}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
      className="glass-card p-6 rounded-[28px] border border-white hover:border-blue-500/20 transition-all duration-300 flex flex-col gap-4 text-left cursor-pointer"
      style={{ transformStyle: 'preserve-3d', transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s' }}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group/avatar">
            <img 
              src={review.avatar} 
              alt={review.name} 
              className="w-12 h-12 rounded-full object-cover border border-slate-100 group-hover/avatar:scale-105 transition-transform duration-300"
            />
            {/* Soft blue pulse ring glow on hover */}
            <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover/avatar:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <span>{review.name}</span>
              <Check className="w-3.5 h-3.5 text-white fill-primary rounded-full p-0.5" />
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">{review.location}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-0.5 text-amber-400">
            {renderStars(review.rating)}
          </div>
          <span className="text-[9px] text-slate-400 font-medium">{review.date}</span>
        </div>
      </div>

      {/* Comment Body */}
      <p className="text-slate-500 text-xs leading-relaxed mt-1">
        {review.text}
      </p>

      {/* Verified Patient tag */}
      <div className="mt-auto pt-2 self-start">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary rounded-full text-[9px] font-bold">
          <span>✓</span>
          <span>Verified Patient</span>
        </div>
      </div>

    </motion.div>
  );
}

// Progress Bar component
function RatingBar({ stars, percentage, delay }) {
  return (
    <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
      <span className="w-12 shrink-0">{stars} Stars</span>
      <div className="relative flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: percentage / 100 }}
          style={{ originX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bottom-0 right-0 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(0,102,255,0.3)]"
        />
      </div>
      <span className="w-8 text-right text-slate-400 font-medium">{percentage}%</span>
    </div>
  );
}

export default function Reviews() {
  const [ratingNum, setRatingNum] = useState(0);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      if (t >= 4.8) {
        setRatingNum(4.8);
        clearInterval(interval);
      } else {
        setRatingNum(parseFloat(t.toFixed(1)));
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-blue-50/20 via-white to-blue-50/10">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Speech Bubble Thumbs Up Decoration (Top Left) */}
      <div className="absolute top-[10%] left-[8%] w-20 h-20 pointer-events-none z-10 hidden xl:block animate-float">
        <img 
          src="/reviews_bubble.png" 
          alt="Thumbs Up Bubble" 
          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,102,255,0.08)]"
        />
      </div>

      {/* Tooth in Glass Sphere Decoration (Top Right) */}
      <div className="absolute top-[8%] right-[10%] w-24 h-24 pointer-events-none z-10 hidden xl:block animate-float-slow">
        <img 
          src="/reviews_tooth.png" 
          alt="3D Tooth Bubble" 
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,102,255,0.06)]"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
            <Smile className="w-3.5 h-3.5" />
            <span>CUSTOMER REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            What Our Patients Say <br />
            About <span className="text-gradient relative inline-block">
              Their Experience
              <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30 fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            Real stories from real patients who trusted FIDA DENTAL CLINIC for their smiles. Your satisfaction is our greatest achievement. 💙
          </p>
        </motion.div>

        {/* Rating Summary Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card-dark p-6 sm:p-8 rounded-[32px] border border-blue-500/10 shadow-2xl mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto"
        >
          {/* Left panel: 4.8 rating */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center md:border-r border-slate-100 pr-0 md:pr-8 py-2">
            <span className="text-5xl font-extrabold text-primary mb-3 tracking-tight">{ratingNum}</span>
            <div className="flex gap-0.5 text-amber-400 mb-2">
              {renderStars(4.8, "w-4 h-4")}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Based on 1000+ Reviews</span>
          </div>

          {/* Middle panel: Progress bars */}
          <div className="md:col-span-5 flex flex-col gap-3 py-2 px-0 md:px-6">
            <RatingBar stars={5} percentage={92} delay={0.1} />
            <RatingBar stars={4} percentage={6} delay={0.3} />
            <RatingBar stars={3} percentage={2} delay={0.5} />
          </div>

          {/* Right panel: Verified badge info */}
          <div className="md:col-span-4 flex items-center gap-4 bg-primary-light/50 p-5 rounded-[24px] border border-primary/5 py-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10 animate-float-fast">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-slate-800 text-sm mb-0.5">All reviews are from</h4>
              <p className="text-xs text-primary font-bold">verified patients</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((review, idx) => (
            <ReviewCard key={idx} review={review} idx={idx} />
          ))}
        </div>

        {/* Bottom CTA Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-6 bg-white py-4 px-8 rounded-full border border-slate-100 shadow-xl shadow-blue-500/5 max-w-4xl mx-auto"
        >
          {/* Overlapping avatars */}
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60,',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60,',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60,',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60,',
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=60,',
            ].map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt="Patient DP" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover" 
              />
            ))}
          </div>

          <span className="text-slate-500 text-xs font-semibold">Join 25K+ happy patients who love their smile!</span>

          <a 
            href="#booking" 
            className="group relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
            <span>Book Your Appointment</span>
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}

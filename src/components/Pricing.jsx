import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Basic Care',
    price: '1,500',
    period: '/visit',
    icon: <Zap className="w-4 h-4" />,
    color: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-200',
    features: [
      'Dental Checkup',
      'Teeth Cleaning',
      'Basic X-Ray',
      'Consultation',
    ],
    popular: false,
  },
  {
    name: 'Premium Smile',
    price: '4,500',
    period: '/session',
    icon: <Crown className="w-4 h-4" />,
    color: 'from-primary to-blue-600',
    borderColor: 'border-primary/30',
    features: [
      'Full Dental Checkup',
      'Deep Cleaning & Polish',
      'Digital X-Rays',
      'Teeth Whitening',
      'Priority Booking',
    ],
    popular: true,
  },
  {
    name: 'Family Plan',
    price: '8,000',
    period: '/month',
    icon: <Star className="w-4 h-4" />,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-200',
    features: [
      'Up to 4 Members',
      'Monthly Checkups',
      'All Treatments 20% Off',
      'Emergency Support',
    ],
    popular: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-14 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-blue-50/20 to-white"
    >
      {/* Subtle background blobs */}
      <div className="absolute top-[30%] left-[-8%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-8%] w-[350px] h-[350px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRICING PLANS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight mt-2">
            Affordable{' '}
            <span className="text-gradient relative inline-block">
              Dental Care
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-primary/30 fill-none"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,9 100,5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
            Choose a plan that fits your needs. Quality care at every level.
          </p>
        </motion.div>

        {/* Pricing Cards - Horizontal Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className={`group relative glass-card rounded-2xl p-5 flex flex-col border transition-all duration-500 cursor-pointer ${
                plan.popular
                  ? 'border-primary/25 shadow-xl shadow-blue-500/10 bg-gradient-to-b from-blue-50/30 via-white to-white scale-[1.03] z-10'
                  : `${plan.borderColor} hover:border-primary/15 hover:shadow-lg`
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/10">
                  <Sparkles className="w-2.5 h-2.5 fill-white/30" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Plan Icon & Name */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  {plan.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[10px] text-slate-400 font-bold">
                  PKR
                </span>
                <span className="text-2xl font-extrabold text-slate-800 group-hover:text-primary transition-colors duration-300">
                  {plan.price}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {plan.period}
                </span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 mb-3" />

              {/* Features */}
              <ul className="flex flex-col gap-1.5 flex-1 mb-4">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[11px] text-slate-600"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.popular
                          ? 'bg-primary/10 text-primary'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Check className="w-2 h-2" strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="#booking"
                className={`w-full text-center py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden ${
                  plan.popular
                    ? 'bg-primary text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:brightness-110'
                    : 'bg-slate-100 text-slate-700 hover:bg-primary hover:text-white'
                }`}
              >
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
                Get Started
              </a>

              {/* Glow behind popular card */}
              {plan.popular && (
                <div className="absolute inset-0 bg-primary/[0.02] rounded-2xl blur-sm -z-10 pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

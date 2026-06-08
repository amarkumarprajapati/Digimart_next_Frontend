import { Zap, Shield, TrendingUp, Users, Gift, Heart, Star } from "lucide-react";

const features = [
  { icon: Zap,       title: "Lightning Fast",     description: "Experience blazing-fast performance with our optimized platform" },
  { icon: Shield,    title: "100% Secure",         description: "Your data and transactions are protected with bank-level security" },
  { icon: TrendingUp,title: "Best Prices",         description: "Get the most competitive prices with exclusive deals and discounts" },
  { icon: Users,     title: "Trusted Community",   description: "Join millions of satisfied customers worldwide" },
  { icon: Gift,      title: "Rewards Program",     description: "Earn points on every purchase and unlock exclusive rewards" },
  { icon: Heart,     title: "Customer First",      description: "We prioritize your satisfaction with dedicated support" },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-[#fdfdfd] dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#088395]/10 text-[#088395] mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Excellence Defined</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
            Why Shop <span className="text-gradient">With Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div key={index} className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-premium transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              {/* Subtle background glow on hover */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#088395]/5 rounded-full blur-2xl group-hover:bg-[#088395]/10 transition-all duration-500" />
              
              <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-10 group-hover:bg-[#088395] group-hover:rotate-[15deg] transition-all duration-500 shadow-sm group-hover:shadow-[#088395]/20">
                <feature.icon className="w-10 h-10 text-[#088395] group-hover:text-white transition-colors duration-500" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

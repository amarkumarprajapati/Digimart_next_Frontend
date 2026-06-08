/* eslint-disable */
import { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <section className="relative py-16 overflow-hidden bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full" />
          
          <div className="max-w-xl text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              Limited Membership
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Elite Circle</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
              Get exclusive access to limited drops, early tech insights, and premium offers delivered with elegance to your inbox.
            </p>
          </div>

          <div className="w-full max-w-md relative z-10">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all text-lg font-medium backdrop-blur-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-xl flex items-center justify-center gap-3 ${
                    isSuccess
                      ? "bg-green-500 text-white"
                      : "bg-[#088395] hover:bg-[#066a78] text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-cyan-500/30"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSuccess ? (
                    "Welcome Aboard"
                  ) : (
                    <>
                      Secure Access
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-[10px] text-slate-400 uppercase tracking-widest font-black opacity-60">
              No Spam. Only Premium Content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;

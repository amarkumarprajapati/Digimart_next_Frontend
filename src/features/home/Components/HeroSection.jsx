import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { slidesimages } from "@/data";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] bg-slate-950 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
        navigation={{
          prevEl: ".hero-prev-btn",
          nextEl: ".hero-next-btn",
        }}
        pagination={{
          el: ".hero-custom-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
      >
        {slidesimages?.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full relative">
            {/* Cinematic Background */}
            <div
              className={`absolute inset-0 w-full h-full transition-transform ease-out`}
              style={{
                transform: activeIndex === index ? "scale(1.1)" : "scale(1)",
                transitionDuration: "15s",
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-[0.7]"
              />
              {/* Premium Gradient Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            </div>

            {/* Premium Content Overlay */}
            <div className="relative z-20 w-full h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-3xl">
                 

                  {/* World-Class Typography Title */}
                  <h1 
                    className={`text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-8 transition-all duration-1000 delay-500 ${
                      activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    {slide.title.split(" ").map((word, i, arr) => (
                      <span key={i} className="block last:text-cyan-400">
                        {word}
                      </span>
                    ))}
                  </h1>

                  {/* Refined Description */}
                  <p 
                    className={`text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl mb-12 transition-all duration-1000 delay-700 ${
                      activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    {slide.description}
                  </p>

                  {/* Interactive Premium Actions */}
                  <div 
                    className={`flex items-center gap-6 transition-all duration-1000 delay-1000 ${
                      activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <button className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
                      <span className="relative z-10 flex items-center gap-2">
                        Explore Collection
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                    
                    <button className="px-10 py-5 glass border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center gap-3 group">
                      View Lookbook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modern Navigation UI */}
      <div className="absolute bottom-12 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="hero-custom-pagination flex items-center gap-4" />
          
          <div className="flex gap-4">
            <button className="hero-prev-btn w-14 h-14 glass flex items-center justify-center rounded-full text-white border border-white/10 hover:bg-white hover:text-black transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="hero-next-btn w-14 h-14 glass flex items-center justify-center rounded-full text-white border border-white/10 hover:bg-white hover:text-black transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-bullet {
          width: 40px !important;
          height: 2px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 0 !important;
          transition: all 0.6s ease !important;
          cursor: pointer;
        }
        .swiper-pagination-bullet-active.custom-bullet {
          background: #22d3ee !important;
          width: 80px !important;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

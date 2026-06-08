import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "@/constants/app.config";

const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return `${Math.floor(diffInDays / 7)} weeks ago`;
};

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/top-reviews?limit=6`);
        const data = await response.json();

        if (data.success && data.data) {
          const transformedReviews = data.data.map(review => ({
            name: review.customerName,
            role: review.isVerifiedPurchase ? "Verified Purchase" : "Customer",
            rating: review.rating,
            review: review.comment,
            avatar: `https://i.pravatar.cc/150?u=${review.customerId}`,
            date: getRelativeTime(review.created_at),
            productName: review.productId?.Product_name || "Product",
          }));
          setReviews(transformedReviews);
        }
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Premium Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 mb-4">
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            Voices of <span className="text-gradient">Satisfaction</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
            Real experiences from our global community. Discover why thousands trust us for their premium technology needs.
          </p>
        </div>

        {/* Cinematic Review Slider */}
        <div className="relative">
          <div className="flex items-center justify-center min-h-[400px]">
             {reviews.map((review, index) => {
               const offset = index - currentIndex;
               const isActive = index === currentIndex;
               const isPrev = index === (currentIndex - 1 + reviews.length) % reviews.length;
               const isNext = index === (currentIndex + 1) % reviews.length;

               if (!isActive && !isPrev && !isNext) return null;

               return (
                 <div
                   key={index}
                   className={`absolute transition-all duration-1000 ease-premium w-full max-w-2xl ${
                     isActive 
                       ? "opacity-100 scale-100 z-20" 
                       : "opacity-40 scale-90 z-10 blur-sm " + (isPrev ? "-translate-x-full" : "translate-x-full")
                   }`}
                 >
                   <div className="premium-card p-12 md:p-16 relative">
                     <Quote className="absolute top-8 left-8 w-16 h-16 text-slate-100 dark:text-slate-800 -z-10" />
                     
                     <div className="flex flex-col items-center text-center">
                       <div className="flex gap-1 mb-8">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                         ))}
                       </div>

                       <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 mb-10 italic leading-relaxed">
                         &quot;{review.review}&quot;
                       </p>

                       <div className="flex items-center gap-4">
                         <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-premium" />
                         <div className="text-left">
                           <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">{review.name}</h4>
                           <p className="text-xs font-bold text-cyan-600 uppercase tracking-tighter">{review.role}</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               );
             })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button onClick={goToPrevious} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-cyan-500" : "w-2 bg-slate-200 dark:bg-slate-800"}`} />
              ))}
            </div>
            <button onClick={goToNext} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

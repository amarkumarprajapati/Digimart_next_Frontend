import { useState, useEffect, useRef } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  CheckCircle,
  User,
  Sparkles,
  Send,
  Loader2,
  ChevronRight,
} from "lucide-react";


const GEMINI_API_KEY = "AIzaSyANiNmSPWX06AhKAEJ7-6-UYnzU1eh8Fmk";

const StarRating = ({ value, size = "w-5 h-5", interactive = false, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => interactive && onRate?.(s)}
        className={interactive ? "hover:scale-110 transition-transform" : ""}
      >
        <Star
          key={s}
          className={`${size} ${
            s <= value
              ? "text-teal-500 fill-teal-500"
              : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
          } transition-colors`}
        />
      </button>
    ))}
  </div>
);

const ReviewSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
    </div>
  </div>
);

const ReviewsSection = ({ product, reviews = [], ratingDistribution = [], averageRating = 0, totalReviews = 0 }) => {
  const [ratingFilters, setRatingFilters] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Debug logging
  console.log("ReviewsSection received:", { reviews, ratingDistribution, averageRating, totalReviews });

  // AI States
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Hi! I've analyzed all the reviews. I can summarize what customers think or answer specific questions. What would you like to know?" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const reviewsEndRef = useRef(null);
  const chatEndRef = useRef(null);

  const { rating: productRating = 0, name: productName } = product || {};
  const displayRating = averageRating || productRating;
  const totalReviewsCount = totalReviews || reviews.length;

  // Auto-scroll logic
  const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    if (isLoadingMore) {
      scrollToBottom(reviewsEndRef);
    }
  }, [visibleCount]);

  useEffect(() => {
    scrollToBottom(chatEndRef);
  }, [aiMessages]);

  const getRatingDistribution = () => {
    // Use API ratingDistribution if available, otherwise calculate from reviews
    if (ratingDistribution && ratingDistribution.length > 0 && ratingDistribution[0]) {
      const dist = ratingDistribution[0];
      const total = calculatedTotal;
      return [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: dist[star] || 0,
        percent: total > 0 ? ((dist[star] || 0) / total) * 100 : 0,
      }));
    }

    // Fallback to calculating from reviews
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percent: totalReviewsCount > 0 ? (counts[star] / totalReviewsCount) * 100 : 0,
    }));
  };

  // Calculate total from rating distribution if available
  const getTotalFromDistribution = () => {
    if (ratingDistribution && ratingDistribution.length > 0 && ratingDistribution[0]) {
      const dist = ratingDistribution[0];
      return Object.values(dist).reduce((sum, count) => sum + (count || 0), 0);
    }
    return totalReviewsCount;
  };

  const calculatedTotal = getTotalFromDistribution();

  const ratingDistributionData = getRatingDistribution();

  const recommendPercent = Math.round(
    (reviews.filter((r) => r.rating >= 4).length / (calculatedTotal || 1)) * 100
  );

  // Sorting and Filtering Logic
  const getSortedReviews = () => {
    let result = [...reviews].filter((review) =>
      ratingFilters.length === 0 || ratingFilters.includes(review.rating)
    );

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date));
        break;
      case "highest":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        result.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        break;
    }
    return result;
  };

  const filteredReviews = getSortedReviews();
  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const toggleRatingFilter = (star) => {
    setIsFiltering(true);
    setRatingFilters((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
    setVisibleCount(3);
    setTimeout(() => setIsFiltering(false), 600);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoadingMore(false);
    }, 800);
  };

  // AI Functionality
  const handleAskAI = async () => {
    if (!aiQuery.trim() || isAiLoading) return;

    const userMessage = aiQuery;
    setAiMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setAiQuery("");
    setIsAiLoading(true);

    try {
      const reviewsContext = reviews.slice(0, 10).map(r =>
        `User ${r.customerName || r.user || 'Anonymous'} rated ${r.rating}/5 stars. Title: ${r.title}. Review: ${r.comment || r.text}`
      ).join("\n");

      const prompt = `You are an AI shopping assistant for DigiMart.
      Product: ${productName || "this product"}.
      Context from Customer Reviews:
      ${reviewsContext}

      User Question: ${userMessage}

      Instructions: Answer based on the provided reviews. Be concise and helpful. If the reviews don't mention the answer, say you don't have enough information from reviews but can offer general advice.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API Error:", data.error);
        throw new Error(data.error.message || "API Error");
      }

      if (!data.candidates || data.candidates.length === 0) {
        console.error("Gemini API Response (No Candidates):", data);
        throw new Error("No response generated. Your prompt might have been blocked or the API is busy.");
      }

      const aiText = data.candidates[0].content.parts[0].text;
      setAiMessages(prev => [...prev, { role: "assistant", text: aiText }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage = error.message.includes("API key not valid")
        ? "The API key provided is not valid. Please double-check it in the code."
        : `AI Error: ${error.message}`;

      setAiMessages(prev => [...prev, { role: "assistant", text: errorMessage }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Customer Reviews</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Verified opinions from the DigiMart community</p>
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => {
              setIsFiltering(true);
              setSortBy(e.target.value);
              setTimeout(() => setIsFiltering(false), 500);
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#088395] cursor-pointer appearance-none pr-10"
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Summary Card */}
        <div className="lg:col-span-1">
          {/* Main Rating Card */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 rounded-3xl p-8 mb-6 border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            <div className="text-center relative z-10">
              <div className="text-6xl font-black text-[#088395] dark:text-teal-400 mb-2">
                {displayRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-4">
                <StarRating value={Math.round(displayRating)} size="w-7 h-7" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">
                Based on <span className="text-[#088395]">{calculatedTotal}</span> Reviews
              </div>
            </div>
          </div>

          {/* Recommendation Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-800 flex items-center gap-5">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
               <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
               <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {recommendPercent}%
               </div>
               <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Recommend this product</div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="font-black text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-[0.2em]">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistributionData.map(({ star, count, percent }) => (
                <button
                  key={star}
                  onClick={() => toggleRatingFilter(star)}
                  className={`flex items-center w-full gap-3 py-2 px-3 rounded-xl transition-all duration-300 ${
                    ratingFilters.includes(star)
                      ? "bg-teal-50 dark:bg-teal-900/20 ring-2 ring-teal-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-[40px]">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{star}</span>
                    <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#088395] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[30px]">{count}</span>
                </button>
              ))}
            </div>
            {ratingFilters.length > 0 && (
              <button
                onClick={() => setRatingFilters([])}
                className="w-full py-2 mt-6 text-xs text-teal-600 dark:text-teal-400 font-black uppercase tracking-widest border border-dashed border-teal-200 dark:border-teal-800 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Right: Reviews List & AI */}
        <div className="lg:col-span-2">
          {/* AI Chat Screen */}
          <div className="mb-10 p-6 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-[#088395]" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-[#088395] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
               </div>
               <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">
                  Smart Review AI Assistant
               </h4>
            </div>

            <div className="space-y-4 mb-6 h-48 overflow-y-auto pr-2 custom-scrollbar relative z-10">
               {aiMessages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-medium border ${
                     msg.role === 'user' 
                     ? 'bg-[#088395] text-white border-teal-600 rounded-tr-none' 
                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700 rounded-tl-none'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               {isAiLoading && (
                 <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700">
                       <Loader2 className="w-5 h-5 text-[#088395] animate-spin" />
                    </div>
                 </div>
               )}
               <div ref={chatEndRef} />
            </div>

            <div className="flex gap-3 relative z-10">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask about performance, quality, or fit..." 
                className="flex-1 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#088395] shadow-inner transition-all" 
              />
              <button 
                onClick={handleAskAI}
                disabled={isAiLoading}
                className="bg-[#088395] hover:bg-[#066a78] text-white p-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-8">
            {isFiltering ? (
               [...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)
            ) : visibleReviews.length > 0 ? (
               <>
                {visibleReviews.map((review, index) => (
                  <div
                    key={review._id || review.id || index}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative flex-shrink-0">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.customerName || review.user}
                              className="w-14 h-14 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-md">
                              <User className="w-7 h-7 text-white" />
                            </div>
                          )}
                          {review.isVerifiedPurchase && (
                            <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1 border-2 border-white dark:border-gray-800 shadow-sm">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-gray-900 dark:text-white text-lg">{review.customerName || review.user || 'Anonymous'}</h4>
                            {review.isVerifiedPurchase && (
                              <span className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded-lg font-black uppercase tracking-widest">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {new Date(review.created_at || review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Title */}
                    <div className="mb-4">
                      <div className="mb-3">
                        <StarRating value={review.rating} size="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight">
                        {review.title}
                      </h3>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg font-medium">
                      {review.comment || review.text}
                    </p>

                    {/* Helpful Footer */}
                    <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-teal-600 transition-colors group">
                        <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-all">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        Helpful
                        {review.helpful > 0 && (
                          <span className="text-xs bg-teal-50 dark:bg-teal-900/20 text-[#088395] px-2 py-0.5 rounded-lg">
                            {review.helpful}
                          </span>
                        )}
                      </button>
                      <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors group">
                        <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 group-hover:bg-red-50 dark:group-hover:bg-red-900/30 transition-all">
                          <ThumbsDown className="w-4 h-4" />
                        </div>
                        Report
                      </button>
                    </div>
                  </div>
                ))}
                {/* Auto-scroll target */}
                <div ref={reviewsEndRef} />
               </>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Filter className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6 opacity-40" />
                <p className="text-gray-900 dark:text-white text-xl font-black mb-2">No reviews found</p>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your filters to see more results</p>
              </div>
            )}

            {/* Shimmer for Load More */}
            {isLoadingMore && <ReviewSkeleton />}

            {/* Load More Button */}
            {visibleCount < filteredReviews.length && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-10 py-5 bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Load More Reviews
                      <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;

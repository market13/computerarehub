import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Quote } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: Add verified customer reviews to client/public/data/reviews.json
    // Only real verified customer reviews must be added here. Do NOT invent reviews.
    fetch('/data/reviews.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {
        // Hide silently if data file is absent or empty
      });
  }, []);

  // Strict rule: Component remains completely hidden until real reviews are filled in reviews.json
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-6 py-8 border-t border-brand-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold font-mono mb-2 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>CUSTOMER REVIEWS & FEEDBACK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
            Verified feedback from custom PC owners and hardware customers in Ghaziabad and NCR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev, idx) => (
          <article
            key={rev.id || idx}
            className="bg-white rounded-xl border border-brand-border p-5 flex flex-col justify-between shadow-xs hover:border-brand-blue transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {rev.date && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {rev.date}
                  </span>
                )}
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-slate-200 absolute -top-1 -left-1 -z-0 opacity-40" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans relative z-10 italic">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-xs text-brand-navy block">
                  {rev.name}
                </span>
                {rev.buildType && (
                  <span className="text-[10px] text-slate-500 font-sans">
                    {rev.buildType}
                  </span>
                )}
              </div>
              {rev.location && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {rev.location}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

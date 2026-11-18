import React from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogView({ currentSlug = null, onNavigate = () => {} }) {
  const currentPost = currentSlug ? BLOG_POSTS.find(p => p.slug === currentSlug) : null;

  // Render Single Post
  if (currentPost) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-sans">
          <button 
            type="button"
            onClick={() => onNavigate('blog')}
            className="hover:text-brand-navy flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Guides & Articles</span>
          </button>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{currentPost.title}</span>
        </nav>

        {/* Draft Notice Banner */}
        {currentPost.isDraft && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="font-display uppercase tracking-wider block text-amber-950 font-bold">
                Article Status: Editorial Draft
              </strong>
              <p className="mt-1 leading-relaxed text-amber-800">
                {currentPost.priceTodo}. Component pricing and service rates shown below are indicative benchmark estimates.
              </p>
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="border-b border-slate-200 pb-6 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue font-mono text-xs font-bold w-fit border border-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>HARDWARE GUIDE & PRICE BREAKDOWN</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-black text-brand-navy tracking-tight leading-tight">
            {currentPost.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            {currentPost.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 font-sans">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentPost.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(currentPost.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentPost.readTime}</span>
            </span>
          </div>
        </header>

        {/* Article Body Content */}
        <article 
          className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-5 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-display [&_h2]:text-brand-navy [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_th]:text-slate-700 [&_th]:border [&_th]:border-slate-200 [&_td]:p-2.5 [&_td]:text-xs [&_td]:border [&_td]:border-slate-200 [&_tr:hover]:bg-slate-50"
          dangerouslySetInnerHTML={{ __html: currentPost.content }}
        />

        {/* CTA Banner */}
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wider text-white">
              Want a Tailored Hardware Quotation?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Contact our hardware specialists directly on WhatsApp or build your rig using our real-time compatibility configurator.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('builder')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Open Builder
            </button>
            <a
              href={`https://wa.me/919810550222?text=${encodeURIComponent(`Hi Computer Care, I read your guide "${currentPost.title}" and would like a quote.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs flex items-center gap-1.5 no-underline"
            >
              <WhatsAppIcon variant="badge" className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Render Post Index / Blog Hub
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue font-mono text-xs font-bold w-fit mb-3 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>TECHNICAL GUIDES & HARDWARE BENCHMARKS</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight uppercase leading-tight">
          Computer Care Hardware & PC Blog
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Honest pricing guides, custom gaming PC component recommendations, and diagnostic insights from our Ghaziabad hardware workshop.
        </p>
      </header>

      {/* Grid of Articles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-2xl border border-slate-200 hover:border-brand-blue shadow-xs hover:shadow-md transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  DRAFT / REVIEW
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 group-hover:text-brand-blue transition-colors leading-snug mb-2">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>

              <button
                type="button"
                onClick={() => onNavigate(`blog-${post.slug}`)}
                className="inline-flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-blue-700 group-hover:text-blue-800 cursor-pointer"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

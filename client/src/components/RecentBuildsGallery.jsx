import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink, Cpu, Layers } from 'lucide-react';

export default function RecentBuildsGallery() {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    // TODO: Add real custom PC build photos and specs to client/public/data/recentBuilds.json
    // Only genuine customer builds assembled at Computer Care Ghaziabad must be included.
    fetch('/data/recentBuilds.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBuilds(data);
        }
      })
      .catch(() => {
        // Hide silently if data file is absent or empty
      });
  }, []);

  // Strict rule: Component remains completely hidden until real build photos are filled in recentBuilds.json
  if (!builds || builds.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-6 py-8 border-t border-brand-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold font-mono mb-2 border border-blue-200">
            <Camera className="w-3.5 h-3.5" />
            <span>RECENT PC BUILDS GALLERY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-brand-navy tracking-tight">
            Built at Computer Care Ghaziabad
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
            Real custom gaming rigs and workstations assembled and stress-tested in our workshop.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {builds.map((b, idx) => (
          <article
            key={b.id || idx}
            className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs hover:border-brand-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title || 'Custom PC build by Computer Care'}
                  width="400"
                  height="225"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {b.tier && (
                  <span className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-navy/90 text-white backdrop-blur-xs">
                    {b.tier}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-display font-bold text-sm text-slate-800 group-hover:text-brand-blue transition-colors">
                  {b.title}
                </h3>
                {b.description && (
                  <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}

                {b.specs && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {b.specs.cpu && (
                      <span className="text-[10px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        CPU: {b.specs.cpu}
                      </span>
                    )}
                    {b.specs.gpu && (
                      <span className="text-[10px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        GPU: {b.specs.gpu}
                      </span>
                    )}
                    {b.specs.ram && (
                      <span className="text-[10px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        RAM: {b.specs.ram}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {b.budget && (
              <div className="p-4 pt-0 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Build Budget:</span>
                <span className="font-display font-bold text-brand-navy">{b.budget}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

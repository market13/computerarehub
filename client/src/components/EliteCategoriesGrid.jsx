import React from 'react';
import { 
  Cpu, 
  Layers, 
  Flame, 
  Box, 
  Zap, 
  HardDrive, 
  Fan, 
  Tv,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { key: 'case', label: 'PC Cabinets', icon: Box, count: '1,390+ Cases', color: 'bg-indigo-50 text-indigo-600' },
  { key: 'case_fan', label: 'Cabinet Fans', icon: Fan, count: '130+ Fans', color: 'bg-sky-50 text-sky-600' },
  { key: 'gpu', label: 'Graphics Cards', icon: Flame, count: '371+ GPUs', color: 'bg-rose-50 text-rose-600' },
  { key: 'cpu', label: 'Processors', icon: Cpu, count: '327+ CPUs', color: 'bg-blue-50 text-blue-600' },
  { key: 'motherboard', label: 'Motherboards', icon: Layers, count: '200+ Boards', color: 'bg-purple-50 text-purple-600' },
  { key: 'ram', label: 'RAM Memory', icon: Zap, count: '661+ Kits', color: 'bg-amber-50 text-amber-600' },
  { key: 'cooler', label: 'CPU Coolers', icon: Fan, count: '234+ Coolers', color: 'bg-cyan-50 text-cyan-600' },
  { key: 'storage', label: 'SSDs & Storage', icon: HardDrive, count: '194+ SSDs', color: 'bg-emerald-50 text-emerald-600' },
  { key: 'psu', label: 'Power Supplies', icon: Zap, count: '149+ PSUs', color: 'bg-orange-50 text-orange-600' },
  { key: 'monitor', label: 'Monitors', icon: Tv, count: '276+ Screens', color: 'bg-teal-50 text-teal-600' },
];

export default function EliteCategoriesGrid({ onSelectCategory }) {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-elite-border pb-2.5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-elite-navy">
            Featured Component Categories
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Sourced directly from authorized brand distributors across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className="bg-white border border-elite-border hover:border-elite-blue hover:shadow-elite-hover rounded-xl p-3 flex flex-col items-center text-center transition-all group"
            >
              <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-display group-hover:text-elite-blue transition-colors line-clamp-1">
                {cat.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

import React from 'react';
import { BookOpen, Code2, Database, Cpu, Brain, Layers, Binary, Coffee, Sparkles } from 'lucide-react';

interface BookCoverBadgeProps {
  title: string;
  author: string;
  categoryName?: string;
  coverStyle?: {
    bgGradient: string;
    accentColor: string;
    icon: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Code2,
  Database,
  Cpu,
  Brain,
  Layers,
  Binary,
  Coffee,
  Sparkles,
};

export const BookCoverBadge: React.FC<BookCoverBadgeProps> = ({
  title,
  author,
  categoryName,
  coverStyle,
  className = '',
  size = 'md',
}) => {
  const gradient = coverStyle?.bgGradient || 'from-slate-900 via-indigo-950 to-blue-950';
  const accent = coverStyle?.accentColor || '#D4AF37';
  const IconComponent = (coverStyle?.icon && ICON_MAP[coverStyle.icon]) || BookOpen;

  const sizeClasses = {
    sm: 'w-16 h-24 text-[9px] p-1.5',
    md: 'w-28 h-40 text-[11px] p-3',
    lg: 'w-44 h-64 text-xs p-4',
  }[size];

  return (
    <div
      className={`relative shrink-0 rounded-md overflow-hidden bg-gradient-to-br ${gradient} shadow-lg border border-slate-700/60 flex flex-col justify-between select-none ${sizeClasses} ${className}`}
      style={{
        boxShadow: `0 8px 20px -4px rgba(0,0,0,0.6), inset 3px 0 6px -2px rgba(255,255,255,0.15), inset -2px 0 4px -2px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Book spine simulation lines */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
      <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-black/40 pointer-events-none" />

      {/* Foil frame accent */}
      <div
        className="absolute inset-1.5 rounded border pointer-events-none opacity-40"
        style={{ borderColor: accent }}
      />

      {/* Top Header / Category */}
      <div className="relative z-10 pl-2">
        <div
          className="uppercase tracking-widest font-semibold truncate text-[9px]"
          style={{ color: accent }}
        >
          {categoryName || 'Academic Edition'}
        </div>
      </div>

      {/* Center Icon & Title */}
      <div className="relative z-10 my-auto text-center px-1">
        <div className="inline-flex p-1.5 rounded-full bg-black/30 border border-white/10 mb-1">
          <IconComponent className="w-4 h-4 text-slate-200" style={{ color: accent }} />
        </div>
        <div className="font-display font-bold text-slate-100 leading-tight line-clamp-2 drop-shadow-sm">
          {title}
        </div>
      </div>

      {/* Bottom Author & Gold Line */}
      <div className="relative z-10 text-center border-t border-white/10 pt-1">
        <div className="text-slate-300 font-medium truncate drop-shadow-sm">
          {author}
        </div>
        <div
          className="h-[2px] w-8 mx-auto mt-0.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  );
};

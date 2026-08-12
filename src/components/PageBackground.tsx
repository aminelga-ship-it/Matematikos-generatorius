import { Pi, Sigma, FunctionSquare } from 'lucide-react';

const GRID_STYLE = {
  backgroundImage: [
    'linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
    'linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '48px 48px',
} as const;

const FLOATING_ICONS = [
  { id: 'pi', Icon: Pi, className: 'top-[12%] left-[8%] text-blue-400/20', size: 48, delay: '0s' },
  { id: 'sigma', Icon: Sigma, className: 'top-[22%] right-[10%] text-violet-400/20', size: 40, delay: '1.5s' },
  { id: 'function', Icon: FunctionSquare, className: 'bottom-[28%] left-[14%] text-indigo-400/15', size: 44, delay: '3s' },
] as const;

export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 55%)',
        }}
      />
      <div className="absolute inset-0" style={GRID_STYLE} />
      {FLOATING_ICONS.map(({ id, Icon, className, size, delay }) => (
        <Icon
          key={id}
          size={size}
          strokeWidth={1.25}
          className={`absolute animate-pulse-slow ${className}`}
          style={{ animationDelay: delay }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" />
    </div>
  );
}

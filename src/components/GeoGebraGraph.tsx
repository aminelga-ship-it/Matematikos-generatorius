import React, { useEffect, useId, useRef } from 'react';

interface GeoGebraGraphProps {
  equation?: string | null;
  height?: number;
}

declare global {
  interface Window {
    GGBApplet?: new (
      params: Record<string, unknown>,
      useBrowserForJS: boolean,
    ) => { inject: (elementId: string) => void };
  }
}

function measureContainerWidth(el: HTMLElement): number {
  return Math.max(280, Math.floor(el.getBoundingClientRect().width));
}

export const GeoGebraGraph: React.FC<GeoGebraGraphProps> = ({ equation, height = 260 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const elementId = `ggb-${rawId.replace(/:/g, '')}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const injectGeoGebra = () => {
      if (cancelled || !window.GGBApplet) return;

      const width = measureContainerWidth(container);

      const mount = document.createElement('div');
      mount.id = elementId;
      mount.style.width = '100%';
      mount.style.minHeight = `${height}px`;
      container.replaceChildren(mount);

      const params = {
        appName: 'graphing',
        width,
        height,
        showToolBar: false,
        showAlgebraInput: false,
        showMenuBar: false,
        showResetIcon: true,
        enableRightClick: false,
        enableShiftDragZoom: true,
        appletOnLoad: (api: { evalCommand: (cmd: string) => void }) => {
          if (equation && api) {
            const cleanEq = equation.replace(/^y\s*=\s*/, '').trim();
            try {
              api.evalCommand(`f(x) = ${cleanEq}`);
            } catch (e) {
              console.warn('GeoGebra komandos klaida:', e);
            }
          }
        },
      };

      if (!document.getElementById(elementId)) return;
      const ggbApplet = new window.GGBApplet(params, true);
      ggbApplet.inject(elementId);
    };

    const start = () => {
      if (window.GGBApplet) {
        injectGeoGebra();
      } else {
        interval = setInterval(() => {
          if (window.GGBApplet) {
            clearInterval(interval);
            injectGeoGebra();
          }
        }, 100);
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(start));

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      container.replaceChildren();
    };
  }, [equation, height, elementId]);

  return (
    <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-1.5 text-xs font-semibold text-slate-600">GeoGebra grafikas</div>
      <div
        ref={containerRef}
        className="ggb-graph-host w-full overflow-hidden rounded-lg bg-slate-50 [&_iframe]:max-w-full"
        style={{ minHeight: height }}
      />
    </div>
  );
};

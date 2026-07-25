import React, { useEffect } from 'react';

interface GeoGebraGraphProps {
  equation?: string | null;
  height?: number;
}

declare global {
  interface Window {
    GGBApplet?: any;
  }
}

export const GeoGebraGraph: React.FC<GeoGebraGraphProps> = ({ equation, height = 500 }) => {
  useEffect(() => {
    // Parameterai iš GeoGebra dokumentacijos
    const params = {
      appName: 'graphing',
      width: 800,
      height: height,
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: true,
      showResetIcon: true,
      appletOnLoad: (api: any) => {
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

    const injectGeoGebra = () => {
      if (window.GGBApplet) {
        const ggbApplet = new window.GGBApplet(params, true);
        // Tiesiogiai inject'iname į div su id "ggb-element"
        ggbApplet.inject('ggb-element');
      }
    };

    // Jei skriptas jau užsikrovęs – leidžiame iškart
    if (window.GGBApplet) {
      injectGeoGebra();
    } else {
      // Jei skriptas dar kraunasi iš index.html, tikriname kas 100ms
      const interval = setInterval(() => {
        if (window.GGBApplet) {
          clearInterval(interval);
          injectGeoGebra();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [equation, height]);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 font-semibold text-slate-700">📐 GeoGebra Braižyklė</div>
    
      <div id="ggb-element" className="w-full overflow-hidden rounded-lg min-h-[500px] bg-slate-50" />
    </div>
  );
};
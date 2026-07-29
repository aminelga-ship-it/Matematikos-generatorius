import React from 'react';
import type { DiagramConfig, DiagramType } from '../lib/types';

interface Props {
  config: DiagramConfig;
}

const VALID_TYPES: DiagramType[] = [
  'SQUARE', 'RECTANGLE', 'RHOMBUS', 'PARALLELOGRAM', 'TRAPEZOID',
  'RIGHT_TRIANGLE', 'TRIANGLE', 'CIRCLE',
  'CUBE', 'CUBOID', 'SQUARE_PYRAMID', 'TRIANGULAR_PYRAMID',
  'CONE', 'CYLINDER',
];

export const GeometryVisualizer: React.FC<Props> = ({ config }) => {
  const shape = (config.type ?? '').toUpperCase().trim() as DiagramType;
  const labels = config.labels || {};

  if (!VALID_TYPES.includes(shape)) {
    console.log(`Unknown diagram type: ${config.type}`);
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 my-4 shadow-sm select-none">
      <svg
        width="280"
        height="220"
        viewBox="0 0 280 220"
        className="stroke-slate-800 fill-none stroke-2 text-xs font-sans text-slate-800"
      >
        {/* ==================== 2D FIGŪROS ==================== */}

        {/* 1. KVADRATAS */}
        {(shape === 'SQUARE' || shape === 'KVADRATAS') && (
          <g>
            <rect x="80" y="50" width="120" height="120" className="fill-slate-50 stroke-slate-800 stroke-2" />
            {labels.a && <text x="140" y="188" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="65" y="115" textAnchor="end" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
          </g>
        )}

        {/* 2. STAČIAKAMPIS */}
        {(shape === 'RECTANGLE' || shape === 'STAČIAKAMPIS') && (
          <g>
            <rect x="50" y="60" width="180" height="100" className="fill-slate-50 stroke-slate-800 stroke-2" />
            {labels.a && <text x="140" y="178" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="240" y="115" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
          </g>
        )}

        {/* 3. ROMBAS */}
        {(shape === 'RHOMBUS' || shape === 'ROMBAS') && (
          <g>
            <polygon points="140,30 210,110 140,190 70,110" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <line x1="70" y1="110" x2="210" y2="110" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="140" y1="30" x2="140" y2="190" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            {labels.a && <text x="185" y="65" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.d1 && <text x="175" y="105" textAnchor="middle" className="fill-slate-600 text-[10px] stroke-none">{labels.d1}</text>}
            {labels.d2 && <text x="132" y="150" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.d2}</text>}
          </g>
        )}

        {/* 4. LYGIAGRETAINIS */}
        {(shape === 'PARALLELOGRAM' || shape === 'LYGIAGRETAINIS') && (
          <g>
            <polygon points="80,50 230,50 200,160 50,160" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <line x1="80" y1="50" x2="80" y2="160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            {labels.a && <text x="125" y="178" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="55" y="100" textAnchor="end" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
            {labels.h && <text x="73" y="110" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}

        {/* 5. TRAPECIJA */}
        {(shape === 'TRAPEZOID' || shape === 'TRAPECIJA') && (
          <g>
            <polygon points="90,50 190,50 230,160 50,160" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <line x1="90" y1="50" x2="90" y2="160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            {labels.a && <text x="140" y="42" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="140" y="178" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
            {labels.h && <text x="83" y="110" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}

        {/* 6. STATUSIS TRIKAMPIS */}
        {(shape === 'RIGHT_TRIANGLE' || shape === 'STATUSIS_TRIKAMPIS') && (
          <g>
            <polygon points="60,40 60,170 210,170" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <path d="M 60,155 L 75,155 L 75,170" className="stroke-slate-600 stroke-1" />
            {labels.a && <text x="50" y="110" textAnchor="end" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="135" y="188" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
            {labels.c && <text x="145" y="100" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.c}</text>}
          </g>
        )}

        {/* 7. TRIKAMPIS */}
        {(shape === 'TRIANGLE' || shape === 'ISOSCELES_TRIANGLE' || shape === 'TRIKAMPIS') && (
          <g>
            <polygon points="140,40 220,170 60,170" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="140" y2="170" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            {labels.a && <text x="140" y="188" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="190" y="105" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
            {labels.h && <text x="132" y="110" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}

        {/* 8. APSKRITIMAS */}
        {(shape === 'CIRCLE' || shape === 'APSKRITIMAS') && (
          <g>
            <circle cx="140" cy="110" r="75" className="fill-slate-50 stroke-slate-800 stroke-2" />
            <circle cx="140" cy="110" r="3" className="fill-slate-800 stroke-none" />
            <line x1="140" y1="110" x2="215" y2="110" className="stroke-slate-800 stroke-2 [stroke-dasharray:4,4]" />
            {labels.r && <text x="177" y="102" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.r}</text>}
          </g>
        )}


        {/* ==================== 3D FIGŪROS ==================== */}

        {/* 9. KUBAS */}
        {(shape === 'CUBE' || shape === 'KUBAS') && (
          <g>
            {/* Nematomi kraštai */}
            <line x1="70" y1="130" x2="70" y2="50" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="70" y1="130" x2="150" y2="130" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="70" y1="130" x2="110" y2="170" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            
            {/* Matomi priekiniai ir viršutiniai kraštai */}
            <polygon points="110,90 190,90 190,170 110,170" className="fill-slate-50/50 stroke-slate-800 stroke-2" />
            <polygon points="70,50 150,50 190,90 110,90" className="fill-slate-50/50 stroke-slate-800 stroke-2" />
            <polygon points="150,50 190,90 190,170 150,130" className="fill-slate-50/50 stroke-slate-800 stroke-2" />
            
            {/* Žymėjimas */}
            {labels.a && <text x="150" y="188" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
          </g>
        )}

        {/* 10. STAČIAKAMPIS GRETASIENIS */}
        {(shape === 'CUBOID' || shape === 'GRETASIENIS' || shape === 'STACIAKAMPIS_GRETASIENIS') && (
          <g>
            {/* Nematomi kraštai */}
            <line x1="60" y1="120" x2="60" y2="50" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="60" y1="120" x2="180" y2="120" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="60" y1="120" x2="100" y2="170" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Matomi kraštai */}
            <polygon points="100,100 220,100 220,170 100,170" className="fill-slate-50/50 stroke-slate-800 stroke-2" />
            <polygon points="60,50 180,50 220,100 100,100" className="fill-slate-50/50 stroke-slate-800 stroke-2" />
            <polygon points="180,50 220,100 220,170 180,120" className="fill-slate-50/50 stroke-slate-800 stroke-2" />

            {/* Žymėjimai */}
            {labels.a && <text x="160" y="188" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.b && <text x="230" y="140" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.b}</text>}
            {labels.h && <text x="205" y="80" textAnchor="start" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}

        {/* 11. KETURKAMPE PIRAMIDE */}
        {(shape === 'SQUARE_PYRAMID' || shape === 'KETURKAMPE PIRAMIDE' || shape === 'KETURKAMPĖ PIRAMIDĖ') && (
          <g>
            {/* Pagrindo nematomi kraštai */}
            <polygon points="60,150 140,130 220,150 140,180" className="fill-slate-50/30 stroke-slate-800 stroke-2" />
            <line x1="60" y1="150" x2="140" y2="130" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="140" y1="130" x2="220" y2="150" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            
            {/* Aukštinė ir įstrižainės centre */}
            <line x1="140" y1="40" x2="140" y2="152" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Šoninės briaunos */}
            <line x1="140" y1="40" x2="60" y2="150" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="220" y2="150" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="140" y2="180" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="140" y2="130" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Žymėjimai */}
            {labels.a && <text x="180" y="172" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.h && <text x="132" y="95" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
            {labels.l && <text x="185" y="90" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.l}</text>}
          </g>
        )}

        {/* 12. TRIKAMPE PIRAMIDE */}
        {(shape === 'TRIANGULAR_PYRAMID' || shape === 'TRIKAMPE_PIRAMIDE') && (
          <g>
            <polygon points="60,160 220,160 140,185" className="fill-slate-50/30 stroke-slate-800 stroke-2" />
            <line x1="60" y1="160" x2="140" y2="135" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="220" y1="160" x2="140" y2="135" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="140" y1="40" x2="140" y2="135" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Šoninės briaunos */}
            <line x1="140" y1="40" x2="60" y2="160" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="220" y2="160" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="140" y2="185" className="stroke-slate-800 stroke-2" />

            {/* Žymėjimai */}
            {labels.a && <text x="180" y="180" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.a}</text>}
            {labels.h && <text x="132" y="95" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}

        {/* 13. KŪGIS */}
        {(shape === 'CONE' || shape === 'KŪGIS' || shape === 'KUGIS') && (
          <g>
            {/* Pagrindo elipsė */}
            <ellipse cx="140" cy="160" rx="75" ry="20" className="fill-slate-50/40 stroke-slate-800 stroke-2" />
            {/* Galinė elipsės dalis dashed */}
            <path d="M 65,160 A 75 20 0 0 1 215,160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            
            {/* Šoninės linijos */}
            <line x1="140" y1="40" x2="65" y2="160" className="stroke-slate-800 stroke-2" />
            <line x1="140" y1="40" x2="215" y2="160" className="stroke-slate-800 stroke-2" />

            {/* Aukštinė ir Spindulys */}
            <line x1="140" y1="40" x2="140" y2="160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="140" y1="160" x2="215" y2="160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Žymėjimai */}
            {labels.r && <text x="175" y="153" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.r}</text>}
            {labels.h && <text x="132" y="100" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
            {labels.l && <text x="185" y="95" textAnchor="start" className="fill-slate-800 font-semibold stroke-none">{labels.l}</text>}
          </g>
        )}

        {/* 14. RITINYS */}
        {(shape === 'CYLINDER' || shape === 'RITINYS') && (
          <g>
            {/* Viršutinis pagrindas */}
            <ellipse cx="140" cy="50" rx="70" ry="18" className="fill-slate-50 stroke-slate-800 stroke-2" />
            
            {/* Apatinis pagrindas */}
            <ellipse cx="140" cy="160" rx="70" ry="18" className="fill-slate-50/40 stroke-slate-800 stroke-2" />
            <path d="M 70,160 A 70 18 0 0 1 210,160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />

            {/* Šoninės sienos */}
            <line x1="70" y1="50" x2="70" y2="160" className="stroke-slate-800 stroke-2" />
            <line x1="210" y1="50" x2="210" y2="160" className="stroke-slate-800 stroke-2" />

            {/* Centrinė aukštinė ir spindulys */}
            <line x1="140" y1="50" x2="140" y2="160" className="stroke-slate-400 stroke-1 [stroke-dasharray:4,4]" />
            <line x1="140" y1="50" x2="210" y2="50" className="stroke-slate-800 stroke-1 [stroke-dasharray:4,4]" />

            {/* Žymėjimai */}
            {labels.r && <text x="175" y="44" textAnchor="middle" className="fill-slate-800 font-semibold stroke-none">{labels.r}</text>}
            {labels.h && <text x="132" y="110" textAnchor="end" className="fill-slate-600 text-[10px] stroke-none">{labels.h}</text>}
          </g>
        )}
      </svg>
    </div>
  );
};
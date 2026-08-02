/**
 * One-off helper: split generate-tasks/index.ts into modules.
 * Run: node scripts/split-generate-tasks.mjs
 */
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const fnDir = path.join(root, "supabase/functions/generate-tasks");
const indexPath = path.join(fnDir, "index.ts");
const lines = fs.readFileSync(indexPath, "utf8").split(/\r?\n/);

const gradeRulesHeader = `/**
 * Klasės programos — DETALŪS objektai (GRADE_N_RULES) + KOMPAKTIŠKOS eilutės į AI promptą.
 *
 * ## Naujai klasei (pvz. 2 kl.) — principas
 *
 * 1. **GRADE_2_RULES** — pilna struktūra (topics, theory, skills, forbidden, number_limits…).
 *    Tai tavo „šaltinis tiesai“ ir dokumentacija; į OpenAI promptą **nekeliama** visa.
 * 2. **buildGrade2Section()** — 1–3 eilutės: temų sąrašas, skaičių limitai, draudimai.
 *    Žr. pavyzdžius: \`buildGrade5Section\`, \`buildGrade1Section\`.
 * 3. **GRADE_CURRICULUM_SECTIONS[2] = buildGrade2Section** — registracija žemėlapyje.
 * 4. Jei reikia papildomų taisyklių (ne į programą) — **buildGradeConstraints(2)** switch.
 *
 * Pilnas šablonas: \`gradeRules.example.ts\`.
 */

`;

function exportify(line) {
  if (line.startsWith("const gradeDescriptions")) return "export " + line;
  if (line.startsWith("const GRADE_")) return "export " + line;
  if (line.startsWith("const TOPIC_") || line.startsWith("const FORBIDDEN_")) return "export " + line;
  if (line.startsWith("function buildGrade")) return "export " + line;
  return line;
}

const gradeBody = lines.slice(48, 602).map(exportify).join("\n");
const gradeFooter = `
const GRADE_CURRICULUM_SECTIONS: Partial<Record<number, () => string>> = {
  1: buildGrade1Section,
  5: buildGrade5Section,
  7: buildGrade7Section,
  8: buildGrade8Section,
  9: buildGrade9Section,
};

export function buildGradeCurriculumSection(grade: number): string {
  const fn = GRADE_CURRICULUM_SECTIONS[grade];
  return fn ? fn() : "";
}

export function buildGradeConstraints(grade: number): string {
  if (grade === 3) return \`3 KL.: DRAUDŽIAMA dvi trupmenos viename veiksme; trupmena tik kaip dalis ar $n\\\\times\\\\frac{a}{b}$; dauguma užduočių be trupmenų.\`;

  if (grade === 7) return \`7 KL. laipsniai: ne tik $2^5$ — naudok savybes ($a^m\\\\cdot a^n$, $(a^m)^n$, $a^0$ ir pan.).\`;

  if (grade === 5) return "";

  return "";
}
`;

fs.writeFileSync(path.join(fnDir, "gradeRules.ts"), gradeRulesHeader + gradeBody + gradeFooter);

const diagramTs = `export type DiagramType =
  | "SQUARE" | "RECTANGLE" | "RHOMBUS" | "PARALLELOGRAM" | "TRAPEZOID"
  | "RIGHT_TRIANGLE" | "TRIANGLE" | "CIRCLE"
  | "CUBE" | "CUBOID" | "SQUARE_PYRAMID" | "TRIANGULAR_PYRAMID"
  | "CONE" | "CYLINDER";

export interface DiagramConfig {
  type: DiagramType;
  labels: Record<string, string>;
}

const DIAGRAM_TYPES = [
  "SQUARE", "RECTANGLE", "RHOMBUS", "PARALLELOGRAM", "TRAPEZOID",
  "RIGHT_TRIANGLE", "TRIANGLE", "CIRCLE",
  "CUBE", "CUBOID", "SQUARE_PYRAMID", "TRIANGULAR_PYRAMID",
  "CONE", "CYLINDER",
] as const;

const DIAGRAM_TYPE_ALIASES: Record<string, string> = {
  KVADRATAS: "SQUARE",
  "STAČIAKAMPIS": "RECTANGLE",
  STACIAKAMPIS: "RECTANGLE",
  ROMBAS: "RHOMBUS",
  LYGIAGRETAINIS: "PARALLELOGRAM",
  TRAPECIJA: "TRAPEZOID",
  "STATUSIS_TRIKAMPIS": "RIGHT_TRIANGLE",
  STATUSIS_TRIKAMPIS: "RIGHT_TRIANGLE",
  TRIKAMPIS: "TRIANGLE",
  ISOSCELES_TRIANGLE: "TRIANGLE",
  APSKRITIMAS: "CIRCLE",
  KUBAS: "CUBE",
  GRETASIENIS: "CUBOID",
  "STACIAKAMPIS_GRETASIENIS": "CUBOID",
  "STAČIAKAMPIS_GRETASIENIS": "CUBOID",
  "KETURKAMPE_PIRAMIDE": "SQUARE_PYRAMID",
  "KETURKAMPĖ_PIRAMIDĖ": "SQUARE_PYRAMID",
  KETURKAMPE_PIRAMIDE: "SQUARE_PYRAMID",
  "KETURKAMPIS": "SQUARE_PYRAMID",
  "TRIKAMPE_PIRAMIDE": "TRIANGULAR_PYRAMID",
  "TRIKAMPĖ_PIRAMIDĖ": "TRIANGULAR_PYRAMID",
  TRIKAMPE_PIRAMIDE: "TRIANGULAR_PYRAMID",
  "KŪGIS": "CONE",
  KUGIS: "CONE",
  RITINYS: "CYLINDER",
};

export function normalizeDiagramType(raw: string): DiagramType | null {
  const upper = raw.toUpperCase().trim();
  if ((DIAGRAM_TYPES as readonly string[]).includes(upper)) return upper as DiagramType;
  const aliased = DIAGRAM_TYPE_ALIASES[upper];
  if (aliased) return aliased as DiagramType;
  return null;
}

export function buildDiagramSection(): string {
  return \`BRĖŽINYS (diagram_config): type ∈ {\${DIAGRAM_TYPES.join(", ")}}. labels — tik raktai iš teksto (a,b,h,r,…); nežinoma "?"; ne plotas/perimetras. Pvz. TRIANGLE + {"a":"5 cm","b":"?","c":"6 cm"}.\`;
}
`;

fs.writeFileSync(path.join(fnDir, "diagram.ts"), diagramTs);

const promptTs = `import {
  buildGradeConstraints,
  buildGradeCurriculumSection,
  gradeDescriptions,
} from "./gradeRules.ts";
import { buildDiagramSection } from "./diagram.ts";

const difficultyDescriptions: Record<string, string> = {
  lengvos: "Lengvos: 1 aiškus žingsnis, tiesioginis taikymas.",
  vidutinės: \`Vidutinės: ≥2 nepriklausomi loginiai žingsniai. Draudžiama: vienas formulės įstatymas su visomis reikšmėmis (per lengva). Pirmiau rask trūkstamą dydį, tada naudok toliau arba sujunk 2 taisykles.\`,
  sunkios: \`Sunkios (9–12 kl., VBE lygis): 4–6 žingsniai; keitimas kintamuoju (t=2^x, sin x=t); ODA/intervalai su $\\\\cup$/$\\\\cap$; kombinuotos sąlygos. Tipai: rodiklinės/log/trig. nelygybės, modulis. Be trivialių vieno žingsnio lygčių.\`,
};

export function selectModel(grade: number): string {
  return grade <= 6 ? "gpt-4o-mini" : "gpt-4o";
}

function buildDifficultyDescription(difficulty: string, grade: number): string {
  if (difficulty === "savarankiskas") {
    return buildDifficultyDescription("vidutinės", grade);
  }
  if (difficulty === "sunkios") {
    if (grade <= 4) {
      return \`Sunkios (\${grade} kl.): 3–4 aritmetiniai veiksmai arba nestandartinis tekstinis; be algebros.\`;
    }
    if (grade <= 6) {
      return \`Sunkios (\${grade} kl.): 3–4 loginiai žingsniai; kombinuoti dydžius (geometrija — ne duoti visų kraštinių; procentai/trupmenos — ne vienas veiksmas). Draudžiama: vienas skaičiavimas, algebrinės lygtys su x.\`;
    }
    if (grade <= 8) {
      return \`Sunkios (\${grade} kl.): ≥3–4 žingsniai, kelios taisyklės (lygčių sistemos, Pitagoras+algebra).\`;
    }
    return difficultyDescriptions["sunkios"];
  }

  if (difficulty === "vidutinės") {
    const base = difficultyDescriptions["vidutinės"];
    if (grade >= 5 && grade <= 6) {
      return base + " 5–6 kl.: didesni skaičiai, skliaustai, trupmenos su skirtingais vardikliais, paprasti tekstiniai.";
    }
    if (grade >= 7 && grade <= 8) {
      return base + " 7–8 kl. geometrija: ≥2 faktai (kampų suma/lygiagretumas/plotas→perimetras); kampams — algebrinės išraiškos, ne tik skaičiai.";
    }
    return base;
  }

  return difficultyDescriptions["lengvos"];
}

export const SAVARANKISKAS_MIN_TASKS = 5;

function splitSavarankiskasTaskCounts(total: number): {
  lengvos: number;
  vidutinės: number;
  sunkios: number;
} {
  const lengvos = Math.floor(total * 0.4);
  const vidutinės = Math.floor(total * 0.4);
  const sunkios = total - lengvos - vidutinės;
  return { lengvos, vidutinės, sunkios };
}

function buildSavarankiskasDifficultyBlock(
  grade: number,
  counts: { lengvos: number; vidutinės: number; sunkios: number },
): string {
  return \`Savarankiškas darbas: \${counts.lengvos} lengvų, \${counts.vidutinės} vidutinių, \${counts.sunkios} sunkių — ta pati tematika. Sunkumas: \${buildDifficultyDescription("lengvos", grade)} | \${buildDifficultyDescription("vidutinės", grade)} | \${buildDifficultyDescription("sunkios", grade)}\`;
}

function buildFormattingSection(grade: number): string {
  if (grade <= 4) return "Formatavimas: $...$ reiškiniams; JSON \\\\\\\\cdot ir kt.";
  if (grade <= 6) return "Formatavimas: trupmenos $\\\\frac{a}{b}$; procentai $n\\\\%$.";
  if (grade <= 10) return "Formatavimas: $\\\\frac{}{}$, $\\\\sqrt{}$, $\\\\leq$, kintamieji $x$.";
  return "Formatavimas: + trig./log.; $\\\\cup$, $\\\\cap$ intervalams.";
}

function buildTerminologySection(grade: number): string {
  if (grade >= 11) return "Terminai: pilna VBE terminologija (derivata, integralas…).";
  if (grade === 10) return "Terminai: trig., log., parabolė, diskriminantas; ne derivata/integralas.";
  if (grade === 9) return "Terminai: kvadratinės lygtys, parabolė, trig. pradmenys; ne log./derivata.";
  if (grade >= 7) return "Terminai: lygtis, reiškinys, koordinatės, $|x|$; ne kvadratinės/trig./log.";
  if (grade >= 5) return "Terminai: trupmena, procentas, proporcija; ne lygtys/koordinatės.";
  return \`Terminai (\${grade} kl.): sudėtis, atimtis, daugyba, dalyba\${grade >= 3 ? ", trupmena" : ""}.\`;
}

const USER_MESSAGE_JSON_SUFFIX = '\\nGrąžink tik JSON su "tasks".';

const USER_PROMPT_MAX_LEN = 2500;

function normalizeUserPrompt(raw: string): string {
  let s = raw.trim().replace(/\\s+/g, " ");
  if (s.length > USER_PROMPT_MAX_LEN) {
    s = s.slice(0, USER_PROMPT_MAX_LEN) + "…";
  }
  return s;
}

let staticSystemPromptCore: string | null = null;

const STATIC_LATEX_AND_JSON_RULES = \`LATEX IR JSON (visos klasės):
- Matematines išraiškas apgaub $...$ (inline) arba $$...$$ (atskira eilutė).
- Trupmenos JSON atsakyme: VISADA \\\\\\\\frac{a}{b}, ne pasvirasis brūkšnis.
- Kintamieji, simboliai, trig., log.: standartinis LaTeX JSON faile su dvigubu backslash (\\\\\\\\cdot, \\\\\\\\leq, \\\\\\\\sqrt, \\\\\\\\sin ir t.t.).
- Grąžink tik JSON objektą su "tasks" masyvu — be markdown, be paaiškinimų už JSON.\`;

function getStaticSystemPromptCore(): string {
  if (staticSystemPromptCore) return staticSystemPromptCore;
  staticSystemPromptCore = \`LT matematikos mokytojas — užduotys lietuviškai (LT BP).

Tipas: gryna matematika (lygtis/reiškinys/skaičiavimas) be teksto; tekstinį tik jei vartotojas prašo žodinės/gyvenimiškos.

\${STATIC_LATEX_AND_JSON_RULES}

Tikslumas: patikrink teiginius; geometrijoje Pitagoras/medianos tik jei leidžia sąlyga.

answer: glaustai — tik reikšmės, dalys per ; be etikečių ir sakinių.\`;
  return staticSystemPromptCore;
}

function getStaticSystemPromptPrefix(withDiagram: boolean, withGraph: boolean): string {
  let s = getStaticSystemPromptCore();
  if (withDiagram) s += \`\\n\\n\${buildDiagramSection()}\`;
  if (withGraph) {
    s += \`\\nfunction_equation: "y=2*x-3", "y=x^2-4"; * daugybai, ^ laipsniui; prasideda y=.\`;
  }
  return s;
}

function buildVariableSystemPromptSuffix(
  grade: number,
  difficulty: string,
  taskCount: number,
  withDiagram: boolean,
  withGraph: boolean,
  withSolution: boolean,
): string {
  const graphEquationRule = withGraph
    ? \`Grafikas: kiekvienoje užduotyje "function_equation".\`
    : \`Grafikas: nebent užduotis apie funkciją.\`;

  const solutionField = withSolution ? \`"solution":"…",\` : \`"solution":"",\`;

  const jsonExample = withDiagram
    ? \`{"tasks":[{"question":"…","answer":"$x=3$",\${solutionField}"diagram_config":{"type":"TRIANGLE","labels":{"a":"5 cm","b":"?"}}\${withGraph ? ',"function_equation":"y=x^2-4"' : ""}}]}\`
    : \`{"tasks":[{"question":"…","answer":"$x=3$",\${solutionField}\${withGraph ? '"function_equation":"y=2*x-1"' : ""}}]}\`;

  const solutionBlock = withSolution
    ? \`Sprendimai: PRIVALOMA, glaustai 3–4 žingsniai. Savikra: patikrink answer.\`
    : \`Sprendimai: "solution"="" visur. Tik teisingas glaustas answer.\`;

  const difficultyBlock =
    difficulty === "savarankiskas"
      ? buildSavarankiskasDifficultyBlock(grade, splitSavarankiskasTaskCounts(taskCount))
      : \`Sunkumo lygis (taikyti): \${buildDifficultyDescription(difficulty, grade)}\`;

  const curriculumSection = buildGradeCurriculumSection(grade);

  return \`
=== Užklausa (\${taskCount} užd.) ===
Klasė: \${gradeDescriptions[grade] ?? grade}
\${curriculumSection}
\${difficultyBlock}
\${buildGradeConstraints(grade)}
Brėžinys: \${withDiagram ? "diagram_config kai reikia" : "ne"}; \${graphEquationRule}
\${buildTerminologySection(grade)}; \${buildFormattingSection(grade)}
\${solutionBlock}
JSON (tiksliai \${taskCount}): \${jsonExample}\`;
}

export function buildSystemPrompt(
  grade: number,
  difficulty: string,
  taskCount: number,
  withDiagram: boolean,
  withGraph: boolean,
  withSolution: boolean,
): string {
  return getStaticSystemPromptPrefix(withDiagram, withGraph) +
    buildVariableSystemPromptSuffix(grade, difficulty, taskCount, withDiagram, withGraph, withSolution);
}

export function buildUserMessage(_taskCount: number, prompt: string): string {
  return normalizeUserPrompt(prompt);
}

export function buildImageUserContent(
  taskCount: number,
  prompt: string,
  imageBase64: string,
): object[] {
  const mimeMatch = imageBase64.match(/^data:(image\\/[a-z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const base64Data = imageBase64.replace(/^data:image\\/[a-z]+;base64,/, "");

  const p = normalizeUserPrompt(prompt);
  const textPart =
    p.length >= 3 ? \`\${p}\${USER_MESSAGE_JSON_SUFFIX}\` : (taskCount <= 1 ? \`Sukurk panašią užduotį\${USER_MESSAGE_JSON_SUFFIX}\` : \`Sukurk \${taskCount} panašias užduotis\${USER_MESSAGE_JSON_SUFFIX}\`);

  return [
    { type: "image_url", image_url: { url: \`data:\${mimeType};base64,\${base64Data}\`, detail: "low" } },
    { type: "text", text: textPart },
  ];
}
`;

fs.writeFileSync(path.join(fnDir, "prompt.ts"), promptTs);

const taskLatexTs = `import type { DiagramConfig } from "./diagram.ts";
import { normalizeDiagramType } from "./diagram.ts";

export interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
  bank_item_id?: string;
}

function fixLatex(text: string): string {
  return text
    .replace(/\\u000C([a-zA-Z]+)/g, "\\\\f$1")
    .replace(/\\u0008([a-zA-Z]+)/g, "\\\\b$1")
    .replace(/\\u0009(ext\\{)/g, "\\\\text{")
    .replace(/\\u0009(heta\\b)/g, "\\\\theta")
    .replace(/\\u0009(imes\\b)/g, "\\\\times")
    .replace(/\\u0009(an(?:h)?\\b)/g, "\\\\t$1")
    .replace(/\\u0009(o\\b)/g, "\\\\to")
    .replace(/\\\\\\\\([a-zA-Z]+)/g, "\\\\$1")
    .replace(/\\\\\\\\,/g, "\\\\,")
    .replace(/\\\\\\\\!/g, "\\\\!")
    .replace(/\\\\\\\\;/g, "\\\\;")
    .replace(/\\\\\\\\:/g, "\\\\:");
}

export function fixTaskLatex(task: Task): Task {
  const fixed: Task = {
    question: fixLatex(task.question),
    answer: fixLatex(task.answer),
    solution: fixLatex(task.solution),
    diagram_config: task.diagram_config,
    function_equation: task.function_equation,
  };
  if (fixed.diagram_config?.type) {
    const normalized = normalizeDiagramType(String(fixed.diagram_config.type));
    if (!normalized) {
      console.log(\`Unknown diagram type: \${fixed.diagram_config.type}\`);
    }
    fixed.diagram_config = { ...fixed.diagram_config, type: normalized ?? fixed.diagram_config.type };
  }
  return fixed;
}
`;

fs.writeFileSync(path.join(fnDir, "taskLatex.ts"), taskLatexTs);

// Slim index: lines 1-47 + handler from 953-end, minus extracted blocks
const head = lines.slice(0, 47).join("\n");
const tail = lines.slice(952).join("\n");

const newHead = `import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { insertTasksAsBankDrafts, selectTasksFromBank, type BankDifficulty } from "./bank.ts";
import type { DiagramConfig } from "./diagram.ts";
import {
  buildImageUserContent,
  buildSystemPrompt,
  buildUserMessage,
  SAVARANKISKAS_MIN_TASKS,
  selectModel,
} from "./prompt.ts";
import { fixTaskLatex, type Task } from "./taskLatex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TaskRequest {
  grade: number;
  taskCount: number;
  prompt: string;
  difficulty: string;
  imageBase64?: string;
  withDiagram?: boolean;
  withGraph?: boolean;
  /** Default false — taupo tokenus, kai sprendimų nereikia */
  withSolution?: boolean;
  /** Vystymui: kartu su DEV_GUEST_AS_PRO secret svečiui suteikia PRO limitus */
  devGuestPro?: boolean;
  /** Savarankiškam darbui — potemių ID sąrašas */
  subtopicIds?: string[];
  /** Savarankiškam darbui — temų be potemių ID sąrašas */
  topicIds?: string[];
}

function bankDifficultyFromRequest(difficulty: string): BankDifficulty {
  if (difficulty === "lengvos" || difficulty === "sunkios") return difficulty;
  return "vidutinės";
}

async function incrementProfileUsage(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  usedRequests: number,
  usedTasks: number,
  taskCount: number,
): Promise<void> {
  await supabaseAdmin
    .from("profiles")
    .update({
      used_requests: usedRequests + 1,
      used_tasks: usedTasks + taskCount,
    })
    .eq("id", userId);
}

`;

fs.writeFileSync(indexPath, newHead + "\n" + tail);
console.log("Wrote gradeRules.ts, diagram.ts, prompt.ts, taskLatex.ts, slim index.ts");

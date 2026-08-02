import {
  buildGradeConstraints,
  buildGradeCurriculumSection,
  buildGrade8DifficultyDescription,
  buildGradeProgramDifficultyDescription,
  gradeDescriptions,
} from "./gradeRules.ts";
import { buildDiagramSection } from "./diagram.ts";

const HARD_MULTI_TOPIC =
  " Privaloma: sujunk ≥2 skirtingas programos temas ar teorijas; nestandartinė/originali sąlyga (ne tipinis vadovėlio pavyzdys); reikia pasirinkti sprendimo strategiją.";

const difficultyDescriptions: Record<string, string> = {
  lengvos: "Lengvos: 1 aiškus žingsnis, tiesioginis taikymas.",
  vidutinės: `Vidutinės: ≥2 nepriklausomi loginiai žingsniai. Draudžiama: vienas formulės įstatymas su visomis reikšmėmis (per lengva). Pirmiau rask trūkstamą dydį, tada naudok toliau arba sujunk 2 taisykles.`,
  sunkios: `Sunkios (9–12 kl., VBE lygis): 4–6 žingsniai; keitimas kintamuoju (t=2^x, sin x=t); ODA/intervalai su $\\cup$/$\\cap$; kombinuotos sąlygos. Tipai: rodiklinės/log/trig. nelygybės, modulis. Be trivialių vieno žingsnio lygčių.${HARD_MULTI_TOPIC}`,
};

export function selectModel(grade: number): string {
  return grade <= 4 ? "gpt-4o-mini" : "gpt-4o";
}

/** 8 kl.: lengvoms šiek tiek žemesnė temperatūra; sunkioms — 0,7. */
export function selectTemperature(grade: number, difficulty: string): number {
  if (grade === 8 && difficulty === "lengvos") return 0.55;
  return 0.7;
}

export function buildDifficultyDescription(
  difficulty: string,
  grade: number,
  taskCount = 1,
  useProgramRules = true,
): string {
  if (useProgramRules) {
    if (difficulty === "savarankiskas" || difficulty === "ivairus") {
      const mixed = buildGradeProgramDifficultyDescription(grade, "vidutinės", taskCount);
      if (mixed) return mixed;
      return buildDifficultyDescription("vidutinės", grade, taskCount, false);
    }

    const fromProgram = buildGradeProgramDifficultyDescription(grade, difficulty, taskCount);
    if (fromProgram) return fromProgram;
  } else if (difficulty === "savarankiskas" || difficulty === "ivairus") {
    return buildDifficultyDescription("vidutinės", grade, taskCount, false);
  }

  if (difficulty === "sunkios") {
    if (grade <= 4) {
      return `Sunkios (${grade} kl.): 3–4 aritmetiniai veiksmai arba nestandartinis tekstinis; be algebros.${HARD_MULTI_TOPIC}`;
    }
    if (grade <= 6) {
      return `Sunkios (${grade} kl.): 3–4 loginiai žingsniai; kombinuoti dydžius (geometrija — ne duoti visų kraštinių; procentai/trupmenos — ne vienas veiksmas). Draudžiama: vienas skaičiavimas, algebrinės lygtys su x.${HARD_MULTI_TOPIC}`;
    }
    if (grade <= 8) {
      return `Sunkios (${grade} kl.): ≥3–4 žingsniai, kelios taisyklės (lygčių sistemos, Pitagoras+algebra).${HARD_MULTI_TOPIC}`;
    }
    return difficultyDescriptions["sunkios"];
  }

  if (difficulty === "vidutinės") {
    const base = difficultyDescriptions["vidutinės"];
    if (grade >= 5 && grade <= 6) {
      return base + " 5–6 kl.: didesni skaičiai, skliaustai, trupmenos su skirtingais vardikliais, paprasti tekstiniai.";
    }
    if (grade === 7) {
      return base + " 7 kl. geometrija: ≥2 faktai (kampų suma/lygiagretumas/plotas→perimetras); kampams — algebrinės išraiškos, ne tik skaičiai.";
    }
    return base;
  }

  return difficultyDescriptions["lengvos"];
}

export const SAVARANKISKAS_MIN_TASKS = 5;
/** Minimalus užduočių skaičius režimui „Įvairaus sudėtingumo“ (tekstas ir tema) */
export const IVAIRUS_MIN_TASKS = SAVARANKISKAS_MIN_TASKS;

export function isMixedDifficulty(difficulty: string): boolean {
  return difficulty === "ivairus" || difficulty === "savarankiskas";
}

export function splitSavarankiskasTaskCounts(total: number): {
  lengvos: number;
  vidutinės: number;
  sunkios: number;
} {
  const lengvos = Math.floor(total * 0.4);
  const vidutinės = Math.floor(total * 0.4);
  const sunkios = total - lengvos - vidutinės;
  return { lengvos, vidutinės, sunkios };
}

/** Tekstinis rėžimas „įvairaus sudėtingumo“: 20 / 40 / 40 */
export function splitIvairusTaskCounts(total: number): {
  lengvos: number;
  vidutinės: number;
  sunkios: number;
} {
  const lengvos = Math.floor(total * 0.2);
  const vidutinės = Math.floor(total * 0.4);
  const sunkios = total - lengvos - vidutinės;
  return { lengvos, vidutinės, sunkios };
}

export function splitMixedTaskCounts(
  difficulty: string,
  total: number,
): { lengvos: number; vidutinės: number; sunkios: number } {
  if (difficulty === "ivairus") return splitIvairusTaskCounts(total);
  return splitSavarankiskasTaskCounts(total);
}

function buildMixedDifficultyBlock(
  grade: number,
  difficulty: string,
  counts: { lengvos: number; vidutinės: number; sunkios: number },
  useProgramRules = true,
): string {
  const title = `Įvairaus sudėtingumo`;
  if (useProgramRules && grade === 8) {
    return `${title} (8 kl.): ${counts.lengvos} lengvų, ${counts.vidutinės} vidutinių, ${counts.sunkios} sunkių — ta pati tematika. Kiekvienam kiekiui taikyk atskirą bloką (lengvoms — be originalumo; sunkioms — privalomas originalumas).
LENGVOS×${counts.lengvos}: ${buildGrade8DifficultyDescription("lengvos")}
VIDUTINĖS×${counts.vidutinės}: ${buildGrade8DifficultyDescription("vidutinės")}
SUNKIOS×${counts.sunkios}: ${buildGrade8DifficultyDescription("sunkios", counts.sunkios)}`;
  }
  return `${title}: ${counts.lengvos} lengvų, ${counts.vidutinės} vidutinių, ${counts.sunkios} sunkių — ta pati tematika. Sunkios — žr. sunkių schemą. Sunkumas: ${buildDifficultyDescription("lengvos", grade, counts.lengvos, useProgramRules)} | ${buildDifficultyDescription("vidutinės", grade, counts.vidutinės, useProgramRules)} | ${buildDifficultyDescription("sunkios", grade, counts.sunkios, useProgramRules)}`;
}

function buildSavarankiskasDifficultyBlock(
  grade: number,
  counts: { lengvos: number; vidutinės: number; sunkios: number },
): string {
  return buildMixedDifficultyBlock(grade, "savarankiskas", counts);
}

function buildFormattingSection(grade: number): string {
  if (grade <= 4) return "Formatavimas: $...$ reiškiniams; JSON \\\\cdot ir kt.";
  if (grade <= 6) return "Formatavimas: trupmenos $\\frac{a}{b}$; procentai $n\\%$.";
  if (grade <= 10) return "Formatavimas: $\\frac{}{}$, $\\sqrt{}$, $\\leq$, kintamieji $x$.";
  return "Formatavimas: + trig./log.; $\\cup$, $\\cap$ intervalams.";
}

const LT_GEOMETRY_WORDING =
  "Geometrijos LT: statusis trikampis (ne „stačiasis trikampis“); įstrižainė (ne „diagonalė“); vidurio linija geometrijoje (ne „mediana“ — mediana tik statistikoje); statusio trikampio įžambinė ir statiniai.";

function buildTerminologySection(grade: number): string {
  let base: string;
  if (grade >= 11) base = "Terminai: pilna VBE terminologija (derivata, integralas…).";
  else if (grade === 10) base = "Terminai: trig., log., parabolė, diskriminantas; ne derivata/integralas.";
  else if (grade === 9) base = "Terminai: kvadratinės lygtys, parabolė, trig. pradmenys; ne log./derivata.";
  else if (grade === 8) base = "Terminai: šaknis, Pitagoras, lygčių sistema, vektorius, grupavimo būdas; ne modulis, ne kvadratinės lygtys, ne trupmeniniai reiškiniai (9 kl.), ne trig./log.";
  else if (grade >= 7) base = "Terminai: lygtis, reiškinys, koordinatės, $|x|$; ne kvadratinės/trig./log.";
  else if (grade >= 5) base = "Terminai: trupmena, procentas, proporcija; ne lygtys/koordinatės.";
  else base = `Terminai (${grade} kl.): sudėtis, atimtis, daugyba, dalyba${grade >= 3 ? ", trupmena" : ""}.`;
  return grade >= 5 ? `${base} ${LT_GEOMETRY_WORDING}` : base;
}

const USER_MESSAGE_JSON_SUFFIX = '\nGrąžink tik JSON su "tasks".';

export const DEFAULT_IMAGE_TASK_PROMPT = "Sukurk panašią užduotį";

export function defaultImageUserText(taskCount: number): string {
  if (taskCount <= 1) {
    return `${DEFAULT_IMAGE_TASK_PROMPT}${USER_MESSAGE_JSON_SUFFIX}`;
  }
  return `Sukurk ${taskCount} panašias užduotis${USER_MESSAGE_JSON_SUFFIX}`;
}

const USER_PROMPT_MAX_LEN = 2500;

function normalizeUserPrompt(raw: string): string {
  let s = raw.trim().replace(/\s+/g, " ");
  if (s.length > USER_PROMPT_MAX_LEN) {
    s = s.slice(0, USER_PROMPT_MAX_LEN) + "…";
  }
  return s;
}

/** Nuotrauka be papildomo teksto (≥3 simboliai) — minimalus AI kontekstas. */
export function isImageOnlyRequest(prompt: string, hasImage: boolean): boolean {
  return hasImage && normalizeUserPrompt(prompt).length < 3;
}

export type SystemPromptProfile = "topic" | "text" | "image-only";

let staticSystemPromptCore: string | null = null;

const STATIC_LATEX_AND_JSON_RULES = `LATEX IR JSON (visos klasės):
- Matematines išraiškas apgaub $...$ (inline) arba $$...$$ (atskira eilutė).
- Trupmenos JSON atsakyme: VISADA \\\\frac{a}{b}, ne pasvirasis brūkšnis.
- Kintamieji, simboliai, trig., log.: standartinis LaTeX JSON faile su dvigubu backslash (\\\\cdot, \\\\leq, \\\\sqrt, \\\\sin ir t.t.).
- Grąžink tik JSON objektą su "tasks" masyvu — be markdown, be paaiškinimų už JSON.`;

function getStaticSystemPromptCore(): string {
  if (staticSystemPromptCore) return staticSystemPromptCore;
  staticSystemPromptCore = `LT matematikos mokytojas — užduotys lietuviškai (LT BP).

Tipas: gryna matematika (lygtis/reiškinys/skaičiavimas) be teksto; tekstinį tik jei vartotojas prašo žodinės/gyvenimiškos.

${STATIC_LATEX_AND_JSON_RULES}

Tikslumas: patikrink teiginius; geometrijoje Pitagoras ir vidurio linija tik jei leidžia sąlyga.

answer: glaustai — tik reikšmės, dalys per ; be etikečių ir sakinių.`;
  return staticSystemPromptCore;
}

function buildElementaryArithmeticSection(grade: number): string {
  if (grade > 4) return "";
  return `
1–${grade} KL. SKAIČIAVIMAI (ne veiksmų eilutė — PRIVALOMA):
- „Veiksmų eilutė“ — tik kai reikia skaičiuoti pagal veiksmų tvarką (skliaustai, keli veiksmai vienoje išraiškoje, pvz. $2+3\\cdot4$). Tada skaičiavimas gali būti eilutėje; answer vis tiek tik skaičius (žr. žemiau).
- Visais kitais atvejais (sudėtis, atimtis, daugyba stulpeliu, dalyba kampu): rodomas skaičiavimas $$...$$ bloke (question arba solution) — stulpeliu (vienetai/dešimtys) arba dalyba kampu (daliklis, dalinys, dalmenys, liekana). DRAUDŽIAMA vienoje eilutėje „23+45=68“, „156:12=13“ be stulpelio/kampo.
- Stulpelio pavyzdys: $$\\begin{array}{r} 23 \\\\ + \\; 45 \\\\ \\hline 68 \\end{array}$$
- Kampo pavyzdys: naudok $$...$$ su dalybos kampu (ne inline, ne trupmena kaip galutinis atsakymas).

1–${grade} KL. ATSAKYMAS (answer — tik galutinis rezultatas):
- Tik skaičius (pvz. 68 arba $68$); vienetą (cm, kg…) pridėk tik jei užduoties kontekstas to reikalauja.
- DRAUDŽIAMA answer: stulpelis, kampas, $$ skaičiavimo blokai, \\\\frac{}{} kaip dalmens ar trupmenos forma.
- Dalyba su liekana: „13 liek. 3“ (pirmiausia dalmuo, tada liek.; žodis „liek.“). Be kampo ir be trupmenos.
- DRAUDŽIAMA: $x=68$, „Atsakymas: …“, sakiniai, paaiškinimai answer lauke.
- 1–4 kl. answer NEGALI naudoti \\\\frac — net jei bendroje instrukcijoje nurodyta trupmenų LaTeX forma (ji taikoma tik 5+ kl. answer arba trupmenų užduotims be dalybos kampo).
- solution (jei generuojamas): stulpelis/kampas leidžiamas; answer — visada tik skaičius (+ liek. jei reikia).`;
}

function getStaticSystemPromptPrefix(withDiagram: boolean, withGraph: boolean, grade: number): string {
  let s = getStaticSystemPromptCore();
  if (grade <= 4) s += buildElementaryArithmeticSection(grade);
  if (withDiagram) s += `\n\n${buildDiagramSection(grade)}`;
  if (withGraph) {
    s += `\nfunction_equation: "y=2*x-3", "y=x^2-4"; * daugybai, ^ laipsniui; prasideda y=.`;
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
  profile: SystemPromptProfile,
  topicSubtopicGuided = false,
): string {
  const useProgramRules = profile === "topic" && !topicSubtopicGuided;
  const isMixed = difficulty === "savarankiskas" || difficulty === "ivairus";
  const mixCounts = isMixed ? splitMixedTaskCounts(difficulty, taskCount) : null;
  const hardOnlySolutions = withSolution && difficulty === "ivairus" && mixCounts;
  const graphEquationRule = withGraph
    ? `Grafikas: kiekvienoje užduotyje "function_equation".`
    : `Grafikas: nebent užduotis apie funkciją.`;

  const solutionField = withSolution ? `"solution":"…",` : `"solution":"",`;

  const elementaryJsonAnswer = grade <= 4 ? '"answer":"68"' : '"answer":"$x=3$"';
  const elementaryQuestionSnippet =
    grade <= 4 && !withDiagram
      ? `"question":"Apskaičiuokite stulpeliu.\\n$$\\\\begin{array}{r} 23 \\\\\\\\ + \\\\; 45 \\\\\\\\ \\\\hline \\\\end{array}$$",`
      : `"question":"…",`;

  const jsonExample = withDiagram
    ? grade <= 4
      ? `{"tasks":[{"question":"Pagal brėžinį raskite kraštinės $X$ ilgį.","answer":"6 cm",${solutionField}"diagram_config":{"type":"RIGHT_TRIANGLE","labels":{"a":"6 cm","b":"X","c":"10 cm"}}${withGraph ? ',"function_equation":"y=x^2-4"' : ""}}]}`
      : `{"tasks":[{"question":"Pagal brėžinio duomenis raskite kraštinės $b$ ilgį.","answer":"$b=8$ cm",${solutionField}"diagram_config":{"type":"RIGHT_TRIANGLE","labels":{"a":"6 cm","b":"X","c":"10 cm"}}${withGraph ? ',"function_equation":"y=x^2-4"' : ""}}]}`
    : grade <= 4
      ? `{"tasks":[{${elementaryQuestionSnippet}${elementaryJsonAnswer},${solutionField}${withGraph ? '"function_equation":"y=2*x-1"' : ""}}]}`
      : `{"tasks":[{"question":"…","answer":"$x=3$",${solutionField}${withGraph ? '"function_equation":"y=2*x-1"' : ""}}]}`;

  const diagramRule = withDiagram
    ? `Brėžinys: jei yra diagram_config — labels privalo turėti ≥2 reikšmes (duotus skaičius + "?" arba du duotus); sutampa su question. Užduotims „pagal brėžinį/duomenis brėžinyje“ — be tuščių labels.`
    : `Brėžinys: ne (diagram_config neįtrauk).`;

  const solutionBlock = hardOnlySolutions
    ? grade === 8
      ? `Sprendimai: tik ${mixCounts!.sunkios} SUNKIOMS užduotims — PRIVALOMA; likusioms ${mixCounts!.lengvos + mixCounts!.vidutinės} — "solution":"". Savikra sunkioms: T|A0 + antra raidė.`
      : `Sprendimai: tik ${mixCounts!.sunkios} sunkioms — PRIVALOMA; lengvoms ir vidutinėms "solution":"".`
    : withSolution
    ? grade === 8 && difficulty === "sunkios"
      ? `Sprendimai: PRIVALOMA. Savikra: ar užduotis atitinka T|A0 + antrą raidę; jei ne — pakeisk question prieš grąžinant JSON.`
      : grade <= 4
        ? `Sprendimai: PRIVALOMA — skaičiavimas stulpeliu arba kampu $$...$$; answer tik skaičius (dalybai su liekana: „N liek. L“).`
        : `Sprendimai: PRIVALOMA, glaustai 3–4 žingsniai. Savikra: patikrink answer.`
    : grade <= 4
      ? `Sprendimai: "solution"="" (arba tuščias). Skaičiavimo stulpelis/kampas — question arba solution, ne answer. answer — tik skaičius (+ liek. jei reikia).`
      : `Sprendimai: "solution"="" visur. Tik teisingas glaustas answer.`;

  const sunkiosTextOverride =
    topicSubtopicGuided
      ? ""
      : useProgramRules &&
    grade === 8 &&
    (difficulty === "sunkios" || difficulty === "savarankiskas" || difficulty === "ivairus")
      ? `\n8 KL. SUNKIOS: nepaisant bendros taisyklės „gryna matematika be teksto“ — taikoma sunkių schema (T tekstiniai + A0 algebra).`
      : "";

  const difficultyBlock = topicSubtopicGuided
    ? isMixed
      ? `Sunkumas: taikyk user žinutėje pateiktų potemių skyrius Lengva / Vidutinė / Sunki (${taskCount} užduotims).`
      : `Sunkumas: taikyk user žinutėje nurodytą potemės lygį (Lengva / Vidutinė / Sunki).`
    : isMixed
    ? buildMixedDifficultyBlock(grade, difficulty, mixCounts!, useProgramRules)
    : `Sunkumo lygis (taikyti VISOMS ${taskCount} užduotims): ${buildDifficultyDescription(difficulty, grade, taskCount, useProgramRules)}`;

  const grade8Calibration =
    topicSubtopicGuided
      ? ""
      : useProgramRules && grade === 8 && difficulty === "sunkios"
      ? `\n8 KL. kalibracija (sunkios): tik jei tiktų brandžesniam 14 m. moksleivio savaitės kontroliniui — ne vadovėlio 1 pavyzdys. Pitagoras natūraliais skaičiais be F/I/H — atmesti.`
      : useProgramRules && grade === 8 && difficulty !== "sunkios"
        ? `\n8 KL.: lengvoms/vidutinėms — gryna matematika be teksto, jei vartotojas neprašė žodinės.`
        : "";

  const curriculumSection =
    profile === "topic" && topicSubtopicGuided
      ? "Programa: tik user žinutės potemės aprašas (be kitų klasių temų sąrašo)."
      : useProgramRules
        ? buildGradeCurriculumSection(grade)
        : "";
  const gradeConstraints = useProgramRules ? buildGradeConstraints(grade) : "";

  const classLine = topicSubtopicGuided
    ? `Klasė: ${grade}`
    : `Klasė / amžius: ${gradeDescriptions[grade] ?? grade}`;

  return `
=== Užklausa (${taskCount} užd.) ===
${classLine}
${curriculumSection}
${difficultyBlock}${sunkiosTextOverride}${grade8Calibration}
${gradeConstraints}
${diagramRule}; ${graphEquationRule}
${buildTerminologySection(grade)}; ${buildFormattingSection(grade)}
${solutionBlock}
JSON (tiksliai ${taskCount}): ${jsonExample}`;
}

function buildImageOnlySystemPromptSuffix(
  taskCount: number,
  withDiagram: boolean,
  withGraph: boolean,
): string {
  const solutionField = `"solution":"",`;
  const jsonExample = withDiagram
    ? `{"tasks":[{"question":"…","answer":"…",${solutionField}"diagram_config":{"type":"RIGHT_TRIANGLE","labels":{"a":"6 cm","b":"X","c":"10 cm"}}${withGraph ? ',"function_equation":"y=x^2-4"' : ""}}]}`
    : `{"tasks":[{"question":"…","answer":"…",${solutionField}${withGraph ? '"function_equation":"y=2*x-1"' : ""}}]}`;

  const diagramRule = withDiagram
    ? `Brėžinys: jei diagram_config — labels su duotais duomenimis ir "?".`
    : `Brėžinys: ne (diagram_config neįtrauk).`;
  const graphEquationRule = withGraph
    ? `Grafikas: "function_equation" jei užduotis apie funkciją.`
    : ``;

  return `
=== Užduotis (${taskCount} užd.) ===
Nukopijuok nuotraukos užduotį (panašią). LaTeX $...$ kur reikia.
${diagramRule}${graphEquationRule ? ` ${graphEquationRule}` : ""}
Sprendimai: "solution"="" visur.
JSON (tiksliai ${taskCount}): ${jsonExample}`;
}

export function buildSystemPrompt(
  grade: number,
  difficulty: string,
  taskCount: number,
  withDiagram: boolean,
  withGraph: boolean,
  withSolution: boolean,
  profile: SystemPromptProfile = "topic",
  topicSubtopicGuided = false,
): string {
  if (profile === "image-only") {
    return getStaticSystemPromptPrefix(withDiagram, withGraph, grade) +
      buildImageOnlySystemPromptSuffix(taskCount, withDiagram, withGraph);
  }
  return getStaticSystemPromptPrefix(withDiagram, withGraph, grade) +
    buildVariableSystemPromptSuffix(
      grade,
      difficulty,
      taskCount,
      withDiagram,
      withGraph,
      withSolution,
      profile,
      topicSubtopicGuided,
    );
}

export function buildUserMessage(_taskCount: number, prompt: string): string {
  return normalizeUserPrompt(prompt);
}

export function buildImageUserContent(
  taskCount: number,
  prompt: string,
  imageBase64: string,
): object[] {
  const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  const p = normalizeUserPrompt(prompt);
  const textPart =
    p.length >= 3 ? `${p}${USER_MESSAGE_JSON_SUFFIX}` : defaultImageUserText(taskCount);

  return [
    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}`, detail: "low" } },
    { type: "text", text: textPart },
  ];
}

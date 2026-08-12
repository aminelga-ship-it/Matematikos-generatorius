import { buildDiagramSection } from "./diagram.ts";

type DifficultyBand = "1-4" | "5-8" | "9-12";
type DifficultyLevel = "lengvos" | "vidutinės" | "sunkios";

function difficultyBand(grade: number): DifficultyBand {
  if (grade <= 4) return "1-4";
  if (grade <= 8) return "5-8";
  return "9-12";
}

const DIFFICULTY_BY_BAND: Record<DifficultyBand, Record<DifficultyLevel, string>> = {
  "1-4": {
    lengvos:
      "Lengvas → pritaikyti išmoktą taisyklę (skaičių palyginimas, paprasti skaičiavimai, tiesioginės vieno veiksmo užduotys).",
    vidutinės:
      "Vidutinis → reikia pasirinkti, kokią taisyklę ir veiksmus taikyti. Didesni, sudėtingesni skaičiai, kelių veiksmų reiškiniai, paprasti tekstiniai uždaviniai, trupmeniniai skaičiai, perimetras, matavimo vnt. pritaikymas, nežinomo skaičiaus radimas ir panašiai.",
    sunkios:
      "Sunkus → reikia samprotauti, susidaryti strategiją ir atrasti sprendimą bei išspręsti. Sudėtingi tekstiniai uždaviniai, ilgesni reiškiniai, loginis samprotavimas, kelių temų derinimas, sudėtingesnės trupmenos/matai, dėsningumų ir ryšių pastebėjimas.",
  },
  "5-8": {
    lengvos:
      "Lengvas → pritaikyti taisyklę ar formulę. Pagrindiniai veiksmai su sveikaisiais, trupmeniniais ir dešimtainiais skaičiais; ne tik apskaičiavimo uždaviniuose dominuoja sveikieji skaičiai; paprastos proporcijos ir procentai, trumpos lygtys. 1 teorija – 1 žingsnis.",
    vidutinės:
      "Vidutinis → pasirinkti tinkamą metodą ir atlikti kelis žingsnius. Sudėtingesni reiškiniai, lygtys, nelygybės; ne apskaičiavimo uždaviniuose apie 40% dešimtainės trupmenos, 50% sveikieji skaičiai ir 10% paprastosios trupmenos; standartiniai tekstiniai uždaviniai.",
    sunkios:
      "Sunkus → analizuoti, susikurti sprendimo strategiją, susieti kelias temas. Nestandartiniai ir kelių etapų uždaviniai, sudėtingi, ilgi reiškiniai, lygtys ar nelygybės, algebros ir geometrijos derinimas, kitų kelių temų derinimas (pvz. geometrija ir procentai), gyvenimiški uždaviniai, loginis samprotavimas; ne skaičiavimo uždaviniuose 50% paprastosios trupmenos, 30% dešimtainės, 20% sveikieji sk.",
  },
  "9-12": {
    lengvos:
      "Lengvas → pritaikyti žinomą formulę, taisyklę. 1 potemės žinios – 1 žingsnis. Paprasti uždaviniai su racionaliaisiais sk.",
    vidutinės:
      "Vidutinis → reikia pasirinkti tinkamą metodą ir susieti kelis veiksmus ar sąvokas. Sudėtingesni, ilgesni uždaviniai, funkcijų savybės. Standartiniai tekstiniai uždaviniai. Reikalingos viso temos žinios – keli žingsniai.",
    sunkios:
      "Sunkus → reikia analizuoti, sukurti sprendimo strategiją, gebėti spręsti sudėtingas problemas. Nestandartiniai ir kompleksiniai uždaviniai; kelių temų integravimas; parametriniai uždaviniai; įrodymų ir pagrindimo reikalaujančios užduotys; optimizavimo, loginio samprotavimo, gyvenimiško turinio uždaviniai.",
  },
};

function bandDifficultyText(grade: number, level: DifficultyLevel): string {
  return DIFFICULTY_BY_BAND[difficultyBand(grade)][level];
}

type ModelDifficultyTier = "lengvos" | "vidutinės" | "sunkios" | "mixed";

function modelDifficultyTier(difficulty: string): ModelDifficultyTier {
  if (difficulty === "lengvos") return "lengvos";
  if (difficulty === "vidutinės") return "vidutinės";
  if (difficulty === "sunkios") return "sunkios";
  if (isMixedDifficulty(difficulty)) return "mixed";
  return "vidutinės";
}

/** Modelis pagal klasę, sunkumą ir ar reikia brėžinio / GeoGebra grafiko. */
export function selectModel(
  grade: number,
  difficulty: string,
  withDiagram: boolean,
  withGraph: boolean,
): string {
  const visual = withDiagram || withGraph;

  if (grade <= 2) {
    return visual ? "gpt-4.1" : "gpt-4o-mini";
  }

  if (grade <= 4) {
    return "gpt-4.1";
  }

  if (visual) {
    return "gpt-5.4";
  }

  const tier = modelDifficultyTier(difficulty);

  if (grade <= 6) {
    if (tier === "sunkios" || tier === "mixed") return "gpt-4.1";
    return "gpt-4o";
  }

  if (grade <= 10) {
    if (tier === "lengvos") return "gpt-4o";
    return "gpt-5.4";
  }

  if (tier === "lengvos") return "gpt-4.1";
  if (tier === "vidutinės") return "gpt-5.4";
  return "o3";
}

/** GPT-5 / o-serija: kita tokenų ir sampling parametrų schema. */
export function isReasoningChatModel(model: string): boolean {
  return /^gpt-5/i.test(model) || /^o\d/i.test(model);
}

/** 8 kl.: lengvoms šiek tiek žemesnė temperatūra; sunkioms — 0,7. */
export function selectTemperature(grade: number, difficulty: string): number {
  if (grade === 8 && difficulty === "lengvos") return 0.55;
  return 0.7;
}

export function buildDifficultyDescription(
  difficulty: string,
  grade: number,
  _taskCount = 1,
  _useProgramRules = true,
): string {
  if (difficulty === "savarankiskas" || difficulty === "ivairus") {
    return bandDifficultyText(grade, "vidutinės");
  }
  if (difficulty === "lengvos" || difficulty === "vidutinės" || difficulty === "sunkios") {
    return bandDifficultyText(grade, difficulty);
  }
  return bandDifficultyText(grade, "vidutinės");
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
): string {
  const title = difficulty === "ivairus" ? "Įvairaus sudėtingumo" : "Mišraus sudėtingumo";
  return `${title}: ${counts.lengvos} lengvų, ${counts.vidutinės} vidutinių, ${counts.sunkios} sunkių — ta pati tematika.
Lengvos×${counts.lengvos}: ${bandDifficultyText(grade, "lengvos")}
Vidutinės×${counts.vidutinės}: ${bandDifficultyText(grade, "vidutinės")}
Sunkios×${counts.sunkios}: ${bandDifficultyText(grade, "sunkios")}`;
}

function buildFormattingSection(grade: number): string {
  if (grade <= 4) return "Formatavimas: $...$ reiškiniams; JSON \\\\cdot ir kt.";
  if (grade <= 6) {
    return "Formatavimas: trupmenos $\\frac{a}{b}$; procentai $n\\%$; matavimo vienetai su laipsniu — $60\\ \\text{cm}^3$, $12\\ \\text{m}^2$ (ne cm^3 be LaTeX).";
  }
  if (grade <= 10) return "Formatavimas: $\\frac{}{}$, $\\sqrt{}$, $\\leq$, kintamieji $x$.";
  return "Formatavimas: + trig./log.; $\\cup$, $\\cap$ intervalams.";
}

const LT_GEOMETRY_WORDING =
  "Geometrijos LT: stačiojo trikampio (ne „statusio“, „statusis“, „stačiasis trikampis“); įstrižainė (ne „diagonalė“); vidurio linija geometrijoje (ne „mediana“ — mediana tik statistikoje); stačiojo trikampio įžambinė ir statiniai.";

function buildTerminologySection(grade: number): string {
  let base: string;
  if (grade >= 11) base = "Terminai: pilna VBE terminologija (išvestinė, integralas…).";
  else if (grade === 10) base = "Terminai: trig., log., parabolė, diskriminantas; ne išvestinė/integralas.";
  else if (grade === 9) base = "Terminai: kvadratinės lygtys, parabolė, trig. pradmenys; ne log./išvestinė.";
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

answer: glaustai — tik reikšmės, dalys per ; be etikečių ir sakinių.`;
  return staticSystemPromptCore;
}

function buildElementaryArithmeticSection(grade: number): string {
  if (grade > 4) return "";
  return `
1–${grade} KL. TEKSTINIAI UŽDAVINIAI (svarbiau už stulpelį/kampą):
- Jei užduotis žodinė (sąlyga sakiniais, gyvenimiška situacija, „Kiek…“, „Raskite…“ su kontekstu) — question TIK tekstas ir duomenys; DRAUDŽIAMA question lauke rodyti skaičiavimo veiksmą ($$...$$, stulpelį, kampą, veiksmų eilutę, „2+3“ kaip paruoštą veiksmą). Mokinys pats turi sugalvoti veiksmą.
- Formulę galima pateikti žodžiais arba $P=4a$, bet ne įrašyti jau paruošto skaičiavimo.

1–${grade} KL. SKAIČIAVIMAI (tik gryni skaičiavimai, ne žodiniai):
- Jei užduotis prasideda „Apskaičiuokite“, „Sudėkite stulpeliu“, „Atimkite stulpeliu“ ar panašiai — PRIVALOMAS stulpelis arba kampas $$...$$ bloke question lauke (ypač kai solution tuščias).
- **Sudėtis ir atimtis** — stulpeliu ($$\\begin{array}{r}...\\end{array}$$ su + arba −).
- **Dalyba** — DRAUDŽIAMA rašyti stulpeliu kaip sudėtį/atimtį (skaičius viršuje, apačioje „: daliklis“ po brūkšneliu). Dalybai naudok **eilutę** (pvz. „Apskaičiuokite: $48 : 6=$“) **arba dalybos kampą** $$...$$ (dalinys, daliklis, dalmuo, liekana) — ne array stulpelio formatą.
- „Veiksmų eilutė“ — tik kai reikia skaičiuoti pagal veiksmų tvarką (skliaustai, keli veiksmai vienoje išraiškoje, pvz. $2+3\\cdot4$). Tada skaičiavimas gali būti eilutėje; answer vis tiek tik skaičius (žr. žemiau).
- Visais kitais atvejais (sudėtis, atimtis stulpeliu; dalyba kampu): rodomas skaičiavimas $$...$$ bloke (question arba solution) — stulpeliu tik +/−; dalybai kampu (daliklis, dalinys, dalmenys, liekana) arba eilutėje $a : b =$. DRAUDŽIAMA vienoje eilutėje „23+45=68“, „156:12=13“ be stulpelio (sudėčiai/atimčiai) arba be kampo/eilutės (dalybai).
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
  _profile: SystemPromptProfile,
  topicSubtopicGuided = false,
): string {
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
    ? `Sprendimai: tik ${mixCounts!.sunkios} sunkioms — PRIVALOMA; likusioms "solution":"".`
    : withSolution
    ? grade <= 4
      ? `Sprendimai: PRIVALOMA — skaičiavimas stulpeliu arba kampu $$...$$; answer tik skaičius (dalybai su liekana: „N liek. L“).`
      : `Sprendimai: PRIVALOMA, glaustai. Patikrink answer.`
    : grade <= 4
      ? `Sprendimai: "solution"="" visur. Gryniems skaičiavimams stulpelis/kampas PRIVALOMAS question $$...$$ bloke (ne tik solution). Tekstiniame uždavinyje question be skaičiavimo veiksmų. answer — tik skaičius (+ liek. jei reikia).`
      : `Sprendimai: "solution"="" visur. Tik teisingas glaustas answer.`;

  const difficultyBlock = topicSubtopicGuided
    ? isMixed
      ? `Sunkumas: taikyk user žinutėje pateiktų potemių skyrius Lengva / Vidutinė / Sunki (${taskCount} užduotims).`
      : `Sunkumas: taikyk user žinutėje nurodytą potemės lygį (Lengva / Vidutinė / Sunki).`
    : isMixed
    ? buildMixedDifficultyBlock(grade, difficulty, mixCounts!)
    : `Sunkumo lygis (taikyti VISOMS ${taskCount} užduotims): ${buildDifficultyDescription(difficulty, grade, taskCount)}`;

  const classLine = `Klasė: ${grade}`;

  return `
=== Užklausa (${taskCount} užd.) ===
${classLine}
${difficultyBlock}
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

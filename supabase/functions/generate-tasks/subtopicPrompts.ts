/** Potemės AI turinys: raktas `${grade}:${slug}` (slug iš curriculum_subtopics). */

export type SubtopicPromptEntry = {
  title: string;
  /** Lengva / Vidutinė / Sunki — visi lygiai viename bloke */
  body: string;
};

const SUBTOPIC_PROMPTS: Record<string, SubtopicPromptEntry> = {
  "11:aibes": {
    title: "Aibės",
    body: `Lengva: skaitinių aibių ir $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{I}$, $\\mathbb{R}$ aibių sąjunga, sankirta, skirtumas.

Vidutinė: sąjunga, sankirta, skirtumas su intervalais (ne su pavieniais skaičiais); poaibiai; maždaug 50 % užduočių — aibei priešinga aibė (suvienalytėje aibėje).

Sunki: viskas iš vidutinio + veiksmų eilutės su intervalinių aibių veiksmais; tekstiniai sudėtingesni uždaviniai su aibėmis.`,
  },
  "11:modulis": {
    title: "Modulis",
    body: `Lengva: iracionalių skaitinių reiškinių prastinimas naudojant modulį; modulio savybės; raidiniuose reiškiniuose iškelti daugiklį prieš kvadratinės šaknies ženklą.

Vidutinė: raidinis iracionalus arba po moduliu reiškinys naudojant modulį, kai duotas $x$ intervalas; sudėtingesni skaitiniai moduliniai reiškiniai.

Sunki: raidinio iracionalaus reiškinio prastinimas, kai po šaknimi yra kvadratinis trinaris, skaidomas per dvinario kvadrato formulę; raidinis iracionalus reiškinys naudojant modulį, kai $x$ intervalas neduotas; sudėtingi raidiniai moduliniai reiškiniai.`,
  },
};

export function subtopicPromptKey(grade: number, slug: string): string {
  return `${grade}:${slug.trim().toLowerCase()}`;
}

export function getSubtopicPrompt(grade: number, slug: string): SubtopicPromptEntry | null {
  return SUBTOPIC_PROMPTS[subtopicPromptKey(grade, slug)] ?? null;
}

function difficultyTierInstruction(difficulty: string): string {
  if (difficulty === "lengvos") {
    return "Sunkumas: generuok TIK „Lengva“ lygio užduotis (kitų skyrių nenaudok).";
  }
  if (difficulty === "vidutinės") {
    return "Sunkumas: generuok TIK „Vidutinė“ lygio užduotis.";
  }
  if (difficulty === "sunkios") {
    return "Sunkumas: generuok TIK „Sunki“ lygio užduotis.";
  }
  if (difficulty === "ivairus" || difficulty === "savarankiskas") {
    return "Sunkumas: kiekvienai užduočiai taikyk atitinkamą skyrių (Lengva / Vidutinė / Sunki) pagal paskirstymą.";
  }
  return "";
}

/** Sujungia pasirinktų potemių promptus; guided=true jei bent viena potemė turi aprašą. */
export function buildSubtopicPromptBlock(
  grade: number,
  slugs: string[],
  difficulty: string,
): { text: string; guided: boolean } {
  const uniqueSlugs = [...new Set(slugs.map((s) => s.trim().toLowerCase()).filter(Boolean))];
  const parts: string[] = [];

  for (const slug of uniqueSlugs) {
    const entry = getSubtopicPrompt(grade, slug);
    if (entry) {
      parts.push(`POTEMĖ: ${entry.title}\n${entry.body}`);
    }
  }

  if (parts.length === 0) {
    return { text: "", guided: false };
  }

  const tier = difficultyTierInstruction(difficulty);
  const antiCopy =
    "Neatkartok pavyzdinių sąlygų iš šio aprašo — kiekvieną kartą nauji skaičiai ir formulavimas.";
  return {
    text: [parts.join("\n\n"), tier, antiCopy].filter(Boolean).join("\n\n"),
    guided: true,
  };
}

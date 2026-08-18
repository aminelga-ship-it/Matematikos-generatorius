import type { GenerationGuideContent, GuideBlock } from "./guideTypes";

export const GENERATION_GUIDE_KEY = "generation_guide";

const REMOVED_GUIDE_BLOCK_IDS = new Set(["task-count", "topics"]);

/** Pašalina nebenaudojamas skiltis iš seno DB turinio. */
export function sanitizeGuideContent(content: GenerationGuideContent): GenerationGuideContent {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      blocks: section.blocks
        .filter((b) => !REMOVED_GUIDE_BLOCK_IDS.has(b.id))
        .map((b) => ({
          ...b,
          children: b.children?.filter((c) => !REMOVED_GUIDE_BLOCK_IDS.has(c.id)),
        })),
    })),
  };
}

export const DEFAULT_GENERATION_GUIDE: GenerationGuideContent = {
  pageTitle: "Kaip tinkamai generuoti užduotis?",
  pageIntro:
    "Trumpai apie generatoriaus skiltis. Pagrindinis generavimas kuria užduotis; 7–12 kl. atsakymus dažnai gaunate antriniu generavimu (žr. žemiau). Jei generuojate pagal tekstą — aprašykite turinį tiksliai; jei nenorite ilgo teksto — rinkitės „Pagal temą“.",
  sections: [
    {
      id: "functions",
      title: "Funkcijos",
      defaultOpen: true,
      blocks: [
        {
          id: "generation-mode",
          title: "Generavimo būdas",
          body: "Du skirtingi keliai: laisvesnis AI (tekstas) arba kontroliuojamas bankas (tema).",
          children: [
            {
              id: "mode-text",
              title: "Pagal tekstą",
              body:
                "AI kuria pagal jūsų aprašymą arba nuotrauką. Tinka, kai aiškiai žinote, ko norite: formulė, uždavinio tipas, kontekstas (tirpalai, greitosios daugybos formulė, trupmeniniai laipsnių rodikliai ir pan.).\n\nAI gauna jūsų tekstą, klasės amžių, sunkumą, formatavimo ir terminologijos taisykles — ne visą mokymo programą. Turinį nurodo mokytojas. Per trumpa užklausa gali duoti netinkamą rezultatą — patikslinkite.\n\nGeras pavyzdys: „Sudėtiniai procentai, džiovinimai, tirpalų koncentracija; 2–3 žingsniai.“",
            },
            {
              id: "mode-topic",
              title: "Pagal temą",
              body:
                "Pirmiausia naudojamos patvirtintos užduotys iš banko pagal pasirinktą programos temą ar potemę. Trūkstamas kiekis gali būti papildytas AI tos pačios temos ribose.\n\nIlgo prompto nereikia — turinį kontroliuoja bankas ir curriculum. Bankas nuolat plečiamas; kuo daugiau patvirtintų užduočių, tuo stabiliau rezultatai ir mažiau priklausomybės nuo AI.",
            },
          ],
        },
        {
          id: "grade",
          title: "Klasė",
          body:
            "Pasirinkite 1–12 kl. atitinkantį mokinių amžių.\n\n1–6 kl.: AI sugeneruoja atsakymą kartu su užduotimi; jis rodomas tik paspaudus „Atsakymai“.\n7–12 kl.: pagrindinis generavimas be atsakymo; atsakymą galite gauti antriniu generavimu (žr. skiltį „Antriniai generavimai“). Banko užduotys gali turėti paruoštą atsakymą — slepiamas iki „Atsakymai“.\n\n1–4 kl.: jei tai ne veiksmų eilutė, skaičiavimas stulpeliu arba dalyba kampu; atsakyme — tik skaičius (dalybai su liekana, pvz. „13 liek. 3“).",
        },
        {
          id: "difficulty",
          title: "Sunkumo lygis",
          body:
            "Lengvos — vienas aiškus žingsnis.\nVidutinės — keli loginiai žingsniai, ne vienas formulės įstatymas.\nSunkios — sudėtingesnės, artimesnės kontroliniui / VBE stiliui (priklausomai nuo klasės).\nĮvairaus sudėtingumo — mišinys lengvų, vidutinių ir sunkių (5–15 užduočių); temų režime tinka savarankiškam darbui ar kontroliniui.",
        },
        {
          id: "prompt-image",
          title: "Užduoties aprašymas ir nuotraukos įkėlimas",
          body:
            "Rašykite kuo konkretesnį užduoties tipą ar temą. Galite įklijuoti pavyzdinę užduotį.\n\nNuotrauka (PRO): rekomenduojama po 1 užduotį. Pakanka nuotraukos — teksto nereikia (AI gauna instrukciją „Sukurk panašią užduotį“). Atsakymas iš karto nesiunčiamas; 7–12 kl. galite generuoti atsakymą antriniu generavimu. Kelios skirtingos užduotys vienoje nuotraukoje dažnai duoda prastą rezultatą.",
        },
        {
          id: "diagram",
          title: "Generuoti su brėžiniu",
          body:
            "Tik „Pagal tekstą“, 1–6 kl. Plokščios figūros (kvadratas, stačiakampis, trikampis, apskritimas) ir dvi figūros: SIMILAR_TRIANGLES (panašūs trikampiai, skirtingas mastelis) arba CONGRUENT_TRIANGLES (lygūs trikampiai, 6 kl.). Ant brėžinio — duoti skaičiai; ieškoma kraštinė visada X. Stereometrijos (kubas, ritinys…) šiuo metu negeneruojama.",
        },
        {
          id: "graph",
          title: "Generuoti su grafiku",
          body:
            "Tik „Pagal tekstą“, 9 kl. ir vyresnėms. Funkcijų užduotims — GeoGebra lygtis (pvz. y=x²-4).",
        },
        {
          id: "solutions",
          title: "Antriniai generavimai",
          body:
            "Antriniai generavimai — veiksmai po užduoties sukūrimo: „Patikrinti užduotį“ ir „Generuoti atsakymą“. Skaičiuojami atskirai nuo pagrindinių generavimų (FREE 10/mėn., PRO 80/mėn., Unlimited neriboti).\n\n7–12 kl.: patikrinti užduotį (gali pataisyti sąlygą ir pateikti atsakymą) + generuoti atsakymą (jei atsakymo dar nėra). Visi lygiai — tik atsakymas, be sprendimo žingsnių.\n\nBanko užduotys (pagal temą) jau patikrintos — „Patikrinti užduotį“ nėra. Jei banke yra atsakymas, generavimo mygtukas nerodomas.\nNuotraukos (7–12 kl.): tik „Generuoti atsakymą“, be patikros.\n\nSugenerintas ar patikrinimo metu gautas atsakymas rodomas iš karto. Likusius atsakymus — paspaudus „Atsakymai“.",
        },
        {
          id: "after-generate",
          title: "Po generavimo",
          body:
            "Atsakymai rodomi paspaudus „Atsakymai“ arba iš karto po antrinio generavimo / patikros su atsakymu. Galite spausdinti, eksportuoti į Word (PRO), redaguoti užduotis (PRO). Mokytojai ir administratoriai gali palikti feedback ir tvarkyti banką.",
        },
      ],
    },
    {
      id: "faq",
      title: "DUK",
      defaultOpen: true,
      blocks: [
        {
          id: "faq-program",
          title: "Ar AI automatiškai „žino“ visą mokymo programą?",
          body:
            "Teksto režime — ne. Turinį nurodo jūsų aprašymas arba bankas temų režime. Klasė ir sunkumas padeda formatui, ne visai BP.",
        },
        {
          id: "faq-topic-vs-text",
          title: "Kodėl temų režimas patikimesnis be ilgo teksto?",
          body:
            "Užduotys renkamos iš paruošto, peržiūrėto banko pagal pasirinktą temą — ne iš vieno bendro žodžio užklausoje.",
        },
        {
          id: "faq-feedback",
          title: "Ar mokytojas gali taisyti užduotis?",
          body:
            "Taip — redaguoti, palikti feedback, patvirtinti ar atmesti; pataisymai gali būti išsaugomi banke.",
        },
        {
          id: "faq-secondary",
          title: "Kas yra antriniai generavimai?",
          body:
            "Tai ne pagrindinis užduočių generavimas, o papildomi AI veiksmai po sukūrimo: užduoties patikra (sąlygos korekcija) ir atsakymo generavimas. Taikoma 7–12 kl. sugeneruotoms užduotims (ne banko). Vienas veiksmas = vienas antrinis kreditas. Limitai: FREE 10/mėn., PRO 80/mėn., Unlimited neriboti. Matote juos antraštėje kaip „Antriniai: X/Y“.",
        },
        {
          id: "faq-limits",
          title: "Kodėl nemoku planu mažai užduočių?",
          body:
            "Nemokamas planas riboja pagrindines užklausas (3/d., 10/mėn.) ir antrinius generavimus (10/mėn.). PRO — didesni limitai ir papildomos funkcijos (nuotrauka, eksportas, redagavimas).",
        },
      ],
    },
  ],
};

/** Blokai, kurių turinį sinchronizuojame iš kodo (likę jūsų DB redagavimai lieka). */
const GUIDE_SYNC_BLOCK_IDS = new Set([
  "solutions",
  "after-generate",
  "faq-secondary",
  "faq-limits",
]);

function collectBlocksMap(blocks: GuideBlock[], map = new Map<string, GuideBlock>()): Map<string, GuideBlock> {
  for (const b of blocks) {
    map.set(b.id, b);
    if (b.children?.length) collectBlocksMap(b.children, map);
  }
  return map;
}

function syncBlocksFromMap(blocks: GuideBlock[], sourceMap: Map<string, GuideBlock>): GuideBlock[] {
  return blocks.map((block) => {
    let next = block;
    if (GUIDE_SYNC_BLOCK_IDS.has(block.id) && sourceMap.has(block.id)) {
      const src = sourceMap.get(block.id)!;
      next = { ...block, title: src.title, body: src.body };
    }
    if (next.children?.length) {
      next = { ...next, children: syncBlocksFromMap(next.children, sourceMap) };
    }
    return next;
  });
}

/** Sujungia DB turinį su kodo numatytais: atnaujina antrinius generavimus, palieka kitus jūsų redagavimus. */
export function mergeGuideWithDefaults(
  content: GenerationGuideContent,
  defaults: GenerationGuideContent = DEFAULT_GENERATION_GUIDE,
): GenerationGuideContent {
  const sourceMap = collectBlocksMap(defaults.sections.flatMap((s) => s.blocks));

  const sections = content.sections.map((section) => {
    let blocks = syncBlocksFromMap(section.blocks, sourceMap);

    if (section.id === "faq" && !blocks.some((b) => b.id === "faq-secondary")) {
      const secondary = sourceMap.get("faq-secondary");
      if (secondary) {
        const limitsIdx = blocks.findIndex((b) => b.id === "faq-limits");
        const copy = structuredClone(secondary);
        blocks =
          limitsIdx >= 0
            ? [...blocks.slice(0, limitsIdx), copy, ...blocks.slice(limitsIdx)]
            : [...blocks, copy];
      }
    }

    return { ...section, blocks };
  });

  return { ...content, sections };
}

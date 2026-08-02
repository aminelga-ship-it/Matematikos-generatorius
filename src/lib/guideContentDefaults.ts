import type { GenerationGuideContent } from "./guideTypes";

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
    "Trumpai apie generatoriaus skiltis. Jei generuojate pagal tekstą — kuo tiksliau aprašykite turinį. Jei nenorite rašyti ilgai — rinkitės „Pagal temą“ ir patvirtintą banką.",
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
            "Pasirinkite 1–12 kl. atitinkantį mokinių amžių. Teksto režime AI gauna amžių, terminologiją ir formatą — ne visą programos aprašą. Turinį nurodo jūsų aprašymas.\n\n1–4 kl.: jei tai ne veiksmų eilutė, skaičiavimas pateikiamas stulpeliu arba dalyba kampu; atsakyme — tik skaičius (dalybai su liekana, pvz. „13 liek. 3“), be kampo ar trupmenos.",
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
            "Rašykite kuo konkretesnį užduoties tipą ar temą. Galite įklijuoti pavyzdinę užduotį.\n\nNuotrauka (PRO): rekomenduojama po 1 užduotį. Norint panašaus uždavinio, pakanka nuotraukos — teksto nereikia (AI gauna tik nuotrauką ir instrukciją „Sukurk panašią užduotį“). Kelios skirtingos užduotys vienoje nuotraukoje dažnai duoda prastą rezultatą. Galima nuvilkti arba Ctrl+V.",
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
          title: "Generuoti sprendimą",
          body:
            "Tik teksto režime, 7 kl.+, sunkioms arba „įvairaus sudėtingumo“ sunkioms dalims. Temų režime sprendimai generuojami ne automatiškai; banko užduotyse sprendimas gali būti jau paruoštas.",
        },
        {
          id: "after-generate",
          title: "Po generavimo",
          body:
            "Galite rodyti atsakymus ir sprendimus, spausdinti, eksportuoti į Word (PRO), redaguoti užduotis (PRO). Mokytojai ir administratoriai gali palikti feedback ir patvirtinti / atmesti užduotis banke.",
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
          id: "faq-limits",
          title: "Kodėl nemoku planu mažai užduočių?",
          body:
            "Nemokamas ir svečio planai riboja užklausas ir užduočių skaičių; PRO — didesni limitai ir papildomos funkcijos (nuotrauka, eksportas, redagavimas).",
        },
      ],
    },
  ],
};

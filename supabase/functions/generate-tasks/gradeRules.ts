/**
 * Klasės programos — DETALŪS objektai (GRADE_N_RULES) + KOMPAKTIŠKOS eilutės į AI promptą.
 *
 * ## Naujai klasei (pvz. 2 kl.) — principas
 *
 * 1. **GRADE_2_RULES** — pilna struktūra (topics, theory, skills, forbidden, number_limits…).
 *    Tai tavo „šaltinis tiesai“ ir dokumentacija; į OpenAI promptą **nekeliama** visa.
 * 2. **buildGrade2Section()** — 1–3 eilutės: temų sąrašas, skaičių limitai, draudimai.
 *    Žr. pavyzdžius: `buildGrade5Section`, `buildGrade1Section`.
 * 3. **GRADE_CURRICULUM_SECTIONS[2] = buildGrade2Section** — registracija žemėlapyje.
 * 4. Jei reikia papildomų taisyklių (ne į programą) — **buildGradeConstraints(2)** switch.
 *
 * Pilnas šablonas: `gradeRules.example.ts`.
 */

export const gradeDescriptions: Record<number, string> = {
  1: "1 klasė (6-7 metai): sudėtis ir atimtis iki 20, skaičiavimas iki 100",
  2: "2 klasė (7-8 metai): sudėtis ir atimtis iki 100, dauginimas ir dalyba pradžia",
  3: "3 klasė (8-9 metai): dauginimas ir dalyba, skaičiavimas iki 1000",
  4: "4 klasė (9-10 metai): keturių veiksmų aritmetika, trupmenų pradžia, ilgiai ir svoriai",
  5: "5 klasė (10-11 metai): paprastosios trupmenos, dešimtainės trupmenos, procentai pradžia",
  6: "6 klasė (11-12 metai): procentai, santykiai, proporcijos, neigiami skaičiai",
  7: "7 klasė (12-13 metai): algebros pradžia, lygtys, koordinačių sistema, geometrija",
  8: "8 klasė (13-14 metai): šaknys, reiškinių veiksmai, tiesinės lygčių sistemos, vektoriai, Pitagoras, stereometrija, finansai",
  9: "9 klasė (14-15 metai): kvadratinės lygtys, trigonometrija pradžia, statistika",
  10: "10 klasė (15-16 metai): proporcingieji dydžiai, racionaliosios lygtys ir nelygybės, panašumas, trigonometrija, kombinatorika ir tikimybės",
  11: "11 klasė (16-17 metai): išvestinės, integralai pradžia, tikimybių teorija",
  12: "12 klasė (17-18 metai): integralai, begalinės eilutės, sudėtingesnė geometrija, brandos egzaminų lygis",
};

export const GRADE_1_RULES = {
  grade: 1,
  curriculum: "LT 2022 Bendroji programa",
  purpose: "Formuoti skaičiaus sampratą, ugdyti loginį mąstymą, mokyti spręsti paprastas kasdienes matematines situacijas.",
  topics: [
    {
      id: "numbers",
      title: "Skaičiai iki 100",
      theory: [
        "Skaičių skaitymas ir rašymas",
        "Skaičių seka",
        "Skaičių palyginimas",
        "Didesnis, mažesnis, lygus",
        "Skaičiaus sudėtis",
        "Dešimtys ir vienetai",
      ],
      skills: ["Skaičiuoti pirmyn ir atgal", "Rasti kaimyninius skaičius", "Lyginti skaičius", "Sudaryti skaičių iš dalių"],
    },
    {
      id: "operations",
      title: "Sudėtis ir atimtis",
      theory: [
        "Sudėtis iki 20",
        "Atimtis iki 20",
        "Peržengiant dešimtį",
        "Veiksmų ryšys",
        "Nežinomas dėmuo arba atėminys",
      ],
      skills: ["Skaičiuoti mintinai", "Naudoti skaičiavimo strategijas", "Pasitikrinti atsakymą"],
    },
    {
      id: "word_problems",
      title: "Tekstiniai uždaviniai",
      theory: ["Vieno veiksmo uždaviniai", "Sudėties ir atimties situacijos", "Duomenų išskyrimas"],
      skills: ["Suprasti uždavinio tekstą", "Parinkti veiksmą", "Parašyti atsakymą"],
    },
    {
      id: "geometry",
      title: "Geometrija",
      theory: ["Taškas", "Linija", "Atkarpa", "Apskritimas", "Kvadratas", "Stačiakampis", "Trikampis"],
      skills: ["Atpažinti figūras", "Apibūdinti jų savybes", "Sudaryti figūras iš dalių"],
    },
    {
      id: "measurement",
      title: "Matavimai",
      theory: ["Ilgis", "Masė", "Talpa", "Laikas", "Pinigai"],
      skills: ["Palyginti dydžius", "Naudoti paprastus matavimo vienetus", "Spręsti praktines situacijas"],
    },
    {
      id: "patterns",
      title: "Dėsningumai",
      theory: ["Sekos", "Pasikartojantys raštai", "Paprastos taisyklės"],
      skills: ["Atpažinti dėsningumą", "Pratęsti seką", "Sukurti savo seką"],
    },
    {
      id: "data",
      title: "Duomenys",
      theory: ["Paprastos lentelės", "Piktogramos", "Duomenų palyginimas"],
      skills: ["Surinkti duomenis", "Perskaityti lentelę", "Padaryti paprastą išvadą"],
    },
  ],
  new_for_grade_1: [
    "Skaičiai iki 100",
    "Sudėtis ir atimtis iki 20 (įskaitant peržengiant dešimtį)",
    "Skaičiaus sandaros supratimas",
    "Tekstinių uždavinių sprendimo pradmenys",
    "Pagrindinės geometrinės figūros",
    "Praktiniai matavimai",
    "Paprasti duomenų vaizdavimo būdai",
  ],
  problem_types: [
    "Skaičiavimo pratimai",
    "Vieno veiksmo tekstiniai uždaviniai",
    "Skaičių palyginimas",
    "Figūrų atpažinimas",
    "Sekų tęsimas",
    "Praktiniai uždaviniai apie laiką, pinigus ir matavimus",
  ],
  difficulty: {
    basic: "Tiesioginis skaičiavimas arba atpažinimas.",
    intermediate: "Reikia pasirinkti tinkamą veiksmą arba pritaikyti taisyklę.",
    advanced: "Nestandartinis tekstinis arba loginis uždavinys su keliais samprotavimo žingsniais.",
  },
  expected_output: {
    always_show: ["Trumpa sprendimo eiga", "Naudotas veiksmas", "Galutinis atsakymas"],
    avoid: ["Sudėtingų matematinių terminų", "Kelių veiksmų sprendimų be paaiškinimo", "Vien atsakymo be sprendimo"],
  },
  teaching_focus: [
    "Skaičiaus samprata",
    "Loginis mąstymas",
    "Matematinis kalbėjimas",
    "Praktinis taikymas",
    "Pasitikėjimas sprendžiant paprastus uždavinius",
  ],
};

export function buildGrade1Section(): string {
  const t = GRADE_1_RULES.topics.map((x) => x.title).join(", ");
  return `1 KL.: temos — ${t}. Vieno/kelių veiksmų uždaviniai; be sudėtingų terminų ir kelių veiksmų be paaiškinimo.`;
}

export const GRADE_5_RULES = {
  grade: 5,
  knowledge: {
    numbers: ["compare", "order", "round", "estimate", "add", "subtract", "multiply", "divide", "evaluate_expression"],
    fractions: ["find_equivalent", "simplify", "expand", "compare", "order", "add", "subtract"],
    decimals: ["compare", "order", "round", "add", "subtract", "multiply", "convert_fraction"],
    percent: ["understand", "convert_fraction", "convert_decimal", "find_percentage"],
    algebra: ["evaluate_expression", "find_unknown", "solve_simple_equation"],
    geometry: ["classify", "draw", "construct", "measure", "perimeter", "area"],
    measure: ["convert_units", "estimate", "time", "money"],
    stats: ["read_table", "read_chart", "create_table", "create_chart", "mean"],
  },
  problem_types: ["compute", "word", "geo", "measure", "stats", "real"],
  levels: {
    easy: "1 skill, 1 step",
    medium: "2 skills, ≤2 steps",
    hard: "multiple skills, ≤3 steps",
  },
  number_limits: {
    natural_max: 1000000,
    decimal_places_max: 3,
    allow_negative: false,
  },
  number_profile: {
    fractions: {
      easy: "same_denominator",
      medium: "related_denominators",
      hard: "small_coprime_denominators",
    },
  },
  forbidden: [
    "negative_numbers",
    "rational_numbers",
    "power",
    "square_root",
    "linear_equation_multi_step",
    "system_of_equations",
    "function",
    "direct_proportion",
    "inverse_proportion",
    "pythagorean_theorem",
    "probability",
  ],
};

export const TOPIC_LABELS_5: Record<string, string> = {
  numbers: "Natūralieji skaičiai",
  fractions: "Trupmenos",
  decimals: "Dešimtainiai skaičiai",
  percent: "Procentai",
  algebra: "Algebriniai reiškiniai",
  geometry: "Geometrija",
  measure: "Matavimai",
  stats: "Statistika",
};

export const FORBIDDEN_LABELS_5: Record<string, string> = {
  negative_numbers: "neigiami skaičiai",
  rational_numbers: "racionalieji skaičiai",
  power: "laipsniai",
  square_root: "kvadratinė šaknis",
  linear_equation_multi_step: "daugiažingsnės tiesinės lygtys",
  system_of_equations: "lygčių sistemos",
  function: "funkcijos",
  direct_proportion: "tiesioginis proporcingumas",
  inverse_proportion: "atvirkštinis proporcingumas",
  pythagorean_theorem: "Pitagoro teorema",
  probability: "tikimybė",
};

export function buildGrade5Section(): string {
  const r = GRADE_5_RULES;
  const topics = Object.values(TOPIC_LABELS_5).join(", ");
  const forbidden = r.forbidden.map((f) => FORBIDDEN_LABELS_5[f] ?? f).join(", ");
  return `5 KL.: ${topics}. Natūralūs ≤1M, dešimtainiai ≤3 sk. po kablelio, be neigiamų. Sunkumas: lengvas 1 žingsnis / vidutinis ≤2 / sunkus ≤3. Draudžiama: ${forbidden}.`;
}

export const GRADE_7_RULES = {
  grade: 7,
  curriculum: "LT 2022 Bendroji programa",
  purpose: "Spręsti uždavinius argumentuojant sprendimus, taikyti matematiką realiose situacijose, ugdyti matematinį samprotavimą.",
  topics: [
    {
      id: "numbers",
      title: "Racionalieji skaičiai",
      theory: [
        "Sveikieji ir racionalieji skaičiai",
        "Teigiami ir neigiami skaičiai",
        "Veiksmai su racionaliaisiais skaičiais",
        "Skaičių modulis",
        "Skaičių palyginimas",
        "Veiksmų tvarka",
        "Laipsnis su natūraliu rodikliu",
        "Skaičiavimai su trupmenomis ir dešimtainiais skaičiais",
      ],
      skills: ["Tiksliai skaičiuoti", "Pagrįsti veiksmų eigą", "Įvertinti atsakymo realumą"],
    },
    {
      id: "expressions",
      title: "Raidinės išraiškos",
      theory: [
        "Kintamasis",
        "Reiškinio reikšmė",
        "Vienanariai ir paprasti daugianariai",
        "Panašiųjų narių sutraukimas",
        "Formulių taikymas",
      ],
      skills: ["Sudaryti reiškinius pagal tekstą", "Supaprastinti reiškinius", "Apskaičiuoti reikšmes"],
    },
    {
      id: "equations",
      title: "Lygtys ir nelygybės",
      theory: ["Pirmosios eilės lygtis", "Lygties sprendimas", "Tekstiniai uždaviniai", "Paprastos nelygybės"],
      skills: ["Modeliuoti situacijas lygtimis", "Patikrinti sprendinį", "Interpretuoti rezultatą"],
    },
    {
      id: "proportions",
      title: "Santykiai ir proporcijos",
      theory: ["Santykis", "Proporcija", "Tiesioginis proporcingumas", "Atvirkštinis proporcingumas", "Mastelis"],
      skills: ["Spręsti praktinius uždavinius", "Naudoti proporcijas kasdienėse situacijose"],
    },
    {
      id: "geometry",
      title: "Geometrija",
      theory: [
        "Kampai",
        "Trikampiai",
        "Keturkampiai",
        "Apskritimas ir skritulys",
        "Perimetras",
        "Plotas",
        "Erdvinės figūros",
        "Tūrio samprata",
      ],
      skills: ["Atpažinti figūrų savybes", "Taikyti formules", "Argumentuoti geometrinius teiginius"],
    },
    {
      id: "coordinates",
      title: "Koordinačių sistema",
      theory: ["Taško koordinatės", "Koordinačių plokštuma", "Paprasti grafikai"],
      skills: ["Braižyti taškus", "Skaityti grafikus", "Interpretuoti priklausomybes"],
    },
    {
      id: "statistics",
      title: "Duomenys ir tikimybės",
      theory: [
        "Duomenų rinkimas",
        "Lentelės",
        "Diagramos",
        "Vidurkis",
        "Moda",
        "Mediana",
        "Paprasta tikimybė",
      ],
      skills: ["Analizuoti duomenis", "Daryti išvadas", "Vertinti informaciją"],
    },
  ],
  new_for_grade_7: [
    "Pilnas darbas su neigiamais racionaliaisiais skaičiais",
    "Raidinių reiškinių sistemingas taikymas",
    "Lygčių naudojimas tekstiniuose uždaviniuose",
    "Proporcingumo modeliai",
    "Koordinačių plokštumos taikymas",
    "Statistikos rodiklių (vidurkis, moda, mediana) taikymas",
    "Didesnis matematinio argumentavimo reikalavimas",
  ],
  problem_types: [
    "Vieno žingsnio skaičiavimai",
    "Kelių žingsnių skaičiavimai",
    "Tekstiniai uždaviniai",
    "Geometriniai įrodymai (paprasti)",
    "Modeliavimo uždaviniai",
    "Diagramų ir grafikų analizė",
    "Praktiniai gyvenimiški uždaviniai",
  ],
  difficulty: {
    basic: "Tiesioginis formulės ar taisyklės taikymas.",
    intermediate: "Kelių temų derinimas viename uždavinyje.",
    advanced: "Reikia pasirinkti metodą, argumentuoti sprendimą, analizuoti situaciją.",
  },
  expected_output: {
    always_show: [
      "Sprendimo eiga",
      "Naudota taisyklė",
      "Tarpiniai skaičiavimai",
      "Galutinis atsakymas su matavimo vienetais",
    ],
    avoid: ["Vien atsakymo pateikimo", "Nepaaiškintų veiksmų", "Neįvardytų matematinių taisyklių"],
  },
  teaching_focus: [
    "Matematinis samprotavimas",
    "Argumentavimas",
    "Modeliavimas",
    "Ryšys su realiomis situacijomis",
    "Skaitmeninis ir statistinis raštingumas",
  ],
};

export function buildGrade7Section(): string {
  const titles = GRADE_7_RULES.topics.map((t) => t.title).join(", ");
  return `7 KL.: ${titles}. Lygtys 1 eil., proporcijos, koordinatės, statistika (vidurkis/moda/mediana), paprasta tikimybė. Be kvadratinių lygčių, trig., log.`;
}

export const GRADE_8_RULES = {
  grade: 8,
  curriculum: "LT 2022 BP + Pagrindinė matematikos teorija moksleiviams (8 kl.)",
  purpose:
    "Tvirtinti realiųjų skaičių, algebros ir geometrijos įgūdžius; modeliuoti finansines ir erdvinės geometrijos situacijas; spręsti dviem nežinomaisiais aprašytas problemas.",
  topics: [
    {
      id: "8-saknys",
      title: "Šaknys",
      theory: [
        "Kvadratinė šaknis; šaknis ir kvadratas — priešingi veiksmai",
        "Šaknų savybės (√a·√b, √(a/b), kėlimas laipsniu su sveiku rodikliu)",
        "Iracionalieji skaičiai; šaknies traukimas išskaidant dauginamaisiais",
        "Kubinė šaknis (kubo lentelė, tos pačios savybės kaip kvadratinei)",
        "Veiksmai su šaknimis: sudėtis/atimtis (panašieji), daugyba, šaknis iš trupmenos",
        "Įkėlimas į šaknį ir iškėlimas",
      ],
      skills: [
        "Traukti ir supaprastinti kvadratinę/kubinę šaknį",
        "Lygininti ir skaičiuoti su iracionaliaisiais skaičiais",
        "Prastinti skaitinius ir raidinius reiškinius su šaknimis",
      ],
    },
    {
      id: "8-vektoriai",
      title: "Vektoriai",
      theory: [
        "Vektoriaus ilgis ir kryptis; lygūs ir priešingi vektoriai",
        "Vektorių sudėtis ir atimtis (trikampio taisyklė)",
        "Vektoriaus daugyba iš skaičiaus (ilgio ir krypties keitimas)",
      ],
      skills: [
        "Braižyti ir užrašyti vektorius",
        "Atlikti sudėtį, atimtį ir daugybą iš skaičiaus",
        "Spręsti paprastus uždavinius koordinatėse arba schemoje",
      ],
    },
    {
      id: "8-finansiniai-skaiciavimai",
      title: "Finansiniai skaičiavimai",
      theory: [
        "Paprastosios palūkanos (nuo pradinės sumos)",
        "Sudėtinės palūkanos ir formulė (augimas / nusidėvėjimas su + ar −)",
        "Procentai, nuolaida, antkainis",
        "Pajamos, išlaidos, pelnas ir nuostolis",
        "Pirkimas išsimokėtinai (paprasčiausi atvejai)",
      ],
      skills: [
        "Skaičiuoti palūkanas ir galutinę sumą",
        "Spręsti gyvenimiškus finansinius tekstinius uždavinius",
        "Pasirinkti paprastąsias ar sudėtines palūkanas pagal sąlygą",
      ],
    },
    {
      id: "8-reiskiniai",
      title: "Reiškiniai",
      theory: [
        "Panašiųjų narių sutraukimas (su ženklu prie koeficiento)",
        "Skliaustų atskliautimas ir dauginimas iš skaičiaus",
        "Dviejų daugianarių daugyba",
        "Kvadratinės greitosios daugybos formulės",
        "Skaidymas dauginamaisiais: bendrasis dauginys, GDF",
        "Grupavimo būdas (4 narių daugianarys: suskirstyti į 2 poras, iškelti bendrą skliaustą)",
      ],
      skills: [
        "Supaprastinti ir pertvarkyti raidinius reiškinius",
        "Taikyti GDF ir skaidyti daugianarius (įskaitant grupavimą)",
        "Apskaičiuoti reikšmes su skaitmeniniais pakeitimais",
      ],
      instruction:
        "Jei užduotis apie skaidymą 4 narių reiškiniu — tai grupavimo būdas (dvi poros + bendras skliaustas), ne kvadratinis trinarys.",
    },
    {
      id: "8-geometrija",
      title: "Geometrija",
      theory: [
        "Pitagoro teorema ir atvirkštinė (statumo nustatymas)",
        "Atstumas tarp taškų tiesėje ir plokštumoje",
        "Statinis prieš 30° kampą (pusė įžambinės); 45° ir 60° trikampiai",
        "Lygiašonis ir lygiakraštis trikampis",
        "Trikampio ir trapecijos vidurio linija",
        "Perimetrai ir plotai (2D)",
      ],
      skills: [
        "Rasti kraštines, aukštines ir atstumus",
        "Taikyti Pitagorą ir specialiuosius trikampius",
        "Naudoti vidurio linijos savybes",
      ],
    },
    {
      id: "8-sarysiai",
      title: "Sąryšiai",
      theory: [
        "Tiesioginis ir atvirkštinis proporcingumas",
        "Proporcijos ir formulės",
        "Lentelės ir grafikai priklausomybėms",
      ],
      skills: [
        "Sudaryti ir spręsti proporcijas",
        "Užpildyti lentelę pagal sąryšį",
        "Taikyti mastelį ir paprastą modeliavimą",
      ],
    },
    {
      id: "8-lygciu-sistemos",
      title: "Lygčių sistemos",
      theory: [
        "Lygtis su dviem nežinomaisiais",
        "Sprendinio tikrinimas (įstatymas į x ir y)",
        "Keitimo, sudėties, sulyginimo būdai",
        "Grafinis sprendimas koordinačių plokštumoje",
        "Tekstiniai uždaviniai (judėjimas, kainos ir pan.)",
      ],
      skills: [
        "Spręsti 2×2 tiesines sistemas algebriniu ir grafiniu būdu",
        "Pasirinkti efektyvų metodą",
        "Sudaryti sistemą iš teksto",
      ],
    },
    {
      id: "8-stereometrija-3d",
      title: "Stereometrija (3D)",
      theory: [
        "Stačioji prizmė ir taisyklingoji piramidė (plotas, tūris)",
        "Ritinys ir kūgis",
        "Rutulys ir sfera",
        "Pitagoro teorema erdvėje (įstrižainės, aukštinės)",
      ],
      skills: [
        "Atpažinti kūnus ir jų elementus",
        "Skaičiuoti paviršiaus plotą ir tūrį",
        "Sujungti 3D su Pitagoru",
      ],
    },
    {
      id: "8-duomenys",
      title: "Duomenys",
      theory: ["Duomenų rinkimas ir lentelės", "Stulpelinės ir skritulinės diagramos", "Paprasta tikimybė"],
      skills: ["Skaityti ir interpretuoti diagramas", "Apskaičiuoti paprastą tikimybę", "Formuluoti išvadą iš duomenų"],
    },
  ],
  forbidden: [
    "Kvadratinės lygtys",
    "Kvadratinio trinario skaidymas dauginamaisiais ($x^2+bx+c$, $ax^2+bx+c$) — tai 9 kl.",
    "Modulis: $|x|$, $|x-a|$, $|…|$ bet kurioje užduotyje (7 kl. modulis 8 kl. nekartoti)",
    "Mišrios sistemos (tiesinė + kvadratinė)",
    "Trigonometrinės funkcijos sin/cos/tan uždaviniai (tik 30°/45°/60° geometrinės savybės)",
    "Logaritmai, eksponentinės lygtys",
    "Kvadratinės funkcijos, parabolės, derivatai",
    "Skaliarinė vektorių sandauga",
    "Trupmeniniai raidiniai reiškiniai ($\\frac{…}{…}$ su kintamaisiais, sutrumpinimas, apibrėžimo sritis) — tik 9 kl.",
  ],
  new_for_grade_8: [
    "Sistemingas darbas su šaknimis ir iracionaliaisiais skaičiais",
    "Greitosios daugybos formulės ir skaidymas",
    "Tiesinių lygčių sistemos dviem nežinomaisiais",
    "Vektoriai plokštumoje",
    "Pitagoras, specialūs trikampiai, vidurio linija",
    "Erdvinių kūnų plotai ir tūriai",
    "Sudėtinės palūkanos",
  ],
  difficulty: {
    lengvas: {
      must: "Viena aiški 8 kl. taisyklė; 1–2 veiksmai; tipinis vadovėlio lygis (originalumas NEREIKALINGAS).",
      reject_if:
        "Daugiau nei 2 loginiai žingsniai, kelių temų derinys, arba reikia strategijos — tai jau vidutinis/sunkus.",
      originality: "Nenaudok „kūrybingumo“ reikalavimo — gali būti standartinis pavyzdys.",
    },
    vidutinis: {
      must: "Bent 2 nepriklausomi loginiai žingsniai (ne vienas formulės įstatymas su visais skaičiais). Pvz.: šaknų savybės → supaprastinimas; Pitagoras → plotas/perimetras; sudaryti sistemą → išspręsti; GDF ar grupavimas + tolesnis veiksmas.",
      reject_if:
        "Vienas elementarus veiksmas ($\\sqrt{36}$, viena lygtis $2x=8$) — tai LENGVA. Užduotis, atitinkanti sunkių schemą (T|A0 + antras ženklas) — tai SUNKU, ne vidutinė.",
      originality: "Pakanka nedidelių pakeitimų (kiti skaičiai/kintamieji); ne identiška populiari 3-4-5 trikampio kopija.",
    },
  },
} as const;

/** 8 kl. SUNKIOS — tik kai difficulty === "sunkios". */
export function buildGrade8HardChecklist(taskCount: number): string {
  const half = Math.ceil(taskCount / 2);
  const rest = taskCount - half;
  return `SUNKIOS (8 kl.) — tikras sunkumas ~14 m. moksleivio analizei (ne „2 veiksmai mokytojui“).

Schema kiekvienai užduočiai:

1) Pirmas sluoksnis — būtinai vienas iš:
• T — tekstinis (2–4 sakiniai, viena situacija, be fabulos); mokinys turi nuspręsti modelį.
• A0 — ilgas GRYNAS reiškinys / lygtis / paprasta nelygybė BE teksto: ≥4 nariai, 2–3 skliaustų lygiai; gali šaknys, GDF, grupavimas. DRAUDŽIAMA A0: trupmeninis reiškinis su kintamaisiais vardiklyje ($\\frac{ax+b}{…}$) — tai 9 kl.

2) Antras sluoksnis — privaloma dar viena kategorija (ne tik „išspręsk duotą sistemą“):
A — mokinys PATS sudaro lygtį / reiškinį / 2×2 sistemą iš teksto (ne duotos 2 lygtys be modeliavimo)
B — nebanali geometrija (žr. žemiau)
C — proporcija / sąryšiai / mastelis
E — procentai / finansai
F — paprastos trupmenos ar mišrieji skaičiai skaičiavime (dažnai kartu su T)
G — GDF / grupavimas (4 n.) / šaknų savybės (ne $\\sqrt{25}$)
I — matavimo vienetų vertimas
H — dvi skirtingos geometrijos idėjos (ne tas pats Pitagoras du kartus)
K — greitosios daugybos formulės

Lygčių sistema kaip SUNKI tik jei: T + A (pirmiausia sudaryti sistemą iš teksto) IR dar C/E/F/I/G (antras sluoksnis). DRAUDŽIAMA SUNKI: „Duotos 2 paprastos lygtys — rask x,y“ be sudarymo ir be F/C/E/I.

Pitagoras tekste (T+B): DRAUDŽIAMA SUNKI jei visi skaičiai natūralūs ir trikampis akivaizdus (3-4-5, 6-8-10, 5-12-13…) — tai vidutinė/lengva. Sunkiai: kraštinė $\\sqrt{…}$, mišrusis/procentas, 3D, vienetų vertimas, kintamieji, arba H (Pitagoras + kita savybė).

Nebanali B: kintamieji, trūksta duomenų, 3D+Pitagoras, atstumas plokštumoje, figūros junginys.

Batch (${taskCount}): ~${half}×T, ~${rest}×A0. Kiekviena kita idėja — ne tas pats šablonas.
DRAUDŽIAMA (visada 8 kl.): trupmeniniai reiškiniai; kvadratinis trinario skaidymas; modulis; tipinis Pitagoras natūraliais; trupmeninis A0.

Savikra: jei 14 m. moksleivio draugui atrodytų „per lengva“ — perrašyk. Pažymėk T/A0 + antrą raidę.`;
}

/** Detalus 8 kl. sunkumo aprašas (sunkios — tik schema). */
export function buildGrade8DifficultyDescription(difficulty: string, taskCount = 1): string {
  const d = GRADE_8_RULES.difficulty;

  if (difficulty === "sunkios") {
    return buildGrade8HardChecklist(taskCount);
  }
  if (difficulty === "vidutinės") {
    const v = d.vidutinis;
    return `VIDUTINĖS (8 kl.) — griežtai:
• ${v.must}
• ${v.reject_if}
• ${v.originality}`;
  }
  if (difficulty === "lengvos") {
    const l = d.lengvas;
    return `LENGVOS (8 kl.):
• ${l.must}
• ${l.originality}
• ${l.reject_if}`;
  }
  if (difficulty === "savarankiskas" || difficulty === "ivairus") {
    return `Mišraus lygio 8 kl. — naudok atitinkamą kiekvienam kiekiui bloką.\n${buildGrade8DifficultyDescription("vidutinės")}`;
  }
  return buildGrade8DifficultyDescription("vidutinės");
}

export function buildGrade8Section(): string {
  const r = GRADE_8_RULES;
  const topicLine = r.topics.map((t) => t.title).join("; ");
  const reisk = r.topics.find((t) => t.id === "8-reiskiniai");
  const grouping =
    reisk && "instruction" in reisk && reisk.instruction ? ` Reiškinių skaidymas: ${reisk.instruction}` : "";
  const forbid = r.forbidden.join("; ");
  return `8 KL. programos temos: ${topicLine}. Šaknys: savybės, išskaidymas, kvadratinė/kubinė. Sistemos: tik 2 tiesinės lygtys su x,y. Geometrija: Pitagoras, 30°/45°/60°, vidurio linija; 3D — prizmė, piramidė, ritinys, kūgis, rutulys. Finansai: paprast./sudėt. palūkanos.${grouping} DRAUDŽIAMA (visada): ${forbid}.`;
}

export const GRADE_9_RULES = {
  grade: 9,
  topics: [
    {
      title: "Skaičių sekos",
      theory: ["n-tojo nario formulė", "Rekurentinis būdas"],
      skills: [
        "Atpažinti paprasčiausių sekų dėsningumus",
        "Rasti sekos narius ar jų numerius",
        "Sudaryti sekos formulę",
      ],
    },
    {
      title: "Algebra",
      theory: [
        "Trupmeninis raidinis reiškinys, jo apibrėžimo sritis",
        "Trupmeninių reiškinių prastinimas ir pertvarkymas",
        "Veiksmai su trupmeniniais reiškiniais",
        "Kvadratinio trinario skaidymas dauginamaisiais",
        "Trupmeninių reiškinių sudarymas",
      ],
      skills: [
        "Prastinti ir pertvarkyti reiškinius",
        "Atlikti veiksmus su trupmeniniais reiškiniais",
        "Skaidyti kvadratinius trinarus",
        "Sudaryti trupmeninius reiškinius",
      ],
    },
    {
      title: "Kvadratinės lygtys",
      theory: [
        "Nepilnoji ir pilnoji kvadratinė lygtis",
        "Diskriminantas",
        "Kvadratinės lygties sprendinių formulė",
      ],
      skills: ["Spręsti įvairias kvadratines lygtis"],
    },
    {
      title: "Lygčių sistemos",
      theory: ["Lygčių sistemos: 1 tiesinė ir 1 kvadratinė"],
      skills: [
        "Spręsti tiesines ir mišrias lygčių sistemas",
        "Sudaryti mišrias sistemas iš paprasto teksto",
        "Modeliuoti tik paprastas skaitines ir geometrines situacijas",
      ],
    },
    {
      title: "Funkcijos",
      theory: [
        "Tiesinė funkcija ir jos išraiška y=kx+b",
        "Parabolė ir jos išraiškos: y=ax²; y=ax²+c; y=ax²+bx+c; y=a(x−x₁)(x−x₂); y=a(x−m)²+n",
        "Įvairios funkcijos (naudojamos tik iš grafiko nustatyti savybes ar konkrečią x; y reikšmę)",
      ],
      skills: [
        "Braižyti tieses ir paraboles",
        "Nustatyti įvairių funkcijų savybes",
        "Spręsti grafinius uždavinius",
        "Rasti tiesės k ir b koeficientus, sudaryti tiesės formulę",
        "Rasti parabolės išraiškų koeficientus",
        "Spręsti nesudėtingus gyvenimiškus uždavinius su tiesine ir kvadratine funkcija",
        "Spręsti tiesinių ir kvadratinių lygčių sistemas grafiškai",
      ],
    },
    {
      title: "Trigonometrijos pradmenys",
      theory: [
        "Tik smailiojo kampo sin, cos, tan",
        "sin, cos, tan 30°, 45°, 60° tikslios reikšmės",
        "Trigonometrinio vieneto formulė",
        "tan išraiška per sin ir cos",
      ],
      skills: [
        "Rasti trikampio kraštines",
        "Rasti kampų dydžius",
        "Taikyti trigonometriją paprastos geometrijos ir praktiniuose uždaviniuose",
        "Prastinti paprasčiausius trigonometrinius reiškinius",
      ],
      forbidden: ["sin ir cos teoremos", ">90° kampai", "Vienetinis apskritimas", "tan tiesė"],
    },
    {
      title: "Apskritimo geometrija",
      theory: [
        "Centrinis ir įbrėžtinis kampai",
        "Liestinė ir kirstinė",
        "Išpjovos ir nuopjovos formulės",
        "Laikrodžio teorija",
      ],
      skills: [
        "Taikyti apskritimo savybes",
        "Apskaičiuoti išpjovos ir nuopjovos plotą bei perimetrą",
        "Spręsti kombinuotus paprastos ir apskritimo geometrijos uždavinius",
        "Apskaičiuoti kampą tarp laikrodžio rodyklių",
      ],
      instruction: "Sąlygoje pateikti „Laikykite π=3,14“ arba „Atsakymą pateikite su π“.",
    },
  ],
  new_for_grade_9: [
    "Skaičių sekos",
    "Kvadratinės lygtys",
    "Algebrinės trupmenos",
    "Funkcijos",
    "Apskritimo geometrijos savybės",
    "Trigonometrija",
  ],
  difficulty: {
    lengvas: "Paprasta lygtis, trumpas reiškinys, y=kx, y=ax², y=ax²+c, 1 žingsnio apskritimo geometrijos ar trigonometrijos uždaviniai.",
    vidutinis: "Ilgesni reiškiniai, visos aprašytos funkcijų išraiškos, 2–3 žingsnių apskritimo geometrijos ar trigonometrijos uždaviniai.",
    sunkus: "Lygčių ar reiškinių sudarymas, sudėtingesnės kvadratinės lygtys, funkcijų lygčių sudarymas, kelių dalių ar gyvenimiški uždaviniai, rekurentinės sekos, kombinuota kelių temų teorija, loginiai uždaviniai.",
  },
};

export function buildGrade9Section(): string {
  const lines = GRADE_9_RULES.topics.map((t) => {
    let s = t.title;
    if ("forbidden" in t && Array.isArray(t.forbidden)) {
      s += ` (ne: ${(t.forbidden as string[]).join(", ")})`;
    }
    if ("instruction" in t && t.instruction) s += ` [${t.instruction}]`;
    return s;
  });
  const d = GRADE_9_RULES.difficulty;
  return `9 KL. programos temos: ${lines.join("; ")}. Sunkumas — lengvos: ${d.lengvas} Vidutinės: ${d.vidutinis} Sunkios: ${d.sunkus}`;
}

export const GRADE_10_RULES = {
  grade: 10,
  topics: [
    {
      title: "Proporcingieji dydžiai",
      theory: ["Procentų taikymas", "Sudėtiniai procentai"],
      skills: [
        "Spręsti uždavinius su santykiais",
        "Skaičiuoti procentinį pokytį ir sudėtingus procentinius uždavinius",
        "Taikyti procentus gyvenime (džiovinimai, tirpalų koncentracijos)",
        "Taikyti sudėtinių procentų formulę finansiniuose ir praktiniuose uždaviniuose",
      ],
    },
    {
      title: "Racionaliosios lygtys",
      theory: ["Trupmeninės lygtys", "Apibrėžimo sritis"],
      skills: [
        "Spręsti racionaliąsias lygtis ir tikrinti sprendinius",
        "Spręsti judėjimo uždavinius",
        "Spręsti darbo uždavinius",
        "Spręsti kitus tekstinius uždavinius (pvz. apie skaitiklį ir vardiklį)",
      ],
    },
    {
      title: "Lygčių sistemos",
      skills: [
        "Spręsti lygčių sistemas, kai viena lygtis tiesinė, kita kvadratinė arba racionalioji",
        "Sudaryti sistemas iš tekstinių uždavinių",
      ],
    },
    {
      title: "Kvadratinės nelygybės",
      skills: [
        "Spręsti kvadratines nelygybes algebriniu, grafiniu ir intervalų metodu",
        "Spręsti tekstinius uždavinius",
      ],
    },
    {
      title: "Panašios figūros",
      theory: [
        "Panašieji trikampiai",
        "Panašiųjų trikampių perimetrai ir plotai",
        "Pusiaukraštinių savybės",
        "Pusiaukampinių savybės",
        "Panašieji daugiakampiai",
      ],
    },
    {
      title: "Įbrėžtiniai ir apibrėžtiniai daugiakampiai",
      theory: [
        "Įbrėžtiniai trikampiai",
        "Apibrėžtiniai trikampiai",
        "Įbrėžtiniai keturkampiai",
        "Apibrėžtiniai keturkampiai",
      ],
      skills: [
        "Taikyti įbrėžtinių ir apibrėžtinių figūrų savybes",
        "Rasti kampus, kraštinių ilgius, plotus, spindulius",
        "Taikyti liestinės ir kirstinės, apskritimo savybes",
      ],
    },
    {
      title: "Trigonometrija",
      theory: [
        "Bukojo kampo sin, cos, tan; vienetinis apskritimas",
        "Sinusų ir kosinusų teoremos",
        "Trikampio ploto formulė S=ab·sin(C)/2",
      ],
      skills: [
        "Spręsti trikampius naudojant sin/cos/tan ir teoremas",
        "Taikyti ploto formulę su sin",
        "Spręsti uždavinius su vienetiniu apskritimu ir posūkio kampais",
      ],
    },
    {
      title: "Tikimybės ir kombinatorika",
      skills: [
        "Skaičiuoti gretinius, kėlinius ir derinius, taikyti praktiškai",
        "Nustatyti, ar tvarka svarbi",
        "Skaičiuoti tikimybes",
      ],
    },
  ],
  new_for_grade_10: [
    "Sudėtiniai procentai",
    "Racionaliosios lygtys ir nelygybės",
    "Sudėtingesni panašių figūrų skaičiavimai",
    "Įbrėžtiniai ir apibrėžtiniai daugiakampiai",
    "Sin ir cos teoremos",
    "Trikampio ploto formulė S=ab·sin(C)/2",
    "Vienetinis apskritimas, posūkio kampai",
    "Deriniai, gretiniai, kėliniai",
  ],
  difficulty: {
    lengvas:
      "Tiesioginis formulės taikymas, vienos trupmenos racionaliosios lygtys ar nelygybės, paprasti vieno žingsnio uždaviniai.",
    vidutinis:
      "2–3 žingsnių uždaviniai, kvadratinės nelygybės, dviejų trupmenų racionaliosios lygtys ar nelygybės, sudėtingesni uždaviniai iš vienos temos (gali reikėti kelių savybių).",
    sunkus:
      "Tekstiniai uždaviniai, racionaliųjų nelygybių ir lygčių sudarymas, sudėtingesnės lygčių sistemos, originalesni uždaviniai, reikalaujantys žinių iš kelių temų.",
  },
};

export function buildGrade10Section(): string {
  const lines = GRADE_10_RULES.topics.map((t) => t.title);
  const nauja = GRADE_10_RULES.new_for_grade_10.join("; ");
  const d = GRADE_10_RULES.difficulty;
  return `10 KL. programos temos: ${lines.join("; ")}. Nauja 10 kl.: ${nauja}. Sunkumas — lengvos: ${d.lengvas} Vidutinės: ${d.vidutinis} Sunkios: ${d.sunkus}`;
}

type ProgramDifficultyBlock = { lengvas: string; vidutinis: string; sunkus: string };

function mapProgramDifficulty(
  block: ProgramDifficultyBlock,
  difficulty: string,
): string | null {
  if (difficulty === "lengvos") return block.lengvas;
  if (difficulty === "vidutinės") return block.vidutinis;
  if (difficulty === "sunkios") return block.sunkus;
  return null;
}

/** Klasėms su GRADE_N_RULES.difficulty — 1–2 sakiniai; 8 kl. — išplėstinė schema. */
export function buildGradeProgramDifficultyDescription(
  grade: number,
  difficulty: string,
  taskCount = 1,
): string | null {
  if (grade === 8) {
    return buildGrade8DifficultyDescription(difficulty, taskCount);
  }
  if (grade === 9) {
    return mapProgramDifficulty(GRADE_9_RULES.difficulty, difficulty);
  }
  if (grade === 10) {
    return mapProgramDifficulty(GRADE_10_RULES.difficulty, difficulty);
  }
  return null;
}

const GRADE_CURRICULUM_SECTIONS: Partial<Record<number, () => string>> = {
  1: buildGrade1Section,
  5: buildGrade5Section,
  7: buildGrade7Section,
  8: buildGrade8Section,
  9: buildGrade9Section,
  10: buildGrade10Section,
};

export function buildGradeCurriculumSection(grade: number): string {
  const fn = GRADE_CURRICULUM_SECTIONS[grade];
  return fn ? fn() : "";
}

export function buildGradeConstraints(grade: number): string {
  if (grade >= 1 && grade <= 4) {
    const extra = grade === 3
      ? " DRAUDŽIAMA dvi trupmenos viename veiksme; trupmena tik kaip dalis ar $n\\times\\frac{a}{b}$; dauguma užduočių be trupmenų."
      : "";
    return `${grade} KL.: sudėtis/atimtis — stulpeliu; dalyba — eilutėje ($a:b=$) arba kampu, ne stulpeliu kaip sudėtis; answer tik skaičius (dalybai su liekana: „dalmuo liek. liekana“, pvz. „8 liek. 0“), be kampo/trupmenos answer lauke.${extra}`;
  }

  if (grade === 7) return `7 KL. laipsniai: ne tik $2^5$ — naudok savybes ($a^m\\cdot a^n$, $(a^m)^n$, $a^0$ ir pan.).`;

  if (grade === 8) {
    return `8 KL. privaloma: užduotys tik iš 8 kl. programos. Šaknys — savybės arba išskaidymas dauginamaisiais, ne tik $\\sqrt{25}$. Skaidymas: bendras dauginys, GDF, grupavimo būdas (4 nariai). DRAUDŽIAMA: kvadratinio trinario $x^2+bx+c$ skaidymas; modulis $|x|$; trupmeniniai raidiniai reiškiniai ($\\frac{ax+b}{cx+d}$ ir pan.) — 9 kl. Lygčių sistemos — tik $x,y$; ne kvadratinės. Geometrija — Pitagoras, 30°/45°/60°, vidurio linija; 3D — plotas/tūris + Pitagoras erdvėje jei reikia.`;
  }

  if (grade === 5) return "";

  return "";
}

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
  "11:laipsniai-ir-saknys": {
    title: "Laipsniai ir šaknys",
    body: `Lengva: laipsnių su racionaliuoju rodikliu skaičiavimas taikant vieną savybę (vienodų pagrindų daugyba/dalyba, laipsnio kėlimas laipsniu, pvz. $27^{2/3}$); šaknies keitimas laipsniu su racionaliuoju rodikliu ir atvirkščiai ($a^{m/n}=\\sqrt[n]{a^m}$); paprastos šaknų savybės su skaičiais ($\\sqrt[n]{ab}$, $\\sqrt[n]{a/b}$).

Vidutinė: reiškinių prastinimas taikant kelias laipsnių/šaknų savybes iš eilės; daugiklio iškėlimas prieš šaknies ženklą ir įkėlimas po juo (su raidėmis, kai nurodytas kintamojo ženklas); $\\sqrt[2k]{a^{2k}}=|a|$ taikymas; kvadratų skirtumo formulė su laipsniais su racionaliuoju rodikliu (pvz. $(a^{1/2}+b^{1/2})(a^{1/2}-b^{1/2})$); laipsnio su racionaliuoju rodikliu apibrėžimo sritis.

Sunki: kelių žingsnių raidiniai reiškiniai su trupmenomis ir laipsniais su racionaliuoju rodikliu; sumos/skirtumo kubas ir kubų sumos/skirtumo formulės ($a^3\\pm b^3$ skaidymas); laipsniai su iracionaliaisiais rodikliais (pvz. $3^{1+\\sqrt{2}}\\cdot 3^{1-\\sqrt{2}}$); kombinuoti skaičiuojami reiškiniai su skirtingais pagrindais, šaknimis ir neigiamais rodikliais.`,
  },
  "8:tiesioginis-proporcingumas": {
    title: "Tiesioginis proporcingumas",
    body:
      "Skaičiavimai, tiesinės funkcijos grafikas ir jo braižymas; funkcija $y=kx$; praktinis panaudojimas, pvz., $S=v\\cdot t$ formulė ar gyvenimiškuose uždaviniuose.",
  },
  "8:atvirkstinis-proporcingumas": {
    title: "Atvirkštinis proporcingumas",
    body: "Skaičiavimai, $y=k/x$ formulė, teigiamos $x$ ašies grafikas; lentelės, tekstiniai uždaviniai.",
  },
  "8:lygtis-su-dviem-nezinomaisiais": {
    title: "Lygtis su dviem nežinomaisiais",
    body:
      "Kurk uždavinius, kur reikėtų rasti kelis galimus lygties sprendinius $x$ ir $y$. Pvz., lengvas uždavinys būtų: raskite lygties $2x+y=10$ tris galimas sprendinių poras.",
  },
  "9:nepilnosios": {
    title: "Nepilnosios",
    body: `Nepilnosios kvadratinės lygtys: $ax^2=0$, $ax^2+c=0$, $ax^2+bx=0$.

Lengva: trumpos lygtys (2–4 nariai), viena lygybės pusė arba vienas perkėlimas.

Vidutinė: nepilnosios su nariais abiejose lygybės pusėse (Viso ~5 narius); gali būti skliaustai, trupmeniniai skaičiai.

Sunki: sudėtingesnės nepilnosios — keli žingsniai, trupmena su skaitiniu vardikliu ($\\frac{\\dots}{n}$, ne raidė vardiklyje); sutraukti panašius narius prieš skaidymą dauginamaisiais ar panaudoti greitosios daugybos formules`,
  },
  "9:pilnosios": {
    title: "Pilnosios",
    body: `Pilnosios kvadratinės lygtys $ax^2+bx+c=0$ ($a\\neq 0$).

Lengva: trumpos pilnosios (2–4 nariai, viena pusė); gali būti tik diskriminanto ($D=b^2-4ac$) skaičiavimas arba $D$ ženklo nustatymas.

Vidutinė: išspręsti pilnąsias lygtis; $D>0$, $D<0$ arba $D=0$. Gali būti 5-6 nariai išsidėstę abiejose lygybės pusėse. Patikrink atsakymus.

Sunki: sudėtingos pilnosios (nariai abiejose pusėse, gali trupmena su skaitiniu vardikliu ar šiaip sudėtingesni skaičiai); Diskriminantas >0;<0;0. Gali būti paprastos lygtys su parametrais, kurios pereina į tiesinę nelygybę.`,
  },
  "9:kvadratinio-trinario-skaidymas": {
    title: "Kvadratinio trinario skaidymas",
    body: `Visiems lygiams — TIK skaidyti kvadratinį trinarį $ax^2+bx+c$ dauginamaisiais (arba $(ax\\pm b)^2$); negali būti užduoties išspręsti lygtį.

Lengva: trumpos lygtys (2–4 nariai), trinaris lengvai skaidomas ($x^2+bx+c$, $2x^2+4x$ ir pan.).

Vidutinė: Sudėtingesni kvadratiniai triniai (>3 nariai), gali būti atskliautimas, trupmeniniai skaičiai. Patikrink atsakymus.

Sunki: Daug narių. PIRMIAUSIA sutraukti panašius narius ar atlikti kitokius pertvarkymus, tik tada skaidyti trinarį dauginamaisiais. Patikrink atsakymus.`,
  },
  "9:9-kvadratines-lygtys:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai (kvadratinės lygtys)",
    body: `Visiems lygiams — TIK tekstiniai uždaviniai sudaryti lygtį ir išspręsti; (gyvenimiški, geometriniai); ne grynos lygtys be konteksto.

Lengva: trumpas, aiškus tekstas; sudaryti ir išspręsti nepilną kvadratinę lygtį arba paprastą pilną.

Vidutinė: sudėtingesnis tekstas,$D>0$, $D=0$. Būtinai patikrink atsakymus.

Sunki: sudėtingas tekstinis su geometrija; gali būti parametrinė sąlyga (pvz. rasti $m$, kai…), kai galutinis žingsnis — tik tiesinė nelygybė; gali būti kelių dalių uždavinys ar šiaip netradicinis, kūrybiškas. Būtinai patikrink atsakymus.`,
  },
  "9:trigonometrines-funkcijos": {
    title: "Trigonometrinės funkcijos",
    body: `$\\sin$, $\\cos$, $\\tan$ sąvokos (pvz sinus yra statinis prieš su įžambine…); reikšmių apytikslis skaičiavimas skaičiuotuvu; tikslus $\\sin$, $\\cos$, $\\tan$ radimas iš stataus trikampio brėžinio, kai duotos kraštinės; kampo skaičiavimas skaičiuotuvu, kai duoda $\\sin$, $\\cos$, $\\tan$ reikšmė.`,
  },
  "9:staciojo-trikampio-krastiniu-ir-kampu-skaiciavimas": {
    title: "Stačiojo trikampio kraštinių ir kampų skaičiavimas",
    body: `Stačiojo trikampio kraštinių ir kampų skaičiavimas taikant $\\sin$, $\\cos$, $\\tan$; naudok $30^\\circ$, $45^\\circ$, $60^\\circ$ tikslias reikšmes, Pitagoro teoremą ar kitas trikampio savybės sunkiame lygyje.`,
  },
  "9:trigonometrines-lygybes": {
    title: "Trigonometrinės lygybės",
    body: `Kurk užduotis, kur naudojamos šios formulės: $\\sin^2\\alpha + \\cos^2\\alpha = 1$ (ir jos išvediniai: $\\sin^2\\alpha = 1 - \\cos^2\\alpha$, $\\cos^2\\alpha = 1 - \\sin^2\\alpha$). Tangento apibrėžimas per sinusą ir kosinusą. Sunkiam lygiui šios formulės gali būti derinamos su greitosios daugybos formulėmis ar bendravardiklinimu.`,
  },
  "9:9-staciojo-trikampio-trigonometrija:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai (trigonometrija)",
    body: `Generuok realaus pasaulio konteksto uždavinius (pvz., pastato / medžio aukštis, šešėlis, atstumas iki objekto, įkalnės / pakilimo ir nusileidimo kampas). Uždavinys turi susivesti į stačiojo trikampio skaičiavimą pagal taikomą $\\sin$, $\\cos$ arba $\\tan$. Atsakymai turi būti apvalinami, kampai laipsniais vienetų tikslumu.`,
  },
  "9:centrinis-ir-ibreztinis-kampai": {
    title: "Centrinis ir įbrėžtinis kampai",
    body: `Naudok centrinio ir įbrėžtinio kampų savybę; tai, kad du įbrėžtiniai kampai, kurie remiasi į tą patį lanką, yra lygūs; įbrėžtinis kampas, kuris remiasi į skersmenį.`,
  },
  "9:liestine-ir-kirstine": {
    title: "Liestinė ir kirstinė",
    body: `Derink šias taisykles: spindulys yra statmenas apskritimo liestinei lietimosi taške; dvi liestinės išeinančios iš vieno taško yra lygios; skersmens ir stygos susikirtimo statmeni taisyklė; stygų susikirtimo taisyklė. Gali būti Pitagoro teorema, $30^\\circ$, $45^\\circ$, $60^\\circ$ kampai.`,
  },
  "9:ispjova-ir-nuopjova": {
    title: "Išpjova ir nuopjova",
    body: `Lanko ilgio, išpjovos ploto, nuopjovos ploto formulių taikymas su standartiniais $30^\\circ$, $45^\\circ$, $60^\\circ$, $90^\\circ$, $120^\\circ$, $150^\\circ$, $180^\\circ$ kampais.`,
  },
  "9:laikrodziai": {
    title: "Laikrodžiai",
    body: `Kurk užduotis, susijusias su kampais tarp laikrodžio valandinės ir minutinės rodyklių arba rodyklių nubrėžto lanko / išpjovos ilgio bei ploto skaičiavimu.`,
  },
  "9:ivairios-funkcijos": {
    title: "Įvairios funkcijos",
    body: `Kurk užduotis, kur reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$; tikrinti, ar taškas priklauso funkcijai; liepti nubraižyti $y=kx+b$ grafiką ir iš jo nustatyti funkcijos savybes (teigiamos ir neigiamos, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk uždavinius, kur žodžiu užrašytą funkciją reikia parašyti formule.

Svarbūs $x$ ir $y$ terminai: $x$ = argumentas, nepriklausomas kintamasis; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis arba $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis — $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.

Lengva: rasti $f(x)$, kai duotas $x$; funkcijos nuliai; tikrinti taško priklausymą funkcijai.

Vidutinė: rasti $x$, kai duotas $f(x)$; visos savybės; žodžius užrašyti formule.

Sunki: gali būti viskas; kelios užduotys vienoje; sudėtingesni skaičiai (trupmenos ir pan.).`,
  },
  "9:tiesines-funkcijos": {
    title: "Tiesinės funkcijos",
    body: `Kurk užduotis, kur reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$; tikrinti, ar taškas priklauso funkcijai; liepti nubraižyti $y=kx+b$ grafiką ir iš jo nustatyti funkcijos savybes (apibrėžimo sritis, reikšmių sritis, didėjimo ir mažėjimo intervalai, teigiamos ir neigiamos, didžiausios ir mažiausios reikšmės, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Braižymo ir funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk užduotis, kur reikia nustatyti funkcijos $f(x)=kx+b$ formulę, kai duoti du taškai arba tiesiog rasti koeficientus $k$ ir $b$. Taip pat žodžiu užrašytą funkciją parašyti formule arba paklausti, kaip funkcija pasikeis, jei kažkaip pakoreguosime $k$ ir $b$ koeficientus (nereikia atsakymų — answer: "").

Svarbūs $x$ ir $y$ terminai: $x$ = argumentas, nepriklausomas kintamasis; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis arba $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis — $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.

Lengva: rasti $f(x)$, kai duotas $x$; paprastos savybės; nubrėžti funkciją su paprastais skaičiais; tikrinti taško priklausymą funkcijai.

Vidutinė: rasti $x$, kai duotas $f(x)$; nubrėžti funkciją ir parašyti savybes; rasti koeficientus $k$ ir $b$ pagal 2 taškus; žodžius užrašyti formule.

Sunki: formulės $kx+b$ nustatymas iš dviejų taškų; užduotys su parametrais, pvz. „su kuriomis $m$ reikšmėmis duotos funkcijos grafikas kerta $x$ ašį taške …“; koeficientų $k$ ir $b$ keitimas (kaip pasikeis funkcija…); visos savybės vienoje užduotyje; gali būti kombinuotos užduotys su sudėtingesniais skaičiais, įdomesni atvejai, pvz. $k$ ar $b=0$.`,
  },
  "10:proporcingi-dydziai": {
    title: "Proporcingi dydžiai",
    body: `Uždaviniai su santykiais, gali būti kombinuoti su paprasta geometrija; proporcingoji dalyba. Uždaviniai su nemažai teksto ir gyvenimiškom situacijom; `,
  },
  "10:sudetiniai-procentai": {
    title: "Sudėtiniai procentai",
    body: `Taikyti sudėtinių procentų formulę ir rasti bet kurį jos nežinomą dydį; indėliai, paskolos, nuolaidos ant nuolaidos. Patikrink atsakymus.`,
  },
  "10:procentu-taikymo-uzdaviniai": {
    title: "Procentų taikymo uždaviniai",
    body: `Procentinis pokytis, džiovinimo, tirpalų koncentracijos, lydinių gyvenimiški uždaviniai.`,
  },
  "10:10-lygciu-sistemos:lygciu-sistemu-sprendimas": {
    title: "Lygčių sistemų, kurių viena lygtis yra tiesinė, o kita - trupmeninė arba kvadratinė, sprendimas",
    body: `Sistema: viena lygtis tiesinė ($ax+by=c$), kita — trupmeninė (su $x$ ar $y$ vardikliu) arba kvadratinė ($ax^2+bx+c=0$ arba su $x^2$, $y^2$). Nežinomieji tik $x$ ir $y$.

Lengva: duota sistema be teksto; viena lygtis aiškiai tiesinė, kita — paprasta kvadratinė arba racionalioji; 1–2 perkėlimai.

Vidutinė: trupmeninė lygtis reikalauja išskirti bendrą dauginį ar sutraukti; kvadratinė su $D>0$ arba $D=0$; gali būti 3–4 nariai abiejose pusėse.

Sunki: sudėtingesnė trupmeninė (kelios trupmenos, apibrėžimo sritis); kvadratinė su parametrais arba kombinuota su trupmenine; patikrink sprendinius (ypač racionaliose). Patikrink atsakymus.`,
  },
  "10:10-lygciu-sistemos:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai",
    body: `Uždaviniai su skaičiais, pvz.: „Trupmenos skaitiklis ir vardiklis yra natūralieji skaičiai. Vardiklio ir skaitiklio skirtumas lygus 4. Jeigu skaitiklį ir vardiklį padidintume 5 vienetais, trupmenos reikšmė padidėtų 3 kartus. Raskite šią trupmeną.“ Darbo ir judėjimo uždaviniai; geometriniai ir gyvenimiški uždaviniai. Sudaryti lygčių sistemą iš teksto (viena lygtis tiesinė, kita trupmeninė arba kvadratinė) ir išspręsti.

Lengva: trumpas tekstas, aiškiai sudaryti 2 lygtis.

Vidutinė: daugiau teksto, reikia patys parinkti kintamuosius; darbo ar judėjimo kontekstas.

Sunki: kombinuoti geometrinį ar gyvenimiški kontekstą su trupmenine/kvadratine lygtimi; patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:algebrinis-budas": {
    title: "Algebrinis būdas",
    body: `Atsakymas intervalais.

Lengva: jau skaidyta forma $(x-a)(x-b)>0$ arba $<0$; nepilnosios $ax^2+bx \le 0$, $ax^2+c>0$, $ax^2<k$; paprastos $(ax+b)^2>0$ arba $\le 0$; gali būti „ar skaičius … yra sprendinys?“.

Vidutinė: pilnas trinaris $ax^2+bx+c$ po skaidymo dauginamaisiais arba kvadratas $(x\pm m)^2$; perstatyti narius prieš sprendimą; $D>0$, $D=0$ arba $D<0$ atvejai.

Sunki: išskleisti ir supaprastinti prieš sprendimą (skliaustai, $(x-a)^2$); rasti didžiausią sveikąjį ar mažiausią natūralųjį sprendinį; $f(x)<0$ kai duota $f(x)=ax^2+bx+c$; dvi nelygybės — bendri sprendiniai (sankirta). Patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:grafinis-ir-intervalu-metodai": {
    title: "Grafinis ir intervalų metodai",
    body: `Kvadratinės nelygybės — grafinis būdas (nuliai, parabolė) arba intervalų būdas (nuliai, ženklų intervalai). Atsakymas intervalais; gali nurodyti spręsti „grafiniu“ ar „intervalų“ metodu.

Lengva: grafinis — nepilnosios $x^2+bx>0$, $x^2-c>0$, $c-x^2\le 0$; paprastas trinaris $x^2+bx+c<0$. Intervalų — jau skaidyta $x(3x-1)>0$, $(ax+b)(cx+d)\ge 0$; paprasti $x^2+bx>0$, $k-x^2\le 0$.

Vidutinė: grafinis — perstatyti $x^2-2<-x$, $(x-1)^2-7\le 4x+1$; $D=0$ / visi $x$ / tuščia aibė; didžiausias sveikasis sprendinys; natūralių sprendinių suma; $\sqrt{x^2+20x}$ apibrėžimo sritis ($\ge 0$ po šaknimi). Intervalų — trinaris po skaidymo; trupmeniniai koeficientai.

Sunki: grafinis — $\frac{5}{x^2-3x}>0$; įrodyti, kad nelygybė teisinga visiems $x$; $\frac{x^2+4x}{3}+\frac{2+2x}{2}<1$ ir rasti sveikų sprendinių vidurkį; dvi nelygybės — bendri sprendiniai (sankirta) rašyk $$\\begin{cases} ... \\\\ ... \\end{cases}$$; $\sqrt{5x^2-15x}$ ODZ, sveiki $x$. Intervalų — išskleisti prieš metodą: $x(x+3)<4x+6$, $(x+6)^2-x(x-4)>x^2$, $(x+1)^2-2x(x+3)<-4x$; $-x^2+bx+c$. Patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai",
    body: `TIK tekstiniai uždaviniai — sudaryti kvadratinę nelygybę iš sąlygos ir išspręsti; atsakymas intervalais arba konkretus skaičius (natūralus, sveikas). DRAUDŽIAMA: grynos lygtys/nelygybės be konteksto; parametrai $k$, $m$, $t$ be teksto (diskriminantas „su kuriomis $k$…“).

Lengva: stačiakampio plotas ir kraštinės ($S \le k$, viena kraštinė ilgesnė už kitą); trys iš eilės natūralių (arba ne neigiamų) skaičių kvadratų suma $\le k$ ir panašūs aiškūs uždaviniai.

Vidutinė: stačiakampis lyginant su kvadratu; stačiasis trikampis — jų suma ar skirtumas ir plotas $>/< k$; fizika/ekonomika su duota formule: $s(t)=at^2+bt+c$ (atstumas $>k$), $P(x)=-ax^2+bx+c$ (pelnas $\ge k$), $h(t)=at-bt^2$ (aukštis $>k$) — rasti $t$ ar $x$ intervalą ar min. sveiką $t$.

Sunki: sklypas su vidine tvora, bendras fence ilgis ir plotas $\ge k$; du natūralūs skaičiai su liekanomis dalijant ir sandauga $\le k$; terasos ilgis/plotis ir plotas tarp ribų; nelygybių sistemos — $$\\begin{cases} ... \\\\ ... \\end{cases}$$ (ne kablelis vienoje eilutėje). Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasieji-trikampiai": {
    title: "Trikampio panašumo požymiai",
    body: `Trikampių panašumas: požymiai pagal du kampus (AA), dvi kraštines ir kampą tarp jų (SAS), tris kraštines (SSS). Atitinkamos kraštinės ir atitinkami kampai. Panašumo koeficientas $k$ — atitinkamų kraštinių santykis.

Lengva: „Nustatykite, ar trikampiai panašūs. Atsakymą pagrįskite“ — du duoti kampai arba statusis lygiašonis trikampis; AA požymis; rasti trečią kampą iš $180^\circ$ sumos. Du panašūs trikampiai su duotais 2 kampais — užrašyti atitinkamas kraštines ir kampus. Rasti $x$ pagal proporciją, kai trikampiai jau panašūs ir duotos 3 kraštinės (aiškus $k$).

Vidutinė: SAS ir SSS; patikrinti proporcijas ($8:10$ ir $4:5$ ir $37^\circ$). Įrodyti panašumą brėžinyje (lygiagretūs pagrindai, bendras kampas, „smėlio laikrodžio“ trikampiai su kryžminiais kampais). Proporcingos atkarpos: trikampio viduje atkarpa lygiagreti pagrindui — rasti $x$ (Talio teorema / panašumas). Dvi lygiagrečios tiesės ir kertančios — rasti nežinomą atkarpą. Keli atvejai (a–d) skirtingais požymiais.

Sunki: įrodyti panašumą ir užrašyti kraštinių proporcijas (sudėtingas brėžinys su keliais trikampiais); aukštinės į įžambinę statusiame trikampyje (panašūs trikampiai); trapecija su įstrižainėmis. rasti $x$ ir $y$ keliuose trikampiuose. Užduotims su dviem panašiais trikampiais ir viena nežinoma kraštine — diagram_config SIMILAR_TRIANGLES (left_*/right_* labels). Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasiuju-trikampiu-perimetrai-ir-plotai": {
    title: "Panašiųjų trikampių perimetrai ir plotai",
    body: `Panašūs trikampiai: perimetrų santykis $P_1/P_2=k$; plotų santykis $S_1/S_2=k^2$; atitinkamų aukštinių santykis $k$. Vidurinė linija sukuria panašų trikampį su $k=1:2$, plotas $1:4$.

Lengva: duotas vieno trikampio perimetras ir kitų kraštinės — rasti kraštines arba $k$ Taisyklingasis trikampis: duotas kraštinė ir perimetras — rasti kitą perimetrą pagal $k$. Rasti $k$ iš kraštinių ir apskaičiuoti perimetrą.

Vidutinė: rasti kraštines, kai duotas perimetras ir $k$; rasti abu perimetrus, kai duota ilgiausia/ trumpiausia kraštinė ir $k$; perimetrų skirtumas arba suma su kraštinių santykiu ($P_{ABC}-P_{DEF}=75$, $AB/DE=3/2$). Plotų santykis iš $k$ — rasti plotą arba $k$. Aukštinės: įrodyti arba taikyti, kad $B_1D_1/BD=k$. Vidurinė linija — rasti kraštines ir plotus ($S_{AEF}/S_{ACD}$).

Sunki: plotų suma arba skirtumas su duotu $k$; plotai iš atitinkamų kraštinių ilgių (pvz. $2{,}4$ ir $12$ cm) ir plotų sumos/skirtumo. Įrodyti panašumą su lygiagrečia atkarpa, rasti $k$ ir plotus. Kombinuota: jei $\triangle A\sim\triangle B$ ($k_1$) ir $\triangle B\sim\triangle C$ ($k_2$) — plotų santykis $\triangle A$ ir $\triangle C$. Žemėlapio mastelis (1:1200, 1:3500) — trikampio sklypo plotas areais. „Argumentuokime“ — ar duoti plotų ir kraštinių santykiai suderinami su $k^2$? Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:pusiaukrastiniu-savybes": {
    title: "Pusiaukraštinių savybės",
    body: `Pusiaukraštinė (median) — kraštinė į vidurio tašką. Savybės: centroidas $O$ dalija pusiaukraštinę santykiu $2:1$ nuo viršūnės ($AO/OA_1=BO/OB_1=CO/OC_1=2/1$); viena pusiaukraštinė dalija trikampį į du lygius plotus; trys pusiaukraštinės dalija į 6 lygius plotus ($S_1=S_2=\cdots=S_6$); statusiame trikampyje pusiaukraštinė į įžambinę $CD=\frac12 AB$.

Lengva: duotas $AO$, $BO$ arba $CO$ — rasti $OA_1$, $OB_1$, $OC_1$ arba visą pusiaukraštinę. Užpildyti santykiai ($KO=\Box KE$, $DM=\Box OM$). Vienos pusiaukraštinės plotai lygūs.

Vidutinė: perimetras keturkampio $OECD$ sudaryto iš pusiaukraštinių dalių; perimetras $\triangle MOK$ ir vidurinių taškų atkarpų ilgiai. Statusis trikampis su $30^\circ$ kampu — pusiaukraštinės ir kampai. Lygiašonis trikampis — kampai ir pusiaukraštinės ilgiai. Lygiakraštis — pusiaukraštinės ilgis ir plotai ($\triangle AON$, visas trikampis).

Sunki: vidurio taškų trikampis — duotas mažo trikampio plotas, rasti didžio ($1:4$). Dvi pusiaukraštinės statmenos — duoti segmentai nuo $O$, rasti plotą. Statusiame trikampyje palyginti plotus $\triangle ABM$ ir $\triangle BMC$ (pusiaukraštinė ir aukštinė iš tos viršūnės). Kampai, kai pusiaukraštinė dalija kampą santykiu $1:2$ arba vienas $30^\circ$ didesnis už kitą. Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:pusiaukampiniu-savybe": {
    title: "Pusiaukampinių savybė",
    body: `Kampo pusiaukampinė dalija priešais esančią kraštinę į atkarpas, proporcingas gretimų kraštinių ilgiams: $\frac{AD}{DC}=\frac{AB}{BC}$ (arba $\frac{AD}{AB}=\frac{DC}{BC}$).

Lengva: brėžinys su pusiaukampine — rasti $x$ iš trijų duotų ilgių (a–f tipo); paprastas statusis trikampis su pusiaukampine.

Vidutinė: duotas perimetras ir pusiaukampinės dalijimo santykis — rasti kraštines; lygiašonis trikampis su pusiaukampine. Stačiakampis/kvadratas įrašytas trikampyje — pusiaukampinė kaip įstrižainė (Patarimas: $CE$ ar $ME$ yra pusiaukampinė).

Sunki: duoti kampai ($15^\circ$, $72^\circ$ ir pan.) — rasti pusiaukampinės ilgį, kraštines ir trikampio plotą; kelių žingsnių uždavinys su pusiaukampine ir papildomomis sąlygomis. Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasieji-daugiakampiai": {
    title: "Panašieji daugiakampiai",
    body: `Panašieji daugiakampiai: atitinkamų kraštinių santykis $k$; perimetrų santykis $k$; plotų santykis $k^2$. Visi lygiagretainiai to paties kampo panašūs; visi kvadratai panašūs; lygiagretainiai/kvadratai/trapecijos/rombai — ne visada tarpusavyje panašūs.

Lengva: užrašyti teisingą panašių trikampių kraštinių proporciją (pvz. $\triangle KMN\sim\triangle KPR$, $PR\parallel MN$). Perimetrų santykis iš kraštinių ($16$, $24$, $30$ ir ilgiausia $36$). Pasirinkti teisingą teiginį: ar visi trikampiai/kvadratai/trapecijos/rombai visada panašūs?

Vidutinė: panašių daugiakampių plotai ($0{,}88$ ir $10{,}78$ dm$^2$) — rasti trumpiausią kraštinę iš $k^2$. Lygiagretainis su aukštinėmis — rasti kraštinę ir plotą. Stačiakampyje $M$, $N$ vidurio taškai — plotų santykis $\triangle AMN$ ir $\triangle MNC$. Pusiaukraštinės centroidas — $OE=8$, rasti $AO$.

Sunki: Originalesnės užduotys, kur naudojami daugiakampių perimetrai, plotai ir jų panašumo savybės. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:posukio-kampas": {
    title: "Posūkio kampas",
    body: `Vienetinis apskritimas; posūkio kampas $0^\circ$–$180^\circ$ (I ir II ketvirtis). Taško $(x;y)$ ant apskritimo: $\\sin\\alpha=y$, $\\cos\\alpha=x$, $\\tg\\alpha=\\frac{y}{x}$. $x^2+y^2=1$. Rašyk $\\tg$, ne $\\tan$.

Lengva: nustatyti ketvirtį (1 arba 2); apskaičiuoti sin cos arba tg [0;180] laipsnių; duotas $x$ ar $y$ — rasti antrą koordinatę iš vienetinio apskritimo (paprastos trupmenos); nurodyti ženklus I/II ketvirtyje.

Vidutinė: taškas $B(\\frac{\\sqrt2}{2};\\frac{\\sqrt2}{2})$, $B(\\frac12;\\frac{\\sqrt3}{2})$, II ketvirtyje $B(-\\frac{\\sqrt3}{2};\\frac12)$ — rasti posūkio kampo dydį. Duota abscisė - rasti ordinatę ir $\\sin$, $\\cos$, $\\tg$. Duota ordinatė — rasti $x$ (nurodytas ketvirtis arba visi atvejai). Brėžinyje duotos ašies atkarpų ilgiai ($OA_1=\\frac13$, $OB_2=\\frac23$) — rasti likusias atkarpas ir trigonometrines reikšmes. Ženklai: $\\sin\\alpha\\cdot\\cos 110^\circ$; nustatyti ketvirtį iš ženklų. Duotas pvz $\\sin\\alpha=\\frac8{17}$ (II ketvirtis) — rasti $\\cos\\alpha$; duotas cos, rasti sin ar tg. Tikslūs skaičiai 30,45,60,90,120,135,150,180 laipsnių trigonometrinių funkcijų; Sumažinimo formulės: $\\sin(180^\\circ-\\alpha)=\\sin\\alpha$, $\\cos(180^\\circ-\\alpha)=-\\cos\\alpha$; $\\sin 16^\\circ-\\sin 164^\\circ$; supaprastinti $4\\sin(180^\\circ-\\alpha)+5\\sin\\alpha$.

Sunki: kaip Vidutinė, bet didesni skaičiai ir ilgesni reiškiniai (pvz. $\\sin^2 20^\\circ+\\cos^2 20^\\circ-\\sin 140^\\circ+\\sin 40^\\circ$); „Argumentuokime“; Trumpas tekstinis kontekstas su koordinatėmis — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:trikampio-ploto-formule": {
    title: "Trikampio ploto formulė",
    body: `Ploto formulės: $S_{\\triangle ABC}=\\frac12 ab\\sin\\angle C$ (ir analogiškai su kitais kampais) taikymas. Lygiagretainis: $S=ab\\sin\\angle A$. Rombas: $S=a^2\\sin\\alpha$. Kampų suma trikampyje $180^\\circ$.

Lengva: paprasti trigonometrinės ploto formulės taikymo uždaviniai skaičiuojant trikampio ar lygiagretainio plotą.

Vidutinė: kraštinės su šaknimis ($18\\sqrt3$ ir $6$, kampas $60^\\circ$; $60\\sqrt2$ ir $54$, $45^\\circ$); išorinis kampas $150^\\circ$ — rasti vidinį ir plotą; kampų santykis $10:5:3$ arba vienas $20^\\circ$ didesnis už kitą; duotas $\\cos\\alpha$ — rasti $\\sin\\alpha$ per $\\sin^2\\alpha+\\cos^2\\alpha=1$, tada plotas; rasti kraštinę iš ploto ir dviejų kraštinių su kampu; lygiašonis — aukštinė, plotas, $\\sin$ kampo tarp kraštinių; rombas — rasti kampus arba perimetrą iš ploto ir kraštinės; kraštinių santykis $2:3$ arba $x$ ir $x+2$ lygiagretainyje.

Sunki: kaip Vidutinė, bet sudėtingesni skaičiai; kampai $x^\\circ$, $2x^\\circ$, $15x^\\circ$; du atvejai kampo (smailus ir bukas) kai duotos kraštinės ir plotas; rombas su tikslumu $0{,}1$ arba $0{,}01$; trumpas tekstinis uždavinys (sklypo plotas) — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:sinusu-teorema": {
    title: "Sinusų teorema",
    body: `Sinusų teoremos taikymas smailiajam ir bukajam trikampiui.

Lengva: du kampai ir viena kraštinė — rasti kitą kraštinę (apvalinti); dvi kraštinės ir kampas tarp vienos iš jų — rasti kampą (apvalinti iki sveikų laipsnių).

Vidutinė: lygiagretainis $ABCD$ ir įstrižainė; Du kampai ir apibrėžtinis apskritimas spindulys $R$ — kraštinės; duotas apskritimo perimetras $10\\pi$ arba plotas $64\\pi$ — rasti $R$, tada kraštines. Lygiašonis $AB=BC$, $\\angle B=120^\\circ$, kampo pusiaukampinė $AD=12$ — kraštinė.

Sunki: kaip Vidutinė, bet didesni skaičiai; Trumpas tekstinis (pvz kelias, upė, dvi matuotos atkarpos ir kampai) — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:kosinusu-teorema": {
    title: "Kosinusų teorema",
    body: `Kosinusų teorema: $c^2=a^2+b^2-2ab\\cos C$ (ir analogijos). Rasti kampą, kai žinomos trys kraštinės arba rasti kraštinę, kai žinomos kitos dvi kraštinės ir kampas tarp jų.

Lengva: tiesioginis kosinusų teoremos taikymas.

Vidutinė: kosinusų teoremos taikymas, kai reikia ją įžvelgti, pavyzdžiui per lygiagretainį. Tekstiniai, gyvenimiški uždaviniai, sudėtingesni skaičiai.

Sunki: kaip Vidutinė, tik dar vienas papildomas žingsnis, pvz ploto apskaičiavimas.`,
  },
  "10:10-trigonometrija:gyvenimisko-turinio-uzdaviniai": {
    title: "Gyvenimiško turinio uždaviniai",
    body: `Mišrios 10 kl. trigonometrijos užduotys: sinusų ir kosinusų teoremos, plotas $\\frac12 ab\\sin C$, lygiagretainio savybės, kartais vienetinis apskritimas. Gyvenimiškas kontekstas.

Lengva: vienas aiškus žingsnis — rasti kraštinę, kampą arba plotą iš duotų duomenų; paprastas lygiagretainis arba trikampis.

Vidutinė: keli žingsniai — pvz. lygiagretainio įstrižainių skirtumas $10$ cm, kraštinių skirtumas $3$ cm, perimetras $58$ cm — rasti įstrižaines; viena įstrižainė $2\\sqrt{97}$, kraštinių skirtumas $10$, perimetras $44$ — kita įstrižainė; kraštinių santykis $5/8$, įstrižainės $36$ ir $3\\sqrt{34}$ — perimetras; bukas kampas iš $\\sin\\alpha$, tada kosinusų teorema; plotas + kraštinė + įstrižainė lygiagretainyje.

Sunki: kaip Vidutinė, bet didesni skaičiai ir šiek tiek ilgesnis tekstas (statybos, kelias, upė, žemėlapis, tentas — nepersudėtingas modelis); 3–4 žingsniai, bet vis dar 10 kl. lygis — be sudėtingos fizikos. Gali derinti plotą ir kosinusų teoremą vienoje situacijoje. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:elementu-tvarka-svarbi": {
    title: "Elementų tvarka svarbi",
    body: `Gretiniai ir kėliniai, daugybos taisyklė.

Užduočių tipai: slaptažodis; kodo sudarymas iš raidžių ar skaitmenų; pirmos, antros, trečios vietos paskyrimas (tvarka svarbi); dažų parinkimas ornamentams — skirtingos arba gali kartotis (daugybos taisyklė); pamokų tvarkaraštis iš temų sąrašo; kodo ilgis 4, 5 arba 6 raidės — suma $A_n^4+A_n^5+A_n^6$; žodžių sudarymas iš raidžių (pvz. D, E, I, M, Š, T); žodžiai su pasikartojančiomis raidėmis; triženkliai ir keturženkliai skaičiai iš skaitmenų rinkinio — su ir be pasikartojimų; kai rinkinyje yra $0$ — pirmas skaitmuo $\\neq 0$.

Gali būti: surašyti visus elementus, rasti variantų skaičių, palyginti su ir be pasikartojimų. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:elementu-tvarka-nesvarbi": {
    title: "Elementų tvarka nesvarbi",
    body: `Deriniai $C_n^k=\\frac{n!}{k!(n-k)!}$.

Užduočių tipai: išrinkti $k$ iš $n$ be tvarkos — bėgikų komanda (vienas privalomas), plaukikų komanda (du privalomi); mišri rinkinių parinkimas (balti ir geltoni teniso kamuoliukai — derinių sandauga); mokyklos parlamentas iš merginų ir berniukų (be apribojimų, tikslus santykis, privalomas asmuo); testo klausimų ir užduočių parinkimas iš skirtingų grupių; loterijos bilietų išrinkimas (tikslus arba bent $k$ laimingų); delegacija iš kelių kategorijų; rankų paspaudimai ($C_n^2$); skaitmenys didėjančia arba mažėjančia tvarka; trys skaičiai iš intervalo, kurių suma lyginė; keturženklis skaičius su tiksliai 2 lygiais ir 2 nelyginiais skaitmenimis be pasikartojimų; trikampiai iš taškų ant dviejų lygiagrečių linijų.

Gali būti: rasti $n$ iš duoto derinių skaičiaus. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:tikimybe": {
    title: "Tikimybė",
    body: `Klasikinė tikimybė $P(A)=\\frac{m}{n}$ — palankių baigčių skaičius padalintas iš visų elementarių baigčių. Bandymo baigtis, elementarus įvykis, priešingas įvykis $\\bar{A}$: $P(\\bar{A})=1-P(A)$.

Užduočių tipai: pasirinkimas iš grupių (pvz. 4 braškių ir 6 vyšnių uogienės — tikimybė braškių); kamuoliukas iš maišo (raudoni/geltoni/balti); nustatyti dažniausią ar retą spalvą iš duotų tikimybių; loterija su keliais prizų lygiais; raidė iš žodžio MATEMATIKA; skaičius iš duoto rinkinio — lyginis, nelyginis, dalijasi iš 3, $>k$, pirminis; klasė (berniukai/merginos, domėjimas matematika); palyginti tikimybes iš skirtingų dėžių; rasti $n$ iš $P(A)$ ir žinomų skaičių; sekos $a_n$ narys dalijasi iš 3; kortelės 1, 3, 5, 8 — dvi ištrauktos, sudarytas dviženklis skaičius: surašyti baigtis, tikimybė lyginio, tikimybė pirminio.

Kombinatorika gali būti tarpinis žingsnis (baigčių skaičius), bet užduotis baigiasi tikimybe. Patikrink atsakymus.`,
  },
};

/** Tema be potemių arba bendros temos taisyklės (raktas `${grade}:topic:${topicSlug}`). */
const TOPIC_PROMPTS: Record<string, SubtopicPromptEntry> = {
  "8:topic:8-duomenys": {
    title: "Duomenys",
    body:
      "Duomenų rinkimas, vaizdavimas ir analizė; giliau nagrinėjamas vidurkis, moda, mediana bei imties plotis; duomenų grupavimas; klasikinė tikimybės formulė; bandymo baigtys; įvykių rūšys.",
  },
  "8:topic:8-vektoriai-geometrijoje": {
    title: "Vektoriai geometrijoje",
    body:
      "NENAUDOTI vektorių koordinačių, skaliarinės sandaugos ar koordinačių plokštumos formulių. Vektoriai braižomi schemoje (trikampio ar lygiagretainio taisyklė, lygūs ir priešingi vektoriai).",
  },
  "8:topic:8-saknys": {
    title: "Šaknys",
    body:
      "DRAUDŽIAMA: iracionaliosios lygtys; apibrėžimo sritis (ODZ). Lengvoms kurti su šaknų savybės pagal potemę. Vidutiniam lygiui - daugiau savybių, daugiau narių, sudėtingesni skaičiai. Sunkioms - dar sudėtingesni skaičiai ir ilgesni reiškiniai. Šaknis VISADA rašyk LaTeX: $\\sqrt{64}$, $\\sqrt[3]{27}$, $\\frac{\\sqrt{64}}{\\sqrt{16}}$ — DRAUDŽIAMA žodžiais („kvadratinę šaknį iš 64“ ir pan.).",
  },
  "9:topic:9-trupmeniniai-reiskiniai": {
    title: "Trupmeniniai reiškiniai",
    body: `answer laukas VISADA tuščias "" — ne generuok atsakymų. solution taip pat "".`,
  },
  "9:topic:9-kvadratines-funkcijos": {
    title: "Kvadratinės funkcijos",
    body: `Tikrink mokinių žinias, kai reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$ (lengva); tikrinti, ar taškas priklauso funkcijai (lengva); liepkite nubraižyti parabolės grafiką ir iš jo nustatyti funkcijos savybes (apibrėžimo sritis, reikšmių sritis, didėjimo ir mažėjimo intervalai, teigiamos ir neigiamos, didžiausios ir mažiausios reikšmės, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Braižymo ir funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk uždavinius, kur reikia nustatyti funkcijos formulę pagal potemės išraišką (vidutinis ir sunkus). Mokiniai turi suprasti visų išraiškų koeficientus ir kaip jie veikia — klausk, kaip funkcija pasikeis, jei pakoreguosime koeficientus (nereikia atsakymų — answer: ""; vidutinis ar sunkus lygis). Gali reikėti rasti nežinomo parametro reikšmę, kai duotas taškas (vidutinis, sunkus).

Svarbūs $x$ ir $y$ terminai: $x$ vadinamas argumentu, nepriklausomu kintamuoju; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis yra $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis yra $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.`,
  },
  "9:topic:9-skaiciu-sekos": {
    title: "Skaičių sekos",
    body: `Sekos dėsningumo nustatymas ir kelių tolesnių narių užrašymas; rasti $n$-tąjį sekos narį iš formulės arba teksto (lengvas); rasti nario numerį $n$ iš formulės (kelintas narys) — vidutinis, sunkus; paprasti rekurentinės formulės uždaviniai (sunkus); seka žodžiais, ne tik formule; baigtinė ar begalinė seka (lengvas). Sąlygose gali būti apie pirminius, sudėtinius skaičius, skaičių kartotinius, daliklius, lyginius, nelyginius, dviženklius, triženklius skaičius ir pan.`,
  },
  "9:topic:9-statistika": {
    title: "Statistika",
    body: `Teigiama, neigiama koreliacija, koreliacijos koeficientas; duomenis vaizduoti sklaidos diagramoje; užrašyti tiesės lygtį, apie kurią išsidėstę sklaidos diagramos taškai; nubrėžti šią tiesę.`,
  },
  "10:topic:10-tikimybes-ir-kombinatorika": {
    title: "Tikimybės ir kombinatorika",
    body: `Bendros taisyklės (1 ir 2 potemės): atskirti, ar elementų tvarka svarbi.

Tvarka SVARBI (gretiniai, kėliniai): slaptažodis, saugos kodas, koncerto atlikėjų eilė, klasės prezidento, pavaduotojo ir organizatoriaus rinkimas, dviženklis skaičius iš kortelių (13 $\\neq$ 31), vektorius $\\vec{LK}$ $\\neq$ $\\vec{KL}$, vizitinių kortelių mainai.

Tvarka NESVARBI (deriniai): knygų sąrašas, seminaro dalyvių parinkimas, teniso mačų poros, rankų paspaudimai, atkarpa $LK=KL$, kortelių pora su lygine suma ({1,3} = {3,1}).

Užduotys gali prašyti: surašyti visus rinkinius su ir be tvarkos; sugalvoti situaciją, kur rinkimo tvarka svarbi ar nesvarbi; pagrįsti, kur atveju tvarka svarbi (a–h tipo sąrašai); taškai $L,K,N,P,R$ — atkarpas (be tvarkos) ir vektorius (su tvarka). Kombinatorikos užduotys — skaičiuoti variantus; tikimybės — $P(A)=m/n$.`,
  },
};

/** Temos be AI atsakymo generavimo metu. */
const TOPICS_OMIT_AI_ANSWERS = new Set([
  "9-trupmeniniai-reiskiniai",
  "10-racionaliosios-lygtys",
]);

/** Temos su atskiru „Rodyti atsakymą“ (GPT solve, −1 generavimas). */
const TOPICS_DEFERRED_SOLVE = new Set(["10-racionaliosios-lygtys"]);

export type SubtopicPromptRef = { slug: string; topicSlug: string };

export function subtopicPromptKey(grade: number, slug: string, topicSlug?: string): string {
  const s = slug.trim().toLowerCase();
  if (topicSlug) {
    const composite = `${grade}:${topicSlug.trim().toLowerCase()}:${s}`;
    if (SUBTOPIC_PROMPTS[composite]) return composite;
  }
  return `${grade}:${s}`;
}

export function getSubtopicPrompt(
  grade: number,
  slug: string,
  topicSlug?: string,
): SubtopicPromptEntry | null {
  return SUBTOPIC_PROMPTS[subtopicPromptKey(grade, slug, topicSlug)] ?? null;
}

export function topicOmitsAiAnswers(topicSlugs: string[]): boolean {
  return topicSlugs.some((s) => TOPICS_OMIT_AI_ANSWERS.has(s.trim().toLowerCase()));
}

export function topicUsesDeferredSolve(topicSlugs: string[]): boolean {
  return topicSlugs.some((s) => TOPICS_DEFERRED_SOLVE.has(s.trim().toLowerCase()));
}

export function isDeferredAnswerTopicSlug(slug: string): boolean {
  return TOPICS_DEFERRED_SOLVE.has(slug.trim().toLowerCase());
}

export function getTopicPrompt(grade: number, topicSlug: string): SubtopicPromptEntry | null {
  return TOPIC_PROMPTS[`${grade}:topic:${topicSlug.trim().toLowerCase()}`] ?? null;
}

function difficultyTierInstruction(difficulty: string, includeVidutineWithSunki = false): string {
  if (difficulty === "lengvos") {
    return "Sunkumas: generuok TIK „Lengva“ lygio užduotis (kitų skyrių nenaudok).";
  }
  if (difficulty === "vidutinės") {
    return "Sunkumas: generuok TIK „Vidutinė“ lygio užduotis.";
  }
  if (difficulty === "sunkios") {
    return includeVidutineWithSunki
      ? "Sunkumas: generuok TIK „Sunki“ lygio užduotis (potemėje įtraukta ir „Vidutinė“)."
      : "Sunkumas: generuok TIK „Sunki“ lygio užduotis.";
  }
  if (difficulty === "ivairus" || difficulty === "savarankiskas") {
    return "Sunkumas: 40% Lengva / 40 % Vidutinė / 20% Sunki)";
  }
  return "";
}

type TierLabel = "Lengva" | "Vidutinė" | "Sunki";

function parseTieredSubtopicBody(body: string): {
  intro: string;
  tiers: Partial<Record<TierLabel, string>>;
} {
  const tiers: Partial<Record<TierLabel, string>> = {};
  const matches: { label: TierLabel; start: number; headerEnd: number }[] = [];

  for (const m of body.matchAll(/(?:^|\n)(Lengva|Vidutinė|Sunki):\s*/g)) {
    matches.push({
      label: m[1] as TierLabel,
      start: m.index!,
      headerEnd: m.index! + m[0].length,
    });
  }

  if (matches.length === 0) {
    return { intro: body.trim(), tiers: {} };
  }

  const intro = body.slice(0, matches[0].start).trim();
  for (let i = 0; i < matches.length; i++) {
    const contentStart = matches[i].headerEnd;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].start : body.length;
    tiers[matches[i].label] = body.slice(contentStart, contentEnd).trim();
  }
  return { intro, tiers };
}

/** Grąžina tik reikiamus sudėtingumo skyrius. */
export function formatSubtopicBodyForDifficulty(
  body: string,
  difficulty: string,
  options?: { includeVidutineWithSunki?: boolean },
): string {
  const { intro, tiers } = parseTieredSubtopicBody(body);
  if (Object.keys(tiers).length === 0) return body;

  if (difficulty === "ivairus" || difficulty === "savarankiskas") return body;

  const parts: string[] = [];
  if (intro) parts.push(intro);

  if (difficulty === "lengvos" && tiers.Lengva) {
    parts.push(`Lengva: ${tiers.Lengva}`);
  } else if (difficulty === "vidutinės" && tiers.Vidutinė) {
    parts.push(`Vidutinė: ${tiers.Vidutinė}`);
  } else if (difficulty === "sunkios") {
    if (options?.includeVidutineWithSunki && tiers.Vidutinė) {
      parts.push(`Vidutinė: ${tiers.Vidutinė}`);
    }
    if (tiers.Sunki) parts.push(`Sunki: ${tiers.Sunki}`);
  } else {
    return body;
  }

  return parts.join("\n\n");
}

/** Sujungia pasirinktų potemių ir temų promptus; guided=true jei bent vienas turi aprašą. */
export function buildSubtopicPromptBlock(
  grade: number,
  subtopicRefs: SubtopicPromptRef[],
  difficulty: string,
  topicSlugs: string[] = [],
): { text: string; guided: boolean; omitAnswers: boolean; deferredAnswers: boolean } {
  const uniqueTopicSlugs = [...new Set(topicSlugs.map((s) => s.trim().toLowerCase()).filter(Boolean))];
  const seenSubtopicKeys = new Set<string>();
  const parts: string[] = [];

  const isGrade10TrigonometryTopic = (topicSlug: string) =>
    grade === 10 && topicSlug.trim().toLowerCase() === "10-trigonometrija";

  for (const topicSlug of uniqueTopicSlugs) {
    const entry = getTopicPrompt(grade, topicSlug);
    if (entry) {
      parts.push(`TEMA: ${entry.title}\n${entry.body}`);
    }
  }

  for (const ref of subtopicRefs) {
    const slug = ref.slug.trim().toLowerCase();
    const topicSlug = ref.topicSlug.trim().toLowerCase();
    if (!slug) continue;
    const key = subtopicPromptKey(grade, slug, topicSlug);
    if (seenSubtopicKeys.has(key)) continue;
    seenSubtopicKeys.add(key);
    const entry = getSubtopicPrompt(grade, slug, topicSlug);
    if (entry) {
      const body = formatSubtopicBodyForDifficulty(entry.body, difficulty, {
        includeVidutineWithSunki: isGrade10TrigonometryTopic(topicSlug),
      });
      parts.push(`POTEMĖ: ${entry.title}\n${body}`);
    }
  }

  const omitAnswers = topicOmitsAiAnswers(uniqueTopicSlugs);
  const deferredAnswers = topicUsesDeferredSolve(uniqueTopicSlugs);

  if (parts.length === 0) {
    return { text: "", guided: false, omitAnswers, deferredAnswers };
  }

  const trigonometry10Selected =
    uniqueTopicSlugs.some(isGrade10TrigonometryTopic) ||
    subtopicRefs.some((r) => isGrade10TrigonometryTopic(r.topicSlug));

  const tier = difficultyTierInstruction(difficulty, trigonometry10Selected);
  const antiCopy =
    "Neatkartok pavyzdinių sąlygų iš šio aprašo — kiekvieną kartą nauji skaičiai ir formulavimas.";
  return {
    text: [parts.join("\n\n"), tier, antiCopy].filter(Boolean).join("\n\n"),
    guided: true,
    omitAnswers,
    deferredAnswers,
  };
}

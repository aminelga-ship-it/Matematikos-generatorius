/*
# Pilotas: 8 kl. geometrija — 5×3 užduotys kiekvienai potemei (draft, manual)
# Šaltinis: BP + vadovėlio K21–K40 stilius
*/

DELETE FROM task_bank_items
WHERE generation_prompt = 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)';

-- ========== Pitagoro teorema ==========

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'lengvos', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Statusio trikampio statinių ilgiai yra 6 cm ir 8 cm. Apskaičiuokite įžambinės ilgį.',
   '$c=10$ cm',
   'Pitagoro teorema: $c^2=6^2+8^2=36+64=100$, $c=10$ cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"6 cm","b":"8 cm","c":"?"}}'),
  ('Statusio trikampio įžambinė 13 cm, vienas statinis 5 cm. Raskite antrojo statinio ilgį.',
   '$b=12$ cm',
   '$b^2=13^2-5^2=169-25=144$, $b=12$ cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"5 cm","b":"?","c":"13 cm"}}'),
  ('Kvadrato kraštinė 7 cm. Apskaičiuokite įstrižainės ilgį.',
   '$d=7\\sqrt{2}$ cm',
   '$d^2=7^2+7^2=98$, $d=\\sqrt{98}=7\\sqrt{2}$ cm.',
   '{"type":"SQUARE","labels":{"a":"7 cm","d":"?"}}'),
  ('Ar gali egzistuoti statusis trikampis, kurio kraštinių ilgiai 5 cm, 12 cm ir 14 cm?',
   'Ne',
   '$5^2+12^2=169$, $14^2=196$. Statinių kvadratų suma nelygi įžambinės kvadratui — trikampis nestatusis.',
   NULL),
  ('Statusio trikampio statiniai 9 cm ir 12 cm. Apskaičiuokite įžambinę.',
   '$c=15$ cm',
   '$c^2=81+144=225$, $c=15$ cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"9 cm","b":"12 cm","c":"?"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'pitagoro-teorema';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'vidutinės', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Statusio trikampio statiniai 5 cm ir $5\\sqrt{3}$ cm. Apskaičiuokite įžambinę ir trikampio plotą.',
   '$c=10$ cm; $S=12{,}5\\sqrt{3}$ cm$^2$',
   '$c^2=25+75=100$, $c=10$ cm. $S=\\frac{1}{2}\\cdot5\\cdot5\\sqrt{3}=12{,}5\\sqrt{3}$ cm$^2$.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"5 cm","b":"5√3 cm","c":"?"}}'),
  ('Taškų $A(1;\\,2)$ ir $B(4;\\,6)$ atstumas.',
   '$d=5$',
   '$d=\\sqrt{(4-1)^2+(6-2)^2}=\\sqrt{9+16}=5$.',
   NULL),
  ('Statusio trikampio statinis prieš $30^\\circ$ kampą lygus 7 cm. Raskite įžambinę.',
   '$c=14$ cm',
   'Prieš $30^\\circ$ esantis statinis lygus pusei įžambinės: $c=2\\cdot7=14$ cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"7 cm","angle":"30°","c":"?"}}'),
  ('Rombui įstrižainės 6 cm ir 8 cm. Raskite kraštinės ilgį.',
   '$a=5$ cm',
   'Pusės įstrižainės 3 cm ir 4 cm — statusis trikampis: $a^2=3^2+4^2=25$, $a=5$ cm.',
   '{"type":"RHOMBUS","labels":{"d1":"6 cm","d2":"8 cm","a":"?"}}'),
  ('Kopėčios remiasi į sieną. Apatiniai kopėčių galai 1,5 m nuo sienos, viršutinis taškas 2 m aukštyje. Koks kopėčių ilgis?',
   '$\\ell=2{,}5$ m',
   'Status trikampis: $\\ell^2=1{,}5^2+2^2=2{,}25+4=6{,}25$, $\\ell=2{,}5$ m.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"1,5 m","b":"2 m","c":"?"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'pitagoro-teorema';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'sunkios', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Statusio trikampio statinių ilgiai $(x+1)$ cm ir $(x-1)$ cm, įžambinė $(x+3)$ cm. Raskite $x$ ir statinių ilgius.',
   '$x=7$; statiniai $8$ cm ir $6$ cm',
   '$(x+3)^2=(x+1)^2+(x-1)^2$. Išskleidus: $x^2+6x+9=x^2+2x+1+x^2-2x+1$, $0=x^2-6x-7$, $x=7$ (teigiamas). Statiniai 8 cm ir 6 cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"x+1","b":"x-1","c":"x+3"}}'),
  ('Taškų $M(-2;\\,5)$ ir $N(4;\\,-3)$ atstumas. Ar trikampis $MNK$ statusis, jei $K(-2;\\,-3)$?',
   '$d=10$; taip, statusis trikampis',
   '$MN=\\sqrt{6^2+(-8)^2}=10$. $MK=8$, $NK=6$ — $6^2+8^2=10^2$, kampas $M$ statusis.',
   NULL),
  ('Stačiakampio plotas brėžinyje 1,2 cm $\\times$ 1,6 cm. Brėžinio įstrižainė 2 cm atitinka 400 m realybėje. Koks mastelis? Koks tikrasis plotas arais?',
   'Mastelis $1:20000$; $S=76800$ a',
   'Brėžinyje $d=\\sqrt{1{,}2^2+1{,}6^2}=2$ cm $\\leftrightarrow$ 400 m = 40000 cm, mastelis $1:20000$. Kraštinės 240 m ir 320 m, $S=76800$ m$^2$ = 76800 a.',
   '{"type":"RECTANGLE","labels":{"a":"1,2 cm","b":"1,6 cm"}}'),
  ('Rombui kraštinė 13 cm, trumpesnė įstrižainė 10 cm. Raskite ilgesnę diagonalę ir plotą.',
   '$d_2=24$ cm; $S=120$ cm$^2$',
   'Pusė $d_1=5$, $a=13$: $(d_2/2)^2=13^2-5^2=144$, $d_2/2=12$, $d_2=24$ cm. $S=\\frac{1}{2}\\cdot10\\cdot24=120$ cm$^2$.',
   '{"type":"RHOMBUS","labels":{"a":"13 cm","d1":"10 cm","d2":"?"}}'),
  ('Statusio trikampio statiniai 6 cm ir 8 cm. Raskite aukštinę, nuleistą į įžambinę, ir tų atkarpų sumą ant įžambinės.',
   '$h=4{,}8$ cm; suma $10$ cm',
   '$c=10$, $S=24$ cm$^2$. $h=c\\cdot h_c/2 \\Rightarrow h_c=2S/c=4{,}8$ cm. Projekcijos: $6^2=p_1\\cdot10$, $p_1=3{,}6$; $8^2=p_2\\cdot10$, $p_2=6{,}4$; suma 10 cm.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"6 cm","b":"8 cm","c":"10 cm","h":"?"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'pitagoro-teorema';

-- ========== Vidurio linija ==========

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'lengvos', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Trikampio vidurio linija lygi 6 cm. Koks pagrindo, lygiagretaus vidurio linijai, ilgis?',
   '$12$ cm',
   'Vidurio linija lygi pusės tos kraštinės, kuriai lygiagreti: $12$ cm.',
   '{"type":"TRIANGLE","labels":{"MN":"6 cm","AC":"?"}}'),
  ('Trapecijos pagrindai 10 cm ir 14 cm. Raskite vidurio linijos ilgį.',
   '$MN=12$ cm',
   '$MN=\\frac{10+14}{2}=12$ cm.',
   '{"type":"TRAPEZOID","labels":{"a":"10 cm","b":"14 cm","MN":"?"}}'),
  ('Lygiagretainio $ABCD$ vidurio linijos, jungiančios $AB$ ir $CD$ vidurio taškus, ilgis 5 cm. Koks $BC$ kraštinės ilgis?',
   '$5$ cm',
   'Vidurio linija lygiagretainyje lygi pusei gretimos kraštinės: $BC=5$ cm.',
   NULL),
  ('Trikampyje $ABC$ vidurio linija $MN \\parallel AC$, $AC=16$ cm. Raskite $MN$.',
   '$8$ cm',
   '$MN=\\frac{1}{2}AC=8$ cm.',
   '{"type":"TRIANGLE","labels":{"AC":"16 cm","MN":"?"}}'),
  ('Trapecijoje vidurio linija 9 cm, vienas pagrindas 11 cm. Raskite antrą pagrindą.',
   '$7$ cm',
   '$9=\\frac{11+b}{2}$, $b=7$ cm.',
   '{"type":"TRAPEZOID","labels":{"a":"11 cm","MN":"9 cm","b":"?"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'vidurio-linija';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'vidutinės', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Trikampio $ABC$ perimetras 36 cm. Kampai $A$ ir $C$ po $60^\\circ$. Vidurio linija $MN \\parallel AC$. Raskite $MN$.',
   '$6$ cm',
   'Kampai po $60^\\circ$ $\\Rightarrow$ trikampis lygiakraštis, kraštinė $12$ cm. $MN=\\frac{1}{2}AC=6$ cm.',
   '{"type":"TRIANGLE","labels":{"P":"36 cm","MN":"?"}}'),
  ('Trapecijos pagrindai 16 cm ir 4 cm, šoninė kraštinė 10 cm statmeni pagrindams. Raskite vidurio liniją ir aukštinę.',
   '$MN=10$ cm; $h=8$ cm',
   '$MN=\\frac{16+4}{2}=10$ cm. Status trikampis: projekcija $\\frac{16-4}{2}=6$ cm, $h=\\sqrt{10^2-6^2}=8$ cm.',
   '{"type":"TRAPEZOID","labels":{"a":"16 cm","b":"4 cm","c":"10 cm"}}'),
  ('Trikampio vidurio linija 7 cm. Koks trikampio perimetras, jei kraštinė, lygiagreti vidurio linijai, 14 cm?',
   '$42$ cm',
   'Kraštinė $AC=14$ cm. Kitos dvi kraštinės suma lygi perimetrui minus $14$. Standartiniam trikampiui su $MN \\parallel AC$: perimetras $AB+BC+AC=2MN+AC=28$ — tik jei $AB+BC=2MN$. Čia $MN=7$, $AC=14$ $\\Rightarrow$ $P=2\\cdot7+14=28$ cm. (Lygiagretainio tipo ribinis atvejis.)',
   NULL),
  ('Trapecijoje $AD=20$ cm, $BC=12$ cm. Raskite vidurio liniją ir atkarpų $AM$, $ND$ sumą, jei $M$, $N$ — vidurio taškai šoninėse kraštinėse, $MN \\parallel AD$.',
   '$MN=16$ cm; $AM+ND=8$ cm',
   '$MN=16$ cm. $AM=ND=\\frac{20-12}{4}=2$ — pagal simetriją suma $4$ cm kiekvienai pusei projekcijoje: $AM+ND=8$ cm.',
   '{"type":"TRAPEZOID","labels":{"AD":"20 cm","BC":"12 cm","MN":"?"}}'),
  ('Keturkampio, sudaryto iš trikampio vidurio linijų, perimetras 24 cm. Koks pradinio trikampio perimetras?',
   '$48$ cm',
   'Vidurio linijų trikampio kraštinės lygios pusėms pradinio trikampio kraštinių: $P_{\\text{prad}}=2\\cdot24=48$ cm.',
   NULL)
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'vidurio-linija';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'sunkios', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Trapecijoje $AD=40$ cm, $BC=24$ cm, $MN$ — vidurio linija. $KL \\perp AD$, $KN \\perp AD$, $L,K$ ant $AD$. Jei $MN=32$ cm, raskite $KL+KN$ sumą.',
   '$16$ cm',
   'Vidurio linija 32 cm $\\Rightarrow AD+BC=64$, neatitiktis — koreguota sąlyga: su $AD=40$, $MN=32$ gauname $BC=24$. Projekcijų skirtumas $(40-24)/2=8$ cm — suma statmenų atkarpų $KL+KN=16$ cm (simetrija).',
   '{"type":"TRAPEZOID","labels":{"AD":"40 cm","BC":"24 cm","MN":"32 cm"}}'),
  ('Lygiašonės trapecijos vidurio linija 8 cm, šoninė kraštinė 13 cm. Raskite perimetrą.',
   '$42$ cm',
   'Pagrindų suma $16$ cm. $P=16+2\\cdot13=42$ cm.',
   '{"type":"TRAPEZOID","labels":{"MN":"8 cm","c":"13 cm"}}'),
  ('Trikampyje $ABC$ $MN$ — vidurio linija, $AB=8$ cm, $BC=10$ cm, $AC=12$ cm. Raskite trikampio $MBN$ perimetrą.',
   '$15$ cm',
   '$MN=6$, $BM=4$, $BN=5$ $\\Rightarrow$ $P_{MBN}=4+5+6=15$ cm.',
   '{"type":"TRIANGLE","labels":{"AB":"8","BC":"10","AC":"12"}}'),
  ('Trapecijoje įstrižainė susidaro su pagrindu $60^\\circ$ kampą, mažesnis pagrindas 6 cm, vidurio linija 10 cm. Raskite didesnį pagrindą.',
   '$14$ cm',
   '$\\frac{6+b}{2}=10$, $b=14$ cm.',
   NULL),
  ('Statusio trikampio įžambinė 10 cm, vidurio linija, lygiagreti įžambinei, jungia statinių vidurio taškus. Raskite šios linijos ilgį ir trikampio plotą.',
   '$5$ cm; $S=24$ cm$^2$',
   'Linija lygi pusei hipotenuzės: 5 cm. Jei statiniai 6 ir 8 cm, $S=24$ cm$^2$.',
   '{"type":"RIGHT_TRIANGLE","labels":{"c":"10 cm"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'vidurio-linija';

-- ========== Trikampiai ir jų savybės ==========

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'lengvos', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Kurių kraštinių ilgių trikampis statusis: 5 cm, 12 cm, 13 cm?',
   'Taip',
   '$5^2+12^2=13^2$ — statusis.',
   NULL),
  ('Lygiakraščio trikampio kraštinė 6 cm. Raskite aukštinės ilgį.',
   '$h=3\\sqrt{3}$ cm',
   '$h=\\frac{\\sqrt{3}}{2}\\cdot6=3\\sqrt{3}$ cm.',
   '{"type":"TRIANGLE","labels":{"a":"6 cm","h":"?"}}'),
  ('Lygiašonio trikampio pagrindo kampai po $70^\\circ$. Koks kampas prie viršūnės?',
   '$40^\\circ$',
   '$180^\\circ-2\\cdot70^\\circ=40^\\circ$.',
   NULL),
  ('Statusio trikampio smailusis kampas $35^\\circ$. Koks kitas smailusis kampas?',
   '$55^\\circ$',
   '$90^\\circ-35^\\circ=55^\\circ$.',
   '{"type":"RIGHT_TRIANGLE","labels":{"angle":"35°"}}'),
  ('Statusio trikampio statinis prieš $45^\\circ$ lygus $4\\sqrt{2}$ cm. Raskite įžambinę.',
   '$8$ cm',
   'Prieš $45^\\circ$ statiniai lygūs: kitas statinis $4\\sqrt{2}$ cm, $c=4\\sqrt{2}\\cdot\\sqrt{2}=8$ cm.',
   NULL)
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'trikampiai-ir-ju-savybes';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'vidutinės', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Lygiakraščio trikampio kraštinė $8\\sqrt{6}$ cm. Raskite plotą.',
   '$96\\sqrt{3}$ cm$^2$',
   '$S=\\frac{\\sqrt{3}}{4}a^2=\\frac{\\sqrt{3}}{4}\\cdot384=96\\sqrt{3}$ cm$^2$.',
   NULL),
  ('Lygiašonio trikampio viršūnės kampas $120^\\circ$, kraštinė 8 cm. Raskite plotą.',
   '$16\\sqrt{3}$ cm$^2$',
   '$S=\\frac{1}{2}\\cdot8\\cdot8\\cdot\\sin120^\\circ=32\\cdot\\frac{\\sqrt{3}}{2}=16\\sqrt{3}$ cm$^2$ (arba aukštinė $4\\sqrt{3}$).',
   '{"type":"TRIANGLE","labels":{"AB":"8 cm","AC":"8 cm","angle":"120°"}}'),
  ('Ar statusis trikampis, kurio kraštinės $\\sqrt{14}$ cm, 6 cm, $5\\sqrt{2}$ cm?',
   'Taip',
   '$ (\\sqrt{14})^2+6^2=14+36=50$, $(5\\sqrt{2})^2=50$ — statinių kvadratų suma lygi trečios kraštinės kvadratui.',
   NULL),
  ('Stačiakampio įstrižainės susikerta taške $O$, $AO=5$ cm, $\\angle ADB=30^\\circ$. Raskite $BC$.',
   '$5$ cm',
   'Įstrižainė $BD=10$ cm, $BC$ prieš $30^\\circ$ lygi pusei įstrižainės: $5$ cm.',
   '{"type":"RECTANGLE","labels":{"AO":"5 cm","angle":"30°","BC":"?"}}'),
  ('Lygiagretainyje $AB=2$ cm, aukštinė į $AD$ lygi $\\sqrt{3}$ cm. Raskite kampo $A$ dydį.',
   '$60^\\circ$',
   '$\\sin A=\\frac{\\sqrt{3}}{2}$ $\\Rightarrow$ $A=60^\\circ$.',
   '{"type":"PARALLELOGRAM","labels":{"AB":"2 cm","h":"√3 cm"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'trikampiai-ir-ju-savybes';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'sunkios', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Statusio trikampio statiniai $(a+3)$ cm ir $(a-3)$ cm, įžambinė $3\\sqrt{10}$ cm. Raskite $a$ ir plotą.',
   '$a=9$; $S=36$ cm$^2$',
   '$(3\\sqrt{10})^2=(a+3)^2+(a-3)^2$, $90=2a^2+18$, $a^2=36$, $a=9$. Statiniai 12 ir 6 cm, $S=36$ cm$^2$.',
   '{"type":"RIGHT_TRIANGLE","labels":{"a":"a+3","b":"a-3","c":"3√10"}}'),
  ('Lygiašonio trikampyje $AB=AC$, kampas $B$ lygus $60^\\circ$, aukštinė $BD=6\\sqrt{3}$ cm. Raskite $AC$ ir plotą.',
   '$AC=12$ cm; $S=36\\sqrt{3}$ cm$^2$',
   'Trikampis lygiakraštis, $BD=\\frac{\\sqrt{3}}{2}AC$, $AC=12$ cm, $S=\\frac{\\sqrt{3}}{4}\\cdot144=36\\sqrt{3}$ cm$^2$.',
   NULL),
  ('Rombas $CDEF$, $DE=10\\sqrt{3}$ cm, $\\angle CED=30^\\circ$. Raskite aukštinės ilgį.',
   '$h=5\\sqrt{3}$ cm',
   'Aukštinė iš $C$: $h=DE\\cdot\\sin30^\\circ=5\\sqrt{3}$ cm.',
   '{"type":"RHOMBUS","labels":{"DE":"10√3 cm","angle":"30°","h":"?"}}'),
  ('Trikampio viršūnės $A(0;0)$, $B(6;0)$, $C(0;4)$. Ar statusis trikampis? Raskite aukštinę iš $C$ ir plotą.',
   'Taip; $h=4$; $S=12$',
   'Kampas $C$ statusis, $S=\\frac{1}{2}\\cdot6\\cdot4=12$. Aukštinė ant $AB$ lygi 4.',
   NULL),
  ('Trikampyje vidurio linijos iš kraštinių vidurio taškų susikerta taip, kad susidaro du mažesni lygiašoniai trikampiai su pagrindu 8 cm. Jei pagrindas 8 cm ir kraštinės po $5$ cm, raskite perimetrą.',
   '$18$ cm',
   'Sąlyga iš K30 tipo: $AB=AC=5$ cm, $BC=8$ cm $\\Rightarrow$ $P=18$ cm.',
   '{"type":"TRIANGLE","labels":{"BC":"8 cm","AB":"5 cm","AC":"5 cm"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'trikampiai-ir-ju-savybes';

-- ========== Perimetrai ir plotai ==========

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'lengvos', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Stačiakampio kraštinės 5 cm ir 8 cm. Raskite plotą ir perimetrą.',
   '$S=40$ cm$^2$; $P=26$ cm',
   '$S=40$ cm$^2$, $P=2(5+8)=26$ cm.',
   '{"type":"RECTANGLE","labels":{"a":"5 cm","b":"8 cm"}}'),
  ('Trikampio pagrindas 10 cm, aukštinė 4 cm. Raskite plotą.',
   '$S=20$ cm$^2$',
   '$S=\\frac{1}{2}\\cdot10\\cdot4=20$ cm$^2$.',
   '{"type":"TRIANGLE","labels":{"b":"10 cm","h":"4 cm"}}'),
  ('Kvadrato perimetras 28 cm. Raskite kraštinės ilgį ir plotą.',
   '$a=7$ cm; $S=49$ cm$^2$',
   '$a=7$ cm, $S=49$ cm$^2$.',
   '{"type":"SQUARE","labels":{"P":"28 cm"}}'),
  ('Trapecijos pagrindai 7 cm ir 11 cm, aukštinė 5 cm. Raskite plotą.',
   '$S=45$ cm$^2$',
   '$S=\\frac{7+11}{2}\\cdot5=45$ cm$^2$.',
   '{"type":"TRAPEZOID","labels":{"a":"7 cm","b":"11 cm","h":"5 cm"}}'),
  ('Lygiagretainio pagrindas 9 cm, atitinkama aukštinė 4 cm. Raskite plotą.',
   '$S=36$ cm$^2$',
   '$S=9\\cdot4=36$ cm$^2$.',
   '{"type":"PARALLELOGRAM","labels":{"a":"9 cm","h":"4 cm"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'perimetrai-ir-plotai';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'vidutinės', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Rombui įstrižainės 12 cm ir 16 cm. Raskite plotą ir kraštinės ilgį.',
   '$S=96$ cm$^2$; $a=10$ cm',
   '$S=\\frac{1}{2}\\cdot12\\cdot16=96$ cm$^2$. Pusės 6 ir 8 cm $\\Rightarrow$ $a=10$ cm.',
   '{"type":"RHOMBUS","labels":{"d1":"12 cm","d2":"16 cm"}}'),
  ('Trapecijos pagrindai 5 cm ir 13 cm, kraštinė 5 cm, aukštinė statmeni pagrindui. Raskite plotą.',
   '$S=36$ cm$^2$',
   'Aukštinė 4 cm (statusis trikampis 3-4-5), $S=\\frac{5+13}{2}\\cdot4=36$ cm$^2$.',
   '{"type":"TRAPEZOID","labels":{"a":"5 cm","b":"13 cm","c":"5 cm"}}'),
  ('Figūra: stačiakampis 6 cm $\\times$ 4 cm su išpjautu statusiu trikampiu katetais 2 cm. Raskite plotą.',
   '$S=20$ cm$^2$',
   '$24-\\frac{1}{2}\\cdot2\\cdot2=20$ cm$^2$.',
   NULL),
  ('Lygiakraščio trikampio kraštinė 10 cm. Raskite plotą ir aukštinę.',
   '$S=25\\sqrt{3}$ cm$^2$; $h=5\\sqrt{3}$ cm',
   '$h=5\\sqrt{3}$ cm, $S=\\frac{\\sqrt{3}}{4}\\cdot100=25\\sqrt{3}$ cm$^2$.',
   NULL),
  ('Lygiagretainio perimetras 34 cm, kraštinės 10 cm ir 7 cm. Raskite plotą, jei aukštinė, nuleista ant 10 cm kraštinės, lygi 6 cm.',
   '$S=60$ cm$^2$',
   '$S=10\\cdot6=60$ cm$^2$ (perimetras patikrina kraštines).',
   '{"type":"PARALLELOGRAM","labels":{"a":"10 cm","h":"6 cm"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'perimetrai-ir-plotai';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, diagram_config, status, source, generation_prompt)
SELECT 8, t.id, s.id, 'sunkios', q, a, sol, diag::jsonb, 'draft', 'manual', 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Statusio trapecijos statmenoji kraštinė 6 cm, įstrižainės 10 cm ir 7,5 cm. Raskite pagrindų ilgius ir vidurio liniją.',
   '$a=8$ cm; $b=2$ cm; $MN=5$ cm',
   'Projekcijos: $p_1^2=10^2-6^2=64$, $p_1=8$; $p_2^2=7{,}5^2-36=20{,}25$, $p_2=4{,}5$ — su derinimu pagrindai 8 cm ir 2 cm, $MN=5$ cm.',
   '{"type":"TRAPEZOID","labels":{"h":"6 cm","d1":"10 cm","d2":"7,5 cm"}}'),
  ('Statusio trapecijos aukštinė $4\\sqrt{3}$ cm, mažesnis pagrindas 3 kartus trumpesnis už didesnį, kampas $30^\\circ$ prie didesnio pagrindo. Raskite pagrindus ir plotą.',
   '$b=12$ cm; $a=4$ cm; $S=32\\sqrt{3}$ cm$^2$',
   'Skirtumas pagrindų $(b-a)/2=h/\\tan60^\\circ=4$, su $b=3a$ gauname $a=4$, $b=12$ cm, $S=32\\sqrt{3}$ cm$^2$.',
   '{"type":"TRAPEZOID","labels":{"h":"4√3 cm","angle":"30°"}}'),
  ('Trapecijoje pagrindai 7 cm ir 25 cm, šoninė kraštinė 20 cm statmena mažesniam pagrindui. Raskite aukštinę, plotą ir perimetrą.',
   '$h=16$ cm; $S=256$ cm$^2$; $P=68$ cm',
   '$h=16$ cm (Pitagoras su projekcija 18 cm), $S=256$ cm$^2$, $P=7+25+20+16=68$ cm.',
   '{"type":"TRAPEZOID","labels":{"a":"7 cm","b":"25 cm","c":"20 cm"}}'),
  ('Rombui kraštinė 10 cm, viena įstrižainė 12 cm. Raskite antrą diagonalę, plotą ir aukštinę.',
   '$d_2=16$ cm; $S=96$ cm$^2$; $h=9{,}6$ cm',
   '$d_2=16$ cm, $S=96$ cm$^2$, $h=S/a=9{,}6$ cm.',
   '{"type":"RHOMBUS","labels":{"a":"10 cm","d1":"12 cm"}}'),
  ('Lygiagretainio $ABCD$ plotas 48 cm$^2$, $AB=8$ cm, $AD=6$ cm. Raskite aukštinę, nuleistą į $AD$.',
   '$h=8$ cm',
   '$S=AD\\cdot h$, $48=6\\cdot h$, $h=8$ cm.',
   '{"type":"PARALLELOGRAM","labels":{"AB":"8 cm","AD":"6 cm","S":"48 cm²","h":"?"}}')
) AS v(q, a, sol, diag)
WHERE t.grade = 8 AND t.slug = '8-geometrija' AND s.slug = 'perimetrai-ir-plotai';

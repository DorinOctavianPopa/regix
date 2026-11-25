# Manual de utilizare — Dosare definitive

## 1. Scop

Pagina **Definitive Case Records** afișează dosarele definitive și permite filtrarea lor după data deciziei finale, consultarea rezultatelor în pagini, exportul în Excel și tipărirea.

Pagina necesită autentificare. Ruta aplicației este:

`/registries/definitive-cases`

## 2. Deschiderea paginii și încărcarea datelor

La deschiderea paginii, aplicația încarcă înregistrările disponibile pentru tipul de obiect configurat. În timpul încărcării este afișat mesajul „Loading definitive case records...”.

Implicit, când ambele câmpuri de dată sunt necompletate, pagina solicită înregistrările cu data deciziei finale de astăzi. Lista este ordonată după data deciziei finale, de la cea mai recentă la cea mai veche.

## 3. Filtrarea după dată

Folosiți câmpurile:

- **Start date** — limita inferioară a intervalului;
- **End date** — limita superioară a intervalului.

Selectarea unei date reîncarcă rezultatele. Înregistrările sunt incluse dacă data deciziei finale se află în interval; ziua de sfârșit este inclusă integral.

**Important:** un câmp lăsat necompletat este tratat ca data curentă, nu ca lipsa unei limite. De exemplu, dacă se completează doar data de început, data de sfârșit rămâne implicit astăzi. Pentru rezultate previzibile, selectați ambele date și verificați ca data de început să nu fie ulterioară datei de sfârșit.

Tipul de obiect este configurat în aplicație și nu poate fi schimbat din această pagină.

## 4. Înțelegerea listei

Deasupra tabelului sunt afișate:

- **Total loaded** — numărul de înregistrări încărcate;
- **Filtered** — numărul de înregistrări care corespund filtrelor;
- **Page** — pagina curentă și numărul total de pagini.

Tabelul afișează următoarele coloane:

| Coloană | Descriere |
|---|---|
| Numar dosar | Numărul dosarului |
| Tip Obiect dosar | Denumirea tipului de obiect |
| Data Deciziei Finale | Data deciziei finale |
| Descriere Ultim Circuit Intern | Descrierea ultimului circuit intern |
| Data Ultim Circuit Intern | Data ultimului circuit intern |

Datele sunt afișate în formatul `ZZ.LL.AAAA`. Pentru unele valori lipsă poate apărea `-`.

## 5. Navigarea între pagini

Tabelul afișează cel mult 20 de înregistrări pe pagină.

- Apăsați **Next →** pentru pagina următoare.
- Apăsați **← Previous** pentru pagina anterioară.
- Butonul corespunzător este dezactivat când nu există o pagină anterioară sau următoare.

Schimbarea datelor filtrului readuce lista la prima pagină.

## 6. Exportul în Excel

1. Selectați intervalul de date dorit.
2. Apăsați **Export XLS**.
3. Deschideți fișierul descărcat în Excel.

Fișierul se numește `definitive-case-records-AAAA-LL-ZZ.xls` și conține toate înregistrările filtrate, nu doar cele vizibile pe pagina curentă. Exportul include și câmpuri suplimentare față de tabel: ID, ID Tip Obiect, ID Ultim Circuit Intern, Nume Tip Obiect și Actualizat La.

Exportul este disponibil numai când există rezultate pentru filtrele curente. Fișierul `.xls` este generat ca tabel HTML pentru compatibilitate cu Excel; nu este un registru `.xlsx` nativ. În funcție de versiunea Excel, poate apărea o avertizare privind formatul fișierului.

## 7. Tipărirea

1. Aplicați filtrele dorite.
2. Apăsați **Print**.
3. În fereastra de tipărire a browserului, selectați imprimanta sau opțiunea de salvare ca PDF și confirmați.

Tipărirea include toate înregistrările filtrate, nu doar cele de pe pagina curentă. Dacă browserul blochează fereastra nouă, permiteți ferestrele pop-up pentru aplicație și încercați din nou.

## 8. Revenirea la pagina anterioară

Apăsați **← Back** pentru a reveni la pagina vizitată anterior.

## 9. Probleme și recomandări

- **„No records match current filters.”** Verificați intervalul de date și încercați un interval care include datele dorite.
- **Apare o eroare la încărcare.** Verificați conexiunea și autentificarea, apoi reveniți la pagina anterioară și redeschideți pagina. Dacă problema persistă, contactați administratorul aplicației.
- **Exportul sau tipărirea nu conține rezultate.** Verificați numărul **Filtered**; exportul și tipărirea folosesc rezultatele filtrate.
- **Excel afișează o avertizare la deschiderea fișierului.** Fișierul exportat este un tabel HTML cu extensia `.xls`. Deschideți-l numai dacă provine din aplicația de încredere.

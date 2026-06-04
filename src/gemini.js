export const CONTENT_PILLARS = [
  {
    id: 'Praktijkinzichten',
    label: 'Praktijkinzichten',
    omschrijving: 'Autoriteit bouwen',
    toelichting: 'Veelgemaakte fouten, actuele ontwikkelingen, juridische veranderingen vertaald naar ondernemersimpact.',
    kleur: '#2FA766',
    icon: '💡',
  },
  {
    id: 'Praktijkcases',
    label: 'Praktijkcases',
    omschrijving: 'Bewijskracht leveren',
    toelichting: 'Geanonimiseerde klantcases, situaties uit de praktijk, succesverhalen en leerpunten.',
    kleur: '#007F81',
    icon: '📋',
  },
  {
    id: 'Netwerk & Events',
    label: 'Netwerk & Events',
    omschrijving: 'Zichtbaarheid vergroten',
    toelichting: 'Mosselborrel, Vastgoedborrel, seminars, businessclubs. Focus op ontmoeting en relaties.',
    kleur: '#E74049',
    icon: '🤝',
  },
  {
    id: 'Mensen achter VDT',
    label: 'Mensen achter VDT',
    omschrijving: 'Vertrouwen & sympathie',
    toelichting: 'Collega\'s, cultuur, samenwerkingen, successen en de dagelijkse praktijk.',
    kleur: '#F4C200',
    icon: '👥',
  },
]

export const DOELGROEPEN = [
  { id: 'Ondernemers', label: 'Ondernemers' },
  { id: 'Accountants', label: 'Accountants' },
  { id: 'Vastgoedprofessionals', label: 'Vastgoed­professionals' },
  { id: 'HR-professionals', label: 'HR-professionals' },
  { id: 'Financieel professionals', label: 'Financieel' },
]

const BRAND_SYSTEM_PROMPT = `Je bent de vaste contentschrijver van VDT Advocaten (Tilburg, sinds 1994). Je kent het kantoor van binnen en buiten. Je schrijft zoals een slimme, hartelijke Brabander praat — direct, met humor waar het kan, en altijd met gevoel voor de ondernemer aan de andere kant.

== BEDRIJFSIDENTITEIT ==
VDT is geen kantoor van deftige heren in pakken. Geen advocaten die je pas bellen als het mis is.
VDT zit naast de ondernemer. Denkt mee als het goed gaat. Staat paraat als het tegenzit.
Kernboodschap: "Wij zitten naast de ondernemer, niet tegenover hem."
Payoff: "Onderneemt met je mee."
Locatie: Hart van Brabantlaan 500, Tilburg. Dat Brabantse, warme, nuchter-met-pit zit in de toon.

== WAT CONTENT MOET DOEN ==
Niet verkopen. Niet imponeren. Wel:
- Top-of-mind blijven bij het netwerk
- Herkenning oproepen ("dat ken ik!")
- Gesprekken uitlokken ("daar wil ik iemand van VDT over bellen")
- Vertrouwen opbouwen zonder opschepperij
- Aanmeldingen stimuleren voor events als de Mosselborrel of Vastgoedborrel
Content is relatiebeheer op schaal. Periode.

== DOELGROEPEN ==
- Ondernemers: groei, personeel, conflicten voorkomen, praktische oplossingen, ondernemen zónder juridische rompslomp. Ze willen dat het geregeld is, niet dat ze het snappen.
- Accountants: werkgeverschap, ondernemerschap, risico's, klantvraagstukken, actualiteiten. Aanspreken als collega, niet als leerling.
- Vastgoedprofessionals: transacties, contracten, samenwerking, risico's. Schrijf als iemand die ook weet hoe een deal ruikt.
- HR-professionals: arbeidsrecht in de praktijk, personeelsdossiers, verzuim & re-integratie, ontslag & disfunctioneren, medezeggenschap, grensoverschrijdend gedrag. Schrijf als sparringpartner die HR-gedoe ontlast. Niet als advocaat die instrueert.
- Financieel professionals (CFO's, controllers, financieel directeuren): aansprakelijkheid, bestuurdersrisico's, contractrisico's, overnames & herstructurering, governance, cashflow-impact van juridische keuzes. Zakelijk, cijfermatig, vertaal risico's naar geld.

== CONTENTPIJLERS ==
Pijler 1 – Praktijkinzichten: autoriteit opbouwen. Format: "Dit zien wij momenteel vaker..." Concreet, herkenbaar, nooit schoolmeesterachtig.
Pijler 2 – Praktijkcases: bewijskracht leveren. Structuur: situatie → probleem → aanpak → resultaat → les. Anoniem, maar echt.
Pijler 3 – Netwerk & Events: zichtbaarheid. Focus op de ontmoeting en de sfeer — NIET op het programma. De Mosselborrel draait om mensen, niet om mosselen.
Pijler 4 – Mensen achter VDT: vertrouwen en sympathie. Collega's, cultuur, de dagelijkse werkelijkheid. Menselijk, niet glanzend.

== TONE OF VOICE — DE VDT-STEM ==
De VDT-stem klinkt als een goede kennis die toevallig ook advocaat is.
- Directe taal, actieve zinnen, geen omhaal
- Brabants nuchter: zeggen wat je bedoelt, zonder drukte
- Warmte zonder sentimentaliteit
- Humor mag — zolang het scherp is, niet grappig-om-grappig-te-zijn
- Nooit 'u'. Altijd je/jij.
- Geen juridisch jargon zonder onmiddellijke uitleg in gewone taal
- Wissel zinslengte bewust af: een korte zin na een lange zin geeft ritme en punch.
- Denk in beelden. Niet "risico's mitigeren" maar "voor je het weet sta je zelf voor de rechter."

== HET 1-2-TJE (signatuur VDT-concept) ==
Tegenstelling "Jij… / Wij…". De klant is de held. VDT is de stille kracht erachter.
Voorbeelden:
"Voor jou de grote plannen — voor ons de kleine lettertjes."
"Jij ziet de kansen. Wij spotten de addertjes."
"Jij wil groeien. Wij zorgen dat het contract dat ook doet."
Gebruik het smaaktvol — als haak of als afsluiter. Nooit verplicht.

== VERBODEN OUTPUT ==
NOOIT:
- "Geachte heer/mevrouw" / "Conform wet- en regelgeving" / "Wij adviseren u derhalve"
- Juridisch jargon zonder uitleg
- Namen van teamleden (tenzij aangeleverd)
- Opschepperige claims over VDT zelf
- Harde garanties over juridische uitkomsten

== VERBODEN AI-SCHRIJFTREKJES — ABSOLUUT NIET ==
De tekst mag op geen enkele manier klinken als AI. De lezer mag het niet eens vermoeden. Verboden:
- Drietallen: "snel, slim en simpel" / "duidelijk, direct en betrouwbaar" — AI groepeert altijd in drieën, doe dit nooit
- "In een wereld waar..." — klassieke AI-opener, herkent iedereen
- "Als ondernemer weet je..." — aanspreken via de rol
- "Wist je dat..." — overgebruikte haak
- "Niet alleen… maar ook…" — standaard AI-tegenstelling
- "Het is belangrijk om..." — zwakke opvulzin
- "Navigeren" en "landschap" — "het juridische landschap navigeren" schreeuwt AI
- "Uitdagingen" — zeg gewoon "problemen" of "gedoe"
- "In de huidige arbeidsmarkt / economie / tijd" — generieke non-opener
- Buzzwords: "proactief", "transparant", "integraal", "faciliteren", "optimaliseren", "transformeren"
- "Vergeet niet..." — betuttelend
- Emoji als decoratie per bullet — gebruik emoji spaarzaam, alleen als het écht iets toevoegt
- Symmetrische lijstjes van precies 3 of 5 punten — alleen als de inhoud dat vraagt, niet als trucje
- "Kortom / Al met al / Tot slot" als mechanische afsluiter
- "Laten we eerlijk zijn..." — nep-intimiteit
- "Of je nu X of Y bent..." — kunstmatige inclusiviteit
- Hedging: "het kan zijn dat", "mogelijk", "in sommige gevallen" — wees gewoon direct
- Generieke CTA: "Heb je vragen? Neem gerust contact op." — té vaag, te standaard
- Uniforme zinslengte — dodelijk saai
- Woorden als "essentieel", "cruciaal", "van groot belang" — te zwaar aangezet
- Opsommingen die beginnen met hetzelfde woord per regel — dat is list-padding, geen schrijven

== CALL-TO-ACTION ==
Altijd laagdrempelig en uitnodigend, nooit generiek:
"Herkenbaar?" / "Sparren?" / "Bakje koffie?" / "Laat gerust iets weten." / "Bel me even." / "Vrijblijvend gesprek van een kwartier — meer hoeft dat niet te zijn."

== ECHTE VDT LINKEDIN-POSTS — GEBRUIK DIT ALS STIJLREFERENTIE ==
Hieronder volgen recente posts van VDT Advocaten op LinkedIn. Dit is de échte stem. Schrijf zo.

POST 1 (Mensen achter VDT — beëdiging):
"Nog maar kort geleden liep Joep hier binnen, en vrijdag stond hij al bij de rechtbank. 🦅
Want het is officieel: Joep van den Hoogen is beëdigd tot advocaat!
Vanaf deze week mogen we hem dus écht advocaat noemen en start hij zijn advocaatstage binnen ons kantoor.
Met zijn enthousiasme, nieuwsgierigheid en drive heeft hij zijn plek binnen VDT snel gevonden. Wij kijken ernaar uit om zijn verdere ontwikkeling van dichtbij mee te maken.
Gefeliciteerd Joep, let's go! 🚀
📸 Joep met zijn patroon Jasper de Roo
#advocaatstagiair #beëdiging #vdtonderneemtmetjemee"

POST 2 (Mensen achter VDT — welkomstpost):
"Welkom: Eefje van den Berg 🚀
Met haar energie, gevoel voor structuur en sociale flair voelt Eefje feilloos aan [...]"

POST 3 (Mensen achter VDT — welkomstpost):
"Welkom: Harold Simonis! 🚀
Als het spannend wordt, blijft Harold rustig. [...meer]"

POST 4 (Kantoor — muurschildering):
"De onthulling was natuurlijk live bedoeld tijdens onze nieuwjaarsborrel, maar het weer gooide roet in het eten… en we wilden niemand langer laten wachten.
Misschien was het sommige al opgevallen: onze vergaderruimte was de afgelopen tijd gesloten. Niet zonder reden 🙈
De saaie, zwarte wand maakte plaats voor iets dat écht bij ons past: Paul Watty is Nederlands kunstenaar, muralist en grafisch ontwerper en Tilburger. Hij nam de muur onder handen en vertaalde onze mascotte 'advocaten van de toekomst' naar beeld.
Het resultaat? Een ruimte die inspireert, verrast en gesprekken op gang brengt. Een samenwerking waar we trots op zijn, samen met lokale Tilburgse ondernemers.
#vdtonderneemtmetjemee"

WAT OPVALT AAN DEZE STIJL:
- Openingszin is een tijdlijn of een punchline: "Nog maar kort geleden... en vrijdag al bij de rechtbank." / "Als het spannend wordt, blijft Harold rustig."
- Korte alinea's, max 2 zinnen per alinea
- Persoonsnamen altijd met voornaam, voelt als een verhaal over iemand die je kent
- Emoji spaarzaam maar raak: 🚀 voor energie, 🦅 voor mijlpalen, 📸 voor fotocredit
- Hashtag altijd afgesloten met #vdtonderneemtmetjemee
- Geen bloemrijke beschrijvingen, geen superlatieven — gewoon wat er is, goed verwoord`

export function buildLinkedInPrompt(formData) {
  const { onderwerp, pijler, doelgroep, toon, gebruik12tje, hashtagsToevoegen, extraContext, websiteLink, zoekWebsiteLink } = formData

  const linkInstructie = zoekWebsiteLink
    ? `- Zoek op vdt-advocaten.nl via Google Search naar de meest relevante pagina voor dit onderwerp: ofwel een teamlid (persoonspagina) ofwel een expertise-/dienstenpagina. Verwerk de gevonden URL op één natuurlijke plek in de tekst of CTA — niet als los blok, maar geïntegreerd.`
    : websiteLink
    ? `- Verwerk deze URL op één natuurlijke, niet-opdringerige plek in de tekst of CTA: ${websiteLink}`
    : ''

  return `${BRAND_SYSTEM_PROMPT}

---

Schrijf een LinkedIn-post voor VDT Advocaten.

BEPAAL EERST (intern, niet tonen):
- Doelgroep: ${doelgroep}
- Contentpijler: ${pijler}
- Kanaal: LinkedIn
- Doel: zie pijlerspecificaties hierboven

DAN SCHRIJF:
Onderwerp / thema: ${onderwerp}
Toon: ${toon}
1-2-tje gebruiken: ${gebruik12tje ? 'Ja' : 'Nee'}
Hashtags toevoegen: ${hashtagsToevoegen ? 'Ja' : 'Nee'}
${extraContext ? `Extra context: ${extraContext}` : ''}

VEREISTEN:
- Pakkende openingszin die direct aandacht trekt (geen "Wist je dat..." of "Als ondernemer...")
- Duidelijke boodschap in max 5 korte alinea's
- Schrijf vanuit het perspectief van de lezer (${doelgroep}), niet vanuit VDT
${gebruik12tje ? '- Gebruik het 1-2-tje als hook of afsluiter' : ''}
- Zachte, laagdrempelige CTA aan het einde
${hashtagsToevoegen ? '- Voeg 3-5 relevante hashtags toe' : ''}
- Maximum 1300 tekens
${linkInstructie}
- De ideale reactie van de lezer: "Interessant, dit herken ik." of "Hier moet ik even iemand van VDT over bellen."`
}

export function buildNewsletterPrompt(formData) {
  const { onderwerp, pijler, doelgroep, typeNieuwsbrief, extraContext, websiteLink, zoekWebsiteLink } = formData

  const pijlerKleur = {
    'Praktijkinzichten': '#2FA766',
    'Praktijkcases': '#007F81',
    'Netwerk & Events': '#E74049',
    'Mensen achter VDT': '#F4C200',
  }[pijler] || '#2FA766'

  const linkInstructie = zoekWebsiteLink
    ? `Verwerk een passende URL van vdt-advocaten.nl via Google Search op één natuurlijke plek.`
    : websiteLink
    ? `Verwerk deze URL op één natuurlijke plek: ${websiteLink}`
    : ''

  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  return `${BRAND_SYSTEM_PROMPT}

---

Schrijf de tekst voor een VDT Advocaten e-mailnieuwsbrief over: "${onderwerp}"
${extraContext ? `Extra context: ${extraContext}` : ''}
Doelgroep: ${doelgroep} | Type: ${typeNieuwsbrief} | Pijler: ${pijler}
${linkInstructie}

LEVER DE VOLGENDE TEKSTVELDEN AAN — gescheiden door de exacte labels hieronder.
Schrijf in VDT-tone: direct, Brabants nuchter, warme taal, geen jargon, geen AI-clichés.

ONDERWERPREGEL: [max 60 tekens, pakkend]
PREHEADER: [max 90 tekens, verlengstuk van onderwerpregel]
EDITIE_LABEL: [kort label in hoofdletters, bijv. "ARBEIDSRECHT" of "ZOMER 2026"]
HERO_TITEL: [grote pakkende kop, max 2 regels]
LEAD_VRAAG: [1 zin die de kernvraag stelt — waarom leest de lezer dit?]
LEAD_TEKST: [2-3 zinnen inleiding, persoonlijk en direct]
BULLET_1: [kort — max 12 woorden]
BULLET_2: [kort — max 12 woorden]
BULLET_3: [kort — max 12 woorden]
BULLET_4: [optioneel — laat leeg als 3 genoeg is]
SECTIE_LABEL: [bijv. "ONZE KIJK" of "WAT WIJ ZIEN"]
SECTIE_TITEL: [tussenkop voor het hoofdartikel]
SECTIE_TEKST: [100-150 woorden kerninhoud — de echte waarde van deze mailing]
PUNT_01_TITEL: [pakkende kop voor inzicht/tip 1]
PUNT_01_TEKST: [2-3 zinnen, concreet en bruikbaar]
PUNT_02_TITEL: [pakkende kop voor inzicht/tip 2]
PUNT_02_TEKST: [2-3 zinnen, concreet en bruikbaar]
PUNT_03_TITEL: [pakkende kop voor inzicht/tip 3]
PUNT_03_TEKST: [2-3 zinnen, concreet en bruikbaar]
KAART_1_LABEL: [kort thema-label in hoofdletters]
KAART_1_TITEL: [koptitel verdiepingsartikel 1]
KAART_1_TEKST: [1 zin over dit artikel]
KAART_2_LABEL: [kort thema-label in hoofdletters]
KAART_2_TITEL: [koptitel verdiepingsartikel 2]
KAART_2_TEKST: [1 zin over dit artikel]
SLOTCITAAT: [1-2 zinnen slotbelofte of kernboodschap — niet generiek]
KOFFIE_VRAAG: [1 zin uitnodiging specifiek voor dit onderwerp — bijv. "Benieuwd wat dit voor jouw personeel betekent?"]`
}

function buildNewsletterHtml(fields, pijlerKleur, today) {
  const ac = pijlerKleur
  const acLight = ac + '18'
  const esc = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const get = (key) => esc(fields[key] || '')

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${get('ONDERWERPREGEL')}</title></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">

  <!-- HEADER -->
  <tr><td style="background:${ac};padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">VDT.</span> <span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:400;letter-spacing:1px;">advocaten</span></td>
        <td align="right">
          <div style="color:rgba(255,255,255,0.85);font-size:12px;">${today}</div>
          <div style="color:rgba(255,255,255,0.55);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">ONDERNEEMT MET JE MEE</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background:${ac};padding:8px 32px 36px;">
    <div style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">${get('EDITIE_LABEL')}</div>
    <h1 style="color:#ffffff;font-size:30px;line-height:1.2;margin:0;font-weight:900;">${get('HERO_TITEL')}</h1>
  </td></tr>

  <!-- LEAD + IN HET KORT -->
  <tr><td style="padding:32px;">
    <h3 style="color:${ac};font-size:16px;margin:0 0 10px;font-weight:700;">${get('LEAD_VRAAG')}</h3>
    <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 24px;">${get('LEAD_TEKST')}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;border-radius:8px;border-left:4px solid ${ac};">
      <tr><td style="padding:20px 24px;">
        <div style="color:${ac};font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-bottom:12px;">IN HET KORT</div>
        <table cellpadding="0" cellspacing="0">
          ${[get('BULLET_1'), get('BULLET_2'), get('BULLET_3'), get('BULLET_4')].filter(Boolean).map(b =>
            `<tr><td style="padding:4px 0;vertical-align:top;"><span style="color:${ac};font-weight:700;margin-right:8px;">—</span></td><td style="color:#444;font-size:14px;line-height:1.5;padding:4px 0;">${b}</td></tr>`
          ).join('')}
        </table>
      </td></tr>
    </table>

    <div style="margin-top:16px;color:#aaaaaa;font-size:12px;">VDT Redactie &nbsp;·&nbsp; Voor ${get('DOELGROEP') || 'onze klanten'}</div>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"></td></tr>

  <!-- HOOFDSECTIE -->
  <tr><td style="padding:32px 32px 24px;">
    <div style="color:${ac};font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-bottom:8px;">${get('SECTIE_LABEL')}</div>
    <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 16px;font-weight:800;">${get('SECTIE_TITEL')}</h2>
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">${get('SECTIE_TEKST')}</p>
    <a href="https://vdt-advocaten.nl" style="color:${ac};font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">LEES MEER OP ONZE WEBSITE →</a>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"></td></tr>

  <!-- WAT DIT VOOR JOU BETEKENT — 3 PUNTEN -->
  <tr><td style="padding:32px 32px 8px;">
    <div style="color:${ac};font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-bottom:8px;">WAT DIT VOOR JOU BETEKENT</div>
    <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 8px;font-weight:800;">Drie dingen om nu te weten.</h2>
  </td></tr>

  ${['01','02','03'].map(n => `
  <tr><td style="padding:16px 32px;border-top:1px solid #f0f0f0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="36" valign="top" style="padding-top:2px;"><span style="color:${ac};font-size:11px;font-weight:700;letter-spacing:1px;">${n}</span></td>
        <td>
          <div style="color:#1a1a1a;font-size:15px;font-weight:700;margin-bottom:6px;">${get('PUNT_'+n+'_TITEL')}</div>
          <p style="color:#555555;font-size:14px;line-height:1.6;margin:0;">${get('PUNT_'+n+'_TEKST')}</p>
        </td>
      </tr>
    </table>
  </td></tr>`).join('')}

  <!-- DIVIDER -->
  <tr><td style="padding:24px 32px 0;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"></td></tr>

  <!-- VERDER LEZEN — 2 KAARTEN -->
  <tr><td style="padding:32px;">
    <div style="color:${ac};font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-bottom:16px;">VERDER LEZEN</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" valign="top" style="background:#f7f7f5;border-radius:8px;padding:20px;border-top:3px solid ${ac};">
          <div style="color:${ac};font-size:9px;letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-bottom:8px;">${get('KAART_1_LABEL')}</div>
          <div style="color:#1a1a1a;font-size:14px;font-weight:700;margin-bottom:8px;line-height:1.4;">${get('KAART_1_TITEL')}</div>
          <p style="color:#666666;font-size:13px;line-height:1.5;margin:0 0 12px;">${get('KAART_1_TEKST')}</p>
          <a href="https://vdt-advocaten.nl" style="color:${ac};font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">LEES HET ARTIKEL →</a>
        </td>
        <td width="4%"></td>
        <td width="48%" valign="top" style="background:#f7f7f5;border-radius:8px;padding:20px;border-top:3px solid ${ac};">
          <div style="color:${ac};font-size:9px;letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-bottom:8px;">${get('KAART_2_LABEL')}</div>
          <div style="color:#1a1a1a;font-size:14px;font-weight:700;margin-bottom:8px;line-height:1.4;">${get('KAART_2_TITEL')}</div>
          <p style="color:#666666;font-size:13px;line-height:1.5;margin:0 0 12px;">${get('KAART_2_TEKST')}</p>
          <a href="https://vdt-advocaten.nl" style="color:${ac};font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">LEES HET ARTIKEL →</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SLOTCITAAT -->
  <tr><td style="padding:28px 32px;background:${acLight};border-left:0;">
    <p style="color:#1a1a1a;font-size:16px;font-style:italic;line-height:1.6;margin:0 0 16px;">"${get('SLOTCITAAT')}"</p>
    <p style="color:#666666;font-size:13px;margin:0;">Met vriendelijke groet,<br><strong style="color:#1a1a1a;">De redactie van VDT</strong><br><span style="color:#aaaaaa;">Studio · Tilburg</span></p>
  </td></tr>

  <!-- BAKJE KOFFIE -->
  <tr><td style="background:${ac};padding:28px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td valign="middle">
          <div style="color:#ffffff;font-size:16px;font-weight:800;letter-spacing:0.5px;margin-bottom:6px;">BAKJE KOFFIE?</div>
          <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0 0 4px;">${get('KOFFIE_VRAAG')}</p>
          <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:0;">We schuiven graag aan. Laat het weten en we plannen iets in.</p>
        </td>
        <td align="right" valign="middle" style="padding-left:16px;white-space:nowrap;">
          <a href="mailto:lovetilburg@vdt-advocaten.nl" style="display:inline-block;background:#ffffff;color:${ac};padding:12px 20px;border-radius:6px;font-weight:800;font-size:13px;text-decoration:none;letter-spacing:0.5px;">PLAN EEN GESPREK →</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- VDT TAGLINE BALK -->
  <tr><td style="background:#1a1a1a;padding:24px 32px;text-align:center;">
    <div style="color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">VDT.</div>
    <div style="color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">ONDERNEEMT MET JE MEE</div>
  </td></tr>

  <!-- DRIE TEAMS NAVIGATIE -->
  <tr><td style="background:#1a1a1a;padding:20px 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="33%" style="text-align:center;padding:0 8px;">
          <div style="color:rgba(255,255,255,0.35);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">01 — STRUCTURE</div>
          <a href="https://vdt-advocaten.nl/vdt-advocaten-tilburg/ons-team/team-bedrijfsstructuur/" style="color:#ffffff;font-size:12px;text-decoration:none;">Voor jouw bedrijf →</a>
        </td>
        <td width="33%" style="text-align:center;padding:0 8px;border-left:1px solid #333;border-right:1px solid #333;">
          <div style="color:rgba(255,255,255,0.35);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">02 — BUSINESS</div>
          <a href="https://vdt-advocaten.nl" style="color:#ffffff;font-size:12px;text-decoration:none;">Voor jouw business →</a>
        </td>
        <td width="33%" style="text-align:center;padding:0 8px;">
          <div style="color:rgba(255,255,255,0.35);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">03 — PEOPLE</div>
          <a href="https://vdt-advocaten.nl/vdt-advocaten-tilburg/ons-team/team-mens-arbeid/" style="color:#ffffff;font-size:12px;text-decoration:none;">Voor jouw mensen →</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#111111;padding:24px 32px;border-top:1px solid #2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="33%" valign="top" style="padding-right:16px;">
          <div style="color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">BEZOEK &amp; POST</div>
          <div style="color:rgba(255,255,255,0.65);font-size:12px;line-height:1.9;">Hart van Brabantlaan 500<br>5038 JA Tilburg<br>Postbus 4203, 5004 JE Tilburg</div>
        </td>
        <td width="33%" valign="top" style="padding-right:16px;">
          <div style="color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">CONTACT</div>
          <div style="color:rgba(255,255,255,0.65);font-size:12px;line-height:1.9;">013 544 0400<br><a href="mailto:lovetilburg@vdt-advocaten.nl" style="color:${ac};text-decoration:none;">lovetilburg@vdt-advocaten.nl</a></div>
        </td>
        <td width="33%" valign="top">
          <div style="color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">VOLG ONS</div>
          <div style="color:rgba(255,255,255,0.65);font-size:12px;line-height:1.9;">
            <a href="https://linkedin.com/company/vdt-advocaten" style="color:${ac};text-decoration:none;">LinkedIn</a><br>
            <a href="https://vdt-advocaten.nl" style="color:${ac};text-decoration:none;">Website</a>
          </div>
        </td>
      </tr>
    </table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #222222;color:rgba(255,255,255,0.25);font-size:11px;line-height:1.7;">
      Je ontvangt deze e-mail omdat je je hebt aangemeld voor de VDT Advocaten nieuwsbrief of omdat je klant bij ons bent.<br>
      Geen updates meer ontvangen? <a href="#" style="color:rgba(255,255,255,0.4);">Uitschrijven kan hier</a> &nbsp;·&nbsp; <a href="https://vdt-advocaten.nl" style="color:rgba(255,255,255,0.4);">Privacyverklaring</a><br>
      © ${new Date().getFullYear()} VDT Advocaten · Tilburg
    </div>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`
}

const NEWSLETTER_FIELD_KEYS = new Set([
  'ONDERWERPREGEL','PREHEADER','EDITIE_LABEL','HERO_TITEL','LEAD_VRAAG','LEAD_TEKST',
  'BULLET_1','BULLET_2','BULLET_3','BULLET_4',
  'SECTIE_LABEL','SECTIE_TITEL','SECTIE_TEKST',
  'PUNT_01_TITEL','PUNT_01_TEKST','PUNT_02_TITEL','PUNT_02_TEKST','PUNT_03_TITEL','PUNT_03_TEKST',
  'KAART_1_LABEL','KAART_1_TITEL','KAART_1_TEKST',
  'KAART_2_LABEL','KAART_2_TITEL','KAART_2_TEKST',
  'SLOTCITAAT','KOFFIE_VRAAG',
])

function parseNewsletterFields(raw) {
  const cleaned = raw.replace(/^```[a-z]*\n?/im, '').replace(/```\s*$/im, '').trim()
  const fields = {}
  const lines = cleaned.split('\n')
  let currentKey = null
  let currentValue = []

  for (const line of lines) {
    const match = line.match(/^([A-Z_0-9]+):\s*(.*)$/)
    if (match && NEWSLETTER_FIELD_KEYS.has(match[1])) {
      if (currentKey) fields[currentKey] = currentValue.join('\n').trim()
      currentKey = match[1]
      currentValue = [match[2]]
    } else if (currentKey) {
      currentValue.push(line)
    }
  }
  if (currentKey) fields[currentKey] = currentValue.join('\n').trim()
  return fields
}

export async function generateContent(apiKey, type, formData) {
  const prompt = type === 'linkedin' ? buildLinkedInPrompt(formData) : buildNewsletterPrompt(formData)
  const useSearch = !!formData.zoekWebsiteLink

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(useSearch ? { tools: [{ google_search: {} }] } : {}),
  }

  const model = useSearch ? 'gemini-2.5-flash' : 'gemini-flash-latest'

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message || 'Er ging iets mis bij Gemini.'
    throw new Error(msg)
  }
  const parts = data.candidates?.[0]?.content?.parts || []
  const raw = parts.map(p => p.text || '').join('')

  if (type === 'newsletter') {
    const pijlerKleur = {
      'Praktijkinzichten': '#2FA766',
      'Praktijkcases': '#007F81',
      'Netwerk & Events': '#E74049',
      'Mensen achter VDT': '#F4C200',
    }[formData.pijler] || '#2FA766'

    const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    const fields = parseNewsletterFields(raw)
    fields.DOELGROEP = formData.doelgroep

    const subject = fields.ONDERWERPREGEL || ''
    const preheader = fields.PREHEADER || ''
    const html = buildNewsletterHtml(fields, pijlerKleur, today)

    return `ONDERWERPREGEL: ${subject}\nPREHEADER: ${preheader}\nHTML:\n${html}`
  }

  return raw
}



const VDT_VISUAL_DNA = `
== VDT ADVOCATEN — VISUAL IDENTITY (BASED ON REAL LINKEDIN POSTS & OFFICE) ==

NO PEOPLE IN THE IMAGE. Zero people, zero hands, zero silhouettes.
Make it feel personal through objects, the real VDT office environment, and brand colors.

BRAND PALETTE:
- VDT Green #2FA766: dominant brand color — backgrounds, large surfaces, objects
- VDT Teal #007F81: darker companion — depth, shadow, secondary elements
- VDT Red #E74049: warm accent — small pop detail only
- VDT Yellow #F4C200: energy accent — sticky note, highlighter, small object
- Off-white #F7F7F5 and warm dark #1A1A1A: clean contrast tones

THE REAL VDT OFFICE — use this when showing a workspace:
The VDT Advocaten office in Tilburg has a distinctive industrial-loft style:
- Ceiling: exposed pipes and ductwork, rectangular fluorescent strip lights on rails — not hidden, intentionally industrial
- Floor: dark gray concrete or polished stone
- Walls: white, clean, occasionally with striking artwork (incl. a large detailed graphite mural of a rocket/spacecraft — their mascot "advocaten van de toekomst")
- Desks: modern, white, minimal — open plan layout
- Lounge area: a deep dark-green curved sofa, low coffee table
- Plants: large tropical statement plants (bird of paradise / strelitzia, or similar tall-leaved plants)
- Light: a mix of industrial strip lighting + warm spots; modern without being cold
- Overall feel: creative agency meets Tilburg nuchterheid — not a traditional law office at all

VDT GRAPHIC DESIGN STYLE (for graphic-style prompts):
When creating a designed/branded visual rather than a photo:
- Background: VDT green gradient (#2FA766 fading lighter top to bottom)
- Typography: bold, large, modern sans-serif — white or very dark
- Pill/badge labels: small rounded rectangles in VDT green with white text (e.g. "WELKOM", category labels)
- Logo placement: "VDT." wordmark top-left (dot included), with "advocaten" below in smaller text
- Clean, confident, modern Dutch design sensibility

PHOTO STYLE (for realistic photo prompts):
- Canon/Sony mirrorless look, 35–50mm equivalent
- Natural and/or warm mixed lighting (window + industrial strip)
- Slightly warm color grade, real — not Instagram-filtered
- Shallow depth of field: sharp object foreground, soft background
- NOT posed, NOT stock — candid object arrangement

HUMANIZING DETAILS (no people, but personal feel):
- An open notebook with handwritten notes (illegible but natural)
- A coffee mug, slight steam, on the dark green sofa armrest or white desk
- A blazer draped over the back of a white office chair
- Reading glasses on a document
- A pen diagonal across a page
- Business cards scattered after a meeting
- Post-its on a monitor edge
- The dark-green VDT sofa with an open book and coffee cup on the low table

FORMAT: Square (1:1), LinkedIn — strong focal point, not busy

ABSOLUTE DON'TS:
- No people, no hands, no body parts
- No scales of justice, gavels, or any legal clichés
- No lightbulbs, arrows, puzzle pieces
- No cold blue tones
- No text overlays (VDT logo added separately in Canva)
- No generic white-background stock photo look
`

const PILLAR_SCENES = {
  'Praktijkinzichten': {
    sceneA: 'The VDT office lounge area: the deep dark-green curved sofa, an open notebook with handwritten notes on the low table, a white ceramic coffee mug with slight steam, a pen beside it. Industrial strip lights softly lit above. No people. Warm, focused.',
    sceneB: 'A white minimal VDT desk with dark concrete floor visible below. An open document with handwritten annotations, reading glasses resting on it, a small VDT-green coffee mug to the side. Shallow depth of field, warm office light.',
    mood: 'someone is working through something important here — expertise made accessible',
  },
  'Praktijkcases': {
    sceneA: 'The VDT office meeting table: two open documents spread out, one with highlighted lines, a red paper clip, a pen across the page. The industrial strip-lit ceiling visible blurred above. Clean, real, in-progress.',
    sceneB: 'Flat lay overhead shot on VDT teal (#007F81) surface: two contracts side by side, yellow (#F4C200) sticky note with scribbles, a black pen, a small calculator. Sharp, clean overhead composition.',
    mood: 'a real case being worked through — detailed, focused, collaborative',
  },
  'Netwerk & Events': {
    sceneA: 'A high café/brasserie table after a VDT networking event: two empty wine glasses, a small VDT-green branded notebook, business cards scattered naturally, warm brasserie evening light blurred in background.',
    sceneB: 'The VDT office lounge: the dark-green sofa with two empty coffee cups on the low table, a few business cards, a closed notebook. The industrial ceiling with strip lights softly visible above. Post-event warmth.',
    mood: 'the warm aftermath of a good conversation — Mosselborrel or Vastgoedborrel vibe',
  },
  'Mensen achter VDT': {
    sceneA: 'A white VDT office chair with a blazer draped naturally over the back. The distinctive VDT office behind it: dark concrete floor, industrial strip lights on the ceiling, large tropical plant blurred in background. A coffee mug on the desk beside it.',
    sceneB: 'Flat lay on VDT green (#2FA766): a leather notebook, a pen, a small succulent, two business cards. Overhead, clean, bold. Warm and personal.',
    mood: 'a real person works here — warm, competent, will be right back',
  },
}

export async function generateVisualPrompt(apiKey, type, formData) {
  const { onderwerp, pijler, doelgroep } = formData

  const pillarData = PILLAR_SCENES[pijler] || {
    sceneA: 'Flat lay on VDT green (#2FA766) background: an open notebook, a pen, a coffee mug, a small plant. Overhead, clean, editorial.',
    sceneB: 'A wooden office desk with VDT-green folder, open document, coffee mug. Warm window light, shallow depth of field.',
    mood: 'professional yet warm and human',
  }

  const doelgroepDetail = {
    'Ondernemers': 'Objects hint at an entrepreneurial context: a business plan printout, a calculator, maybe a company name card visible.',
    'Accountants': 'Objects suggest a financial/numbers context: printed spreadsheet edge visible, a calculator, structured paperwork.',
    'Vastgoedprofessionals': 'Hint at real estate: a floor plan edge, a small architectural model, a key on the desk.',
    'HR-professionals': 'Hint at people management: an org chart printout, a "team" document header visible but illegible.',
    'Financieel professionals': 'Sharp, precise objects: financial document, a small calculator, clean desk, precise composition.',
  }[doelgroep] || ''

  const prompt = `You are a creative director for a modern Dutch law firm, VDT Advocaten (Tilburg). Write ONE precise English image generation prompt for their LinkedIn.

BRAND IDENTITY:
${VDT_VISUAL_DNA}

POST TOPIC: "${onderwerp}"
CONTENT PILLAR: ${pijler}

TWO SCENE OPTIONS TO CHOOSE FROM (pick the one that fits the topic best, or combine elements):
Option A: ${pillarData.sceneA}
Option B: ${pillarData.sceneB}

TARGET AUDIENCE DETAIL: ${doelgroepDetail}

MOOD: ${pillarData.mood}

WRITE THE PROMPT — follow these rules exactly:
1. Start with photography/style descriptor: "Editorial still life photography..." or "Clean overhead flat-lay photography..."
2. Describe the dominant VDT color used (green #2FA766 or teal #007F81) as a major surface or element
3. List the specific objects in the scene (3–4 max), including at least one humanizing detail
4. Add one small accent color detail (red #E74049 or yellow #F4C200 object)
5. Describe lighting and depth of field
6. Relate at least one object subtly to the topic: "${onderwerp}"
7. End with: "Square 1:1 format. No people, no hands, no text, no logos. Not a stock photo."

Return ONLY the English prompt, 110–150 words. No explanation.`

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Prompt generatie mislukt.')

  const parts = data.candidates?.[0]?.content?.parts || []
  return parts.map(p => p.text || '').join('').trim()
}

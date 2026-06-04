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
"Herkenbaar?" / "Sparren?" / "Bakje koffie?" / "Laat gerust iets weten." / "Bel me even." / "Vrijblijvend gesprek van een kwartier — meer hoeft dat niet te zijn."`

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
    ? `- Zoek op vdt-advocaten.nl via Google Search naar de meest relevante pagina voor dit onderwerp: ofwel een teamlid ofwel een expertise-/dienstenpagina. Verwerk de gevonden URL als klikbare hyperlink in de HTML — op één logische plek, geïntegreerd in de tekst of als secundaire CTA-link.`
    : websiteLink
    ? `- Verwerk deze URL als klikbare hyperlink in de HTML op een natuurlijke plek: ${websiteLink}`
    : ''

  return `${BRAND_SYSTEM_PROMPT}

---

Schrijf een volledige e-mailnieuwsbrief voor VDT Advocaten.

BEPAAL EERST (intern, niet tonen):
- Doelgroep: ${doelgroep}
- Contentpijler: ${pijler}
- Type: ${typeNieuwsbrief}
- Doel: relaties warm houden, niet verkopen, gesprekken uitlokken

DAN SCHRIJF:
Onderwerp / thema: ${onderwerp}
${extraContext ? `Extra context: ${extraContext}` : ''}

STRUCTUUR VAN DE MAILING:
- Opening: kort, persoonlijk, geen formele introductie
- Hoofdonderwerp: 1 onderwerp, max 200 woorden
- Concrete waarde: 3 inzichten / tips / aandachtspunten
- Afsluiting: laagdrempelige CTA (Herkenbaar? Sparren? Laat gerust iets weten.)
${linkInstructie}

HTML E-MAIL TECHNISCH:
- Clean HTML met uitsluitend inline styles (geen <style> blokken)
- Maximale breedte 600px, gecentreerd
- Header: achtergrond #2FA766, witte tekst "VDT Advocaten", payoff "Onderneemt met je mee."
- Accentkleur voor pijler ${pijler}: ${pijlerKleur}
- Font: Arial, 16px, #333333
- CTA-knop: groen (#2FA766), witte tekst
- Footer: Hart van Brabantlaan 500, 5038 JA Tilburg · 013-544-0400 · lovetilburg@vdt-advocaten.nl

Geef je antwoord in dit exacte formaat:
ONDERWERPREGEL: [pakkende onderwerpregel]
PREHEADER: [max 90 tekens]
HTML:
[volledige HTML]`
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
  // Collect all text parts (search grounding may split into multiple parts)
  const parts = data.candidates?.[0]?.content?.parts || []
  return parts.map(p => p.text || '').join('')
}



const VDT_VISUAL_DNA = `
== VDT ADVOCATEN — VISUAL IDENTITY GUIDE FOR IMAGE PROMPTS ==

BRAND COLORS (use at least one, never forced or overwhelming):
- Primary green: #2FA766 — appear in: blazer/jacket lapel, coffee mug, plant, folder, accent wall stripe, pen, lanyard, door frame
- Teal: #007F81 — darker accent, backgrounds, chair fabric
- Warm white and light gray: dominant background tones
- Natural wood: desks, tables, floors — warm and grounded
- NEVER: cold blue corporate tones, harsh fluorescent lighting

PHOTOGRAPHY STYLE:
- Editorial-candid hybrid: looks real but well-composed
- Shot with a mirrorless camera, 35mm or 50mm lens equivalent
- Warm white balance (not cool/clinical)
- Shallow depth of field (f/2 to f/4) — sharp subject, slightly blurred background
- Natural window light as key light, no harsh flash, no studio softbox look
- Slightly warm, film-like color grade — think Fujifilm simulation
- NOT a stock photo. NOT posed. NOT symmetrical corporate composure.

PEOPLE:
- Age: 30–55 years old, Dutch/European appearance
- Dress code: smart casual — blazer without tie, open collar shirt, quality knitwear
- NO suits with ties. NO power poses. NO fake smiles to camera.
- Body language: leaning in, gesturing while talking, looking at documents together, laughing mid-conversation
- Diverse but realistic for a Tilburg professional context

SETTINGS:
- Modern open office with plants, exposed concrete or brick, wooden desks
- Glass-walled meeting rooms — visible but not sterile
- Café or brasserie setting for networking scenes — warm lighting, high tables
- Tilburg street or Hart van Brabantlaan exterior — subtle, not tourist-y
- Outdoor terrace of a Tilburg venue, evening golden hour

MOOD:
- Professional but human. Warm but sharp. Tilburg: nuchter met pit.
- The feeling: "these are people I'd want to grab a coffee with who also know their stuff"
- NOT: cold, hierarchical, authoritative, distant, corporate-generic

FORMAT: Square (1:1), optimized for LinkedIn feed — strong focal point, not too busy

ABSOLUTE DON'TS:
- No scales of justice, gavels, or legal clichés
- No stock-photo handshakes with teeth-showing fake smiles
- No lightbulbs, arrows, puzzle pieces
- No text overlays or logos
- No overly symmetrical "hero" compositions
- No all-white backgrounds
- No more than 4 people in frame
`

const PILLAR_SCENES = {
  'Praktijkinzichten': {
    scene: 'One lawyer leaning slightly forward across a small meeting table, one hand gesturing expressively, explaining something to a single client who nods — notepad and coffee cup on the table. Intimate, focused, warm.',
    mood: 'moment of clarity and trust — the expert making something complex feel simple',
  },
  'Praktijkcases': {
    scene: 'Two professionals side by side at a desk, both looking at the same document or laptop screen, one pointing at a specific line — collaborative, problem-solving energy. Papers spread out naturally.',
    mood: 'working through a real challenge together — partnership in action',
  },
  'Netwerk & Events': {
    scene: 'A group of 3–4 professionals at a standing high table in a warm brasserie or venue, holding drinks, mid-conversation and laughing. Evening warm light. One person with a VDT-green detail on their blazer or lanyard.',
    mood: 'genuine connection at a Tilburg networking event — the Mosselborrel or Vastgoedborrel vibe',
  },
  'Mensen achter VDT': {
    scene: 'A single VDT team member photographed candidly in their natural work environment — looking slightly off-camera, mid-action (writing, picking up a phone, walking through office). Not a headshot. Real moment.',
    mood: 'human, approachable, you\'d trust this person — warm and competent',
  },
}

export async function generateVisualPrompt(apiKey, type, formData) {
  const { onderwerp, pijler, doelgroep } = formData

  const pillarData = PILLAR_SCENES[pijler] || {
    scene: 'Two professionals in a modern Tilburg office, engaged in focused conversation over documents and coffee.',
    mood: 'professional yet human, warm and approachable',
  }

  const doelgroepDetail = {
    'Ondernemers': 'The non-lawyer in the scene looks like an entrepreneur — energetic, practical, business casual, maybe a bit informal.',
    'Accountants': 'The setting has a slightly more structured/financial feel — papers, numbers visible in background.',
    'Vastgoedprofessionals': 'Background hints at real estate context — building blueprints, a scale model, or a modern building exterior visible.',
    'HR-professionals': 'Setting suggests a people/organizational context — open office floor visible, or HR-related documents.',
    'Financieel professionals': 'Atmosphere is sharp and precise — clean desk, financial documents, subtle financial data on a screen in background.',
  }[doelgroep] || ''

  const prompt = `You are an expert creative director writing image generation prompts for a Dutch law firm's LinkedIn visuals.

BRAND IDENTITY:
${VDT_VISUAL_DNA}

YOUR TASK:
Write ONE precise English image prompt (100–140 words) for a LinkedIn post about:
Topic: "${onderwerp}"
Content pillar: ${pijler}

Base scene to work from:
${pillarData.scene}

Mood to capture:
${pillarData.mood}

Audience detail:
${doelgroepDetail}

PROMPT WRITING RULES:
1. Start with the photography style descriptor
2. Describe the scene specifically (who, what, where, what are they doing)
3. Include one VDT brand color detail naturally (green mug, teal folder, etc.)
4. Specify lighting and lens feel
5. End with technical format note
6. Include a short negative clause: "Not a stock photo, no posed smiles, no text overlays"

Adapt the base scene creatively to the specific topic "${onderwerp}" if it makes the image more relevant.

Return ONLY the English image prompt. No preamble, no explanation.`

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

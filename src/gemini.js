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

const BRAND_SYSTEM_PROMPT = `Je bent de contentschrijver van VDT Advocaten (Tilburg, sinds 1994).

== BEDRIJFSIDENTITEIT ==
VDT Advocaten is geen traditioneel advocatenkantoor.
Positionering: praktisch, toegankelijk, ondernemend, commercieel meedenkend, oplossingsgericht.
Kernboodschap: "Wij zitten naast de ondernemer, niet tegenover hem."
Payoff: "Onderneemt met je mee."

== DOEL VAN CONTENT ==
Content heeft NOOIT als primair doel juridische kennis te etaleren.
Content draagt bij aan:
- Top-of-mind positie binnen het netwerk
- Vertrouwen opbouwen
- Relaties onderhouden
- Gesprekken initiëren
- Aanmeldingen voor events stimuleren
- Nieuwe opdrachten genereren
Content moet voelen als relatiebeheer op schaal.

== GEWENSTE REACTIE VAN DE LEZER ==
"Interessant, dit herken ik." OF "Hier moet ik even iemand van VDT over bellen."
Dat is het primaire succescriterium van alle content.

== DOELGROEPEN ==
- Ondernemers: groei, personeel, conflicten voorkomen, praktische oplossingen, ondernemen zonder juridische rompslomp
- Accountants: werkgeverschap, ondernemerschap, risico's, klantvraagstukken, actualiteiten
- Vastgoedprofessionals: transacties, samenwerking, contracten, risico's, praktijkervaringen
- HR-professionals: arbeidsrecht in de praktijk, personeelsdossiers, verzuim & re-integratie, ontslag & disfunctioneren, medezeggenschap, grensoverschrijdend gedrag, arbeidsmarktveranderingen. Schrijf als sparringpartner die HR ontlast — niet als advocaat die instrueert.
- Financieel professionals (CFO's, controllers, financieel directeuren): aansprakelijkheid, bestuurdersrisico's, contractrisico's, overnames & herstructurering, governance, cashflow-impact van juridische keuzes. Schrijf zakelijk en cijfermatig ingesteld, vertaal juridische risico's naar financiële consequenties.

== CONTENTPIJLERS ==
Pijler 1 – Praktijkinzichten: autoriteit bouwen. Format: "Dit zien wij momenteel vaak gebeuren..."
Pijler 2 – Praktijkcases: bewijskracht. Structuur: situatie → probleem → aanpak → resultaat → les voor ondernemers
Pijler 3 – Netwerk & Events: zichtbaarheid. Focus NIET op het event zelf, maar op ontmoeting, relaties, kennisdeling.
Pijler 4 – Mensen achter VDT: vertrouwen en sympathie. Collega's, cultuur, samenwerkingen.

== TONE OF VOICE ==
- Korte zinnen, actieve taal, begrijpelijke woorden, directe formuleringen
- Schrijf alsof je een ondernemer spreekt tijdens een netwerkborrel
- Deskundig, benaderbaar, praktisch, energiek, ondernemend
- NIET: academisch, afstandelijk, formeel, arrogant
- Informeel, je/jij-vorm (NOOIT 'u')
- Geen juridisch jargon zonder uitleg

== HET 1-2-TJE (signatuur VDT-tekstconcept) ==
Tegenstelling "Jij… / Wij…": klant is de held, VDT neemt het probleem weg.
Voorbeelden: "Voor jou de grote plannen — voor ons de kleine lettertjes." / "Jij ziet de kansen — wij spotten de risico's."
Gebruik smaaktvol als hook of afsluiter.

== VERBODEN OUTPUT ==
NOOIT gebruiken:
- "Geachte heer/mevrouw"
- "Hierbij informeren wij u"
- "Conform wet- en regelgeving"
- "Wij adviseren u derhalve"
- Juridische vakjargon zonder uitleg
- Harde garanties over uitkomsten van zaken
- Namen van teamleden (tenzij aangeleverd)
- Opschepperige claims over VDT zelf

== CALL-TO-ACTION ==
Altijd laagdrempelig: "Herkenbaar?", "Sparren?", "Bakje koffie?", "Laat gerust iets weten.", vrijblijvend gesprek max 15 min.`

export function buildLinkedInPrompt(formData) {
  const { onderwerp, pijler, doelgroep, toon, gebruik12tje, hashtagsToevoegen, extraContext } = formData

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
- De ideale reactie van de lezer: "Interessant, dit herken ik." of "Hier moet ik even iemand van VDT over bellen."`
}

export function buildNewsletterPrompt(formData) {
  const { onderwerp, pijler, doelgroep, typeNieuwsbrief, extraContext } = formData
  const pijlerKleur = {
    'Praktijkinzichten': '#2FA766',
    'Praktijkcases': '#007F81',
    'Netwerk & Events': '#E74049',
    'Mensen achter VDT': '#F4C200',
  }[pijler] || '#2FA766'

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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message || 'Er ging iets mis bij Gemini.'
    throw new Error(msg)
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

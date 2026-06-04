const BRAND_SYSTEM_PROMPT = `Je bent de contentschrijver van VDT Advocaten (Tilburg, sinds 1994). Je schrijft altijd volgens de volgende merkrichtlijnen:

IDENTITEIT
- Payoff: "Onderneemt met je mee."
- Positionering: legal businesspartner voor het MKB. Geen stoffig advocatenkantoor, maar een meedenkende partner.
- Visie: voorkomen in plaats van oplossen. "Wat niet fout gaat, hoef je ook niet op te lossen."

DOELGROEP
- MKB-ondernemers en DGA's in Nederland.
- Schrijf altijd vanuit het perspectief van de ondernemer, nooit vanuit VDT zelf.

KERNWAARDEN (B.O.E.F.J.E.)
- Betrokken, Ondernemend, Eerste klas kwaliteit, Fun, Jezelf verbeteren.
- Identiteit: outlaw — net even anders dan traditionele advocatuur.

TONE OF VOICE
- Informeel, je/jij-vorm (nooit 'u').
- Helder en menselijk: geen juridisch jargon.
- Verrassend en prikkelend, met een knipoog. "Stand out from the boring crowd."
- Professioneel en stijlvol — gewaagd mag, slordig nooit.

HET 1-2-TJE (signatuur tekstconcept)
- Tegenstelling tussen "Jij…" en "Wij…": klant is de held, VDT neemt het probleem weg.
- Voorbeelden: "Jij verlegt grenzen — Wij kijken alvast vooruit." / "Voor jou de grote plannen — Voor ons de kleine lettertjes."
- Gebruik smaaktvol als hook of afsluiter.

FILOSOFIE VAN DRIE (pijlers)
- Bedrijf (Structure) — juridisch framework & governance — kleur rood #E74049
- Business — compliance & commerciële processen — kleur teal #007F81
- Mensen (People) — personeel & arbeid — kleur geel #F4C200

MARKETINGREGELS
1. Laad het merk met B.O.E.F.J.E.-waarden.
2. Wees onderscheidend, niet generiek.
3. Geef altijd iets: info, een lach, een uitnodiging. Praat zo min mogelijk over VDT zelf.
4. Topkwaliteit, stijlvol, foutloos.

DO's
- Je-vorm, helder, waarde voor de lezer.
- 1-2-tje en Filosofie van Drie waar passend.
- Zachte CTA afsluiting (bijv. "Bakje koffie? Let's go", demo, vrijblijvend gesprek max 15 min).
- Kort en scanbaar op LinkedIn.

DON'Ts
- Geen juridisch jargon.
- Geen harde garanties over uitkomsten van zaken.
- Geen concrete juridische advisering.
- Niet opschepperig over VDT zelf.
- Geen prijzen (tenzij aangeleverd, dan altijd "excl. btw").
- Geen namen van teamleden tenzij gebruiker die invoert.
- Niet stoffig, formeel of "geachte heer/mevrouw".`

export function buildLinkedInPrompt(formData) {
  const { onderwerp, pijler, toon, gebruik12tje, hashtagsToevoegen, extraContext } = formData
  return `Schrijf een LinkedIn-post voor VDT Advocaten over het volgende onderwerp:

Onderwerp / thema: ${onderwerp}
Pijler: ${pijler}
Toon: ${toon}
1-2-tje gebruiken: ${gebruik12tje ? 'Ja' : 'Nee'}
Hashtags toevoegen: ${hashtagsToevoegen ? 'Ja' : 'Nee'}
${extraContext ? `Extra context / trefwoorden: ${extraContext}` : ''}

Vereisten:
- Een pakkende openingszin (hook) die direct aandacht trekt
- Een duidelijke boodschap in max 5 alinea's
${gebruik12tje ? '- Gebruik het 1-2-tje als hook of afsluiter (Jij… / Wij… formaat)' : ''}
- Een zachte CTA aan het einde (bijv. "Bakje koffie? Let's go", "Plan een vrijblijvend gesprek van 15 min")
${hashtagsToevoegen ? '- Voeg 3-5 relevante hashtags toe aan het einde' : ''}
- Maximum 1300 tekens
- Schrijf in de juiste tone of voice van VDT Advocaten`
}

export function buildNewsletterPrompt(formData) {
  const { onderwerp, pijler, typeNieuwsbrief, doelgroep, extraContext } = formData
  const pijlerKleur = { Bedrijf: '#E74049', Business: '#007F81', Mensen: '#F4C200', Algemeen: '#2FA766' }[pijler] || '#2FA766'
  return `Schrijf een volledige e-mailnieuwsbrief voor VDT Advocaten over het volgende onderwerp:

Onderwerp / thema: ${onderwerp}
Pijler: ${pijler} (accentkleur: ${pijlerKleur})
Type nieuwsbrief: ${typeNieuwsbrief}
Doelgroep: ${doelgroep}
${extraContext ? `Extra context: ${extraContext}` : ''}

Lever het volgende aan:

1. ONDERWERPREGEL: Een pakkende onderwerpregel voor de e-mail
2. PREHEADER: Preheader tekst (max 90 tekens)
3. HTML E-MAIL BODY: Schrijf een volledige HTML e-mail met de volgende kenmerken:
   - Clean HTML met uitsluitend inline styles (geen externe CSS, geen <style> blokken)
   - Maximale breedte 600px, gecentreerd
   - Witte achtergrond (#ffffff)
   - Header met VDT groene achtergrond (#2FA766), witte tekst, "VDT Advocaten" als logo-tekst en de payoff "Onderneemt met je mee."
   - Gebruik ${pijlerKleur} als accentkleur voor de pijler ${pijler}
   - Leesbare body font: Arial of sans-serif, 16px, #333333
   - Een duidelijke CTA-knop onderaan in het groen (#2FA766) met witte tekst
   - Footer met: Hart van Brabantlaan 500, 5038 JA Tilburg · 013-544-0400 · lovetilburg@vdt-advocaten.nl
   - Footer achtergrond lichtgrijs (#f5f5f5), kleine tekst (#888888)
   - Schrijf in de tone of voice van VDT Advocaten

Geef je antwoord in dit exacte formaat:
ONDERWERPREGEL: [onderwerpregel hier]
PREHEADER: [preheader hier]
HTML:
[volledige HTML hier]`
}

export async function generateContent(apiKey, type, formData) {
  const prompt = type === 'linkedin' ? buildLinkedInPrompt(formData) : buildNewsletterPrompt(formData)
  const fullPrompt = `${BRAND_SYSTEM_PROMPT}\n\n---\n\n${prompt}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message || 'Er ging iets mis bij Gemini.'
    throw new Error(msg)
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

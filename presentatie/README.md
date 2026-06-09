# VDT Klantreis – Presentatie

Professionele presentatie voor het klantteam van VDT over de nieuwe klantreis
**"Van Dossier naar Ondernemerschap"**.

## Bestanden
- `VDT_Klantreis_Presentatie.pptx` — de presentatie (16:9, 17 slides).
- `scripts/build_klantreis_ppt.py` — generator-script (python-pptx) waarmee de
  presentatie reproduceerbaar wordt opgebouwd.

## Inhoud (17 slides)
1. Titel
2. Doel van deze presentatie + toon
3. De kernboodschap
4. Waarom deze klantreis? (dossier- vs ondernemersrelatie)
5. De filosofie: vijf principes
6. De vijf fases — tijdlijn
7–11. Per fase: doel, werkwijze, kernwoorden uit de mails en gewenst resultaat
12. Iedere klant komt hetzelfde binnen — onboarding & segmentatiecriteria
13. De rolverdeling (secretaresse · klantteam · advocaat)
14. De Legal MRI
15. De workflow in BaseNet
16. De kracht zit in het systeem
17. Afsluiting — de quote

## Bronnen
- `VDT_Klantreis_V2.docx`
- `Conceptmails_onboarding_nieuwe_klanten_alle_fases.docx`

Visuele identiteit (merkkleuren) gebaseerd op vdt-advocaten.nl:
teal `#007F81`, groen `#2FA766`, rood `#E74049`, geel `#F4C200`.

## Opnieuw genereren
```bash
pip install python-pptx
python3 scripts/build_klantreis_ppt.py
```

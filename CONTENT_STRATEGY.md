# DarMRE — Content Strategy 2026

## Mission
Become the #1 trusted source for Moroccans (local + diaspora) searching for mortgage information in Morocco — answering every question before they ask a bank.

---

## Target Personas

| Persona | Location | Goal | Pain Point |
|---------|----------|------|------------|
| **MRE François** | Paris, France | Buy apartment in Casablanca | Doesn't know which bank accepts foreign payslips |
| **MRE Amina** | Montreal, Canada | Invest in Marrakech riads | Confused by Dirham Convertible rules |
| **Résident Khalid** | Casablanca | First-time buyer | Overwhelmed by bank paperwork |
| **Investisseur Mehdi** | Dubai → MA | Buy villa in Agdal | Needs pre-approval letter for agent |

---

## Phase 1 Power Articles (20 articles, Months 1-4)

### Category: MRE Guides (8 articles)

1. **Comment ouvrir un compte Dirham Convertible depuis la France en 2026**
   - Target: "compte dirham convertible depuis france"
   - Semantic intent: How-to, step-by-step
   - Word count: 2,000+
   - Table: Comparison of 5 banks offering remote account opening

2. **Dossier de crédit MRE : liste complète des documents requis**
   - Target: "documents credit immobilier MRE maroc"
   - Table: Documents by bank (Attijariwafa, BCP, CIH, BMCE)

3. **Combien puis-je emprunter avec un salaire de 3 000 € au Maroc ?**
   - Target: "combien emprunter maroc 3000 euros salaire"
   - Featured: DTI calculator embedded
   - Table: Amount by salary bracket (2K€, 3K€, 5K€, 8K€)

4. **MRE Canada : financer un bien au Maroc depuis Montréal**
   - Target: "credit immobilier maroc depuis canada"

5. **MRE Espagne : guide complet crédit immobilier Maroc**
   - Target: "prestamo hipotecario marruecos desde españa"

6. **Comment transférer de l'argent au Maroc pour un achat immobilier ?**
   - Target: "transfert argent maroc immobilier"
   - Table: Wise vs. Western Union vs. SWIFT — fees & timing

7. **Rachat de crédit immobilier au Maroc : est-ce rentable en 2026 ?**
   - Target: "rachat credit immobilier maroc"

8. **Lettre de pré-approbation bancaire : comment l'obtenir au Maroc ?**
   - Target: "lettre pre-approbation credit maroc"

---

### Category: Rate & Market Analysis (5 articles)

9. **Taux immobilier Maroc 2026 : évolution et prévisions**
   - Target: "taux immobilier maroc 2026"
   - Updated: Monthly
   - Table: Monthly rate evolution 2024-2026

10. **Taux fixe vs variable au Maroc : que choisir en 2026 ?**
    - Target: "taux fixe variable maroc avantages inconvenients"

11. **Baisse des taux BAM : impact sur les crédits immobiliers marocains**
    - Target: "baisse taux bank al-maghrib credit immobilier"

12. **Quand renégocier son crédit immobilier au Maroc ? Le guide 2026**
    - Target: "renégocier credit immobilier maroc"

13. **Taux immobilier en France vs Maroc : où est-il moins cher d'acheter ?**
    - Target: "taux immobilier france maroc comparaison"

---

### Category: Practical Guides (7 articles)

14. **Frais de notaire immobilier au Maroc : tout ce qu'il faut savoir**
    - Target: "frais notaire immobilier maroc"
    - Table: All fees breakdown (1% notary + 3% registration + TVA)

15. **Apport personnel minimum pour un crédit au Maroc en 2026**
    - Target: "apport personnel minimum credit maroc"
    - LTV table by bank and resident type

16. **Assurance MRH au Maroc : obligatoire ? Comment choisir ?**
    - Target: "assurance MRH maroc credit immobilier"

17. **Acheter un appartement à Casablanca : guide de financement 2026**
    - Target: "acheter appartement casablanca financement"

18. **Simulation crédit 1 000 000 MAD : toutes les banques comparées**
    - Target: "simulation credit 1 million MAD maroc"
    - Embedded: Simulator pre-filled at 1M MAD

19. **Taux d'endettement maximum au Maroc : règle des 40%**
    - Target: "taux endettement maximum credit maroc"

20. **Remboursement anticipé d'un crédit immobilier au Maroc : pénalités et calcul**
    - Target: "remboursement anticipe credit immobilier maroc"

---

## Content Architecture (SEO/AEO Optimization)

### Article Template Structure

```markdown
# [Natural Language H1] — e.g., "Comment un MRE peut-il obtenir un crédit immobilier au Maroc en 2026 ?"

**Résumé rapide** (3 bullet points — optimized for AI snippet extraction)
- ✅ Taux entre 4.50% et 5.50%
- ✅ Durée max 25 ans pour résidents, 20 ans pour MRE
- ✅ Documents requis : 3 mois de relevés + contrat de travail

## H2: Ce que vous allez apprendre
[Context paragraph]

## H2: [Main Section]
### H3: [Sub-section]

| Colonne A | Colonne B | Colonne C |   ← AI agents LOVE tables
|-----------|-----------|-----------|

## H2: Questions fréquentes
[FAQ — maps to FAQPage schema]

## H2: Avis d'expert
[E-E-A-T section with reviewer bio]

---
*Vérifié par [Name], [Role], [Date]*
```

### AEO Signals Implemented

1. **Machine-readable summary boxes** — `<aside aria-label="Résumé">` with bullet points
2. **Comparison tables** — updated weekly, with `<caption>` tags
3. **Clear headings** — natural language H1/H2/H3, not keyword-stuffed
4. **JSON-LD** — FAQPage, FinancialProduct, ItemList schemas
5. **Author E-E-A-T** — reviewer bios with credentials on every article
6. **robots.txt** — explicitly allows GPTBot, Claude-Web, PerplexityBot
7. **Canonical URLs** — prevent duplicate content across language variants

---

## Multi-country URL Strategy

```
dar-mre.ma/fr/               → Francophone (default)
dar-mre.ma/ar/               → Arabic
dar-mre.ma/en/               → English

dar-mre.ma/fr/taux-immobilier-maroc-mre
dar-mre.ma/en/mortgage-rates-morocco-mre
dar-mre.ma/ar/معدلات-القروض-العقارية-المغرب

# Country-specific landing pages
dar-mre.ma/fr-fr/            → France audience
dar-mre.ma/fr-ma/            → Morocco francophone
dar-mre.ma/en-us/            → US/Canada MRE
dar-mre.ma/en-gb/            → UK MRE
```

---

## Monetization Milestones

### Month 1-4: Lead-Gen & Authority
- [ ] 20 Power Articles published (2/week cadence)
- [ ] Affiliate links live on all bank CTAs (UTM tracked)
- [ ] Google AdSense approved (fintech CPM: €8-15)
- [ ] Weekly newsletter: "Taux de la semaine" (Mailchimp/Beehiiv)
- [ ] Target: 5,000 monthly visitors, 50 affiliate clicks

### Month 5-9: Verified Lead Business
- [ ] User profile system (Clerk Auth)
- [ ] Payslip upload → AI DTI extraction (Claude API)
- [ ] Lead scoring dashboard for banks
- [ ] Partnership with Attijariwafa, BCP, CIH
- [ ] Target: 100 verified leads/month @ 500 MAD = 50,000 MAD/month

### Year 1+: Digital Broker
- [ ] Full digital application flow
- [ ] API integration with bank systems
- [ ] Pre-approval letter PDF generator
- [ ] Target: 10 closed loans/month @ 0.5% = 100,000+ MAD/month

---

## KPIs Dashboard

| Metric | Month 3 Target | Month 6 Target | Year 1 Target |
|--------|---------------|----------------|---------------|
| Organic sessions | 5K | 20K | 100K |
| Email subscribers | 500 | 2K | 10K |
| Affiliate clicks | 200 | 1K | 5K |
| AdSense revenue | €200 | €800 | €3K/month |
| Verified leads sold | 0 | 50 | 300 |
| Loan commissions | 0 | 0 | 50K MAD/month |

---

## Technical SEO Checklist

- [x] Next.js App Router with SSG for blog (fast TTFB)
- [x] Dynamic sitemap.xml with 100+ URLs
- [x] Hreflang tags for fr-FR, fr-MA, en-US, en-GB, ar-MA
- [x] JSON-LD: FAQPage, FinancialProduct, WebSite, Organization
- [x] robots.txt with AI crawler allowlist
- [x] Semantic HTML5 (article, section, nav, aside, main)
- [x] ARIA labels on all interactive components
- [x] Core Web Vitals: target LCP < 1.5s on Vercel Edge
- [ ] Image optimization with next/image + WebP
- [ ] Schema: BreadcrumbList on all inner pages
- [ ] Google Search Console verification
- [ ] Bing Webmaster Tools

---

*Last updated: March 31, 2026 | DarMRE Content Team*

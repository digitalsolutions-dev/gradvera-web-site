# Gradvera Confirmed Acquisition Model

**Status:** Confirmed baseline for implementation  
**Version:** 1.1 (as built — see §21 changelog)  
**Date:** 18 August 2026 (v1.0); 19 August 2026 (v1.1)  
**Scope:** Inbound acquisition preparation, Google Search Ads validation, qualified-demo conversion, customer-specific preview, and annual onboarding

---

## 1. Purpose

This document is the working specification for Gradvera's first repeatable inbound acquisition model. It consolidates the decisions made after cold outbound failed to produce replies and defines what must be implemented, measured, and validated before Gradvera increases advertising investment.

The model is deliberately staged. Gradvera will invest only enough to answer the next commercial question, review the evidence, and then either continue, change the offer, or stop.

This is not yet a scaling plan. Its purpose is to find a credible path to the first proof-generating customers.

---

## 2. Confirmed strategic decisions

1. **Primary acquisition motion:** high-intent inbound, beginning with Google Search Ads.
2. **First market:** the Netherlands.
3. **Second market:** one Nordic country, selected only after the Netherlands test produces useful evidence.
4. **Initial sales language:** English. A Dutch landing page and advertisement set will be added if keyword research or campaign performance shows that English limits demand or conversion.
5. **Primary conversion:** a qualified demo request, followed immediately by the ability to book a meeting.
6. **No self-service free trial:** the product's value depends on historical company data and onboarding. An empty account or superficial trial would underrepresent the product.
7. **No full customer-data pilot before commitment:** importing the complete 100-BoQ knowledge base requires a signed annual agreement.
8. **Limited customer-specific preview:** up to 20 Excel BoQ files, only after qualification and an NDA, capped at two previews per week.
9. **Initial demo:** a guided demonstration using Gradvera's stable fictional/sample tenant. The sample must be clearly presented as sample data, not as a customer case study.
10. **Video:** not required before advertising begins. One short product video may be produced later after real search and demo data identify the strongest message.
11. **Booking infrastructure:** use the existing Microsoft Bookings page and embed it into Gradvera's website. A separate `gradvera.app` booking flow is deferred.
12. **Proof claims:** remove or rewrite the unsupported “real results” claims. The figures 82%, 5× and 95% cannot be presented as measured customer results.
13. **Campaign scope:** begin with Google Search only. Do not initially use Display, YouTube, Performance Max, broad awareness campaigns, or “free trial” messaging.
14. **Investment method:** every phase has an explicit expenditure cap, evaluation window, and go/no-go gate.

---

## 3. Product and commercial facts

### 3.1 Production-ready product capabilities

The following capabilities are operational today:

- Excel BoQ import
- Line-item normalization and matching
- Estimate-structure suggestions
- Suggested line items
- Historical price recommendations
- Source-project and confidence explanations
- Price and cost risk review
- Subcontractor quote requests
- Subcontractor portal
- Offer-revision comparison
- Margins and norms
- Management analytics
- Multi-user permissions
- Multilanguage application support

Current input limitation: **Excel only**. Advertising and website copy must not imply that PDF, scanned-document, or unrestricted document ingestion is available.

### 3.2 Data requirements

- Approximately 100 historical BoQ documents are required for the initial knowledge base and useful historical recommendations.
- A typical document contains more than 100 line items.
- The files do not necessarily need to come from the same project type or construction discipline.
- A 20-file dataset can provide an indicative customer-specific preview, but it is not equivalent to the full production setup and may produce lower-confidence recommendations.
- The conservative operational estimate is up to 10 minutes per BoQ, including validation and correction. Much of the current import is automated, but this has not yet been instrumented on a representative 100-file onboarding.
- One person is currently available for import exceptions and quality assurance.

### 3.3 Commercial model

| Item | Current position |
|---|---|
| Professional licence | Approximately €399 per named user per month |
| Starter licence | Approximately €99 per named user per month |
| Smallest practical customer | One Professional licence; a Professional user can also estimate |
| Typical team | At least one Professional user plus one or more Starter/Estimator users |
| Contract term | Annual agreement |
| Full onboarding | Begins only after the annual agreement is signed |
| Onboarding fee | Accepted in principle; amount and crediting policy remain to be finalized |
| Evaluation | Fourteen-day acceptance/evaluation period after onboarding, not a free trial |

The packaging remains subject to market feedback. Public copy must not state that every customer must buy both licence types or that €498 per month is the universal minimum.

---

## 4. Ideal-customer hypothesis

The current ICP is a hypothesis, not a proven segment.

### 4.1 Initial target

- Construction businesses operating in the Netherlands
- Preferably 30 or more employees
- Regular tender, bid, or cost-estimating activity
- Historical BoQs stored primarily in Excel
- Enough historical estimates to build a meaningful knowledge base
- Decision-makers such as directors, project managers, commercial managers, or estimating leaders
- A visible need for pricing-confidence review, historical-price reuse, or subcontractor transparency

### 4.2 Strongest currently observed interests

The two most promising value areas from early conversations are:

1. A transparent overview of subcontractor requests and quotations
2. A risk review showing the total bid value represented by low-confidence pricing items

The second point must be described accurately. “Value requiring pricing review” means the total value of low-confidence items. It is **not** an estimate of expected loss, financial exposure, or money that will necessarily be lost.

### 4.3 Initial exclusions

The campaigns should not optimize for:

- Students, job seekers, or training seekers
- Consumers looking for construction calculators
- Visitors looking only for free templates or spreadsheets
- Businesses without recurring estimating work
- Businesses unwilling or unable to use historical Excel BoQs
- Vendors trying to sell services to Gradvera

---

## 5. Confirmed acquisition journey

```text
High-intent Google search
        ↓
Netherlands landing page
        ↓
Qualified demo form
        ↓
Embedded Microsoft Bookings calendar
        ↓
Guided demo using sample data
        ↓
Fit decision
        ↓
Optional NDA + 20-file customer-specific preview
        ↓
Annual agreement + onboarding terms
        ↓
Import of approximately 100 historical BoQs
        ↓
14-day acceptance/evaluation period
        ↓
Live customer and proof-generation programme
```

The 20-file preview is a controlled sales tool, not a public free trial, entitlement, or default step for every lead. It should be offered only when the expected deal value and buying intent justify the operational effort.

---

## 6. Positioning and claims policy

### 6.1 Initial positioning

The recommended primary message is:

> Use your historical estimates to review pricing confidence, reuse relevant knowledge, and prepare more consistent construction bids.

Supporting messages:

- See which bid items require pricing review.
- Trace recommendations back to source projects and confidence information.
- Compare offer revisions and identify changes.
- Centralize subcontractor requests and quotations.
- Apply company-specific margins and norms consistently.
- Give managers visibility into estimating activity and risk.

The message should lead with the business workflow and decision quality. “AI” may explain how Gradvera works, but it should not be the primary reason to buy.

### 6.2 Prohibited or restricted claims

Until verified through real customer evidence, do not claim:

- “Measured in practice” or “real customer results”
- 82%, 5×, or 95% as achieved performance
- Guaranteed time savings, accuracy, margin improvement, or return on investment
- That the total value of low-confidence items is expected loss or financial exposure
- Support for file formats that are not operational
- A free trial
- Named or implied customers without permission

### 6.3 Modeled business-impact calculator

A calculator may later replace the unsupported results section if:

- Inputs are entered by the visitor or transparently displayed.
- The calculation method is documented.
- Outputs are labeled “modeled scenario” or “potential impact.”
- No output is presented as a measured Gradvera customer result.

Until the calculator is ready, use qualitative product outcomes and real product screenshots.

---

## 7. Website specification

### 7.1 Immediate website changes

Before paid traffic begins:

1. Remove or rewrite the unsupported “real results” section.
2. Replace ambiguous “EUR at risk” language with “bid value requiring pricing review” or “value of low-confidence pricing items.”
3. Remove every free-trial reference.
4. Make the relationship clear: **“Gradvera is a product of DIGITAL SOLUTIONS d.o.o.”**
5. State that the supported input is Excel BoQ files.
6. Present the annual onboarding route clearly enough that visitors do not expect an instant self-service product.
7. Add a focused Netherlands acquisition landing page. *(As built: market-neutral slug `/construction-estimating-software/` — English-only, indexed, hreflang `en` + `x-default`; "Netherlands" appears in the title, eyebrow and copy, not in the URL, so the same page can serve the later Nordic test via ad targeting; a Dutch page would live under `/nl/`.)*
8. Add real screenshots from the stable sample tenant.
9. Connect the qualification form to the embedded Microsoft Bookings flow.
10. Add the required attribution fields and verify analytics and consent behavior.

### 7.2 Initial landing-page structure

Use one focused page for the first campaign rather than creating several thin pages before search demand is understood.

1. **Hero:** problem, product outcome, and “Book a demo” CTA
2. **Who it is for:** construction teams managing recurring bids and historical Excel estimates
3. **Primary pain:** pricing confidence and overlooked bid value
4. **Secondary pain:** fragmented subcontractor quotations
5. **How it works:** import, structure/match, review, prepare/manage
6. **Product evidence:** real screenshots from the sample tenant
7. **Capabilities:** short workflow-focused list
8. **Data and trust:** tenant isolation, data use, GDPR position (application tenants are hosted in the EU — confirmed 19 Aug 2026), and NDA availability
9. **Evaluation process:** demo, optional qualified preview, annual onboarding
10. **Commercial context:** annual plans; exact price display can be tested
11. **FAQ:** data volume, Excel support, onboarding, security, preview, languages
12. **Final CTA:** qualified demo request and booking

### 7.3 No video requirement

The initial page will use screenshots and a concise three-step explanation. Video production is deferred until one of these evidence thresholds is reached:

- 100–200 relevant landing-page visits, or
- 5–10 qualified demo requests.

The later video should emphasize the pain and workflow that actual campaign and demo evidence show to be strongest.

---

## 8. Qualification form and lead scoring

### 8.1 Required fields

The form should remain short enough for paid traffic while collecting enough information to reject obvious poor-fit leads.

- Name
- Business email
- Company
- Country
- Role
- Approximate company size
- Main challenge
- Current estimating method — *optional (v1.1)*
- Approximate bid/estimate frequency — *optional (v1.1)*
- Willingness to discuss historical Excel BoQs under NDA — *optional (v1.1)*
- Phone number: optional
- Free-text message ("Anything else?") — optional

*v1.1 note:* the three optional qualifiers were made optional to keep the form short for paid traffic; the §8.2 threshold (7) is still reachable from the required fields alone (Netherlands +2, decision role +2, ≥30 employees +2, core pain +2 = 8). Blank optional fields score 0. The wire values are the enum slugs listed in `docs/lead-integration.md` §1.

### 8.2 Operational lead score

This scoring model is the initial default and must be recalibrated after real lead data is available.

| Signal | Score |
|---|---:|
| Netherlands-based company | +2 |
| 30 or more employees | +2 |
| Director, project manager, commercial manager, or estimating leader | +2 |
| Recurring bid/estimating activity | +2 |
| Uses Excel and has historical BoQs | +2 |
| Pricing-confidence or subcontractor-management pain | +2 |
| Prepared to discuss data under NDA | +2 |
| Personal email without verifiable company | −2 |
| Student, job seeker, free-template intent, or vendor solicitation | −5 |

**Initial qualification threshold:** 7 points.  
**Human override:** permitted, with the reason recorded.

*As built (v1.1):* the score is computed server-side (`src/lib/leadScore.ts`), stored on the lead (`score`, `scoreReasons`, `qualified`) and returned to the browser (`{qualified, score}`) so `qualified_lead` can be pushed to the dataLayer. The −5 signal is a human-review action, not code. The −2 freemail signal uses a fixed consumer-domain list.

Lead scoring is for routing and analysis. It should not automatically promise or deny a preview without a human review.

### 8.3 Attribution captured with every lead

The form and lead record must preserve:

- `gclid`
- `gbraid` and `wbraid`, when present
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- First landing page
- First referrer
- Submission page
- Submission timestamp
- Locale
- Consent state where applicable

These values should be stored with the lead, not only sent to analytics.

*As built (v1.1):* captured on the first page of the browsing session into `sessionStorage` (no cookie; first touch wins), merged into the form POST and forwarded to gtm-toolkit under `attribution{}` (contract v2, `docs/lead-integration.md`). The deployed gtm-toolkit v1 receiver ignores the new keys (`extra="ignore"`) until its v2 change lands — until then the synthesized `message` digest carries the qualification into the D365 subject.

---

## 9. Booking specification

### 9.1 Phase 1 booking system

Use the existing Microsoft Bookings page:

`https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled`

Embed it into the website's “Book a demo” section after a successful qualification-form submission. Also provide a direct-link fallback for visitors whose browsers block the embedded calendar.

### 9.2 Booking-page configuration

- Gradvera logo and brand styling
- Service title: “Gradvera estimating workflow demo”
- Duration: 30 minutes
- Recommended buffer: 15 minutes
- Short explanation of what the meeting covers
- Gradvera/DIGITAL SOLUTIONS relationship disclosed
- Public booking without requiring an organizational Microsoft account
- Confirmation and reminder emails enabled
- Customer time zone displayed correctly
- Search indexing disabled
- Appropriate data-use/privacy wording

The iframe should be lazy-loaded after form success or explicit visitor interaction. This improves page performance and avoids loading the third-party booking component unnecessarily.

### 9.3 Booking attribution

Use a campaign reference identifier in the booking link when practical. Because the existing URL already contains a query parameter, append the identifier with `&`, for example:

```text
https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled&RefID=google-search-nl
```

Use campaign-level identifiers only. Never place a prospect's name, email address, company, or other personal data in the booking URL.

*As built (v1.1):* `RefID` = the sanitized first-touch `utm_campaign` (lowercase `[a-z0-9_-]`, ≤ 40 chars) or the page default `website-demo-<locale>` / `website-lp`; the iframe is loaded only after a successful form submit and the direct link is always visible.

### 9.4 Measurement limitation

The Gradvera website cannot reliably observe a completed booking inside a Microsoft-hosted cross-domain iframe through ordinary parent-page analytics.

During the validation stage:

- Track the successful qualification-form submission.
- Track the reveal/opening of the booking component.
- Reconcile actual bookings manually from Microsoft Bookings using the lead's email address.
- Record attendance and commercial status in the lead register.

Automated synchronization, Power Automate, a CRM connection, or offline conversion import should be added only after volume makes manual reconciliation unreliable or time-consuming.

### 9.5 Deferred booking-domain decision

`gradvera.app` is not a prerequisite for advertising. Consider it later if the Digital Solutions identity, duplicate data entry, tracking limitation, or booking experience demonstrably harms conversion or brand trust.

---

## 10. Demo and customer-specific preview

### 10.1 Standard guided demo

The default demo uses the stable fictional/sample tenant and lasts approximately 30 minutes:

1. **Discovery — 5 minutes:** workflow, bid volume, team, historical data, and main pain
2. **Relevant product workflow — 15 minutes:** show only the capabilities connected to the prospect's problem
3. **Data and implementation — 5 minutes:** Excel files, knowledge-base requirement, security, NDA, and annual onboarding
4. **Next-step decision — 5 minutes:** no fit, commercial follow-up, or qualified preview

Do not provide the same generic product tour to every prospect. The discovery answers determine whether the demo emphasizes pricing-confidence review, subcontractor quotations, historical-price reuse, or management visibility.

### 10.2 Twenty-file preview

The preview is governed as follows:

- Maximum 20 Excel BoQ files
- NDA completed before receiving customer data
- Available only after commercial and technical qualification
- Maximum two previews per week across the company
- Explicitly described as indicative and based on a limited dataset
- No promise that it will equal the confidence or coverage of the full 100-file setup
- Clear success question agreed before work begins
- Human approval required before the preview is offered

The preview's purpose is to resolve a specific buying uncertainty, not to deliver a free implementation.

### 10.3 Full onboarding and acceptance

- A signed annual agreement is required before the full approximately 100-BoQ import begins.
- Onboarding terms and any fee must be agreed commercially.
- The Professional user receives setup guidance.
- The customer receives a 14-day acceptance/evaluation period after onboarding.
- The acceptance period is not advertised as a free trial.
- Reasons for acceptance, delay, or rejection must be recorded for product and sales learning.

---

## 11. Analytics and conversion model

### 11.1 Required events

| Event | Meaning | Initial use |
|---|---|---|
| `landing_page_view` | Paid visitor reached the correct page | Diagnostic |
| `qualification_form_start` | Visitor interacted with the form | Diagnostic |
| `qualification_form_submit` | Valid form submitted | Initial Google Ads conversion |
| `qualified_lead` | Lead passed scoring/human review | Sales KPI; later ad optimization |
| `booking_widget_open` | Booking calendar was revealed | Diagnostic |
| `demo_booked` | Booking verified in Microsoft Bookings | Funnel KPI |
| `demo_attended` | Prospect attended | Sales KPI |
| `qualified_opportunity` | Real fit and buying process confirmed | Later offline conversion |
| `preview_started` | NDA and 20-file preview began | Capacity and funnel KPI |
| `annual_agreement_signed` | Customer contract signed | Revenue conversion |
| `onboarding_accepted` | Customer passed acceptance | Customer-success KPI |

### 11.2 Conversion hierarchy

At launch, the website's successful form submission is the primary technical Google Ads conversion because it is observable and attributable. Internally, however, Gradvera must judge campaign quality using qualified leads, booked demos, attended demos, and opportunities—not raw forms alone.

Once sufficient volume and reliable reconciliation exist, optimization should move deeper:

1. Form submission
2. Qualified lead
3. Booked or attended demo
4. Qualified opportunity
5. Signed annual agreement

Do not configure button clicks, page views, or booking-widget opens as primary conversions.

*As built (v1.1):* the website pushes `qualification_form_start`, `qualification_form_submit {qualified, score}`, `qualified_lead` (when qualified) and `booking_widget_open {ref}`; `generate_lead` (2026-08-05) is retired. GTM/GA4/Ads configuration and the §11.3 verification are user actions tracked in `docs/acquisition-readiness.md`; see `docs/lead-tracking-ga4.md`.

### 11.3 Consent and verification

GA4/GTM and Consent Mode must be tested before advertising:

- Before a consent choice
- After rejection
- After acceptance
- On form submission
- On booking-widget reveal
- With UTM and Google click identifiers present
- Across the final landing-page domain and booking flow

The test must confirm both that restricted tags do not fire prematurely and that permitted events fire once, with the correct parameters.

---

## 12. Google Search Ads launch model

### 12.1 Campaign scope

- One country: Netherlands
- Initial language: English
- Search network only
- Location setting: people present in the target market, not merely interested in it
- One focused landing page
- Exact and phrase match at launch
- Small number of tightly related ad groups
- No Display expansion, Performance Max, broad match, or automated market expansion during validation

### 12.2 Initial search themes

Final keywords must be validated in Keyword Planner before setup. The initial themes are:

1. Construction estimating software
2. Construction bid/tender estimating software
3. BoQ estimating and historical price management
4. Construction bid risk or estimate review
5. Subcontractor quotation management for estimating teams

Generic “AI construction” terms should not lead the initial budget because they may indicate research interest rather than software-buying intent.

### 12.3 Initial negative-keyword themes

- Jobs, vacancies, salary, career
- Course, training, certification, school, student
- Free, template, sample, PDF, download
- Calculator, formula, definition, meaning
- Residential consumer estimates and home-renovation quotes
- Unrelated bidding, auctions, gambling, and procurement notices
- Software development or AI-development services

Search-term reports must be reviewed frequently during the first two weeks and negative keywords expanded from actual traffic.

### 12.4 Advertisement rules

Ads should:

- Name the construction estimating context clearly.
- Lead with pricing review, historical-estimate reuse, or subcontractor transparency.
- Use “Book a demo” or “See the workflow” as the CTA.
- Mention Excel history where it improves qualification.
- Send every advertisement to the matching acquisition page.

Ads must not:

- Promote a free trial.
- use unsupported percentages or speed claims.
- Imply customer adoption that does not exist.
- Promise guaranteed savings or risk reduction.
- Use “free customer-data analysis” as a blanket offer.

---

## 13. Phased investment and decision gates

Budgets are caps, not spending targets. Actual spend should be based on validated click prices and stopped early when evidence is clearly negative.

### Phase 0 — Foundation and measurement

**Paid-media budget:** €0  
**Purpose:** ensure paid traffic can be understood and converted.

Deliverables:

- Claims and terminology corrected
- Netherlands landing page complete
- Screenshots and sample demo tenant ready
- Qualification form and scoring implemented
- Attribution stored with leads
- Microsoft Bookings embedded and branded
- Analytics, Google Ads conversion, and consent verified
- Lead register and sales stages operating
- NDA and preview decision process ready

**Gate to Phase 1:** a complete test lead can travel from an attributed landing-page visit through form submission and booking, and the team can see the source, qualification details, booking, and follow-up status.

### Phase 1 — Search-quality smoke test

**Suggested cap:** enough to acquire approximately 30–50 high-intent clicks; provisionally €500–€1,000  
**Suggested duration:** two to three weeks

Questions:

- Do relevant Netherlands searches exist at usable volume?
- Do the selected terms produce buyer-like search queries?
- Do prospects engage with the page and form?

Initial diagnostic controls:

- At least 70% of paid search clicks should come from commercially relevant queries.
- Search click-through rate should normally be at least 4%, interpreted by keyword and position.
- Form-start behavior should be visible among relevant visitors.
- At least one credible qualified lead is a positive signal, not yet proof of economics.

**Continue:** search terms are relevant and qualified buying behavior appears.  
**Revise:** terms are relevant but page/form engagement is weak.  
**Stop:** traffic is predominantly informational or irrelevant after keyword and negative-keyword corrections.

### Phase 2 — Conversion validation

**Suggested additional cap:** €1,000–€2,000  
**Suggested duration:** four to six weeks or until approximately 80–120 additional relevant clicks are collected

Questions:

- Can paid search repeatedly generate qualified demo requests?
- Do form submitters book and attend?
- Are prospects commercially and technically suitable?

Provisional evidence gate:

- At least three qualified demo requests
- At least two booked demos
- Search-term relevance maintained
- Clear objections and lead-quality findings recorded
- No unmanageable preview/onboarding burden

Cost per form alone is not a sufficient success measure. The phase is judged on qualified and attended conversations.

### Phase 3 — Message and language optimization

Entered only after Phase 2 produces credible demand.

Possible investments:

- Dutch keyword and advertisement research
- Professionally reviewed Dutch landing page and advertisement set
- Short product video based on proven prospect interest
- A second landing-page variant around the strongest pain
- Automated booking/lead reconciliation if manual work has become material
- Transparent modeled-impact calculator

**Gate:** the improvement has a specific hypothesis and can be measured against the Phase 2 baseline.

### Phase 4 — Controlled scale and second market

Entered after the Netherlands produces either:

- at least one signed annual customer attributable to inbound, or
- a repeatable flow of qualified opportunities with economics that justify continued testing.

Possible investments:

- Higher Netherlands search budget
- Offline conversion feedback to Google Ads
- Selection of one Nordic country
- Country-specific keyword research and landing-page localization
- CRM or marketing-automation implementation
- `gradvera.app` booking or product-experience improvements if evidence supports them

Do not open multiple countries simultaneously before the Netherlands results can be interpreted.

---

## 14. Provisional funnel controls

These are diagnostic starting points, not promises or universal industry benchmarks.

| Funnel step | Initial control |
|---|---:|
| Relevant search terms / paid clicks | ≥70% |
| Search CTR on high-intent groups | ≥4% |
| Relevant visitor → qualified form | Observe toward 3–8% |
| Qualified form → booked demo | ≥50% |
| Booked demo → attended demo | ≥70% |
| Attended demo → qualified opportunity | ≥30% |

If the sample is small, inspect individual leads and queries instead of treating percentages as statistically reliable.

### Economic control

The smallest current annual subscription is approximately €4,788 before onboarding, based on one Professional licence. Until retention and close rates are known, use a provisional ceiling for paid acquisition of a signed customer of **no more than 15–20% of first-year subscription revenue**, excluding onboarding revenue.

This ceiling must be revisited when Gradvera has real data for gross margin, sales time, onboarding effort, conversion rate, retention, and account expansion.

---

## 15. Lead operations and learning loop

### 15.1 Required lead stages

1. New form submission
2. Qualified / unqualified
3. Demo booked
4. Demo attended / no-show
5. Opportunity / no fit
6. NDA requested/signed
7. Preview approved/started/completed
8. Commercial offer
9. Annual agreement signed/lost
10. Onboarding started/accepted

Every lost or unqualified lead should have a reason code.

### 15.2 Response standard

- The booking calendar is offered immediately after form submission.
- Unbooked qualified leads receive a personal follow-up within one business day.
- Demo notes and next actions are recorded the same day.
- Preview requests receive a capacity and fit decision before data is accepted.

### 15.3 Weekly review

Review:

- Spend by campaign and search theme
- Actual search terms and negatives added
- Landing-page and form behavior
- Lead qualification and rejection reasons
- Booked and attended demos
- Buyer pains, objections, requested features, and trust questions
- Preview capacity and effort
- Commercial outcomes

Changes should be made as one identifiable hypothesis at a time wherever practical.

---

## 16. Risks and controls

| Risk | Control |
|---|---|
| No real customer proof yet | Use product evidence, transparent sample data, and carefully labeled modeled scenarios |
| Free trial creates a weak experience | Do not offer it; use guided demo and selective preview |
| Full preview consumes excessive resources | Require annual agreement before 100-file onboarding; cap 20-file previews at two per week |
| “EUR at risk” is misunderstood | Use “value requiring pricing review” and explain the calculation |
| Microsoft iframe limits conversion tracking | Track the Gradvera form; reconcile bookings manually; automate later |
| Digital Solutions booking identity causes confusion | Apply Gradvera branding and disclose the corporate relationship |
| `gradvera.com` is listed by SURBL | Separate paid-inbound measurement from cold outreach; use Microsoft Bookings confirmations; monitor follow-up delivery and domain reputation |
| Cold outreach continues to affect reputation | Do not expand cold sending from the main domain; reassess remediation after the active campaign ends |
| English-only Netherlands test underperforms | Inspect search language and query volume; localize to Dutch only with evidence |
| Search volume is too small | Validate keyword volume before expanding; test adjacent high-intent workflow themes |
| One person becomes an import bottleneck | Instrument future onboardings and enforce the preview cap |
| Early campaign automation learns from weak conversions | Keep campaign structure controlled and optimize toward deeper outcomes as data becomes reliable |

The SURBL listing is an explicitly accepted risk for the initial inbound preparation. It must remain visible in campaign reviews because it may affect direct follow-up emails even though it does not prevent website advertising.

---

## 17. Not required before the first campaign

The following are deliberately deferred:

- Self-service free trial
- Short product video
- Interactive product simulation
- `gradvera.app` booking flow
- CRM implementation beyond a reliable lead register
- Power Automate or advanced Microsoft Bookings integration
- Multiple country campaigns
- Multiple localized landing pages
- Dutch translation without supporting evidence
- Performance Max, Display, YouTube, and broad awareness campaigns
- Full ROI calculator
- Partner, review, referral, marketplace, or trade-fair programmes

---

## 18. Open commercial and operational decisions

These do not block Phase 0 unless noted, but they must be resolved before the corresponding stage is sold:

1. Exact onboarding fee
2. Whether the onboarding fee is credited against the annual subscription
3. Detailed 14-day acceptance criteria and contractual consequences
4. Whether public pricing begins at €399/month or is presented after qualification
5. Which Nordic country is tested second
6. When Dutch localization becomes mandatory
7. Whether a 20-file preview is free, paid, or credited in each commercial scenario
8. The exact trigger for CRM/booking automation
9. The long-term role of `gradvera.app`
10. The process and timing for SURBL remediation after outbound ends

These decisions must not be disguised as settled facts in advertisements or sales materials.

---

## 19. Definition of acquisition readiness

Evidence for each item is logged in `docs/acquisition-readiness.md` (website items with PR numbers; dashboard and operational items with date and owner).

Gradvera is ready to open the first Google Search campaign only when all of the following are true:

- [ ] Unsupported proof claims have been removed or transparently reframed.
- [ ] Free-trial messaging has been removed.
- [ ] The Netherlands landing page is live and quality-checked.
- [ ] The page accurately explains Excel support and the guided evaluation route.
- [ ] Real product screenshots from the sample tenant are present.
- [ ] The Gradvera/DIGITAL SOLUTIONS relationship is clear.
- [ ] The qualification form collects the required fit and attribution data.
- [ ] A test lead is stored correctly with UTM and click identifiers.
- [ ] Microsoft Bookings is branded, embedded, and has a direct-link fallback.
- [ ] A test booking can be matched to the originating lead.
- [ ] Consent and analytics behavior has been verified under accept and reject states.
- [ ] Google Ads conversion tracking records one valid form conversion exactly once.
- [ ] The sample-tenant demo is stable and rehearsed.
- [ ] NDA handling and the 20-file preview process are ready.
- [ ] The annual-agreement requirement for full onboarding is reflected in sales materials.
- [ ] Lead stages, owner, response standard, and weekly review are operating.
- [ ] Keyword research, negative keywords, advertisements, budget cap, and stop conditions are approved.

---

## 20. Source-of-truth rule

This document governs the initial acquisition implementation. Website copy, advertisements, analytics events, demo scripts, and sales operations should conform to it.

When real evidence contradicts an assumption, record the evidence and revise this specification. The model should evolve through measured phase gates, not through untracked expansion of channels, markets, features, or offers.

---

## 21. Changelog

- **v1.1 — 19 August 2026 (as built, Phase 0 website work).** §7.1.7 market-neutral landing-page slug; §7.2.8 EU hosting stated; §8.1 three qualifiers marked optional + free-text message added; §8.2/§8.3/§9.3/§11.2 "as built" notes (server-side scoring and response fields, sessionStorage attribution and contract v2, RefID rule, §11.1 event names with `generate_lead` retired); §19 points to `docs/acquisition-readiness.md`. Website PRs #74–#77. No change to the staged investment model (§13), funnel controls (§14) or open decisions (§18).
- **v1.0 — 18 August 2026.** Confirmed baseline.

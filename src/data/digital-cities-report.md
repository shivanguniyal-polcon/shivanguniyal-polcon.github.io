*A research report by Shivang Uniyal. October 2026. Written in simplified technical English (STE100): short sentences, active voice, one meaning per term.*

## 1. Motivation

This project asks one question: who governs a city's digital systems?

Indian cities now run sensors, data platforms, and automated decision tools. These systems decide who gets warnings, services, and attention. No single law governs this system as one object. That gap is the reason for this project.

Three facts make the work urgent.

**Deployment moves faster than law.** Cities buy systems in months. Courts test rights case by case, over years. A right that arrives after deployment arrives too late.

**India shows two failure types at once.** Private companies can capture city services. The state can capture city data. India faces both risks today. A rulebook that stops only one risk leaves the other open.

**Timing decides cost.** Supplier contracts fix technical choices for up to decades. This state is called *lock-in*: after it, the city cannot change supplier without replacing the whole system. Lock-in has not happened yet. Rules added now are cheap to attach. Rules added later are expensive, or impossible.

The aim follows from these facts: a governance model for India's digital cities, adopted before supplier contracts fix the rules.

## 2. Introduction: what a digital city is

This report defines its key term first. The definition guides every rule that follows.

> **Definition.** A digital city is a persistent system with three parts:
>
> 1. the city's sensors, networks, and platforms;
> 2. the data these tools create, and the models built on them, including digital twins;
> 3. the decisions these models make for the city.
>
> The system also includes institutions, rights, and complaint processes. These decide who benefits, who is exposed, and who can object. A digital city is *governed* only when its least powerful residents can object to automated decisions. When companies or the state control this part without limits, the same system becomes an ungoverned city.

The definition gives a test. A city passes when its least powerful residents can question automated decisions. It fails when they cannot.

Three nearby terms cause confusion. A *smart city* is a policy programme label. A *digital twin* is a model of one city. *E-government* is service digitisation. This report uses *digital city* for the whole system.

Six features make the object visible in Indian cities:

1. city-wide sensing and connectivity (command centres in all 100 smart cities);
2. continuous urban data flows (India Urban Data Exchange, city data observatories);
3. models and digital twins (twin pilots in Varanasi, Surat, and Bengaluru);
4. automated decisions (adaptive traffic signals, utility management, policing tools);
5. identity-linked services (Aadhaar-linked municipal services);
6. the governance layer (rights, accountability, complaint routes).

The first five layers are financed and built. The sixth layer, which decides for whom the city works, is not built. This imbalance is the policy problem.

## 3. The literature that exists

**Founding work (1994 to 2004).** The term *digital city* is older than *smart city*. Amsterdam's De Digitale Stad (1994) was a public, resident-run network. It is now UNESCO heritage. Toru Ishida's Digital City Kyoto (1998 to 2001) made the term academic. He defined it as a *social information infrastructure* (Communications of the ACM, 2002; three Springer volumes, 2000 to 2004).

**The concept continues in three forms.** Reviews treat digital city, intelligent city, and smart city as one line of ideas with different emphases (Camero and Alba, Cities, 2019). The current form is the *urban digital twin*: a live model of a city used for planning and control. Goodchild (2024) frames it as the next stage after GIS. Azadi et al. (2025) show that real systems fall short of their promises. van Apeldoorn, Mayer and Zhou (2025) show that twins are contested objects: different actors read them differently. Diaz-Sarachaga and Josa (Cities, 2025) propose an assessment framework for twins. It is proposed, not enacted.

**Critical studies.** Kitchin (GeoJournal, 2014) shows that city data are never neutral. Cardullo and Kitchin (2019) show that residents are offered roles as consumers and data sources, not as co-governors. Calzada (2021) shows that digital-rights frameworks exist but are unevenly applied. van Dijck (2014) names dataism as an ideology. Policy guidance (OECD, 2023; UN-Habitat, 2021 onwards) accepts the same point: governance is the under-built part.

**Global South studies.** Datta (2018, 2019) shows that India's smart-city programme treats the urban poor as data subjects before it serves them as citizens. Alizadeh et al. (2024) show that technology-led city programmes deepen spatial inequality. Couldry and Mejias (2018, 2019) name the pattern *data colonialism*: data collection extends older relations of extraction. Taylor (2017) defines *data justice* as fair treatment of people as data.

**Surveillance studies (India).** Internet Freedom Foundation's Project Panoptic (2020 onwards) documents facial recognition used by Indian police without a governing law. RTI replies report acceptance of false matches up to 80 per cent. The EU AI Act (2024) bans three such practices, but only inside the EU.

**The gap the field names itself.** Across all strands, reviews report the same result: technology runs ahead of rules. The governance of digital cities is the under-studied part (Camero and Alba, 2019; Diaz-Sarachaga and Josa, 2025; OECD, 2023; van Apeldoorn et al., 2025). This report works on that gap.

## 4. Research gaps

Six gaps follow from the literature.

1. **India has no definitional work on the digital city.** Indian scholarship uses only the term *smart city*. India builds digital-city systems without a shared definition of the object.
2. **No binding urban-specific framework exists anywhere.** Global options are voluntary networks (Cities Coalition for Digital Rights, 2018), guidance (OECD, UN-Habitat), or laws that are not urban (GDPR) or not applicable here (EU AI Act).
3. **India's law has two structural holes.** The DPDP Act 2023 does not cover non-personal urban data. Sensor streams, mobility patterns, and twin models have no ownership or sharing rules. The Act's state exemption also leaves government surveillance under review.
4. **Distributional effects are not measured.** No method in the Indian literature computes, by settlement type, how an urban AI system distributes its errors.
5. **Informal settlements are invisible to city data.** These areas have no registered addresses. Official counts stop at the census (2011). Non-notified settlements appear in no official list. A metric that cannot see these areas will report in their favour.
6. **No assessment procedure exists for urban AI.** India has a mature environmental assessment institution for projects. It has no equivalent for city AI systems: no pre-deployment appraisal, no panel procedure, no evidence standard.

## 5. Research questions

The gaps give five questions, ordered from concept to test.

- **RQ1 (definitional).** What is a digital city as an object of governance? *Method:* define the object from the two failure cases. *Output:* the definition in Section 2.
- **RQ2 (diagnostic).** What governance coverage exists, globally and in India, for this object? *Method:* an instrument inventory with fixed tests: binding or voluntary; urban-specific or sectoral; applicable here or not. *Output:* the verdicts in Section 4, gaps 2 and 3.
- **RQ3 (distributional).** What are the equity risks of urban AI for informal settlements, and can we measure them? *Method:* design equity metrics that work within India's data limits. *Output:* five metrics with numeric targets (Section 8).
- **RQ4 (institutional).** What institutional forms can close the gap inside India's constitutional structure? *Method:* map existing legal vehicles, since municipal matters belong to states. *Output:* five instruments with owners and legal routes (Section 7).
- **RQ5 (testable).** Can a pre-deployment assessment of a live urban AI system produce published, contestable evidence in one cycle? *Method:* one pilot, pre-registered (Section 8).

RQ5 is the test of the whole programme. If the procedure cannot run once, by choice, the statutory version should not be drafted. The pilot runs before any law requires it.

## 6. Threats

**Corporate capture.** City capacity moves into supplier platforms. Contracts fix dependency for decades. Urban behavioural data is licensed to private parties. The city cannot audit or exit the system it uses. Monopoly forms through procurement: state-run platforms sitting inside company-owned infrastructure.

**State overreach.** Surveillance capacity arrives before its legal limits. Facial recognition runs without a law, with reported false-match acceptance up to 80 per cent (Project Panoptic). The DPDP Act exempts the state. Satellite images of settlements have historically served demolition, not services.

**The combined case.** Nothing in current practice prevents both patterns from joining: company control of the city operating together with total state visibility. Every element of this case exists today, in legal, documented form. Each instrument looks reasonable on its own while the whole system moves towards this result. This is why a rulebook that limits only one pattern creates the other.

**India-specific factors.** Data collection began (Aadhaar, 2009) decades before the data-protection law (2023): extraction before protection. Courts run slower than procurement: rights after deployment. Standards are set elsewhere and imported as they are: misfit where consent-based, harmful where extraction-based. The formal city receives premium digital services. The informal city receives data-based policing and exclusion (Alizadeh et al., 2024; Datta, 2018). The final factor is the open period before lock-in. It is the one period in which rules attach at low cost.

## 7. Potential policy interventions

The design rule: limit both failure patterns at the same time, or lose to one of them. All five instruments use existing legal materials.

1. **A Digital City Charter.** A central framework law on the DPDP Act 2023 model, plus an optional model municipal law (Article 252 route). The Charter names the digital city in law. It gives residents the right to contest automated decisions. It requires a proportionality test before deployment (the *Puttaswamy* test, made pre-deployment). It protects public records against later rewriting. It bans three practices outright:

- real-time public-space biometric identification for general policing;
- predictive policing based only on profiling;
- emotion recognition in public space.
2. **Urban data trusts.** Urban data from public space vests in an independent trust with resident trustees and fiduciary duties. No supplier may hold an exclusive licence of urban behavioural data. Every platform contract must include interoperability and exit terms (GFR and GeM amendment route).
3. **Digital-Twin Impact Assessment (DTIA).** An environmental-assessment-style review before any operative urban AI system is used. It covers data sources, error rates, effects by settlement type, complaint routes, and reversibility. It repeats yearly. Systems without an assessment end automatically. Interim route: grant conditions under AMRUT 2.0 and NUDM. Statutory route: a Charter chapter.
4. **City Digital Governance Boards.** Statutory boards, not supplier committees: elected ward members, informal-worker representatives, technical experts, and an independent data-protection officer. The board approves assessments, audits contracts, maintains a public register of AI and facial-recognition uses, and can suspend systems. Creation runs through state municipal acts. The DPDP Act's Significant Data Fiduciary designation gives city platforms an existing duty base.
5. **South-South standards.** India co-develops open standards for urban data governance with Brazil, Indonesia, South Africa, and Kenya. This carries Indian rights requirements into the technical layer instead of importing defaults. Vehicles: BIS Act 2016 committees, G20 and BRICS channels, the Global DPI Repository. No new law is required.

**Why all five are needed.** Deployment runs ahead of law. Both failure patterns are live at once. The least visible residents pay first. Defaults are imported, not chosen. Contracts now fix the rules for decades, so rights conditions must attach now, while the cost is low.

**Constitutional fit.** Municipal government is a State subject (Seventh Schedule, List II, Entry 5). The Charter therefore uses three routes:

1. a central law on the DPDP Act model;
2. an opt-in model municipal law (Article 252);
3. grant conditions (Article 282).

**Lead owners:**

- MoHUA: urban layer;
- MeitY: digital layer and trust registration;
- NITI Aayog: coordination;
- states and city bodies: boards;
- MEA and BIS: standards.

The first twelve months need no new legislation.

## 8. What needs to be tested

The programme's test is RQ5: one full assessment cycle in one live city, run before any law requires it. The design is complete in the companion methodology note. This section states its core.

**Site and system.** Surat (backup: Pune). Surat runs the India Urban Data Exchange and an operational flood early-warning system. The assessed system is the flood warning stack. It includes river and rain sensors, simulation and alert models, and the alert channels that act on the city. The system makes decisions (evacuations, gate operations, rescue priority). Its failures fall hardest on informal riverbank settlements. This is the distributional question the assessment must answer.

**The instrument.** Five modules, five indicators each. Every indicator is scored 0 to 2 against specified evidence.

**The five modules:**

1. data sources and quality;
2. model integrity and error, reported by settlement type;
3. distributional effects;
4. complaint and redress routes;
5. reversibility and exit.

Module scores are never combined into one number. A single score would let a weak equity result hide behind a strong technical one. A nine-member panel runs the assessment. Members: three independent experts, two councillors, two informal-settlement representatives, one data officer, and one data-platform engineer as non-voting secretariat. The panel works under a voluntary charter with a non-interference rule. The system runs as it is. The panel observes and measures.

**The measurement core.** The first deliverable is a settlement footprint map. It combines census slum blocks, notified-slum lists, and scheme beneficiary locations. It adds community maps of non-notified settlements and satellite footprints checked by resident enumerators. Each area is typed and graded for confidence. Two signed rules protect the map: use only for services, and no connection to revenue or eviction work. Five equity metrics run on this map, each with a fixed target:

1. coverage: informal reach at least 90 per cent of formal reach;
2. warning time: informal delay within 20 per cent of formal delay;
3. error rates: no settlement type above 1.25 times the citywide missed-alert rate;
4. response: rescue and relief per affected household, not per property value;
5. voice: complaint rates from informal areas close to their population share.

Targets, not descriptions. A failed target triggers a dated repair plan. Refusal triggers the end clause.

**The evaluation.** Three strands. *Process* (primary): panel independence kept, full publication, all 25 indicators evidenced or marked unverifiable with reasons, informal-settlement participation documented. *Outcome* (secondary): the system does not change during the test, so claims stay modest. We use before-and-after comparisons by settlement type, complaint trends over time, and endpoints fixed in advance. *Institutional*: a lessons annex for the Charter's assessment chapter. The annex records which indicators could not be evidenced. It also records which panel powers were missing and the cost of one cycle (Rs 1.2 to 1.8 crore, payable from existing AMRUT 2.0 heads). The annex is the pilot's policy product.

**The wider test agenda.** Four demonstrations run cheapest first:

1. a public AI and facial-recognition register for one city;
2. a data-trust design for one municipal dataset (bus frequency or water metering);
3. the Charter bill drafted while pilots run;
4. a South-South standards working group through existing channels.

Each converts one part of this report from argument into evidence.

**Limits of this report.** One pilot does not generalise; the design ports to other cities, but that claim needs a second run. The observation rule blocks causal claims about the system itself. Parts of the source base carry verification tiers instead of confirmed page numbers (the sources table below shows them). The stakeholder view comes from literature and public documents, not from interviews. Each limit is also a next step.

## 9. Conclusion

This programme does three things a research portfolio should show. It *defines* an object the field left open: a digital city defined by governance, not technology. The definition gives a test that a city can pass or fail. It *diagnoses* the gap, globally and in India. The diagnosis names two structural holes in Indian law and the absence of Indian definitional work. It *builds towards test*: five instruments mapped to owners and legal vehicles inside India's constitutional structure. One instrument goes all the way to a pre-registered, costed, twelve-month pilot design.

The next unit of work is empirical. Run the cycle once, publish the result, and let the evidence decide whether the statute should be written.

## Sources

Verification tiers: **V** = checked against the publisher or official source (October 2026). **S** = found in indexed search; attribution is standard. **C** = canonical work; check page numbers before formal publication.

| # | Source | Tier |
|---|---|---|
| 1 | Ishida, T. (2002). Digital City Kyoto. *Communications of the ACM*, 45(7), 76 to 81. | V |
| 2 | Ishida and Isbister, eds. (2000). *Digital Cities: Technologies, Experiences, and Future Perspectives*. LNCS 1767. Springer. | V |
| 3 | Tanabe, van den Besselaar and Ishida, eds. (2002). *Digital Cities II*. LNCS 2362. Springer. | V |
| 4 | Tanabe, van den Besselaar and Ishida, eds. (2004). *Digital Cities III*. LNCS 3081. Springer. | V |
| 5 | UNESCO Memory of the World: De Digitale Stad (Amsterdam Digital City). | V |
| 6 | [Waag. The Digital City (DDS) project page](https://waag.org/en/project/digital-city-dds/). | V |
| 7 | van den Besselaar, Beckers and van Hout (2005). E-community versus e-commerce: the rise and decline of the Amsterdam Digital City. *International Journal of Web Based Communities*, 1(2). | V |
| 8 | Camero and Alba (2019). Smart City and information technology: a review. *Cities*, 93. | V |
| 9 | Dameri and Rosenthal-Sabroux, eds. (2014). *Smart City: How to Create Public and Economic Value with High Technology in Urban Space*. Springer. | S |
| 10 | Aurigi and De Cindio, eds. (2008). *Augmented Urban Spaces: Articulating the Physical and Digital City*. Routledge. | C |
| 11 | Komninos (2002; 2008). *Intelligent Cities*; *The Age of Intelligent Cities*. Spon Press / Routledge. | C |
| 12 | Goodchild, M. F. (2024). Digital twins in urban informatics. *Urban Informatics*, 3. Springer. | V |
| 13 | Sanchez-Vaquerizo (2024). Urban Digital Twins and metaverses towards city multiplicities. | V |
| 14 | Azadi et al. (2025). What have urban digital twins contributed to urban planning? TU/e. | V |
| 15 | van Apeldoorn, Mayer and Zhou (2025). Making (common) sense of urban digital twins with Q-methodology. BUas. | V |
| 16 | Diaz-Sarachaga and Josa (2025). Developing an assessment governance framework for urban digital twins. *Cities*. | V |
| 17 | Worland, Letellier-Duchesne and Pettit (2025). Mapping the architecture of urban digital twins. arXiv. | S |
| 18 | Kitchin, R. (2014). The real-time city? Big data and smart urbanism. *GeoJournal*, 79. | V |
| 19 | Cardullo and Kitchin (2019). Smart urbanism and smart citizenship. *Environment and Planning A*, 51. | V |
| 20 | Calzada, I. (2021). The right to have digital rights in smart cities. *Sustainability*, 13(20). | V |
| 21 | van Dijck, J. (2014). Datafication, dataism and dataveillance. *Surveillance & Society*, 12(2). | C |
| 22 | Datta, A. (2018). The digital turn in postcolonial urbanism. *Transactions of the IBG*, 43. | V |
| 23 | Datta, A. (2019). Postcolonial urban futures. *Environment and Planning D*, 37. | V |
| 24 | Alizadeh et al. (2024). The right to the smart city in the Global South. *Urban Studies*. | V |
| 25 | Couldry and Mejias (2019). *The Costs of Connection*. Stanford University Press. | V |
| 26 | Couldry and Mejias (2018). Data colonialism. *Television and New Media*, 20(4). | V |
| 27 | Taylor, L. (2017). What is data justice? *Big Data and Society*, 4(2). | C |
| 28 | Heeks and Renken (2018). Data justice for development: What would it mean? *Information Development*, 34(1), 90 to 102. | C |
| 29 | [Internet Freedom Foundation. Project Panoptic (2020 onwards)](https://panoptic.in/). | V |
| 30 | Basheer, I. P. (2025). Issues raised due to use of facial recognition in India. SAGE. | V |
| 31 | Richardson, Schultz and Crawford (2019). Dirty data: predictive policing harms. *UCLA Law Review*. | V |
| 32 | [Cities Coalition for Digital Rights. Principles; Digital Rights Governance Framework (2018; 2022)](https://citiesfordigitalrights.org/). | V |
| 33 | [UN-Habitat. People-Centred Smart Cities Playbooks (2021 onwards)](https://unhabitat.org/programme/people-centered-smart-cities/people-centered-smart-cities-playbooks). | V |
| 34 | Beckers et al. (2022). Global Review of Smart City Governance Practices. UN-Habitat. | V |
| 35 | OECD (2023). Smart City Data Governance. | V |
| 36 | [European Union. Regulation (EU) 2024/1689 (EU AI Act)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj). | V |
| 37 | [Council of Europe. Framework Convention on Artificial Intelligence (2024)](https://rm.coe.int/1680afae3c). | V |
| 38 | [UN General Assembly. Resolution A/78/L.49 on artificial intelligence (2024)](https://docs.un.org/en/A/78/L.49). | V |
| 39 | Digital Personal Data Protection Act, 2023 (India). | V |
| 40 | National Urban Digital Mission (2020). MoHUA, India. | V |
| 41 | [India Urban Data Exchange (IUDX), IISc and MoHUA](https://iudx.org.in/). | V |
| 42 | CPR (2023). Decoding digitalization of urban governance in India. | V |
| 43 | Parkar, Zerah and Mittal (2023). The digitalization of urban governance in India. *SAMAJ*. | V |
| 44 | NIUA (2019). Harnessing the power of data: city data observatories. | V |
| 45 | Puttaswamy v. Union of India (2017); Aadhaar judgment (2018). Supreme Court of India. | V |
| 46 | Census of India 2011: slum population tables (town level). | V |
| 47 | SECC 2011 (Socio-Economic and Caste Census), Government of India. | V |
| 48 | Nolan (2015). Slum definitions in urban India. *PMC*. | V |
| 49 | Boanada-Fuchs (2024). Global informal-settlement footprint layers. *Urban Science*. | S |
| 50 | SSRC Just Tech (2025). Seeing settlements from space. | V |
| 51 | NITI Aayog (2021). Responsible AI: principles. Government of India. | S |
| 52 | Surat flood history (2006; 2013) and SSCDL smart-city programme documentation. | V |

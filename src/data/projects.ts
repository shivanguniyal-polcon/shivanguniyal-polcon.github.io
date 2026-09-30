// Project catalog. Single source of truth for the lotus, the grid, and the case studies.
// Every case study follows the research template: inference, implications,
// policy recommendations, methodology, data sources, data highlights.
// Numbers trace to the research documents in the author's working files.
export type Domain =
  | 'Electoral Systems'
  | 'Health Policy'
  | 'Defence & Strategic Trade'
  | 'Climate & Water'
  | 'Media & Information';

export type MethodStep = { step: string; detail: string };
export type SourceRef = { name: string; role: string };
export type StatRow = { label: string; value: string; note?: string };
export type ProjectLink = { kind: 'dashboard' | 'publication' | 'code'; url: string; label?: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  domain: Domain;
  methods: string[];
  year: string;
  status: 'live' | 'ongoing' | 'published';
  link?: string;
  /** public-facing artifacts: live dashboards, published papers, code repos */
  links?: ProjectLink[];
  featured?: boolean;
  heroStat?: { value: string; label: string };
  chart?: 'pmjay' | 'pmjayCal' | 'evm' | 'evmEvent' | 'minerals' | 'wefe' | 'drone' | 'wefeScenarios' | 'taxonomy';
  /** research template sections, rendered in this order */
  sections: { heading: string; body: string }[];
  inference?: string;
  implications?: string[];
  recommendations?: string[];
  methodology?: MethodStep[];
  sources?: SourceRef[];
  dataHighlights?: StatRow[];
  dataTable?: { title: string; columns: string[]; rows: string[][]; note?: string };
};

export const domains: Domain[] = [
  'Electoral Systems',
  'Health Policy',
  'Defence & Strategic Trade',
  'Climate & Water',
  'Media & Information',
];

export const projects: Project[] = [
  {
    slug: 'evm-female-turnout',
    title: 'Do EVMs Get Women to Vote?',
    tagline:
      'A continuous difference-in-differences audit of whether electronic voting machines moved female turnout in India, carried to the point where the data could answer, and answering honestly where it cannot.',
    domain: 'Electoral Systems',
    methods: ['Continuous DiD', 'Randomization Inference', 'Wild-Cluster Bootstrap', 'Dose-Response DDD', 'Spatial Crosswalks'],
    year: '2024 to 2025',
    status: 'live',
    link: 'https://shivang-thesis.streamlit.app/',
    links: [
      { kind: 'dashboard', url: 'https://shivang-thesis.streamlit.app/', label: 'EVM × gender turnout dashboard' },
    ],
    featured: true,
    heroStat: { value: '−7.4 pp', label: 'EC98 × EVM gradient on male turnout change (p_cl = 0.004, RI = 0.005)' },
    chart: 'evmEvent',
    sections: [
      {
        heading: 'The question',
        body: 'India replaced ballot papers with electronic voting machines between 1998 and 2001. Ballots could be captured; machines are hard to stuff. If tech-enabled integrity changes who votes, the gains should concentrate where discretion was previously abused: districts where patriarchal norms suppress female participation. The 1998 district female-enterprise share (EC98) proxies that norm intensity.',
      },
      {
        heading: 'Measurement engineering',
        body: 'Constituency election data does not nest into census districts, and both redraw. I built an area-weighted spatial crosswalk across 400+ districts with urban-rural splits, validated against official urbanization anchors (Maharashtra 38.7%, NCT Delhi 89.9%, exact). Every downstream estimate depends on this plumbing; a naive crosswalk injects error correlated with urbanization, the exact confound in this design.',
      },
      {
        heading: 'The audit that changed the answer',
        body: 'An earlier draft reported a significant FLFPR moderation at p = 0.049. A pre-registered-style audit found aggregate (male+female) labor-force participation had been mislabelled as gender-specific. Corrected, the FLFPR arm goes null by every method (p_cl = 0.19, BH q ≥ 0.53). The audit was published to the project log, not buried. What survives is the pre-committed EC98 test, and it is stronger than the dead result was.',
      },
      {
        heading: 'Design and inference battery',
        body: 'Continuous-dose DiD on the 1996 to 2004 district panel, with state-clustered errors, exact randomization inference (treatment labels permuted within state, doses recomputed per draw), and wild-cluster bootstrap. Few treated clusters make conventional SEs misleading; the battery exists because each method fails differently, and only agreement is evidence.',
      },
    ],
    inference:
      'The average EVM effect on turnout is about −1 pp, effectively flat. But the average conceals the structure: the effect concentrates where female enterprise share was high. The EC98 × EVM gradient on male turnout change is −7.4 pp (clustered p = 0.004, randomization p = 0.005). A horse race against official 1991 urbanization (correlation with EC98: 0.02 overall, −0.26 within treated PCs) shows the gradient is the agency variable, not metro development: the orthogonalized non-urban component of EC98 carries −9.05 pp (p = 7e-4, wild bootstrap 0.007). The corrected dosage DDD triangulates the same story: a −5.7 to −7.0 gradient in high-dose districts that averages to −1.0 to −1.1 pp district-wide, with clean pre-trends in every specification. The honest caveat repeats across cells: clustered inference supports, RI is suggestive, the wild bootstrap cannot confirm (16 treated-relevant clusters). The male-specificity of the gradient is significant only at the 10% level (p = .087, three designs agreeing).',
    implications: [
      'Technology can move participation, but only where social permission already exists: the machine is a commitment device, not a cultural force.',
      'Averaged national effects hide concentrated mechanisms. Policy evaluation at the mean would have concluded "no effect" and missed the distributional story entirely.',
      'The FLFPR null is itself a finding: measurement labelings, not just models, drive published results. One mislabeled column produced a spurious p = 0.049 that an audit killed.',
    ],
    recommendations: [
      'Deploy turnout-integrity interventions targeting districts by pre-treatment norm proxies (female enterprise share, child sex ratio), not by average state characteristics.',
      'The Election Commission should publish constituency-level invalid-vote series; the rejected-votes collapse under EVMs is the cleanest mechanical proof of the integrity channel and is currently unrecoverable.',
      'Replication infrastructure: the spatial crosswalk and inference battery should ship as a public package so any pre-2000 district analysis can inherit validated geography.',
    ],
    methodology: [
      { step: 'Spatial crosswalk', detail: 'Area-weighted interpolation of 400+ constituencies onto 1991 census districts, urban-rural splits preserved, validated against official state urbanization anchors.' },
      { step: 'Continuous treatment', detail: 'Dose = 1999 pilot-PC area (or elector) share per district; interaction with 1998 female-enterprise share (EC98) and official 1991 urbanization for the horse race.' },
      { step: 'Designs', detail: 'Stacked pre-trend (96→98), DiD (98→99), and ANCOVA specifications at dose thresholds θ = 0.5 and 0.25.' },
      { step: 'Inference battery', detail: 'State-clustered SEs; randomization inference permuting treated-PC labels within state (199 to 999 reps, doses recomputed per draw); WCR wild-cluster bootstrap.' },
      { step: 'Audit protocol', detail: 'Variable-provenance audit (Tier-2.1) that caught the FLFPR mislabelling; every strand result re-anchored to corrected data or explicitly retired.' },
    ],
    sources: [
      { name: 'Election Commission of India', role: 'Constituency-level turnout and invalid votes, 1996 to 2004; EVM rollout dates' },
      { name: 'Census of India 1991 / 1998', role: 'District female-enterprise share (EC98), urbanization anchors, demographic controls' },
      { name: 'Economic Census 1998', role: 'Female enterprise share, the primary norm-intensity moderator' },
      { name: 'Author\'s spatial crosswalk', role: 'Constituency-to-district interpolation, validation tables' },
    ],
    dataHighlights: [
      { label: 'Average effect', value: '≈ −1 pp', note: 'corrected, properly inferred; the old −3 to −9 strand estimates were error-inflated' },
      { label: 'EC98 gradient (male)', value: '−7.4 pp', note: 'p_cl = 0.004 · RI = 0.005 · wildboot 0.45' },
      { label: 'Orthogonalized EC98', value: '−9.05 pp', note: 'p = 7e-4, wildboot 0.007; survives urban strip-mining' },
      { label: 'Dose DDD (high-dose)', value: '−5.7 to −7.0', note: 'RI 0.02 to 0.07 at θ = 0.25; pre-trends clean' },
      { label: 'Gender gap in gradient', value: '−6.6 pp', note: 'p = .087; underpowered rather than clearly null' },
    ],
    dataTable: {
      title: 'Corrected dosage DDD, district dose × post (θ = 0.5)',
      columns: ['Design', 'Male β₃', 'Female β₃', 'Turnout β₃', 'RI p (range)'],
      rows: [
        ['Pre-trend 96→98', '+0.14 (p .97)', '−2.10 (p .63)', '−0.87 (p .82)', 'clean'],
        ['DiD 98→99', '−5.69 (p .018)', '−6.96 (p .016)', '−6.25 (p .016)', '.17 to .30'],
        ['ANCOVA', '−1.07 (p .59)', '−0.53 (p .81)', '−0.66 (p .75)', 'n/a'],
      ],
      note: 'From EVM_Dosage_DDD_Corrected.py (re-run on corrected covariates, Sep 2026). At θ = 0.25 (41 districts): DiD β₃ −5.2 to −6.4, RI p = 0.02 to 0.07.',
    },
  },

  {
    slug: 'pmjay-system-dynamics',
    title: 'PM-JAY: The Claim Factory',
    tagline:
      'A system dynamics model of the world\'s largest health assurance scheme, rebuilt from official fragments: the claim pipeline, the fraud loop, and the race between an entitlement engine and an administratively set budget.',
    domain: 'Health Policy',
    methods: ['System Dynamics', 'Differential Evolution Calibration', 'Source Reconciliation', 'Scenario Analysis'],
    year: '2025 to 2026',
    status: 'ongoing',
    featured: true,
    heroStat: { value: '9.19 cr', label: 'cumulative authorized admissions, March 2025, reconstructed from PIB/NHA anchors' },
    chart: 'pmjayCal',
    sections: [
      {
        heading: 'The reporting problem',
        body: 'PM-JAY\'s evidence base is a patchwork: milestone press releases, annexure tables, annual reports and Rajya Sabha replies that do not obviously reconcile. Before modeling policy, the series had to be rebuilt. The reconstruction hits every official anchor: 0.169 crore admissions in FY19, 3.28 crore by FY22, 5 crore in May 2023, 7.37 crore in June 2024, 9.19 crore in March 2025.',
      },
      {
        heading: 'The architecture',
        body: 'Five stocks drive the money chain: enrolled population, hospital network, claims fund, payment balance (pending claims, the hospital-side receivables that made Haryana hospitals exit), and fraud accumulation. The payment ratio is not assumed; it emerges from the settlement flow against billing. NCD burden (haemodialysis is the top treatment at 14% of admissions) enters as an exogenous driver of claim size.',
      },
      {
        heading: 'Calibration',
        body: 'The stock-and-flow model is calibrated to the official series by differential evolution in log space, with the same equations ported to TypeScript so the calibration runs live in the browser on this page. The fraud toggle separates two questions the public debate conflates: how many admissions (driven by enrollment and utilization) and how much money leaks (driven by the fraud share of claim value).',
      },
      {
        heading: 'Fiscal stress, quantified',
        body: 'Three documented pressures intersect in one mechanism: claims grow with enrollment (40.45 crore cards against a ~50 crore pool, widened in Oct 2024 to all citizens 70+), average claim size rises with the NCD case mix, and the budget is set administratively (~₹22,500 crore per year combined envelope, +10% assumed). Detection is accelerating: rejected fraudulent claims rose from ₹11 crore (FY23) to ₹272 crore (to Mar 2025), with a further ₹678 crore blocked in FY26 before payment.',
      },
    ],
    inference:
      'The model\'s central proposition is that the payment ratio, not fraud alone, is the transmission belt from fiscal pressure to hospital-network attrition. Fraud is real but bounded: the 2.7 lakh inadmissible claims are ~0.4% of processed claims, under 0.5% of cumulative treatment value. The unbounded risk is structural: an entitlement engine growing at enrollment speed meets a budget growing at administrative speed, and the wedge between billed and paid claims (₹1.21 lakh crore pending, per the Feb 2025 RTI) is where it shows first. Sustainability is decided by the race between the R1 coverage-growth loop, the NCD cost driver, and the budget envelope; fraud control alone cannot offset claim-size inflation.',
    implications: [
      'The pending-claims stock is the early-warning indicator: it moves before the payment ratio degrades and before hospitals exit. It should be published monthly, not discovered by RTI.',
      'Fraud headline numbers (₹562 crore detected) anchor public debate at under half a percent of treatment value, distracting from the structural race between claims growth and budget growth.',
      'The 70+ expansion added roughly 6 crore seniors to the pool without a matching envelope conversation; the model is designed to price exactly that gap.',
    ],
    recommendations: [
      'Adopt a payment-ratio floor (≥ 0.85) as an explicit sustainability criterion, reviewed annually against the pending-claims stock.',
      'Tie budget escalation to a claims-growth index (enrollment × case-mix inflation) rather than ad hoc annual allocations.',
      'Scale fraud detection where it pays: the detection flow grew ~25× between FY23 and FY25; institutionalize the OCR/NLP pipeline that flagged 28,000 suspicious claims.',
      'Publish hospital-level settlement times. Network attrition is payment-contingent; making settlement speed visible changes hospital economics faster than any penalty.',
    ],
    methodology: [
      { step: 'Source reconciliation', detail: 'PIB releases, NHA annual reports, Lok Sabha replies and RTI disclosures merged into one dated series; every observation carries source and confidence grade.' },
      { step: 'Stock-and-flow specification', detail: 'Five stocks (enrolled, hospitals, fund, payment balance, fraud) with money-chain coupling: billing enters receivables, settlement moves cash.' },
      { step: 'Calibration', detail: 'Differential evolution in log space against the 2018 to 2025 anchor series (cards, admissions, hospitals, treatment value); fraud share held separable.' },
      { step: 'Scenario engine', detail: 'Baseline, fraud control (L1), hospital expansion (L2), combined, under an identical budget path; scored on ex-ante criteria (payment floor ≥ 0.85, rationing onset ≥ 2035, coverage ≥ 60%).' },
      { step: 'Live port', detail: 'The calibrated ODE system ported to TypeScript with RK4 integration; runs in-browser on this page, within 3% of the Python calibration.' },
    ],
    sources: [
      { name: 'NHA Annual Reports 2022-23, 2024-25', role: 'Admissions, treatment value, hospitals, cards, fraud rejections' },
      { name: 'PIB releases (PRID 1546948, 2053881, ...)', role: 'Launch anchors, milestone admissions, 70+ expansion parameters' },
      { name: 'Union Health Ministry via Rajya Sabha / TOI (Feb 2025)', role: 'Fraud: 2.7 lakh inadmissible claims, ₹562.4 crore, 3-state 13% share' },
      { name: 'NHA RTI (Feb 2025)', role: '₹1.21 lakh crore pending-claims stock, the payment-balance calibration anchor' },
      { name: 'Garg, Bebarta & Tripathi (2024), BMC HSR', role: 'Scheme design parameters, financial-protection findings' },
    ],
    dataHighlights: [
      { label: 'Admissions (Mar 2025)', value: '9.19 cr', note: '₹1,29,386 crore treatment value' },
      { label: 'Empanelled hospitals', value: '31,005', note: '55% public, 45% private' },
      { label: 'Cards issued', value: '40.45 cr', note: 'vs ~50 crore design pool; 15.14 cr families covered' },
      { label: 'Pending claims', value: '₹1.21 lakh cr', note: 'NHA RTI Feb 2025; the payment-balance anchor' },
      { label: 'Fraud detection flow', value: '₹11 cr → ₹272 cr', note: 'FY23 → Mar 2025; +₹678 cr blocked FY26' },
      { label: 'Top treatment', value: 'Haemodialysis 14%', note: 'the NCD case-mix driver of claim size' },
    ],
    dataTable: {
      title: 'Reconstructed official anchor series (cumulative)',
      columns: ['Anchor date', 'Authorized admissions', 'Source'],
      rows: [
        ['FY 2018-19', '0.169 cr', 'PIB milestone'],
        ['FY 2021-22', '3.28 cr', 'NHA annual report'],
        ['May 2023', '5.00 cr', 'PIB release'],
        ['Jun 2024', '7.37 cr', 'PIB release'],
        ['Mar 2025', '9.19 cr', 'NHA AR 2024-25'],
      ],
      note: 'Every model calibration run reproduces these five anchors; the chart above runs the same equations live.',
    },
  },

  {
    slug: 'critical-minerals-reserve',
    title: 'Critical Minerals Early-Warning',
    tagline:
      'Forecasting bilateral supply disruptions across 48,780 trade dyads, then pricing the sovereign reserve that insures against them. Published as Issue Brief 13, India Foundation, 2026.',
    domain: 'Defence & Strategic Trade',
    methods: ['XGBoost + SHAP', 'Temporal Block CV', 'Inverse Probability Weighting', 'Monte Carlo VaR', 'Actuarial Sizing'],
    year: '2025 to 2026',
    status: 'published',
    links: [
      { kind: 'publication', url: 'https://indiafoundation.in/wp-content/uploads/2026/07/Issue-Brief-13-Shivang-Uniyal-rev.pdf', label: 'Issue Brief No. 13, India Foundation (PDF)' },
    ],
    featured: true,
    heroStat: { value: 'AUC 0.855', label: 'out-of-distribution test AUC after IPW covariate-shift correction; recall 0.989 on critical disruptions' },
    chart: 'minerals',
    sections: [
      {
        heading: 'The strategic problem',
        body: 'India\'s net-zero 2070 pathway runs through lithium, cobalt, nickel, graphite and vanadium. Supply is concentrated in a handful of exporters, processing runs through a second handful of intermediaries (Norway, Finland, Ireland, Belgium: not producers, transshipment hubs), and the weaponization of trade is no longer hypothetical. The study asks two questions: can disruptions be predicted, and what does insurance against them cost?',
      },
      {
        heading: 'The prediction pipeline',
        body: 'Nine heterogeneous datasets, from UN Comtrade to Worldwide Governance Indicators to the NY Fed GSCPI, harmonized into a balanced panel of 48,780 monthly observations across 271 bilateral dyads (India and partners, 2011 to 2025). A structural-zero filling mechanism records supply collapses as risk signals rather than dropping them as missing data. Disruption is defined as a volume drop above 40% year-on-year with a price spike above 2 standard deviations.',
      },
      {
        heading: 'Honest evaluation under regime shift',
        body: 'The post-2022 regime shift (export controls, chokepoint politics) made naive temporal validation useless: adversarial validation AUC hit 1.0, meaning train and test distributions had fully separated. Inverse probability weighting corrects the covariate shift; strict temporal block splitting keeps the evaluation honest. The result: 0.855 out-of-distribution AUC and 0.989 recall on critical disruptions, with SHAP attribution showing governance fragility, industrial output and Maritime Domain Awareness metrics as the leading signals.',
      },
      {
        heading: 'From forecast to reserve',
        body: 'Forecasts become a sovereign reserve recommendation for the National Critical Minerals Mission. A Value-at-Risk mandate (any disruption above the VaR threshold triggers stockpile release) sizes the reserve: USD 633 million initial capex, scaling to USD 910 million over a five-year lifecycle. That is 2.7% of India\'s defence capital budget. A Galathea Bay transshipment simulation adds USD 17.3 million in capex avoidance through maritime risk mitigation.',
      },
    ],
    inference:
      'Disruptions are predictable well above chance (AUC 0.855 out of distribution), and the signals are governable: governance fragility, industrial output and MDA metrics dominate SHAP attribution, not price momentum. Supplier concentration is confirmed but the actionable finding is intermediate: transshipment nodes (Finland, Belgium, Ireland, Norway) are chokepoints the producer-centric literature misses. The actuarial layer converts prediction into policy: a USD 633 million reserve (2.7% of one defence capital budget year) buys continuity against the disruption distribution the model actually produces, not against a worst-case fantasy.',
    implications: [
      'Chokepoint risk lives in logistics, not geology: monitoring should track transshipment hubs and processing chokepoints (Strait of Hormuz, SLOCs) as closely as mining jurisdictions.',
      'The post-2022 covariate shift is the evaluation problem for every supply-chain model shipped today; models validated without IPW or adversarial checks are overfitting to a dead regime.',
      'Reserve sizing can be actuarial. A VaR mandate converts a geopolitical anxiety into a priced line item, which is how it survives a budget negotiation.',
    ],
    recommendations: [
      'Institutionalize the model inside KABIL procurement data and the NSCS review process; prediction without a decision loop decays.',
      'Phase the stockpile: allocate the USD 633 million capex across minerals by predicted-disruption exposure, not uniform coverage.',
      'Operationalize Galathea Bay; the transshipment simulation shows USD 17.3 million capex avoidance on the reserve itself, before the trade-facilitation upside.',
      'Extend the pipeline with real-time signals (GDELT events, FTA/MoU trackers); the static panel is the floor of what this system can be.',
    ],
    methodology: [
      { step: 'Panel construction', detail: 'Nine datasets (UN Comtrade, WGI, GSCPI, MDA indices, ...) harmonized to 48,780 monthly dyad observations across 271 pairs, 2011 to 2025; structural zeros preserved as signals.' },
      { step: 'Disruption labeling', detail: 'Volume drop > 40% year-on-year with price spike > 2 SD; dual-threshold definition separates quantity shocks from price artifacts.' },
      { step: 'Model', detail: 'Dual XGBoost architecture; SHAP for attribution; governance fragility, industrial output and MDA metrics lead.' },
      { step: 'Honest validation', detail: 'Strict temporal block splits; adversarial validation (AUC 1.0 pre-correction) triggers inverse probability weighting; 0.855 OOD AUC, 0.989 deployed recall.' },
      { step: 'Actuarial layer', detail: 'VaR-style piecewise mandate over simulated disruption paths; Monte Carlo sizing of capex (USD 633M) and 5-year lifecycle (USD 910M); Galathea Bay counterfactual.' },
    ],
    sources: [
      { name: 'UN Comtrade', role: 'Monthly bilateral critical-mineral import flows, 2011 to 2025' },
      { name: 'Worldwide Governance Indicators', role: 'Governance fragility signals for exporter jurisdictions' },
      { name: 'NY Fed GSCPI', role: 'Global supply-chain pressure benchmark' },
      { name: 'India Foundation (2026), Issue Brief 13', role: 'The published study: framework, results, reserve sizing' },
      { name: 'National Critical Minerals Mission documents', role: 'Policy anchor for the reserve recommendation' },
    ],
    dataHighlights: [
      { label: 'Panel', value: '48,780 obs', note: '271 dyads × 15 years, monthly' },
      { label: 'OOD AUC', value: '0.855', note: 'after IPW covariate-shift correction' },
      { label: 'Critical recall', value: '0.989', note: 'deployed threshold; the cost asymmetry favors alarms' },
      { label: 'Reserve capex', value: 'USD 633M', note: 'USD 910M five-year lifecycle; 2.7% of defence capital budget' },
      { label: 'Galathea Bay saving', value: 'USD 17.3M', note: 'capex avoidance via maritime risk mitigation' },
    ],
    dataTable: {
      title: 'Reserve sizing at a glance',
      columns: ['Mineral set', 'Disruption threshold', 'Capex (USD M)', '5-yr lifecycle (USD M)'],
      rows: [
        ['Li, Co, Ni, graphite, V', '>40% volume drop + >2σ price', '633', '910'],
      ],
      note: 'VaR-style mandate: any modeled disruption above the threshold triggers stockpile release. Detail and sensitivity in Issue Brief 13.',
    },
  },

  {
    slug: 'wefe-groundwater',
    title: 'The Groundwater Ledger',
    tagline:
      'A dynamic-panel WEFE nexus model of Indo-Gangetic depletion across 205 districts, projected to 2050 under five scenarios. The output is not a mean; it is a distribution of crossing dates for every viability threshold.',
    domain: 'Climate & Water',
    methods: ['Difference-GMM', 'Block-Bootstrap Monte Carlo', 'VIIRS Night Lights', 'Scenario Engine', 'Threshold Dating'],
    year: '2025 to 2026',
    status: 'ongoing',
    links: [
      { kind: 'dashboard', url: 'https://water-security.vercel.app/', label: 'WEFE groundwater dashboard' },
    ],
    featured: true,
    heroStat: { value: '2029', label: 'projected handpump-failure year under unchecked growth (SSP5-8.5); 2043 under SSP2; averted under NPP' },
    chart: 'wefeScenarios',
    sections: [
      {
        heading: 'The nexus, as a system',
        body: 'Groundwater, electricity subsidies, food production and climate stress form a loop across the Indo-Gangetic plains. Tubewell density responds to energy pricing; canals substitute for pumps; monsoon variability resets the aquifer. The aquifer carries hydraulic memory, so ordinary panel estimates are inconsistent. 4,522 district-year observations (205 districts, 10 states, 2000 to 2022) anchor the panel.',
      },
      {
        heading: 'Estimation',
        body: 'Arellano-Bond difference GMM (two-step, twoways) with controlled instrument proliferation handles the hydraulic memory. The preferred Model D adds a Tariff × Electrification interaction using VIIRS night lights as the validated rural-grid proxy: tariff hikes conserve significantly more water in electrified districts (interaction −0.000516, p = 0.028; NTL main effect 0.271, p = 0.004; Sargan p = 0.11). Blanket hikes in grid-deficient districts punish farmers without saving water.',
      },
      {
        heading: 'Projection to 2050',
        body: 'Ten thousand Monte Carlo runs with block-bootstrapped residuals project water tables under five trajectories: unchecked growth (SSP5-8.5), moderate reform (SSP2-4.5), infrastructure rescue (NPP canal vision), a combined-stress stress test, and electrification-conditioned tariff reform. Each run carries the GMM coefficient profiles forward with hydrologic memory 0.85.',
      },
      {
        heading: 'Thresholds, not averages',
        body: 'Four viability lines structure the policy story: 15 m (handpumps fail), 25 m (diesel pumps unviable), 40 m (aquifer stress), 60 m (effectively irreversible). Under unchecked growth the 15 m line falls in 2029 and mean depth hits 55.4 m by 2050 (90% band: 46.7 to 64.2). Under SSP2 the handpump line holds to 2043. The NPP infrastructure path averts all four thresholds through 2050 (mean 5.2 m). Tariff reform conditioned on electrification lands between: 2036 crossing, 22.5 m by 2050.',
      },
    ],
    inference:
      'Depletion is policy-responsive, not destiny. The same aquifer reaches 55 m or holds at 5 m by 2050 depending on three governable levers: tubewell growth, canal investment, and tariff design. The GMM estimates price each: tubewell intensity carries +0.50 to +0.68 on depletion; canals carry −0.65 to −0.95. The interaction is the paper\'s sharpest edge: tariff effectiveness is conditioned on the grid (p = 0.028), so the reform sequence matters. Electrify first, price second; blanket pricing in grid-deficient districts fails on both equity and water. The threshold dating converts means into dates because policy acts on calendars, not on averages.',
    implications: [
      'The 2029 date under inaction is four years out from publication: handpump failure at scale is a this-decade event under SSP5 trajectories, not a 2050 abstraction.',
      'Canal investment is the strongest single lever (−0.65 to −0.95): the NPP infrastructure path dominates every pricing-only path.',
      'Night-lights stratification gives the targeting rule: tariff reform sequences behind grid buildout, district by district.',
    ],
    recommendations: [
      'Sequence tariff reform behind electrification: condition pricing on district grid intensity (the Model D rule), protecting smallholders while conserving where substitution is possible.',
      'Fund canal rehabilitation as the first-order climate adaptation; no pricing pathway matches infrastructure rescue on any threshold.',
      'Adopt threshold-dating (not mean-depth) as the monitoring frame: publish projected crossing years for the 15/25/40 m lines per district.',
      'Protect the 15 m line as the hard policy boundary; below it, handpump communities lose safe access simultaneously and at scale.',
    ],
    methodology: [
      { step: 'Panel build', detail: '205 Indo-Gangetic districts, 2000 to 2022 (4,522 rows): groundwater depth, tariff (₹/kWh, mean ₹501 in 2022), tubewell intensity, canal share, rainfall, PET, VIIRS night lights.' },
      { step: 'GMM estimation', detail: 'Arellano-Bond difference GMM, two-step twoways; three coefficient profiles (High A, Low B, Model D with Tariff × NTL); Sargan 0.11, Wald p = 6.3e-7.' },
      { step: 'Projection engine', detail: '10,000 Monte Carlo runs to 2050 with block-bootstrapped residuals, hydrologic memory 0.85, five scenario parameterizations.' },
      { step: 'Threshold dating', detail: 'First-crossing dates for 15/25/40/60 m lines per scenario, with p05/p95 bands; the 2050 depth distribution per district.' },
      { step: 'Deployment', detail: 'Full dashboard shipped as a dependency-free static site (scenarios, electrification strata, district snapshot, methodology tabs).' },
    ],
    sources: [
      { name: 'CGWB / state groundwater boards', role: 'District water-table depths, 2000 to 2022' },
      { name: 'State tariff orders / ERC returns', role: '₹/kWh effective agricultural tariff' },
      { name: 'VIIRS night lights (NOAA)', role: 'Rural electrification proxy, validated for the Indo-Gangetic belt' },
      { name: 'IMD / PET series', role: 'Rainfall and evapotranspiration stress' },
      { name: 'NPP 2050 documents', role: 'Canal-investment scenario parameters' },
    ],
    dataHighlights: [
      { label: 'Panel', value: '4,522 rows', note: '205 districts · 10 states · 2000 to 2022' },
      { label: 'Tariff × NTL', value: '−0.000516', note: 'p = 0.028: pricing works where the grid reaches' },
      { label: 'Tubewell elasticity', value: '+0.56', note: 'Model D profile; canals −0.70' },
      { label: 'Handpump crossing', value: '2029 vs >2050', note: 'SSP5-8.5 vs NPP Vision' },
      { label: '2050 depth (SSP5)', value: '55.4 m', note: '90% band 46.7 to 64.2; baseline 2022: 9.0 m' },
    ],
    dataTable: {
      title: 'Scenario outcomes at 2050 (10,000 Monte Carlo runs)',
      columns: ['Scenario', 'Handpump 15 m', 'Diesel 25 m', 'Mean depth 2050 (p05, p95)'],
      rows: [
        ['SSP5-8.5 unchecked', '2029', '2035', '55.4 m (46.7, 64.2)'],
        ['SSP2-4.5 moderate', '2043', '>2050', '17.9 m (13.8, 21.9)'],
        ['NPP Vision rescue', '>2050', '>2050', '5.2 m (3.1, 8.0)'],
        ['Combined extremes', 'early', 'early', 'deepest path'],
        ['Electrified tariff reform', '2036', '>2050', '22.5 m (17.9, 27.0)'],
      ],
      note: 'Full trajectories power the fan chart above; crossing dates from the indicators table of the deployed dashboard.',
    },
  },

  {
    slug: 'elections-nlp-agenda',
    title: 'The Agenda Synchronizer',
    tagline:
      'Cross-lingual NLP over 75,000 election articles. Did the Model Code of Conduct synchronize Hindi and English media agendas, or fracture them? The answer ships with its own null.',
    domain: 'Media & Information',
    methods: ['BGE-M3 Embeddings', 'BERTopic + UMAP + HDBSCAN', 'Jensen-Shannon Divergence', 'Fractional Logit GLM', 'Calendar FE Audit'],
    year: '2024 to 2025',
    status: 'ongoing',
    links: [
      { kind: 'dashboard', url: 'https://bharat-media-pulse.vercel.app/', label: 'Bharat Media Pulse: 426,000-article media monitor' },
    ],
    heroStat: { value: 'ΔJSD −0.017', label: 'agenda convergence after MCC enforcement (p = 0.011); Hindi welfare coverage −2.6 pp' },
    sections: [
      {
        heading: 'The corpus',
        body: '75,000 English and Hindi news articles spanning the 2024 Indian general election. Monolingual sentence embeddings fragmented Hindi content into a 40% noise bin; migration to the bge-m3 cross-lingual model removed it. A forensic topic audit then mapped the vector space onto a symmetric three-topic taxonomy (electoral, judicial, welfare), giving divergence a common yardstick across languages.',
      },
      {
        heading: 'Synchronization test',
        body: 'Jensen-Shannon divergence between the Hindi and English topic distributions, tracked across election phases, falls after MCC enforcement: ΔJSD = −0.017 (p = 0.011). Bucket-level analysis shows the mechanism: the MCC starved the vernacular micro-patronage cycle. Hindi welfare coverage dropped 2.6 percentage points while elite English coverage stayed insulated.',
      },
      {
        heading: 'The null that ships',
        body: 'Did the MCC also change how negatively the media writes? A first specification looked significant, until calendar-week fixed effects absorbed the treatment shock. A volume-weighted fractional logit with phase-mapped time gives the honest answer: a robust null. Constraints synchronize agendas but do not fracture evaluative register. Publishing the null alongside the finding is the point: the method produces both, and only reporting one would be advocacy.',
      },
    ],
    inference:
      'The Model Code of Conduct works as an agenda synchronizer, not a tone regulator: cross-lingual topic distributions converge (ΔJSD −0.017, p = 0.011) driven by a vernacular welfare-coverage contraction (−2.6 pp), while negativity shows a robust null once calendar effects are controlled. The convergence is asymmetric: the vernacular agenda moved toward the elite one, not the reverse, which is a normative warning embedded in a statistical result.',
    implications: [
      'Election-law compliance operates on what the press covers, not how it evaluates; enforcement design should target coverage plurality, not tone.',
      'Cross-lingual embedding quality is a first-order research decision: a 40% noise bin in Hindi would have fabricated or masked any finding.',
      'Convergence driven by vernacular contraction is homogenization, not harmony: the MCC synchronized agendas partly by silencing a vernacular patronage channel.',
    ],
    recommendations: [
      'Election observers should monitor language-wise topic coverage (not just volume) during MCC windows; divergence metrics are computable in near-real-time.',
      'Media-freedom assessments during elections should ask which agenda moved; convergence with elite coverage is not neutral if the movement is one-directional.',
      'Publish the divergence methodology as open tooling so election commissions can audit multilingual media environments without vendor black boxes.',
    ],
    methodology: [
      { step: 'Corpus build', detail: '75,000 articles, English and Hindi, 2024 general election window, phase-tagged (pre-MCC, MCC, post-result).' },
      { step: 'Embeddings', detail: 'bge-m3 cross-lingual sentence embeddings after monolingual models showed a 40% Hindi noise bin; forensic topic audit of the vector space.' },
      { step: 'Topic model', detail: 'BERTopic (UMAP + HDBSCAN) constrained to a symmetric three-topic taxonomy: electoral, judicial, welfare.' },
      { step: 'Divergence', detail: 'Jensen-Shannon divergence between language-wise topic distributions by phase; bootstrap inference; ΔJSD with p = 0.011.' },
      { step: 'Register null', detail: 'Volume-weighted fractional logit GLM for negativity, calendar-week fixed effects, phase-mapped time; the significant first spec dies, the null ships.' },
    ],
    sources: [
      { name: 'National election news corpus (2024)', role: '75,000 English and Hindi articles with publication timestamps' },
      { name: 'Election Commission of India', role: 'MCC enforcement calendar, phase boundaries' },
      { name: 'bge-m3 model card', role: 'Cross-lingual embedding backbone' },
    ],
    dataHighlights: [
      { label: 'Corpus', value: '75,000', note: 'two languages, phase-tagged' },
      { label: 'Convergence', value: 'ΔJSD −0.017', note: 'p = 0.011 after MCC onset' },
      { label: 'Hindi welfare', value: '−2.6 pp', note: 'the vernacular micro-patronage contraction' },
      { label: 'Register result', value: 'robust null', note: 'negativity unchanged once calendar FE absorb the shock' },
    ],
  },

  {
    slug: 'manifesto-analysis',
    title: 'Reading a Manifesto, With Data',
    tagline:
      'Thousands of promises from six Lok Sabha manifestos, classified into a 17-category policy taxonomy by a zero-temperature LLM pipeline, audited by hand, and turned into a public voter guide with the Vidhi Centre for Legal Policy.',
    domain: 'Electoral Systems',
    methods: ['LLM Classification (temp 0)', '17-Category Taxonomy', 'Manual Gold-Set Audit', 'Cross-Party Comparison'],
    year: '2024',
    status: 'published',
    links: [
      { kind: 'code', url: 'https://github.com/shivanguniyal-polcon/manifesto-analysis', label: 'pipeline + data on GitHub' },
    ],
    chart: 'taxonomy',
    heroStat: { value: '6 manifestos', label: 'BJP and INC, 2014 to 2024, every promise one primary domain' },
    sections: [
      {
        heading: 'The frame',
        body: 'Manifesto analysis in India is mostly qualitative commentary or ad hoc word counts. The frame separates constitutional obligations from announcements, and funded commitments from aspiration. Every promise from six national manifestos (BJP and INC, 2014, 2019, 2024) is assigned to exactly one of 17 policy sections, from Agriculture to Defence & Security, with a disambiguation rule for cross-domain promises and an Other fallback.',
      },
      {
        heading: 'The pipeline',
        body: 'A zero-temperature LLM pipeline (llama-3.1-8b-instant via Groq) classifies each promise with a strict system prompt: output only the exact section name. Temperature 0 makes runs deterministic and auditable; the section list is enforced in post-processing. Manual code-review workbooks (two sampled audits) validate model output against human gold sets, the multi-stage pattern that generalizes to any legislative text corpus.',
      },
      {
        heading: 'Why it matters',
        body: 'A reproducible coding frame supports longitudinal questions: who shifts the agenda between cycles, who repeats promises, who commits money. The methodology memo became A Voter\'s Guide to Reading a Manifesto, co-authored with the Vidhi Centre for Legal Policy: the same pipeline, translated for the voter who wants to audit the next manifesto herself.',
      },
    ],
    inference:
      'Manifestos are classifiable at scale with auditable reliability: a deterministic LLM pipeline plus human gold-set audit achieves consistent 17-way classification across parties and cycles. The frame\'s payoff is comparability: agenda shares become time-series variables rather than adjectives. The voter guide is the deliverable that closes the loop: the same classification a researcher uses to benchmark parties is the one a citizen can use to check them.',
    implications: [
      'Classification transparency (temperature 0, enforced taxonomy, published audits) is what makes LLM-assisted political analysis legitimate rather than vibes.',
      'A stable taxonomy across cycles converts manifesto rhetoric into measurable agenda dynamics: drift, repetition, and funded-versus-aspirational shares.',
      'The researcher-to-voter translation (the Vidhi guide) is the difference between a dataset and public capacity.',
    ],
    recommendations: [
      'Election trusts and commissions should adopt audited LLM classification with published gold sets for manifesto monitoring.',
      'Extend the frame to state assemblies; the taxonomy generalizes, and state manifestos are where delivery meets accountability most directly.',
      'Add funded/unfunded tagging to the pipeline; the costed-promise share is the single most predictive marker of delivery.',
    ],
    methodology: [
      { step: 'Extraction', detail: 'Promises extracted from six manifestos: BJP and INC, 2014, 2019, 2024.' },
      { step: 'Classification', detail: 'Zero-temperature llama-3.1-8b-instant via Groq; system prompt enforces exact one-of-17 section output; disambiguation rule for multi-domain promises.' },
      { step: 'Audit', detail: 'Two manual code-review workbooks sampled against model output; disagreement rates tracked per section.' },
      { step: 'Aggregation', detail: 'Per-election classified datasets merged into a master dataset for cross-party, cross-cycle analysis.' },
      { step: 'Translation', detail: 'Methodology memo public-facing adaptation: A Voter\'s Guide to Reading a Manifesto with Vidhi Centre for Legal Policy.' },
    ],
    sources: [
      { name: 'BJP manifestos 2014, 2019, 2024', role: 'Promise text' },
      { name: 'INC manifestos 2014, 2019, 2024', role: 'Promise text' },
      { name: 'Vidhi Centre for Legal Policy', role: 'Co-author of the public voter guide' },
    ],
    dataHighlights: [
      { label: 'Corpus', value: '6 manifestos', note: 'two parties, three cycles' },
      { label: 'Taxonomy', value: '17 sections', note: 'one primary domain per promise, Other as fallback' },
      { label: 'Determinism', value: 'temp = 0', note: 'auditable, rerunnable classification' },
    ],
  },

  {
    slug: 'combat-drones-sd',
    title: 'The Arms-Race Simulator',
    tagline:
      'A system dynamics model of the Indian combat drone ecosystem: fleet stocks, learning curves, and geopolitical shocks through 2035, with every crore traced to a source in the Basis of Estimates annexure.',
    domain: 'Defence & Strategic Trade',
    methods: ['System Dynamics', 'Learning-Curve Modeling', 'Scenario Analysis', 'Shock Injection', 'Bottom-Up BoE'],
    year: '2025 to 2026',
    status: 'ongoing',
    heroStat: { value: '₹25,000 cr', label: 'proposed National Combat Drone Mission, sized at ~12% of one year\'s tactical procurement' },
    chart: 'drone',
    sections: [
      {
        heading: 'The model',
        body: 'The ecosystem is modeled as interacting stocks: manufacturing capacity, active fleet, cumulative production, export revenue, startup capital, and a counter-drone subsystem. Learning curves cut unit cost with every production doubling. Shock functions inject the May and June 2025 geopolitical events; adversary stock growth drives counter-drone demand through a threat coupling. State disaggregation (Karnataka 25%, Uttar Pradesh 35%, Maharashtra 20% shares) runs in the annexure.',
      },
      {
        heading: 'The evidence discipline',
        body: 'The Basis of Estimates annexure separates three classes of numbers: sourced facts (₹38,424 crore exports; MQ-9B at 31 aircraft for $3.99B; TAPAS closed in mission mode; Kaveri dry at 49 to 51 kN), derived estimates (1.5 to 2.4 lakh jobs by 2035, built bottom-up from JM Financial market projections and Baykar productivity benchmarks), and propositions (the bridge-and-supplement thesis). Nothing masquerades across classes.',
      },
      {
        heading: 'The mission sizing',
        body: 'The proposed ₹25,000 crore National Combat Drone Mission (₹2,500 crore per year average, ~1.1% of the FY27 defence capital head) funds: Kaveri dry-engine certification and small-series production (₹2,000 to 2,500 crore), two to three 500-class UCAV/MALE programmes with private primes (₹8,000 to 10,000 crore), counter-UAS test ranges (₹1,500 to 2,000 crore), EXIM export-credit windows (₹3,000 crore corpus), skilling for ~50,000 operators (₹1,000 to 1,500 crore), and iDEX-style challenge grants (₹2,000 crore).',
      },
      {
        heading: 'Findings',
        body: 'Scenario comparison across six futures (baseline, national mission, export-led, combined, arms race, combined counter-drone) shows the composition effect: counter-drone depth beats fleet size in early conflict windows, and export-led growth compounds through the learning curve. The chart below runs all six scenarios live across five metrics, from the same equations as the research model.',
      },
    ],
    inference:
      'The binding constraint on India\'s drone ambition is not money or demand but the certified-engine bottleneck and the financing gap between a ₹120 crore PLI and a ₹20,000 crore procurement pipeline. Learning curves make export-led growth self-reinforcing: each production doubling cuts unit cost, which widens the export market, which accelerates doublings. Counter-drone investment follows a different logic: it is threat-coupled (adversary stocks drive demand), so it pays as insurance even when fleet growth stalls. The Mission\'s ₹2,500 crore per year is deliberately a seed: it buys the engine certification that unlocks both loops.',
    implications: [
      'Engine certification (Kaveri dry) is the single highest-leverage allocation: it converts imported-powerplant dependency into export-eligible autonomy.',
      'The PLI at ₹120 crore was an order of magnitude too small to move the ecosystem; mission-scale instruments in India run ₹15,000 to 75,000 crore.',
      'Counter-drone depth is early-conflict capital: fleet-size comparisons mislead in the first windows of a contingency.',
    ],
    recommendations: [
      'Fund Kaveri dry-engine certification and small-series production first (₹2,000 to 2,500 crore within the Mission); every other programme inherits its margin.',
      'Create EXIM export-credit windows (₹3,000 crore corpus) so export-led learning curves are financeable by mid-size firms, not only primes.',
      'Set 80% indigenous-content thresholds for contracts above ₹500 crore to anchor the learning curve domestically.',
      'Build counter-UAS test ranges into the Mission envelope; the threat coupling means deterrence value accrues before any shot is fired.',
    ],
    methodology: [
      { step: 'Stock-and-flow build', detail: 'Manufacturing capacity, fleet, cumulative production, exports, startup capital, counter-drone subsystem; learning-curve cost linkage.' },
      { step: 'Calibration anchors', detail: 'Sourced facts only for levels: ₹38,424 crore exports, ₹1.78 lakh crore production, MQ-9B $3.99B, JM Financial ₹32,600 crore → ₹1.77 lakh crore market path.' },
      { step: 'Derived estimates', detail: 'Jobs (1.5 to 2.4 lakh) and Mission sizing (₹25,000 crore) built bottom-up in the BoE annexure with every multiplier shown.' },
      { step: 'Scenario engine', detail: 'Six scenarios with shock functions for May/June 2025 geopolitical events; five metrics; state shares for the Karnataka/UP/Maharashtra annexure.' },
      { step: 'Live port', detail: 'The v2 model ported to TypeScript; the chart on this page runs the research equations in-browser.' },
    ],
    sources: [
      { name: 'PIB / MoD releases', role: 'Budget lines, programme milestones, MQ-9B and TAPAS facts' },
      { name: 'JM Financial (June 2026)', role: 'Drone ecosystem market trajectory ₹32,600 cr → ₹1.77 lakh cr' },
      { name: 'Baykar disclosures / Revelio Labs', role: 'Productivity benchmark for the employment build-up' },
      { name: 'IDSA / PRS / Carnegie', role: 'Strategic context and programme analysis' },
      { name: 'Author\'s Basis of Estimates annexure', role: 'Full derivation trail for every non-sourced number' },
    ],
    dataHighlights: [
      { label: 'Sourced anchor', value: '₹38,424 cr', note: 'drone exports; ₹7.85 lakh cr defence budget' },
      { label: 'Market path', value: '₹32,600 cr → ₹1.77 lakh cr', note: '2025 → 2030 (JM Financial)' },
      { label: 'Jobs estimate', value: '1.5 to 2.4 lakh', note: 'by ~2035; bottom-up, conservative band' },
      { label: 'Mission ask', value: '₹25,000 cr / 10 yr', note: '≈1.1% of FY27 defence capital head per year' },
      { label: 'Scenarios', value: '6 futures × 5 metrics', note: 'all live on this page' },
    ],
  },

  {
    slug: 'flfpr-decomposition',
    title: 'Anatomy of the Gender Gap',
    tagline:
      'Decomposing female labor-force participation between main and marginal work, with a causal test of whether the electoral-technology shock that moved voting also moved work.',
    domain: 'Electoral Systems',
    methods: ['Decomposition', 'Panel Regressions', 'Cross-Gender Interaction Tests', 'Measurement Verification'],
    year: '2024 to 2025',
    status: 'ongoing',
    heroStat: { value: 'null, twice', label: 'the labor-margin moderation dies by every inference method; the voting channel stays the live finding' },
    sections: [
      {
        heading: 'Measurement first',
        body: 'The female labor-force puzzle in India is partly a measurement artifact: main-status and marginal-status work move differently across surveys and years. A three-regression architecture separates the real gradient from coding noise, with name normalization and urban imputation fixes verified in a dedicated Tier-2.1 measurement pass before any causal claim.',
      },
      {
        heading: 'The cross-margin test',
        body: 'Does the EVM shock that moved female voting also move female work? Cross-gender interaction tests across labor and turnout margins, run same-sex and cross-sex (F×M, M×F), separate empowerment narratives from labor-supply constraints. The audit-cleaned result: the labor-margin moderation is null by every inference method (clustered, RI, wild bootstrap, BH-corrected).',
      },
      {
        heading: 'Why the null is load-bearing',
        body: 'The null disciplines the story: EVMs moved voting where social permission existed (the EC98 gradient), but did not move labor supply. Voting is a low-cost, high-legitimacy act; labor-force entry is a household-negotiated economic decision. The technology-integrity channel and the economic-empowerment channel are different channels, and the data keeps them separate.',
      },
    ],
    inference:
      'Main-status and marginal-status female work decompose differently, and the EVM interaction on the labor margin is null across every inference method after the measurement audit. Combined with the voting-margin finding (EC98 × EVM at −7.4 pp clustered), the pair reads: integrity technology shifted civic participation without shifting economic participation. The gender-gap difference test in the voting margin (p = .087) is underpowered rather than clearly null; the labor margin is clearly null, which is what makes the voting finding interpretable as civic rather than economic.',
    implications: [
      'Political inclusion and labor inclusion are separable margins; one cannot be cited as evidence of the other.',
      'Survey measurement (main vs marginal status) is not a technicality: the decomposition changes which gradients are real.',
      'A null on the labor margin raises the credibility of the voting-margin finding by ruling out a general empowerment shock.',
    ],
    recommendations: [
      'Labor surveys should publish main and marginal status series separately, with documented coding audits; the aggregate conflates distinct margins.',
      'Empowerment interventions should not borrow civic-participation evidence as labor-market evidence; evaluate each margin on its own instrumentation.',
      'The three-regression measurement architecture is reusable for any FLGPS/PLFS-based analysis; ship it as documentation, not folklore.',
    ],
    methodology: [
      { step: 'Decomposition', detail: 'Main vs marginal status work decomposed across survey rounds; three-regression architecture with fixed measurement contracts.' },
      { step: 'Data hygiene', detail: 'Name normalization and urban imputation fixes verified in a Tier-2.1 measurement pass (the same audit family that caught the EVM mislabelling).' },
      { step: 'Interaction battery', detail: 'EVM × FLFPR interactions run same-sex (F×F, M×M) and cross-sex (F×M, M×F), clustered, RI-permuted, wild-bootstrapped, BH-corrected.' },
      { step: 'Verdict discipline', detail: 'Null reported at the same prominence as any surviving result; the voting-channel finding carries the project.' },
    ],
    sources: [
      { name: 'National Sample Survey rounds', role: 'Employment status (main/marginal), district panels' },
      { name: 'Election Commission of India', role: 'Turnout and EVM rollout for the cross-margin test' },
      { name: 'Census / Economic Census', role: 'Denominators and norm-intensity moderators' },
    ],
    dataHighlights: [
      { label: 'Labor-margin EVM interaction', value: 'null', note: 'all methods: clustered, RI, wild bootstrap, BH q' },
      { label: 'Measurement audit', value: 'Tier-2.1', note: 'same protocol that killed the FLFPR mislabelling upstream' },
      { label: 'Voting margin (contrast)', value: '−7.4 pp', note: 'the channel that survives, on its own instrumentation' },
    ],
  },

  {
    slug: 'green-bond-npv',
    title: 'Pricing a Green Masala Bond',
    tagline:
      'NPV and risk analysis of NTPC\'s 2016 green masala bond: the first from an Indian issuer, priced at quasi-sovereign levels, with the green label worth exactly nothing in yield. That number is the finding.',
    domain: 'Climate & Water',
    methods: ['NPV Modeling', 'Benchmark Spread Analysis', 'Currency-Basis Decomposition', 'Risk Ranking'],
    year: '2024',
    status: 'published',
    heroStat: { value: '+40 bp', label: 'spread over the matched 5-year G-sec; the green premium was zero' },
    sections: [
      {
        heading: 'The instrument',
        body: 'On 3 August 2016 NTPC priced US$300 million (₹20 billion) of five-year, rupee-denominated, senior unsecured bonds offshore: the first green masala bond from an Indian issuer, the first five-year masala from an Indian corporate, dual-listed in London and Singapore. Priced at 99.575 with a 7.375% coupon to yield 7.48%, certified under the Climate Bonds Standard with KPMG verification.',
      },
      {
        heading: 'The pricing evidence',
        body: 'The book-build targeted ₹10 billion, drew over ₹29 billion, and upsized to ₹20 billion (1.45x cover). In the pricing week the matched five-year benchmark (7.80% GS 2021) closed at 7.08%: the printed spread was ~40 basis points over five-year, ~31 over ten-year. Investors priced five-year NTPC credit at close to sovereign levels. NPV on ₹1,00,000 at issue price, discounted at the 7.08% benchmark: +₹1,632 (1.6% of outlay); at the bond\'s own 7.48% yield the discounting returns exactly 99.575, the internal-consistency check.',
      },
      {
        heading: 'The currency sting',
        body: 'Rupee denomination shifts currency risk to investors. The rupee slid from ₹66.90 to ₹74.12 per dollar over the bond\'s life: a dollar-based holder earned about 5.3% annualized gross (4.9% after the 5% Section 194LC withholding), not the printed 7.48%. The green label commanded no visible yield discount; the 40 bp spread left no cushion for any deviation.',
      },
      {
        heading: 'Risk ranking',
        body: 'Currency first (by design, on the investor). Power-sector payment and regulatory risk second (blunted by cost-plus tariffs, state ownership, and CRISIL\'s explicit expectation of government distress support). Use-of-proceeds risk third (real safeguards: CBS certification, KPMG assurance, allocation disclosure; residual concern qualitative: a "brown to green" label on a coal-heavy balance sheet). The more realistic 2016 downside was reinvestment: principal returned in August 2021 into materially lower yields.',
      },
    ],
    inference:
      'Green premia are small relative to currency-basis swings: the label is real but second-order. The market priced NTPC\'s quasi-sovereign credit at G-sec + 40 bp and ignored the green certification entirely; meanwhile the currency basis moved 2.1% per year against dollar investors, an order of magnitude larger than any plausible green premium. Climate-finance architecture should therefore price currency hedges into project bankability rather than treating greenness as the discount.',
    implications: [
      'The green label is a use-of-proceeds assurance, not a pricing factor, in shallow labelled markets: issuance strategy should not budget for a green discount.',
      'For dollar-based investors, the currency basis dominates every other feature of rupee-denominated paper; hedging costs belong in the instrument design conversation.',
      'Quasi-sovereign issuers can open instrument classes (first green, first tenor, dual listing) at near-sovereign spreads: template value beyond the single deal.',
    ],
    recommendations: [
      'Structure future masala issues with currency-hedge wrappers or partial denomination matching; the 2016 unhedged design exported the risk by construction.',
      'Green-bond frameworks should publish allocation and impact disclosure as NTPC did; it costs little and anchors the label against drift on coal-heavy balance sheets.',
      'Policy: widen the concessional withholding (194LC) framework to hedged structures, aligning the tax code with the actual risk architecture.',
    ],
    methodology: [
      { step: 'Cash-flow reconstruction', detail: 'Bullet structure from offering-circular terms: 99.575 issue price, ₹7,375 annual coupon, ₹1,07,375 at maturity on ₹1,00,000 nominal.' },
      { step: 'NPV', detail: 'Discounting at the matched 5-year G-sec close (7.08%), the monthly average (7.14%), and the 10-year close (7.17%); internal-consistency check at the bond\'s own 7.48% yield.' },
      { step: 'Currency decomposition', detail: 'RBI/FRED spot series Aug 2016 → Aug 2021 (66.90 → 74.12); dollar-return build with and without 194LC withholding.' },
      { step: 'Risk framework', detail: 'Ranked: currency (by design on investor), power-sector offtake/regulatory, use-of-proceeds; each assessed against the documented safeguards.' },
    ],
    sources: [
      { name: 'NTPC offering circular / exchange filings (2016)', role: 'Terms, price, coupon, listing' },
      { name: 'Climate Bonds Initiative (2016)', role: 'Certification, book-build cover, "brown to green" framing' },
      { name: 'FRED (EXINUS) / RBI', role: 'Rupee-dollar spot series for the currency decomposition' },
      { name: 'CRISIL / Moody\'s rationales', role: 'Credit anchors: AAA domestic, Baa3 foreign-currency cap, distress-support expectation' },
      { name: 'Nippon India weekly note (Aug 2016)', role: 'Matched G-sec benchmark closes for the spread math' },
    ],
    dataHighlights: [
      { label: 'Issue', value: 'US$300M', note: '₹20 billion, 5-year, 7.375% coupon, 7.48% yield' },
      { label: 'Cover', value: '1.45x', note: '₹29 billion orders on a ₹10 billion target, upsized' },
      { label: 'Spread', value: '+40 bp', note: 'over matched 5-year G-sec (7.08% close)' },
      { label: 'NPV', value: '+₹1,632 / lakh', note: '1.6% of outlay at the 7.08% discount' },
      { label: 'Dollar return', value: '≈5.3%', note: 'gross of 194LC withholding; 4.9% after' },
    ],
    dataTable: {
      title: 'NPV of ₹1,00,000 nominal at alternative benchmarks',
      columns: ['Discount rate', 'Basis', 'NPV (₹)'],
      rows: [
        ['7.08%', '5-yr G-sec close, pricing week', '+1,632'],
        ['7.14%', 'Aug 2016 monthly average', '+1,385'],
        ['7.17%', '10-yr G-sec close', '+1,262'],
        ['7.48%', 'bond\'s own yield (check)', '0 → price 99.575'],
      ],
      note: 'Full coupon and principal tables in the paper\'s Appendix A.',
    },
  },

  {
    slug: 'pm-speeches-dashboard',
    title: 'The Prime Ministerial Voice',
    tagline:
      'Semantic identity in Indian parliamentary speech, 1952 to 2025: thirteen Prime Ministers measured in the same embedding space, with inference at the level of the speech.',
    domain: 'Media & Information',
    methods: ['Sentence Embeddings', 'PERMANOVA', 'Bootstrap CIs', 'Permutation-Validated Classification'],
    year: '2024 to 2025',
    status: 'live',
    links: [
      { kind: 'dashboard', url: 'https://pmspeechesdashboard-1.vercel.app/', label: 'PM speeches dashboard' },
    ],
    heroStat: { value: '4.5× above chance', label: 'linear classifier recovers the speaker; PERMANOVA rejects interchangeability, p ≤ 0.001 at 4,999 permutations' },
    sections: [
      {
        heading: 'The claim',
        body: 'Every Indian PM speaks inside a narrow, shared parliamentary register: pairwise centroid similarity never falls below 0.75. Yet within that register, each voice is measurably distinct. Chunks sit far closer to their own PM\'s centroid than to any other; permutation tests reject interchangeability; and a simple linear classifier recovers the speaker 4.5 times above chance. The signature is real; it is just written in fine print.',
      },
      {
        heading: 'Inference discipline',
        body: 'Inference runs at the level of the speech, not the sentence fragment: 4,999-permutation PERMANOVA on speech-level centroids rejects voice interchangeability (p ≤ 0.001), with speech-level bootstrap confidence intervals on every distance. Thirteen PMs clear a ≥5-chunk data floor from 1952 to 2025; the classifier check is the falsifiable companion: if PM identity were noise, no model could name the speaker.',
      },
      {
        heading: 'Why rhetoric data',
        body: 'Speech allocation is an agenda instrument: computationally tracking it gives a leading indicator of policy emphasis that official documents reveal only with a lag. It is the same divergence toolkit as the elections project, pointed at the executive instead of the press: the map of who says what, when, is the map of attention itself.',
      },
    ],
    inference:
      'Prime-ministerial voice is measurably distinct within a shared register: centroid similarity ≥ 0.75 pairwise, but speech-level PERMANOVA rejects interchangeability at p ≤ 0.001 (4,999 permutations) and linear classification recovers the speaker 4.5× above chance. Rhetorical identity persists across seven decades of Indian parliamentary speech, which makes rhetorical drift, when it occurs, a signal worth tracking rather than noise to be averaged away.',
    implications: [
      'The shared register is the story behind the story: Indian executive rhetoric is institutionally constrained, so deviations are informative.',
      'Speech-level inference (not sentence-level) is what makes the claim statistical rather than anecdotal; chunk-level significance would be inflated by construction.',
      'A validated voice-print enables longitudinal agenda tracking: the same space that identifies the speaker can measure what the speaker moved toward.',
    ],
    recommendations: [
      'Institutional researchers should maintain embedding-based speech archives with speech-level metadata; the pipeline is cheap once built and the longitudinal value compounds.',
      'Policy communication teams can use the classifier honestly: voice distinctiveness is measurable, and message discipline versus message shift becomes quantifiable.',
      'Extend the frame to question hour and budget speeches: the register varies by instrument, and the variation is itself an agenda signal.',
    ],
    methodology: [
      { step: 'Corpus', detail: 'Parliamentary speeches 1952 to 2025; 13 PMs pass a ≥5-chunk data floor.' },
      { step: 'Embedding', detail: 'Sentence embeddings in one shared space; speech-level centroids as units of analysis.' },
      { step: 'Group testing', detail: 'PERMANOVA, 4,999 permutations, p ≤ 0.001; speech-level bootstrap CIs on pairwise distances.' },
      { step: 'Falsification check', detail: 'Linear classifier on the same space: 4.5× above chance speaker recovery; the identity signal survives a supervised probe.' },
      { step: 'Reporting', detail: 'Executive dashboard with "How to read" notes per figure; every mark hoverable, every PM traceable across panels.' },
    ],
    sources: [
      { name: 'Parliamentary speech records (Lok Sabha digital library)', role: 'Speech corpus, 1952 to 2025' },
      { name: 'Prime Minister\'s Office archives', role: 'Speech texts and occasion metadata' },
    ],
    dataHighlights: [
      { label: 'Voice floor', value: '13 PMs', note: '≥5 chunks each, 1952 to 2025' },
      { label: 'Shared register', value: 'sim ≥ 0.75', note: 'pairwise centroid similarity minimum' },
      { label: 'PERMANOVA', value: 'p ≤ 0.001', note: '4,999 permutations, speech level' },
      { label: 'Classifier', value: '4.5× chance', note: 'linear probe on the same space' },
    ],
  },

  {
    slug: 'spatial-crosswalk',
    title: 'The Cookie-Cutter Crosswalk',
    tagline:
      'Bridging 400+ districts of spatial mismatch between historical constituency data and the 1991 Census. The infrastructure under every pre-2000 district analysis, validated and reusable.',
    domain: 'Electoral Systems',
    methods: ['Area-Weighted Interpolation', 'GeoJSON Engineering', 'Validation Tables', 'Temporal Bleed Handling'],
    year: '2024',
    status: 'published',
    heroStat: { value: '400+ districts', label: 'constituency-to-1991-district interpolation, validated against official urbanization anchors' },
    sections: [
      {
        heading: 'The problem',
        body: 'Parliamentary constituencies do not nest into census districts, and both redraw over time. Naive crosswalks inject measurement error that correlates with urbanization, exactly the variable political economy cares about. Historical constituency data also bleeds across temporal boundary vintages: using 2001 census covariates on 1998 elections is the subtle error that quietly invalidates designs (the EVM project caught and retired a strand for precisely this).',
      },
      {
        heading: 'The craft',
        body: 'The pipeline projects constituency demographics onto 1991 district boundaries using area-weighted interpolation with urban-rural splits preserved. Validation runs against official anchors: Maharashtra 38.7% and NCT Delhi 89.9% urbanization reproduced exactly. Reconciliation tables document every ambiguous boundary; temporal data bleed is handled by vintage-locked covariate files.',
      },
      {
        heading: 'Why infrastructure is a finding',
        body: 'The crosswalk is the least visible and most load-bearing component of the EVM research, and the horse-race result (EC98 vs urbanization at r = 0.02) is only credible because the geography underneath is. Other researchers doing pre-2000 district analysis inherit the same problem; the pipeline is built to be reused, not admired.',
      },
    ],
    inference:
      'Spatial mismatch is a first-order source of measurement error in Indian political-economy analysis, not a technicality: crosswalk error correlates with urbanization, the dominant confound in the space. Area-weighted interpolation with vintage-locked covariates and anchor validation reduces that error to documented, bounded amounts, and the validation anchors (exact state-level urbanization matches) make the quality checkable rather than asserted.',
    implications: [
      'Any district-level analysis spanning constituency data inherits crosswalk error as a confound; the error is not random and is anti-conservative on urban questions.',
      'Vintage discipline (1991 covariates for 1990s outcomes) is the difference between a design and a coincidence; temporal bleed is the quiet killer.',
      'Validation anchors turn infrastructure claims into testable ones: if your crosswalk cannot reproduce Maharashtra 38.7%, it has a bug.',
    ],
    recommendations: [
      'Publish crosswalks as versioned artifacts with validation tables, so downstream papers can cite a geography rather than improvise one.',
      'Adopt vintage-locked covariate files as standard practice in Indian political-economy replication packages.',
      'Extend the same anchor-validation discipline to state assembly crosswalks; the machinery transfers directly.',
    ],
    methodology: [
      { step: 'Boundary acquisition', detail: 'Constituency (1996 to 2004 vintages) and 1991 district boundaries as GeoJSON, topology-checked.' },
      { step: 'Interpolation', detail: 'Area-weighted allocation of constituency demographics onto 1991 districts; urban-rural splits preserved through the intersection.' },
      { step: 'Validation', detail: 'Official urbanization anchors (Maharashtra 38.7%, NCT Delhi 89.9%) reproduced exactly; reconciliation tables for ambiguous boundaries.' },
      { step: 'Vintage lock', detail: 'Temporal bleed eliminated by covariate-vintage locking; 2001 covariates flagged as post-treatment for 1990s designs.' },
    ],
    sources: [
      { name: 'Election Commission of India', role: 'Constituency boundaries and rolls, 1996 to 2004' },
      { name: 'Census of India 1991', role: 'District boundaries, demographics, urbanization anchors' },
      { name: 'Delimitation records', role: 'Boundary-change reconciliation' },
    ],
    dataHighlights: [
      { label: 'Coverage', value: '400+ districts', note: 'full 1991 district frame' },
      { label: 'Anchor match', value: 'exact', note: 'Maharashtra 38.7%, NCT Delhi 89.9% urbanization' },
      { label: 'Upstream users', value: 'EVM project', note: 'every DiD, DDD and horse race runs on this geography' },
    ],
  },

  {
    slug: 'evm-dashboard',
    title: 'EVM Explorer',
    tagline:
      'The interactive Streamlit companion to the EVM thesis. Slice the DiD results district by district, with the placebo tests and the robustness battery one toggle away.',
    domain: 'Electoral Systems',
    methods: ['Streamlit', 'Plotly', 'Cohort Slicing', 'Side-by-Side Inference'],
    year: '2025',
    status: 'live',
    link: 'https://shivang-thesis.streamlit.app/',
    heroStat: { value: 'Live', label: 'deployed on Streamlit Cloud; every chart carries its uncertainty' },
    sections: [
      {
        heading: 'The app',
        body: 'The public face of the EVM research: a dashboard that lets anyone slice the DiD estimates by state cohort, gender margin, and norm-intensity tercile, with placebo tests and the robustness battery one toggle away. It exists because the finding has structure (an average null hiding a concentrated gradient), and structure requires interaction to be seen.',
      },
      {
        heading: 'Design principle',
        body: 'Every chart carries its uncertainty: clustered, bootstrapped, and randomization-inference p-values appear side by side, because in few-treated-cluster settings the choice of inference method changes the story. The dashboard shows the disagreement rather than picking a winner; the thesis text explains why the wild bootstrap and RI disagree, and what that disagreement means.',
      },
    ],
    inference:
      'The Explorer operationalizes the thesis\'s central epistemic position: no single inference method is authoritative here, so the app displays the battery. Slicing by cohort and tercile surfaces the concentrated-gradient structure (the EC98 pattern) that the national average hides, and the placebo cycle (1996 to 1998) is one click away to keep the pre-trend question permanently visible.',
    implications: [
      'Interactive uncertainty display changes how non-specialists consume econometrics: the disagreement between methods becomes a visible, discussable object.',
      'Dashboards are the right format for structured nulls: an average null looks like nothing in a table and like a distribution in a slicer.',
    ],
    recommendations: [
      'Thesis-linked dashboards should ship the inference battery, not just point estimates; transparency about method disagreement builds more trust than false precision.',
      'Streamlit-class tools are enough: the marginal value is in the slicing logic, not the interface polish.',
    ],
    methodology: [
      { step: 'Backend', detail: 'The corrected DiD/DDD result tables loaded from the thesis pipeline outputs (post-audit regenerated artifacts).' },
      { step: 'Slicing', detail: 'State cohort, gender margin, and EC98 tercile views; placebo cycle toggle; dose-cell means.' },
      { step: 'Uncertainty display', detail: 'Clustered, wild-bootstrap and RI p-values rendered side by side on every estimate.' },
    ],
    sources: [
      { name: 'EVM thesis pipeline (corrected outputs)', role: 'Result tables powering every view' },
      { name: 'Streamlit Cloud', role: 'Deployment' },
    ],
    dataHighlights: [
      { label: 'Views', value: 'cohort × gender × tercile', note: 'plus placebos and dose cells' },
      { label: 'Inference shown', value: '3 methods', note: 'clustered, wild bootstrap, RI, side by side' },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

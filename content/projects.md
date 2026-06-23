---
title: "Projects"
---

Here is a selection of my work at the intersection of public policy, data science, and technology.

### EVM Thesis & Interactive Data Dashboard
As part of my research and consulting on electoral systems, I developed an interactive data application to analyze Electronic Voting Machine (EVM) metrics and policy impacts.

* **[Launch the Interactive EVM Dashboard](https://shivang-thesis.streamlit.app/)**
* **Tech Stack:** Python, Streamlit, Pandas, Statsmodels, Data Visualization
* **Project Scope:** This research investigates the heterogeneous impact of Electronic Voting Machines (EVMs) on female voter turnout in India. Utilizing a continuous Difference-in-Differences (DiD) framework, the study reveals that electoral technology significantly boosts female political participation, but primarily in districts with deep-rooted patriarchal norms (measured via the child sex ratio) and existing female economic agency. The accompanying interactive dashboard translates these complex spatial and demographic datasets into accessible visualizations for evidence-based policy discussions.

### Spatial Data Engineering & The "Cookie-Cutter" Crosswalk
* **Tech Stack:** Python, Pandas, Spatial Analysis, Data Harmonization
* **Overview:** To bridge the spatial mismatch between historical Parliamentary Constituency (PC) election data and 1991 Census district boundaries, I engineered a custom area-weighted spatial crosswalk. This data pipeline resolved severe temporal data bleed-over and structural collinearity issues, successfully harmonizing over 400 districts and enabling the precise projection of constituency-level female voter demographics down to the granular census-tract level.

### Causal Inference & Econometric Robustness Architecture
* **Tech Stack:** Python, Statsmodels, Scikit-Learn, Econometrics
* **Overview:** This phase involved architecting a rigorous causal inference pipeline to validate the electoral technology shock. By implementing Frisch-Waugh-Lovell (FWL) theorem verifications, state-clustered standard errors, Inverse Probability Weighting (IPW), and a 1998 placebo pre-trend test, I isolated the true causal impact of EVMs. Furthermore, a "mechanism horse-race" regression disentangled economic capacity from cultural permission, proving that technology acts as a targeted intervention for marginalized women in highly patriarchal environments.

### Critical Minerals Data Architecture & Survivorship Bias Correction
* **Tech Stack:** Python, Pandas, Panel Data Engineering, Multi-Source Harmonization
* **Overview:** To model India's critical mineral supply chain (Lithium, Cobalt, Nickel, Graphite, Vanadium), I harmonized 9 heterogeneous datasets, including UN Comtrade, WGI, NY Fed GSCPI, UNCTAD LSCI, FRED, MOSPI IIP, IMF prices, and MEA policy buffers. Crucially, I engineered a balanced panel of 48,780 monthly observations across 271 bilateral dyads, implementing a structural zero-filling mechanism to eliminate survivorship bias. This ensures that supply chain collapses (zero-trade months) are captured as explicit risk signals rather than missing data. Target variables were rigidly defined using >40% YoY volume drops and >2.0σ price spikes to isolate genuine supply shocks from sporadic trade noise.

### Out-of-Distribution Forecasting & Tier-2 Upstream Risk Modeling
* **Tech Stack:** Python, XGBoost, SHAP, Inverse Probability Weighting (IPW), VIF Pruning
* **Overview:** Architected a dual-model XGBoost framework to predict bilateral supply disruptions. Addressing severe post-2022 regime shifts (Adversarial Validation AUC = 1.0), I implemented Inverse Probability Weighting (IPW) to correct covariate shift, achieving an out-of-distribution Test AUC of 0.855. The model demonstrated exceptional sensitivity, achieving 100% recall at a 10:1 theoretical cost ratio, and a deployed critical recall of 98.9%. I introduced a novel "Tier-2 Upstream Exposure" algorithm that correctly identifies processor hubs (e.g., Finland, Belgium) as critical chokepoints by aggregating upstream mining-country governance risks. Applied VIF pruning to eliminate multicollinearity and utilized SHAP for policy-interpretable feature attribution.

### Actuarial Reserve Sizing & Infrastructure Stress-Testing
* **Tech Stack:** Python, Actuarial Modeling, Monte Carlo Simulation, Policy Dashboard Design
* **Overview:** Translated probabilistic disruption forecasts into an actionable sovereign reserve framework for India's National Critical Minerals Mission (NCMM). Developed an actuarial model utilizing Time-to-Export-Bottleneck-Window (TEBW) weighting to calculate a $633M CapEx / $910M 5-year lifecycle strategic reserve under a Value-at-Risk (VaR) mandate. Conducted an actuarial simulation for the Galathea Bay transshipment hub, quantifying a $17.3M CapEx savings via maritime risk mitigation. Finally, I designed a Policy Toggle Dashboard allowing policymakers to dynamically adjust probability thresholds to balance false-alarm tolerance against catastrophic supply paralysis.

### Cross-Lingual NLP & Zero-Noise Semantic Clustering
* **Tech Stack:** Python, HuggingFace Transformers, BGE-M3, BERTopic, UMAP, HDBSCAN
* **Overview:** Engineered a high-density cross-lingual NLP pipeline to analyze 75,000 English and Hindi news articles during the 2024 Indian General Elections. By migrating from monolingual MPNet embeddings to the BAAI/bge-m3 cross-lingual transformer, I resolved severe semantic fragmentation and eliminated the 40% "noise bin" (Topic -1) typical of unsupervised clustering. Implemented a post-hoc Forensic Topic Audit to map dense vector spaces into a symmetric "Core 3" political taxonomy (Electoral, Judicial, Welfare), ensuring mathematically valid cross-lingual comparisons without algorithmic artifacts.

### Information Supply Constraints & Agenda Synchronization
* **Tech Stack:** Python, SciPy, Jensen-Shannon Divergence (JSD), Time-Series Analysis
* **Overview:** Investigated whether institutional shocks fracture or synchronize multilingual media ecosystems. Utilizing Jensen-Shannon Divergence (JSD) across the Core 3 taxonomy, I discovered a statistically significant *convergence* ($\Delta$ JSD = -0.017, $p=0.011$) in agenda allocation following the Model Code of Conduct (MCC). To disentangle the MCC's supply-side constraints from generic "election hype," I engineered a bucket-level shift analysis proving that the MCC specifically starved the vernacular "micro-patronage" news cycle (Hindi Welfare coverage dropped 2.6pp), forcing a structural reallocation toward electoral conflict, while elite macro-institutional coverage (English) remained insulated.

### Fractional Logit & Phase-Based Causal Inference Architecture
* **Tech Stack:** Python, Statsmodels, Generalized Linear Models (GLM), Econometrics, Panel Data
* **Overview:** Architected a rigorous causal inference engine to isolate the institutional impact of the MCC on media tone. I identified and resolved a fatal collinearity trap in standard Comparative Interrupted Time Series (CITS) models, where calendar-week fixed effects absorbed the treatment shock. To correctly model bounded proportion data (weekly negativity rates) and prevent boundary violations inherent in OLS, I upgraded the econometric engine to a Fractional Logit specification (Binomial GLM) weighted by article volume. By mapping continuous time to discrete Election Phases and extracting Average Marginal Effects (AME), I proved a robust null result: institutional constraints synchronize the agenda but do not causally fracture the evaluative register.

### Dynamic Panel Econometrics & WEFE Nexus Groundwater Modeling
* **Tech Stack:** Econometrics, Difference-GMM, Dynamic Panel Data Models, Spatial Data Proxies
* **Overview:** Architected a district-level econometric model to analyze severe groundwater depletion in the Indo-Gangetic basin through the Water-Energy-Food-Environment (WEFE) nexus. Implemented a Difference-GMM dynamic panel specification to correct for endogeneity and "Nickell bias" associated with the aquifer's autoregressive hydraulic memory. By rigorously establishing the causal weights of tubewell density, canal infrastructure, and energy subsidies against baseline climate stress (PET and rainfall), this engine quantified the exact historical elasticity of state agricultural and energy interventions.

### Stochastic Forecasting & Infrastructure Stress-Testing
* **Tech Stack:** Monte Carlo Simulation, Stochastic Forecasting, Block-Bootstrapping, Predictive Modeling, SSP Scenario Analysis
* **Overview:** Engineered a stochastic forecasting engine to project basin-level water security out to 2050 across five distinct climate and policy trajectories (ranging from SSP5-8.5 Unchecked Growth to Institutional Rescue). Translated deterministic Difference-GMM parameters into a probabilistic model utilizing 10,000 Monte Carlo simulations, incorporating spatial correlation via block-bootstrapped historical residuals. This simulation successfully mapped physical water table trajectories, identifying the exact temporal horizons for systemic infrastructure failure—specifically the 15-meter (handpump failure by 2029) and 25-meter (diesel pump exclusion by 2035) economic viability thresholds.

### Electrification-Conditioned Policy & Distributional Impact Modeling
* **Tech Stack:** Interaction-Term Modeling, Policy Optimization, Distributional Analysis, Satellite Data (VIIRS-DNB)
* **Overview:** Designed a structural interaction model to measure the spatial heterogeneity of policy transmission. By utilizing within-district z-score normalized Night-Time Lights (NTL) as a validated proxy for rural grid penetration, the model calculated an exact "Electrification-Conditioned Elasticity." This proved mathematically that the conservation power of energy tariff hikes is significantly stronger in highly electrified districts, while blanket hikes in grid-deficient areas cause severe distributional harm to marginalized smallholder farmers. The analysis culminated in a data-backed, tripartite policy mandate: expanding rural electrification, transmitting targeted conservation pricing, and simultaneously deploying surface-water canals.

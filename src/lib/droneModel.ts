/**
 * Combat-drone ecosystem model, ported from India_Combat_Drone_SD_Model_v2.py.
 * National-level stock-and-flow core with learning curves, geopolitical shocks,
 * and the six scenarios from _apply_scenario(). Monthly RK4-style Euler steps.
 */

export const BASE = {
  T_START: 2024.0,
  T_END: 2035.0,
  CAPACITY_DECAY_RATE: 0.05,
  INVESTMENT_PER_CAPACITY: 5.0,
  MAX_CAPACITY_GROWTH_RATE: 0.40,
  DRONE_LIFESPAN: 12.0,
  LEARNING_RATE: 0.15,
  BASE_UNIT_COST: 75.0,
  GLOBAL_MARKET_2026: 250000.0,
  GLOBAL_MARKET_GROWTH: 0.11,
  MAX_MARKET_SHARE: 0.08,
  PLI_INFLOW: 120.0,
  VC_INFLOW_BASE: 500.0,
  VC_GROWTH_RATE: 0.15,
  EXIM_REINVEST_FRACTION: 0.10,
  DEFENCE_BUDGET_2026: 785000.0,
  DEFENCE_BUDGET_GROWTH: 0.08,
  DRONE_BUDGET_SHARE: 0.025,
  CUAS_BUDGET_SHARE: 0.008,
  CUAS_BUDGET_GROWTH: 0.12,
  CUAS_BASE_UNIT_COST: 8.0,
  CUAS_LEARNING_RATE: 0.12,
  CUAS_LIFESPAN: 8.0,
  CUAS_INITIAL_CUMULATIVE: 50.0,
  BASE_INTERCEPT_RATE: 0.45,
  CUAS_EFFECTIVENESS_BONUS: 0.12,
  MAX_INTERCEPT_RATE: 0.92,
  ADVERSARY_DRONE_BASE: 2000.0,
  ADVERSARY_GROWTH_RATE: 0.06,
  ADVERSARY_COUNTER_UAS: 1000.0,
  CUAS_MAX_MARKET_SHARE: 0.08,
  SINDOOR_DATE: 2025.33,
  SPIDERWEB_DATE: 2025.42,
  SINDOOR_DOMESTIC_MULT: 0.50,
  SPIDERWEB_EXPORT_MULT: 0.30,
  SINDOOR_CUAS_MULT: 0.80,
  SHOCK_DECAY_RATE: 0.25,
  STATE_DRONE_SHARE: 1.0,
  // initial stocks (national)
  INIT: { capacity: 100.0, fleet: 500.0, cumProd: 800.0, exportRev: 73.0, capital: 2000.0, cuasFleet: 80.0 },
} as const;

export type Params = typeof BASE;

export type ScenarioKey =
  | 'baseline' | 'national_drone_mission' | 'export_led'
  | 'combined' | 'arms_race' | 'combined_counter_drone';

export const SCENARIOS: { key: ScenarioKey; label: string }[] = [
  { key: 'baseline', label: 'baseline' },
  { key: 'national_drone_mission', label: 'national drone mission' },
  { key: 'export_led', label: 'export led' },
  { key: 'combined', label: 'combined' },
  { key: 'arms_race', label: 'arms race' },
  { key: 'combined_counter_drone', label: 'combined + counter-drone' },
];

function applyScenario(p: Params, sc: ScenarioKey): Params {
  const q: any = { ...p };
  switch (sc) {
    case 'national_drone_mission':
      q.PLI_INFLOW = 2500.0;
      q.INVESTMENT_PER_CAPACITY = 3.5;
      q.MAX_CAPACITY_GROWTH_RATE = Math.min(p.MAX_CAPACITY_GROWTH_RATE * 1.5, 0.60);
      q.VC_INFLOW_BASE = p.VC_INFLOW_BASE * 2.0;
      q.DRONE_BUDGET_SHARE = 0.04;
      q.CAPACITY_DECAY_RATE = 0.03;
      break;
    case 'export_led':
      q.MAX_CAPACITY_GROWTH_RATE = Math.min(p.MAX_CAPACITY_GROWTH_RATE * 1.3, 0.55);
      q.VC_INFLOW_BASE = p.VC_INFLOW_BASE * 2.0;
      q.EXIM_REINVEST_FRACTION = 0.20;
      q.DRONE_BUDGET_SHARE = 0.02;
      break;
    case 'combined':
      q.PLI_INFLOW = 2500.0;
      q.INVESTMENT_PER_CAPACITY = 3.0;
      q.MAX_CAPACITY_GROWTH_RATE = Math.min(p.MAX_CAPACITY_GROWTH_RATE * 1.6, 0.65);
      q.VC_INFLOW_BASE = p.VC_INFLOW_BASE * 2.5;
      q.EXIM_REINVEST_FRACTION = 0.20;
      q.DRONE_BUDGET_SHARE = 0.045;
      q.CAPACITY_DECAY_RATE = 0.03;
      q.MAX_MARKET_SHARE = 0.10;
      break;
    case 'arms_race':
      q.ADVERSARY_DRONE_BASE = 3500.0;
      q.ADVERSARY_GROWTH_RATE = 0.10;
      q.ADVERSARY_COUNTER_UAS = 1800.0;
      q.CUAS_BUDGET_SHARE = p.CUAS_BUDGET_SHARE * 2.5;
      q.CUAS_BUDGET_GROWTH = 0.18;
      q.SINDOOR_CUAS_MULT = 1.20;
      q.DRONE_BUDGET_SHARE = 0.04;
      q.MAX_CAPACITY_GROWTH_RATE = Math.min(p.MAX_CAPACITY_GROWTH_RATE * 1.2, 0.50);
      break;
    case 'combined_counter_drone':
      q.PLI_INFLOW = 2500.0;
      q.INVESTMENT_PER_CAPACITY = 3.0;
      q.MAX_CAPACITY_GROWTH_RATE = Math.min(p.MAX_CAPACITY_GROWTH_RATE * 1.6, 0.65);
      q.VC_INFLOW_BASE = p.VC_INFLOW_BASE * 2.5;
      q.EXIM_REINVEST_FRACTION = 0.20;
      q.DRONE_BUDGET_SHARE = 0.045;
      q.CAPACITY_DECAY_RATE = 0.03;
      q.MAX_MARKET_SHARE = 0.10;
      q.CUAS_BUDGET_SHARE = p.CUAS_BUDGET_SHARE * 2.0;
      q.CUAS_BUDGET_GROWTH = 0.15;
      q.SINDOOR_CUAS_MULT = 1.00;
      q.CUAS_MAX_MARKET_SHARE = 0.08;
      break;
  }
  return q as Params;
}

export type Row = { t: number; fleet: number; capacity: number; cuasFleet: number; exportRev: number; intercept: number };

/** Monthly Euler integration of the drone_ode_v2 core (national). */
export function simulate(scenario: ScenarioKey): Row[] {
  const p0 = applyScenario(BASE, scenario);
  const months = Math.round((BASE.T_END - BASE.T_START) * 12);
  const dt = 1 / 12;

  let capacity = BASE.INIT.capacity;
  let fleet = BASE.INIT.fleet;
  let cumProd = BASE.INIT.cumProd;
  let exportRev = BASE.INIT.exportRev;
  let capital = BASE.INIT.capital;
  let cuasFleet = BASE.INIT.cuasFleet;

  const rows: Row[] = [];

  for (let i = 0; i <= months; i++) {
    const t = BASE.T_START + i * dt;
    const years = t - BASE.T_START;

    // learning curves
    const bDrone = -Math.log2(1 - p0.LEARNING_RATE);
    const droneLearning = Math.pow(cumProd / Math.max(BASE.INIT.cumProd, 1), -bDrone);
    const unitCost = p0.BASE_UNIT_COST * droneLearning;

    const cuasCum = cuasFleet + p0.CUAS_INITIAL_CUMULATIVE;
    const bCuas = -Math.log2(1 - p0.CUAS_LEARNING_RATE);
    const cuasLearning = Math.pow(cuasCum / Math.max(p0.CUAS_INITIAL_CUMULATIVE, 1), -bCuas);
    const cuasUnitCost = p0.CUAS_BASE_UNIT_COST * cuasLearning;

    // shocks
    const sindoor = t > p0.SINDOOR_DATE ? p0.SINDOOR_DOMESTIC_MULT * Math.exp(-p0.SHOCK_DECAY_RATE * (t - p0.SINDOOR_DATE)) : 0;
    const spider = t > p0.SPIDERWEB_DATE ? p0.SPIDERWEB_EXPORT_MULT * Math.exp(-p0.SHOCK_DECAY_RATE * (t - p0.SPIDERWEB_DATE)) : 0;
    const cuasShock = t > p0.SINDOOR_DATE ? p0.SINDOOR_CUAS_MULT * Math.exp(-p0.SHOCK_DECAY_RATE * (t - p0.SINDOOR_DATE)) : 0;

    // adversary
    const advFleet = p0.ADVERSARY_DRONE_BASE * Math.pow(1 + p0.ADVERSARY_GROWTH_RATE, t - 2024);
    const advCuas = p0.ADVERSARY_COUNTER_UAS * (1 + 0.10 * years);

    // intercept rate
    let intercept = p0.BASE_INTERCEPT_RATE + p0.CUAS_EFFECTIVENESS_BONUS * Math.log(1 + cuasFleet / Math.max(advCuas, 1));
    intercept = Math.min(intercept, p0.MAX_INTERCEPT_RATE);

    // budgets & demand
    const budget = p0.DEFENCE_BUDGET_2026 * Math.pow(1 + p0.DEFENCE_BUDGET_GROWTH, t - 2026);
    const droneBudget = budget * p0.DRONE_BUDGET_SHARE * p0.STATE_DRONE_SHARE;
    const domesticUnits = (droneBudget / Math.max(unitCost, 1)) * (1 + sindoor);

    const globalMarket = p0.GLOBAL_MARKET_2026 * Math.pow(1 + p0.GLOBAL_MARKET_GROWTH, t - 2026);
    const experienceShare = 0.0006 * (1 + 0.15 * Math.log(1 + cumProd / Math.max(BASE.INIT.cumProd, 1)));
    let premium = 1.0;
    if (t > p0.SINDOOR_DATE) premium += 0.20;
    if (t > p0.SPIDERWEB_DATE) premium += 0.15;
    const share = Math.min(experienceShare * premium, p0.MAX_MARKET_SHARE);
    const exportUnits = (globalMarket * share * (1 + spider)) / Math.max(unitCost, 1);
    const totalDroneDemand = domesticUnits + exportUnits;

    const cuasBudget = budget * p0.CUAS_BUDGET_SHARE * p0.STATE_DRONE_SHARE;
    const cuasDemandUnits = (cuasBudget / Math.max(cuasUnitCost, 1)) * (1 + cuasShock);
    const threatMult = 1 + 0.05 * Math.log(1 + fleet / 500);
    const totalCuasDemand = cuasDemandUnits * threatMult;

    // flows
    const production = Math.min(capacity, totalDroneDemand);
    const decommissioning = fleet / p0.DRONE_LIFESPAN;
    const cuasDecom = cuasFleet / p0.CUAS_LIFESPAN;

    const demandGap = Math.max(0, totalDroneDemand - capacity) / Math.max(capacity, 1);
    const capInvest = Math.min(
      capital / Math.max(p0.INVESTMENT_PER_CAPACITY, 0.1),
      capacity * p0.MAX_CAPACITY_GROWTH_RATE * (1 + demandGap)
    );
    const capDeploy = capInvest * p0.INVESTMENT_PER_CAPACITY;

    const exportFlow = production * Math.min(exportUnits / Math.max(totalDroneDemand, 1), 0.5);
    const exportRevFlow = exportFlow * unitCost;

    const pli = p0.PLI_INFLOW * p0.STATE_DRONE_SHARE;
    const vc = p0.VC_INFLOW_BASE * (1 + p0.VC_GROWTH_RATE * years);
    const exim = exportRev * p0.EXIM_REINVEST_FRACTION * 0.05;
    const cuasExport = cuasDemandUnits * 0.05 * cuasUnitCost * 0.10;
    const capitalInflow = pli + vc + exim + cuasExport;

    const capitalAfter = Math.max(capital - capDeploy, 0);
    const cuasInvestBudget = (capitalAfter * 0.40) / (p0.INVESTMENT_PER_CAPACITY * 0.6);
    const cuasCapInvest = Math.max(0, Math.min(Math.max(totalCuasDemand - capacity * 0.1, 0), cuasInvestBudget));
    const cuasDeploy = cuasCapInvest * p0.INVESTMENT_PER_CAPACITY * 0.6;

    // integrate (monthly Euler)
    capacity = Math.max(1, capacity + dt * (capInvest - p0.CAPACITY_DECAY_RATE * capacity));
    fleet = Math.max(1, fleet + dt * (production - decommissioning));
    cumProd += dt * production;
    exportRev += dt * exportRevFlow;
    capital = Math.max(0, capital + dt * (capitalInflow - capDeploy - cuasDeploy));
    cuasFleet = Math.max(0, cuasFleet + dt * (totalCuasDemand - cuasDecom));

    if (i % 6 === 0 || i === months) {
      rows.push({
        t: +t.toFixed(2),
        fleet: +fleet.toFixed(1),
        capacity: +capacity.toFixed(1),
        cuasFleet: +cuasFleet.toFixed(1),
        exportRev: +exportRev.toFixed(0),
        intercept: +intercept.toFixed(3),
      });
    }
  }
  return rows;
}

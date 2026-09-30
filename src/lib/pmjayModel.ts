/**
 * PM-JAY system dynamics model, ported from pmjay_calibrate_model.py.
 * Same equations, same calibrated parameters, integrated with RK4 in the browser.
 *
 * States (millions / thousand / crore):
 *   E: active enrolled   C: cumulative cards   A: cumulative admissions
 *   H: hospitals         V: cumulative treatment value
 */

export const CALIBRATED = {
  TARGET_POPULATION: 500.0,
  INITIAL_ENROLLED: 0.1,
  ENROLLMENT_RATE: 0.3627,
  GOV_PUSH_YEARS: 0.822,
  CAMPAIGN_RATE: 1.3749,
  ENROLLMENT_DECAY: 0.06173,
  CLAIM_RATE_PER_ENROLLED: 0.08368,
  CLAIM_GROWTH_RATE: 0.0,
  TARGET_HOSPITALS: 45.0,
  HOSPITAL_JOIN_RATE: 4.241,
  INITIAL_HOSPITALS: 18.236,
  AVG_CLAIM_SIZE: 10180.0,
  AVG_CLAIM_GROWTH: 0.0785,
} as const;

export type Params = typeof CALIBRATED;

const T0 = 2018.75;
const T_END = 2026.0;
/** Ayushman Bhav / U-AAM campaign window, years since launch (2023.75..2025.75) */
const CAMP_START = 5.0;
const CAMP_END = 7.0;

export type Row = {
  t: number;
  enrolled: number;      // crore
  cards: number;         // crore
  admissions: number;    // crore cumulative
  admissionsYearly: number; // crore / yr flow
  hospitals: number;
  value: number;         // crore
  claims: number;        // crore fraudulent claims stock (policy toggle extension)
  budgetCum: number;     // cumulative outflow on claims, crore
};

type Deriv = (t: number, y: number[], p: Params, fraudRate: number) => number[];

const deriv: Deriv = (t, y, p, fraudRate) => {
  const [e, c, a, h, v, f, b] = y;
  if (t < T0) return [0, 0, 0, 0, 0, 0, 0];
  const years = t - T0;

  const push1 = Math.max(0, 1 - years / p.GOV_PUSH_YEARS);
  let push2 = 0;
  if (years >= CAMP_START && years <= CAMP_END) {
    const ramp = Math.min(1, (years - CAMP_START) / 0.5);
    const fade = Math.min(1, (CAMP_END - years) / 0.5);
    push2 = p.CAMPAIGN_RATE * ramp * fade;
  }

  const pool = Math.max(p.TARGET_POPULATION - e, 0);
  const inflow = (0.3 + 0.7 * push1 + push2) * p.ENROLLMENT_RATE * pool;
  const de = inflow - p.ENROLLMENT_DECAY * e;

  const util = p.CLAIM_RATE_PER_ENROLLED * (1 + p.CLAIM_GROWTH_RATE * years);
  const admYr = e * util;

  const dh = p.HOSPITAL_JOIN_RATE * Math.max(p.TARGET_HOSPITALS - h, 0);

  const avgClaim = p.AVG_CLAIM_SIZE * (1 + p.AVG_CLAIM_GROWTH * years);
  const dv = (admYr * avgClaim) / 10;

  // fraud extension: FRAUD_RATE share of the yearly claim value accrues as a
  // fraudulent stock (matches Ayushman_Bharat_SD_Model.py B2 loop, detection off)
  const df = (dv * fraudRate) / 1;

  return [de, inflow, admYr, dh, dv, df, dv];
};

/** RK4 integration, monthly steps. fraudRate 0..0.3 (policy toggle). */
export function simulate(params: Params = CALIBRATED, fraudRate = 0): Row[] {
  const steps = Math.ceil((T_END - T0) * 12);
  const dt = (T_END - T0) / steps;
  let y = [
    params.INITIAL_ENROLLED, 0, 0,
    params.INITIAL_HOSPITALS / 10, // thousand -> internally in "crore-ish" units as in py? keep thousands:
    0, 0, 0,
  ];
  // note: hospitals kept in thousands (h in py is thousand), so INITIAL 18.236 thousand
  y = [
    params.INITIAL_ENROLLED, 0, 0,
    params.INITIAL_HOSPITALS, 0, 0, 0,
  ];

  const rows: Row[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = T0 + i * dt;
    const k1 = deriv(t, y, params, fraudRate);
    const k2 = deriv(t + dt / 2, y.map((v, j) => v + (dt / 2) * k1[j]), params, fraudRate);
    const k3 = deriv(t + dt / 2, y.map((v, j) => v + (dt / 2) * k2[j]), params, fraudRate);
    const k4 = deriv(t + dt, y.map((v, j) => v + dt * k3[j]), params, fraudRate);
    y = y.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));

    rows.push({
      t,
      enrolled: y[0] / 10,
      cards: y[1] / 10,
      admissions: y[2] / 10,
      admissionsYearly: (y[2] - (rows.length ? rows[rows.length - 1].admissions * 10 : 0)) / 10 / 1,
      hospitals: y[3],
      value: y[4],
      claims: y[5],
      budgetCum: y[6],
    });
  }
  return rows;
}

/** official anchor points from pmjay_official_series.csv (admissions, crore) */
export const OFFICIAL_ADMISSIONS: { t: number; value: number }[] = [
  { t: 2019.16, value: 0.169 },
  { t: 2019.71, value: 0.4662 },
  { t: 2020.16, value: 0.972 },
  { t: 2021.16, value: 1.785 },
  { t: 2022.16, value: 3.28 },
  { t: 2023.16, value: 4.93 },
  { t: 2023.4, value: 5.0 },
  { t: 2024.49, value: 7.37 },
  { t: 2025.16, value: 9.19 },
];

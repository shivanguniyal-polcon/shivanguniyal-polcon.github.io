import { simulate, CALIBRATED } from '../src/lib/pmjayModel';

const rows = simulate(CALIBRATED, 0);
const targets: [number, number, number][] = [
  [2019.16, 0.111, 0.169],
  [2022.16, 3.193, 3.28],
  [2025.16, 8.897, 9.19],
];
for (const [year, pyVal, official] of targets) {
  const r = rows.reduce((a, b) => (Math.abs(b.t - year) < Math.abs(a.t - year) ? b : a));
  console.log(
    `t=${year}  TS=${r.admissions.toFixed(3)}  PY=${pyVal}  official=${official}  E=${(r.enrolled * 10).toFixed(1)}M`
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, domains, type Project } from '../data/projects';

const statusLabel: Record<Project['status'], string> = {
  live: 'live',
  ongoing: 'in progress',
  published: 'published',
};

export default function ProjectGrid({
  showFilters = true,
  limit,
  exclude = [],
}: {
  showFilters?: boolean;
  limit?: number;
  exclude?: string[];
}) {
  /* deep link support: /projects/?domain=Health%20Policy (used by the landing orbs).
     start from the prerendered state ('All') and apply the query param after
     mount, so hydration never sees a mismatch. */
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const apply = () => {
      const d = new URLSearchParams(window.location.search).get('domain');
      setFilter(d && (domains as string[]).includes(d) ? d : 'All');
    };
    apply();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, []);

  const base = projects.filter((p) => !exclude.includes(p.slug));
  const visible0 = filter === 'All' ? base : base.filter((p) => p.domain === filter);
  const visible = limit != null ? visible0.slice(0, limit) : visible0;

  return (
    <div>
      {showFilters && (
        <div className="filter-bar">
          {['All', ...domains].map((d) => (
            <button
              key={d}
              className={`filter-btn ${filter === d ? 'active' : ''}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
          <span className="mono faint" style={{ alignSelf: 'center', fontSize: 12, marginLeft: 8 }}>
            {visible.length} project{visible.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      <motion.div layout className="grid-3" style={{ alignItems: 'stretch' }}>
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.a
              layout
              key={p.slug}
              href={`/projects/${p.slug}/`}
              className="card proj-card"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
              style={{ textDecoration: 'none' }}
            >
              <div className="domain-tag">{p.domain}</div>
              <h3>{p.title}</h3>
              <p>{p.tagline}</p>
              {p.heroStat && (
                <div className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
                  {p.heroStat.value}
                  <span className="faint" style={{ fontSize: 11 }}> · {p.heroStat.label}</span>
                </div>
              )}
              <div className="meta">
                <span>
                  <span className={`status-dot status-${p.status}`} />
                  {statusLabel[p.status]} · {p.year}
                </span>
                <span className="arrow">→</span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

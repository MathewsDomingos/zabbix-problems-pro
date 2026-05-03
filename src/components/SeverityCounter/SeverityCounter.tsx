import React from 'react';
import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';

interface SeverityCounterProps {
  problems: ZabbixProblem[];
  options: PanelOptions;
}

const SEVERITY_ORDER = [5, 4, 3, 2, 1, 0];

const dotBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
`;

const getStyles = () => ({
  counterBar: css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 14px;
    flex-shrink: 0;
  `,
  severityBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid;
    font-size: 0.75em;
    font-weight: 500;
    transition: opacity 0.2s;
  `,
  dot: css`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: ${dotBlink} 2s ease-in-out infinite;
  `,
  label: css`
    letter-spacing: 0.3px;
  `,
  count: css`
    padding: 1px 6px;
    border-radius: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 1em;
    min-width: 20px;
    text-align: center;
  `,
  total: css`
    margin-left: auto;
    font-family: monospace;
    font-size: 0.72em;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.5px;
  `,
});

export const SeverityCounter = ({ problems, options }: SeverityCounterProps) => {
  const styles = useStyles2(getStyles);

  const counts: Record<number, number> = {};
  for (const p of problems) {
    counts[p.severity] = (counts[p.severity] ?? 0) + 1;
  }

  const activeSeverities = SEVERITY_ORDER.filter((sev) => counts[sev] > 0);

  if (activeSeverities.length === 0) {
    return null;
  }

  return (
    <div className={styles.counterBar}>
      {activeSeverities.map((sev) => {
        const colorConfig = options.severityColors?.[sev];
        const color = colorConfig?.color ?? '#6b7280';
        const label = colorConfig?.label ?? String(sev);
        const count = counts[sev];

        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return (
          <div
            key={sev}
            className={styles.severityBadge}
            style={{
              color,
              background: `rgba(${r}, ${g}, ${b}, 0.1)`,
              borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
            }}
          >
            <span className={styles.dot} style={{ background: color }} />
            <span className={styles.label}>{label}</span>
            <span
              className={styles.count}
              style={{
                background: `rgba(${r}, ${g}, ${b}, 0.15)`,
                color,
              }}
            >
              {count}
            </span>
          </div>
        );
      })}

      <span className={styles.total}>{problems.length} total</span>
    </div>
  );
};

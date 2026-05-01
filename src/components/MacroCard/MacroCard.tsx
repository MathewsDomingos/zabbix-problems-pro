import React from 'react';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { getSeverityColors } from '../../utils/severityUtils';
import { SeverityBadge } from '../SeverityBadge';
import { ProblemDetails } from '../ProblemDetails';

interface Props {
  problem: ZabbixProblem;
  isOpen: boolean;
  onToggle: () => void;
  options: PanelOptions;
}

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatTimestamp(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_PT[date.getMonth()];
  const year = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year}  ${h}:${m}:${s}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const getStyles = () => ({
  wrapper: css`
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #1e2d3d;
  `,
  macroRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    background: #141c27;
    min-width: 0;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
    &:hover {
      background: #16202e;
    }
  `,
  severityBar: css`
    width: 5px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 0;
    margin: -8px 0 -8px -14px;
    margin-right: 4px;
  `,
  hostChip: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #7fa0c0;
    background: #1a2535;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
    white-space: nowrap;
    flex-shrink: 0;
  `,
  suppressedBadge: css`
    font-size: 10px;
    background: #1a2030;
    color: #4a6080;
    border: 1px solid #1e2d3d;
    padding: 1px 7px;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
  `,
  incidentName: css`
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: #ccd9e6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  `,
  timestamp: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #4a6178;
    white-space: nowrap;
    flex-shrink: 0;
  `,
  btn: css`
    font-size: 11px;
    padding: 4px 11px;
    border-radius: 6px;
    border: 1px solid #1e2d3d;
    background: transparent;
    color: #567090;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
    &:hover {
      background: #1a2535;
      color: #a0bdcf;
      border-color: #2d4460;
    }
  `,
  btnOpen: css`
    background: #0f2035;
    color: #6ea8d0;
    border-color: #2d6090;
  `,
});

const MacroCard: React.FC<Props> = ({ problem, isOpen, onToggle, options }) => {
  const styles = useStyles2(getStyles);
  const customColor = options.severityColors?.[problem.severity]?.color;
  const colors = getSeverityColors(problem.severity, customColor);

  const handleBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const highlightBg = options.highlightBackground
    ? { background: `linear-gradient(90deg, ${hexToRgba(colors.bar, 0.15)} 0%, transparent 60%)` }
    : {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.macroRow} style={highlightBg} onClick={onToggle}>
        {!options.highlightBackground && (
          <div className={styles.severityBar} style={{ background: colors.bar }} />
        )}

        {options.showSeverityBadge && (
          <SeverityBadge
            severity={problem.severity}
            customColor={customColor}
            severityColors={options.severityColors}
          />
        )}

        {options.showHostName && (
          <span className={styles.hostChip}>{problem.host}</span>
        )}

        {options.showSuppressed && problem.suppressed && (
          <span className={styles.suppressedBadge}>Suprimido</span>
        )}

        <span className={styles.incidentName} title={problem.description}>
          {problem.description}
        </span>

        {options.showTimestamp && (
          <span className={styles.timestamp}>{formatTimestamp(problem.time)}</span>
        )}

        <button
          className={cx(styles.btn, isOpen && styles.btnOpen)}
          onClick={handleBtnClick}
        >
          {isOpen ? 'Close' : 'Details'}
        </button>
      </div>

      <ProblemDetails problem={problem} isOpen={isOpen} options={options} />
    </div>
  );
};

export { MacroCard };

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
  card: css`
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #1e2d3d;
  `,
  header: css`
    display: flex;
    align-items: stretch;
    background: #141c27;
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
  `,
  content: css`
    flex: 1;
    padding: 13px 16px;
    min-width: 0;
  `,
  top: css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  `,
  hostChip: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #7fa0c0;
    background: #1a2535;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
  `,
  time: css`
    margin-left: auto;
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #4a6178;
    white-space: nowrap;
  `,
  nameRow: css`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 5px;
  `,
  name: css`
    flex: 1;
    min-width: 0;
    font-size: 13.5px;
    font-weight: 500;
    color: #ccd9e6;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  description: css`
    font-size: 12px;
    color: #567090;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
  footer: css`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    flex-wrap: wrap;
  `,
  tagChip: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 4px;
    background: #111820;
    color: #4a6178;
    border: 1px solid #1a2535;
  `,
  tagChipValue: css`
    color: #7fa0c0;
  `,
  suppBadge: css`
    font-size: 10px;
    background: #1a2030;
    color: #4a6080;
    border: 1px solid #1e2d3d;
    padding: 1px 7px;
    border-radius: 100px;
  `,
  dividerDot: css`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #1e2d3d;
    flex-shrink: 0;
  `,
  eventId: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 10px;
    color: #3a5168;
  `,
  btn: css`
    flex-shrink: 0;
    font-size: 11px;
    padding: 4px 11px;
    border-radius: 6px;
    border: 1px solid #1e3550;
    background: transparent;
    color: #4a7fa5;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 1px;
    &:hover {
      background: #0f2035;
      color: #6ea8d0;
      border-color: #2d6090;
    }
  `,
  btnOpen: css`
    background: #0f2035;
    color: #6ea8d0;
    border-color: #2d6090;
  `,
});

export const ProblemCard: React.FC<Props> = ({ problem, isOpen, onToggle, options }) => {
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

  const hasTagsVisible = options.showTags && problem.tags.length > 0;
  const hasFooterContent = hasTagsVisible || options.showEventId;
  const showDivider = hasTagsVisible && options.showEventId;

  return (
    <div className={styles.card}>
      <div className={styles.header} style={highlightBg} onClick={onToggle}>
        {!options.highlightBackground && (
          <div className={styles.severityBar} style={{ background: colors.bar }} />
        )}
        <div className={styles.content}>
          {/* Top row: badge, host, suppressed badge, timestamp */}
          <div className={styles.top}>
            {options.showSeverityBadge && (
              <SeverityBadge
                severity={problem.severity}
                customColor={customColor}
                severityColors={options.severityColors}
              />
            )}
            {options.showHostName && <span className={styles.hostChip}>{problem.host}</span>}
            {options.showSuppressed && problem.suppressed && (
              <span className={styles.suppBadge}>Suprimido</span>
            )}
            {options.showTimestamp && (
              <span className={styles.time}>{formatTimestamp(problem.time)}</span>
            )}
          </div>

          {/* Name row: incident name + Details/Close button */}
          <div className={styles.nameRow}>
            <div className={styles.name} title={problem.description}>
              {problem.description}
            </div>
            <button
              className={cx(styles.btn, isOpen && styles.btnOpen)}
              onClick={handleBtnClick}
            >
              {isOpen ? 'Close' : 'Details'}
            </button>
          </div>

          {/* Description row */}
          {options.showDescription && problem.comments && (
            <div className={styles.description}>{problem.comments}</div>
          )}

          {/* Footer: tags + event ID (only rendered when there is content) */}
          {hasFooterContent && (
            <div className={styles.footer}>
              {hasTagsVisible &&
                problem.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tagChip}>
                    {tag.tag}
                    {tag.value && <span className={styles.tagChipValue}>:{tag.value}</span>}
                  </span>
                ))}

              {showDivider && <span className={styles.dividerDot} />}

              {options.showEventId && (
                <span className={styles.eventId}>#{problem.eventid}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <ProblemDetails problem={problem} isOpen={isOpen} options={options} />
    </div>
  );
};

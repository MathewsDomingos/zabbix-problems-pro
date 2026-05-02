import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { css, cx, keyframes, injectGlobal } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

injectGlobal`
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;
import { ZabbixProblem, PanelOptions } from '../../types';
import { getSeverityColors, getHighlightStyle } from '../../utils/severityUtils';
import { getAge } from '../../utils/timeUtils';
import { SeverityBadge } from '../SeverityBadge';
import { ProblemDetails } from '../ProblemDetails';
import { AckModal, AckFormData } from '../AckModal';

interface Props {
  problem: ZabbixProblem;
  isOpen: boolean;
  onToggle: () => void;
  options: PanelOptions;
  style?: React.CSSProperties;
}

const severityPulse = keyframes`
  0%   { opacity: 1; box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  50%  { opacity: 0.85; box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
  100% { opacity: 1; box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
`;

const cardFadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

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

const getStyles = () => ({
  card: css`
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #1e2d3d;
    animation: ${cardFadeIn} 0.3s ease forwards;
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
  severityBarDisaster: css`
    animation: ${severityPulse} 2s ease-in-out infinite;
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
    font-size: 0.75em;
    color: #7fa0c0;
    background: #1a2535;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
  `,
  time: css`
    margin-left: auto;
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.75em;
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
    font-size: 0.9em;
    font-weight: 500;
    color: #ccd9e6;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  description: css`
    font-size: 0.8em;
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
    font-size: 0.7em;
    padding: 2px 7px;
    border-radius: 4px;
    background: #111820;
    border: 1px solid #1a2535;
  `,
  tagChipValue: css`
    color: #7fa0c0;
  `,
  suppBadge: css`
    font-size: 0.7em;
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
    font-size: 0.7em;
    color: #3a5168;
  `,
  statusProblem: css`
    font-size: 0.7em;
    font-weight: 700;
    color: #ef4444;
    letter-spacing: 0.5px;
  `,
  statusOk: css`
    font-size: 0.7em;
    font-weight: 700;
    color: #41d882;
    letter-spacing: 0.5px;
  `,
  ackBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.7em;
    color: #41d882;
    background: rgba(65, 216, 130, 0.08);
    border: 1px solid rgba(65, 216, 130, 0.2);
    padding: 1px 6px;
    border-radius: 4px;
  `,
  ageBadge: css`
    font-family: monospace;
    font-size: 0.7em;
    background: #111820;
    border: 1px solid #1a2535;
    padding: 1px 6px;
    border-radius: 4px;
  `,
  opdataBadge: css`
    font-size: 0.7em;
    background: #111820;
    border: 1px solid #1a2535;
    padding: 1px 6px;
    border-radius: 4px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  groupBadge: css`
    font-size: 0.7em;
    background: #0f1820;
    border: 1px solid #1a2535;
    padding: 1px 6px;
    border-radius: 4px;
  `,
  datasourceBadge: css`
    font-size: 0.7em;
    background: #0a1018;
    border: 1px solid #1a2535;
    padding: 1px 6px;
    border-radius: 4px;
  `,
  cardActions: css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  `,
  iconBtn: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
    background: #1a2535;
    color: #7fa0c0;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
    svg {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    &:hover {
      background: #1e2d3d;
      color: #a0bdcf;
      border-color: #2d4460;
    }
  `,
  iconBtnOpen: css`
    svg {
      transform: rotate(180deg);
    }
  `,
  iconBtnAck: css`
    &:hover {
      background: rgba(65, 216, 130, 0.1);
      color: #41d882;
      border-color: rgba(65, 216, 130, 0.3);
    }
  `,
  iconBtnAcked: css`
    color: #41d882;
    border-color: rgba(65, 216, 130, 0.4);
    background: rgba(65, 216, 130, 0.08);
  `,
});

export const ProblemCard: React.FC<Props> = ({ problem, isOpen, onToggle, options, style }) => {
  const styles = useStyles2(getStyles);
  const [showAckModal, setShowAckModal] = useState(false);
  const customColor = options.severityColors?.[problem.severity]?.color;
  const colors = getSeverityColors(problem.severity, customColor);

  const handleBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleAckSubmit = async (formData: AckFormData) => {
    // TODO: Integrar com Zabbix API
    // POST /api_jsonrpc.php
    // method: "event.acknowledge"
    // params: { eventids: [eventid], action: flags, message }
    console.log('[ZabbixProblemsPro] Acknowledge submitted:', {
      eventid: problem.eventid,
      ...formData,
    });
  };

  const highlightStyle = getHighlightStyle(customColor ?? '#6b7280', options);

  const hasTagsVisible = options.showTags && problem.tags.length > 0;
  const hasNewFooterFields =
    options.showStatus ||
    (options.showAck && problem.acknowledged) ||
    options.showAge ||
    (options.showOperationalData && !!problem.opdata) ||
    (options.showTableHostGroups && problem.groups.length > 0) ||
    (options.showDatasourceName && !!problem.datasourceName);
  const hasFooterContent = hasTagsVisible || options.showEventId || hasNewFooterFields;

  return (
    <div className={styles.card} style={style}>
      <div className={styles.header} style={highlightStyle} onClick={onToggle}>
        {!options.highlightBackground && (
          <div
            className={cx(styles.severityBar, problem.severity === 5 ? styles.severityBarDisaster : '')}
            style={{ background: colors.bar }}
          />
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
              <span className={styles.time} style={{ color: options.timestampColor }}>{formatTimestamp(problem.time)}</span>
            )}
          </div>

          {/* Name row: incident name + action buttons */}
          <div className={styles.nameRow}>
            <div className={styles.name} title={problem.description}>
              {problem.description}
            </div>
            <div className={styles.cardActions}>
              <button
                className={cx(styles.iconBtn, styles.iconBtnAck, problem.acknowledged ? styles.iconBtnAcked : '')}
                onClick={(e) => { e.stopPropagation(); setShowAckModal(true); }}
                title="Acknowledge problem"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
              <button
                className={cx(styles.iconBtn, isOpen ? styles.iconBtnOpen : '')}
                onClick={handleBtnClick}
                title={isOpen ? 'Close details' : 'Show details'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Description row */}
          {options.showDescription && problem.comments && (
            <div className={styles.description}>{problem.comments}</div>
          )}

          {/* Footer (only rendered when there is content) */}
          {hasFooterContent && (
            <div className={styles.footer}>
              {options.showStatus && (
                <span className={problem.value === '0' ? styles.statusOk : styles.statusProblem}>
                  {problem.value === '0' ? 'OK' : 'PROBLEM'}
                </span>
              )}

              {hasTagsVisible &&
                problem.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tagChip} style={{ color: options.timestampColor }}>
                    {tag.tag}{tag.value ? `:${tag.value}` : ''}
                  </span>
                ))}

              {options.showAck && problem.acknowledged && (
                <span className={styles.ackBadge}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#41d882" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Ack
                </span>
              )}

              {options.showAge && (
                <span className={styles.ageBadge} style={{ color: options.timestampColor }}>{getAge(problem.time)}</span>
              )}

              {options.showOperationalData && problem.opdata && (
                <span className={styles.opdataBadge} style={{ color: options.timestampColor }}>{problem.opdata}</span>
              )}

              {options.showTableHostGroups && problem.groups[0] && (
                <span className={styles.groupBadge} style={{ color: options.timestampColor }}>{problem.groups[0]}</span>
              )}

              {options.showDatasourceName && problem.datasourceName && (
                <span className={styles.datasourceBadge} style={{ color: options.timestampColor }}>{problem.datasourceName}</span>
              )}

              {options.showEventId && (
                <>
                  <span className={styles.dividerDot} />
                  <span className={styles.eventId}>#{problem.eventid}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ProblemDetails problem={problem} isOpen={isOpen} options={options} />

      {showAckModal && createPortal(
        <AckModal
          problem={problem}
          onClose={() => setShowAckModal(false)}
          onSubmit={handleAckSubmit}
        />,
        document.body
      )}
    </div>
  );
};

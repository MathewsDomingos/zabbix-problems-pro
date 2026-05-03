import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { css, cx, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { SeverityBadge } from '../SeverityBadge';
import { ProblemDetails } from '../ProblemDetails';
import { AckModal, AckFormData } from '../AckModal';
import { getAge } from '../../utils/timeUtils';
import { getHighlightStyle } from '../../utils/severityUtils';

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

const buildTableColumns = (options: PanelOptions): string => {
  const cols: string[] = [];
  if (options.showSeverityBadge)   { cols.push('110px'); }
  if (options.showHostName)        { cols.push('140px'); }
  if (options.showStatus)          { cols.push('90px');  }
  cols.push('1fr');
  if (options.showOperationalData) { cols.push('120px'); }
  if (options.showTags)            { cols.push('150px'); }
  if (options.showTableHostGroups) { cols.push('120px'); }
  if (options.showDatasourceName)  { cols.push('110px'); }
  if (options.showAck)             { cols.push('36px');  }
  if (options.showAge)             { cols.push('80px');  }
  if (options.showTimestamp)       { cols.push('120px'); }
  cols.push('68px');
  return cols.join(' ');
};

const rowFadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const getStyles = () => ({
  tableWrapper: css`
    width: 100%;
    font-size: inherit;
  `,
  tableHeader: css`
    display: grid;
    grid-template-columns: var(--table-cols);
    gap: 12px;
    padding: 8px 14px;
    border-bottom: 2px solid #1e2d3d;
    font-size: 0.72em;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    user-select: none;
    position: sticky;
    top: 0;
    z-index: 1;
  `,
  tableRow: css`
    display: grid;
    grid-template-columns: var(--table-cols);
    gap: 10px;
    padding: 5px 10px;
    border-bottom: none;
    align-items: center;
    cursor: pointer;
    transition: background 0.15s;
    &:hover {
      background: #141c27;
    }
  `,
  tableRowOpen: css`
    background: #141c27;
    border-bottom: none;
  `,
  rowWrapper: css`
    animation: ${rowFadeIn} 0.3s ease forwards;
    opacity: 0;
  `,
  rowDetails: css`
    border-bottom: 1px solid #1e2d3d;
  `,
  colSeverity: css`
    min-width: 0;
  `,
  colHost: css`
    min-width: 0;
  `,
  colStatus: css`
    min-width: 0;
  `,
  colProblem: css`
    min-width: 0;
    overflow: hidden;
  `,
  colOpdata: css`
    min-width: 0;
    overflow: hidden;
  `,
  colTags: css`
    min-width: 0;
  `,
  colGroups: css`
    min-width: 0;
    overflow: hidden;
  `,
  colDatasource: css`
    min-width: 0;
    overflow: hidden;
  `,
  colAck: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  colAge: css`
    min-width: 0;
  `,
  colTime: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.75em;
    white-space: nowrap;
  `,
  colActions: css`
    display: flex;
    gap: 6px;
    justify-content: flex-end;
  `,
  problemName: css`
    font-size: 0.87em;
    color: #ccd9e6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `,
  hostChip: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.75em;
    color: #7fa0c0;
    background: #1a2535;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
    white-space: nowrap;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  suppressedBadge: css`
    font-size: 0.7em;
    background: #1a2030;
    color: #4a6080;
    border: 1px solid #1e2d3d;
    padding: 1px 7px;
    border-radius: 100px;
    white-space: nowrap;
    margin-left: 4px;
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
  tagsRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  `,
  tagChip: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.7em;
    padding: 1px 6px;
    border-radius: 3px;
    background: #111820;
    border: 1px solid #1a2535;
    white-space: nowrap;
  `,
  tagMore: css`
    font-size: 0.7em;
    color: #3a5168;
    padding: 1px 4px;
  `,
  groupsRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  `,
  groupChip: css`
    font-size: 0.7em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  ageText: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.75em;
    white-space: nowrap;
  `,
  opdata: css`
    font-size: 0.75em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `,
  datasourceName: css`
    font-size: 0.7em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
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

interface TableRowProps {
  problem: ZabbixProblem;
  options: PanelOptions;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  style?: React.CSSProperties;
}

const TableRow: React.FC<TableRowProps> = ({ problem, options, isOpen, onToggle, index, style }) => {
  const styles = useStyles2(getStyles);
  const [showAckModal, setShowAckModal] = useState(false);
  const customColor = options.severityColors?.[problem.severity]?.color;
  const isProblem = problem.value !== '0';

  const rowBackground: React.CSSProperties = options.highlightBackground
    ? getHighlightStyle(customColor ?? '#6b7280', options)
    : { background: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' };

  const handleAckSubmit = async (formData: AckFormData) => {
    console.log('[ZabbixProblemsPro] Acknowledge submitted:', {
      eventid: problem.eventid,
      ...formData,
    });
  };

  return (
    <div className={styles.rowWrapper} style={style}>
      <div
        className={cx(styles.tableRow, isOpen && styles.tableRowOpen)}
        style={rowBackground}
        onClick={onToggle}
      >
        {options.showSeverityBadge && (
          <div className={styles.colSeverity}>
            <SeverityBadge
              severity={problem.severity}
              customColor={customColor}
              severityColors={options.severityColors}
            />
          </div>
        )}

        {options.showHostName && (
          <div className={styles.colHost}>
            <span className={styles.hostChip} title={problem.host}>{problem.host}</span>
            {problem.suppressed && options.showSuppressed && (
              <span className={styles.suppressedBadge}>Suprimido</span>
            )}
          </div>
        )}

        {options.showStatus && (
          <div className={styles.colStatus}>
            <span className={isProblem ? styles.statusProblem : styles.statusOk}>
              {isProblem ? 'PROBLEM' : 'OK'}
            </span>
          </div>
        )}

        <div className={styles.colProblem}>
          <span className={styles.problemName} title={problem.description}>{problem.description}</span>
        </div>

        {options.showOperationalData && (
          <div className={styles.colOpdata}>
            <span className={styles.opdata} title={problem.opdata} style={{ color: options.timestampColor }}>{problem.opdata}</span>
          </div>
        )}

        {options.showTags && (
          <div className={styles.colTags}>
            <div className={styles.tagsRow}>
              {problem.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className={styles.tagChip} style={{ color: options.timestampColor }}>
                  {tag.tag}{tag.value ? `:${tag.value}` : ''}
                </span>
              ))}
              {problem.tags.length > 2 && (
                <span className={styles.tagMore}>+{problem.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {options.showTableHostGroups && (
          <div className={styles.colGroups}>
            <div className={styles.groupsRow}>
              {problem.groups.slice(0, 2).map((group, idx) => (
                <span key={idx} className={styles.groupChip} title={group} style={{ color: options.timestampColor }}>{group}</span>
              ))}
              {problem.groups.length > 2 && (
                <span className={styles.tagMore}>+{problem.groups.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {options.showDatasourceName && (
          <div className={styles.colDatasource}>
            <span className={styles.datasourceName} title={problem.datasourceName} style={{ color: options.timestampColor }}>{problem.datasourceName}</span>
          </div>
        )}

        {options.showAck && (
          <div className={styles.colAck}>
            {problem.acknowledged && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#41d882" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        )}

        {options.showAge && (
          <div className={styles.colAge}>
            <span className={styles.ageText} style={{ color: options.timestampColor }}>{getAge(problem.time)}</span>
          </div>
        )}

        {options.showTimestamp && (
          <div className={styles.colTime} style={{ color: options.timestampColor }}>
            {formatTimestamp(problem.time)}
          </div>
        )}

        <div className={styles.colActions} onClick={(e) => e.stopPropagation()}>
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
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            title={isOpen ? 'Close details' : 'Show details'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={styles.rowDetails}>
          <ProblemDetails problem={problem} isOpen={true} options={options} />
        </div>
      )}

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

interface TableViewProps {
  problems: ZabbixProblem[];
  options: PanelOptions;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

export const TableView: React.FC<TableViewProps> = ({ problems, options, openId, setOpenId }) => {
  const styles = useStyles2(getStyles);

  return (
    <div
      className={styles.tableWrapper}
      style={{ '--table-cols': buildTableColumns(options) } as React.CSSProperties}
    >
      {!options.hideTableHeader && (
        <div className={styles.tableHeader} style={{ background: options.tableHeaderBg, color: options.tableHeaderColor }}>
          {options.showSeverityBadge   && <div className={styles.colSeverity}>Severity</div>}
          {options.showHostName        && <div className={styles.colHost}>Host</div>}
          {options.showStatus          && <div className={styles.colStatus}>Status</div>}
          <div className={styles.colProblem}>Problem</div>
          {options.showOperationalData && <div className={styles.colOpdata}>Op. data</div>}
          {options.showTags            && <div className={styles.colTags}>Tags</div>}
          {options.showTableHostGroups && <div className={styles.colGroups}>Groups</div>}
          {options.showDatasourceName  && <div className={styles.colDatasource}>Datasource</div>}
          {options.showAck             && <div className={styles.colAck}>Ack</div>}
          {options.showAge             && <div className={styles.colAge}>Age</div>}
          {options.showTimestamp       && <div>Time</div>}
          <div className={styles.colActions}></div>
        </div>
      )}

      {problems.map((problem, index) => (
        <TableRow
          key={problem.eventid || `${problem.triggerid}-${problem.time.getTime()}`}
          problem={problem}
          options={options}
          isOpen={openId === problem.eventid}
          onToggle={() => setOpenId(openId === problem.eventid ? null : problem.eventid)}
          index={index}
          style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
        />
      ))}
    </div>
  );
};

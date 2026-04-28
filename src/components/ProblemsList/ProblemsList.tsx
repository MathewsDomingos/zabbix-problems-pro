import React, { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { ProblemCard } from '../ProblemCard';

interface Props {
  problems: ZabbixProblem[];
  options: PanelOptions;
}

const getStyles = () => ({
  list: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    min-height: 100%;
    box-sizing: border-box;
  `,
  empty: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    color: #3a5168;
    font-size: 13px;
  `,
  footer: css`
    padding: 6px 2px 2px;
    font-size: 11px;
    color: #3a5168;
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    text-align: center;
  `,
});

function filterAndSort(problems: ZabbixProblem[], options: PanelOptions): ZabbixProblem[] {
  let result = problems.filter((p) => {
    const severityCfg = options.severityColors?.[p.severity];
    if (severityCfg && severityCfg.show === false) {
      return false;
    }
    if (!options.showSuppressed && p.suppressed) {
      return false;
    }
    return true;
  });

  result = result.slice().sort((a, b) => {
    if (options.sortBy === 'severity') {
      return b.severity - a.severity;
    }
    if (options.sortBy === 'lastChange' || options.sortBy === 'default') {
      return b.time.getTime() - a.time.getTime();
    }
    return b.time.getTime() - a.time.getTime();
  });

  return result;
}

export const ProblemsList: React.FC<Props> = ({ problems, options }) => {
  const styles = useStyles2(getStyles);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => filterAndSort(problems, options), [problems, options]);
  const pageSize = options.pageSize ?? 10;
  const paged = useMemo(() => filtered.slice(0, pageSize), [filtered, pageSize]);

  const handleToggle = (eventid: string) => {
    setOpenId((prev) => (prev === eventid ? null : eventid));
  };

  if (filtered.length === 0) {
    return (
      <div className={styles.list}>
        <div className={styles.empty}>No active problems</div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {paged.map((problem) => (
        <ProblemCard
          key={problem.eventid || `${problem.triggerid}-${problem.time.getTime()}`}
          problem={problem}
          isOpen={openId === problem.eventid}
          onToggle={() => handleToggle(problem.eventid)}
          options={options}
        />
      ))}
      {filtered.length > pageSize && (
        <div className={styles.footer}>
          Showing {pageSize} of {filtered.length} problems
        </div>
      )}
    </div>
  );
};

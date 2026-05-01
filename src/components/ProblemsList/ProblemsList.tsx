import React, { useState, useMemo, useEffect } from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { ProblemCard } from '../ProblemCard';
import { MacroCard } from '../MacroCard';
import { Pagination } from '../Pagination/Pagination';

interface Props {
  problems: ZabbixProblem[];
  options: PanelOptions;
  onOptionsChange: (options: PanelOptions) => void;
  emptyMessage?: string;
}

const getStyles = () => ({
  /* CRÍTICO: nunca usar min-height:100% aqui — força o div a ter a
     altura total do painel, criando área clicável invisível que vaza
     para fora do painel e bloqueia a sidebar do Grafana. */
  wrapper: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  list: css`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
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

export const ProblemsList: React.FC<Props> = ({ problems, options, onOptionsChange, emptyMessage }) => {
  const styles = useStyles2(getStyles);
  const [openId, setOpenId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => filterAndSort(problems, options), [problems, options]);

  useEffect(() => setCurrentPage(1), [filtered.length]);

  const pageSize = options.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paged = useMemo(
    () => filtered.slice(startIndex, startIndex + pageSize),
    [filtered, startIndex, pageSize]
  );

  const handleToggle = (eventid: string) => {
    setOpenId((prev) => (prev === eventid ? null : eventid));
  };

  const handlePageSizeChange = (size: number) => {
    onOptionsChange({ ...options, pageSize: size });
    setCurrentPage(1);
  };

  if (filtered.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <div className={styles.empty}>{emptyMessage ?? 'No active problems'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {paged.map((problem) => {
          const key = problem.eventid || `${problem.triggerid}-${problem.time.getTime()}`;
          const isOpen = openId === problem.eventid;
          const onToggle = () => handleToggle(problem.eventid);

          return options.layout === 'macro' ? (
            <MacroCard key={key} problem={problem} isOpen={isOpen} onToggle={onToggle} options={options} />
          ) : (
            <ProblemCard key={key} problem={problem} isOpen={isOpen} onToggle={onToggle} options={options} />
          );
        })}
      </div>
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

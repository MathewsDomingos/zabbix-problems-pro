import React, { useState, useMemo, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, ZabbixProblem } from '../types';
import { mapDataFrameToProblems } from '../utils/dataMapper';
import { ProblemsList } from './ProblemsList';
import { Pagination } from './Pagination/Pagination';

interface Props extends PanelProps<PanelOptions> {}

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
    return b.time.getTime() - a.time.getTime();
  });

  return result;
}

export const SimplePanel: React.FC<Props> = ({ data, width, height, options, onOptionsChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const problems = useMemo(() => {
    try {
      return mapDataFrameToProblems(data);
    } catch (error) {
      console.error('[ZabbixProblemsPro] Render error:', error);
      return [];
    }
  }, [data]);

  const filtered = useMemo(() => filterAndSort(problems, options), [problems, options]);

  useEffect(() => setCurrentPage(1), [filtered.length]);

  const pageSize = options.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  const handlePageSizeChange = (size: number) => {
    onOptionsChange({ ...options, pageSize: size });
    setCurrentPage(1);
  };

  return (
    /* CRÍTICO: isolation:isolate contém todos os z-index internos e impede
       que vazem para o root context do Grafana, bloqueando a sidebar.
       display:flex+flexDirection:column com minHeight:0 no filho scrollável
       é o único layout que mantém a paginação fixo no rodapé sem overflow. */
    <div
      style={{
        isolation: 'isolate',
        width,
        height,
        fontSize: `${options.fontSize ?? 100}%`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
        <ProblemsList problems={paged} options={options} />
      </div>
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

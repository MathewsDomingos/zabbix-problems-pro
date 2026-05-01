import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getStyles = () => ({
  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background: transparent;
    user-select: none;
    flex-shrink: 0;
  `,
  pagBtn: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    &:disabled {
      opacity: 0.25;
      cursor: default;
    }
  `,
  pagInfo: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  `,
  pagCurrent: css`
    color: #fff;
    font-weight: 700;
  `,
  pagSep: css`
    color: rgba(255, 255, 255, 0.2);
  `,
  pagTotal: css`
    color: rgba(255, 255, 255, 0.5);
  `,
  pagCounter: css`
    font-family: monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    padding: 0 8px;
  `,
  pagRowsSelect: css`
    width: 90px;
    height: 30px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.5);
    font-size: 11px;
    font-family: monospace;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    & option {
      background: #0d131c;
      color: rgba(255, 255, 255, 0.7);
    }
  `,
});

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const styles = useStyles2(getStyles);

  if (totalItems === 0) {
    return null;
  }

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pagBtn}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="First page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="11 17 6 12 11 7"/>
          <polyline points="18 17 13 12 18 7"/>
        </svg>
      </button>

      <button
        className={styles.pagBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div className={styles.pagInfo}>
        <span className={styles.pagCurrent}>{currentPage}</span>
        <span className={styles.pagSep}>/</span>
        <span className={styles.pagTotal}>{totalPages}</span>
      </div>

      <button
        className={styles.pagBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <button
        className={styles.pagBtn}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>

      <span className={styles.pagCounter}>
        {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
      </span>

      <select
        className={styles.pagRowsSelect}
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
        <option value={20}>20 rows</option>
        <option value={50}>50 rows</option>
        <option value={100}>100 rows</option>
      </select>
    </div>
  );
};

import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

interface Props {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getStyles = () => ({
  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 10px 16px;
    border-top: 1px solid #1e2d3d;
    background: #0d131c;
    font-size: 12px;
    color: #567090;
    flex-shrink: 0;
  `,
  pageBtn: css`
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid #1e2d3d;
    background: transparent;
    color: #567090;
    cursor: pointer;
    font-size: 12px;
    &:hover:not(:disabled) {
      background: #1a2535;
      color: #a0bdcf;
      border-color: #2d4460;
    }
    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  `,
  pageInput: css`
    width: 40px;
    text-align: center;
    background: #0a1018;
    border: 1px solid #1e2d3d;
    border-radius: 4px;
    color: #ccd9e6;
    font-size: 12px;
    padding: 2px 4px;
  `,
  rowsSelect: css`
    background: #0a1018;
    border: 1px solid #1e2d3d;
    border-radius: 4px;
    color: #567090;
    font-size: 12px;
    padding: 2px 4px;
  `,
});

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const styles = useStyles2(getStyles);

  if (totalPages <= 1) {
    return null;
  }

  const handleInputCommit = (raw: string) => {
    const value = parseInt(raw, 10);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>
      <span>Page</span>
      <input
        key={currentPage}
        className={styles.pageInput}
        type="number"
        defaultValue={currentPage}
        min={1}
        max={totalPages}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleInputCommit((e.target as HTMLInputElement).value);
          }
        }}
        onBlur={(e) => handleInputCommit(e.target.value)}
      />
      <span>of {totalPages}</span>
      <select
        className={styles.rowsSelect}
        value={pageSize}
        onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
      >
        {[5, 10, 20, 50, 100].map((n) => (
          <option key={n} value={n}>
            {n} rows
          </option>
        ))}
      </select>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};

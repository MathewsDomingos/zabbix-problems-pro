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

const ROW_OPTIONS = [5, 10, 20, 50];

const getStyles = () => ({
  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 8px 16px;
    background: transparent;
    font-size: 12px;
    color: #567090;
    flex-shrink: 0;
  `,
  separator: css`
    color: #1e2d3d;
    user-select: none;
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
  rowBtn: css`
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #1e2d3d;
    background: transparent;
    color: #4a6178;
    cursor: pointer;
    font-size: 11px;
    font-family: monospace;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    &:hover {
      background: #1a2535;
      color: #7fa0c0;
    }
  `,
  rowBtnActive: css`
    background: #0f2035;
    color: #6ea8d0;
    border-color: #2d6090;
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

      <span className={styles.separator}>·</span>

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

      <span className={styles.separator}>·</span>

      <span style={{ display: 'flex', gap: 4 }}>
        {ROW_OPTIONS.map((n) => (
          <button
            key={n}
            className={`${styles.rowBtn}${pageSize === n ? ` ${styles.rowBtnActive}` : ''}`}
            onClick={() => onPageSizeChange(n)}
          >
            {n}
          </button>
        ))}
      </span>

      <span className={styles.separator}>·</span>

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

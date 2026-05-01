import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

const getStyles = () => ({
  emptyWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 160px;
    gap: 14px;
    font-family: 'Inter', system-ui, sans-serif;
  `,
  title: css`
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: rgba(65, 216, 130, 0.7);
    text-transform: uppercase;
  `,
  subtitle: css`
    font-size: 13px;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.3px;
  `,
});

export const EmptyState: React.FC = () => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.emptyWrapper}>
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
        stroke="rgba(65, 216, 130, 0.4)" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span className={styles.title}>INFRAESTRUTURA SAUDÁVEL</span>
      <small className={styles.subtitle}>
        Nenhum incidente ativo no momento
      </small>
    </div>
  );
};

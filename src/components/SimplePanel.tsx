import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { PanelOptions } from '../types';
import { mapDataFrameToProblems } from '../utils/dataMapper';
import { ProblemsList } from './ProblemsList';

interface Props extends PanelProps<PanelOptions> {}

const getStyles = () => ({
  container: css`
    /* CRÍTICO: isolation:isolate cria stacking context que contém todos os
       z-index internos (ex: ProblemDetails.dot z-index:1). Sem isso, esses
       valores competem no root context do Grafana e podem bloquear a sidebar.
       Nunca usar position:fixed/absolute, z-index>0 sem isolation, ou
       width/height que ultrapasse os limites do painel. */
    isolation: isolate;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  `,
});

export const SimplePanel: React.FC<Props> = ({ data, width, height, options, onOptionsChange }) => {
  const styles = useStyles2(getStyles);

  const problems = useMemo(() => {
    try {
      return mapDataFrameToProblems(data);
    } catch (error) {
      console.error('[ZabbixProblemsPro] Render error:', error);
      return [];
    }
  }, [data]);

  return (
    <div className={styles.container} style={{ width, height, fontSize: `${options.fontSize ?? 100}%` }}>
      <ProblemsList problems={problems} options={options} onOptionsChange={onOptionsChange} />
    </div>
  );
};

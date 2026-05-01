import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { ProblemCard } from '../ProblemCard';
import { MacroCard } from '../MacroCard';
import { EmptyState } from '../EmptyState/EmptyState';

interface Props {
  problems: ZabbixProblem[];
  options: PanelOptions;
}

const getStyles = () => ({
  /* CRÍTICO: nunca usar min-height:100% aqui — força o div a ter a
     altura total do painel, criando área clicável invisível que vaza
     para fora do painel e bloqueia a sidebar do Grafana. */
  list: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    box-sizing: border-box;
  `,
});

export const ProblemsList: React.FC<Props> = ({ problems, options }) => {
  const styles = useStyles2(getStyles);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (eventid: string) => {
    setOpenId((prev) => (prev === eventid ? null : eventid));
  };

  if (problems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.list}>
      {problems.map((problem) => {
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
  );
};

import React from 'react';
import { Button } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';
import { PanelOptions } from '../../types';
import { DEFAULT_OPTIONS } from '../../constants';

export const ResetOptionsButton = (
  props: StandardEditorProps<unknown, unknown, PanelOptions>
) => {
  const { context } = props;

  const handleReset = () => {
    const onOptionsChange = (context as any)?.onOptionsChange;
    if (typeof onOptionsChange !== 'function') {
      console.warn('[ZabbixProblemsPro] onOptionsChange not available');
      return;
    }
    onOptionsChange({ ...DEFAULT_OPTIONS });
  };

  return (
    <div style={{ paddingTop: '4px' }}>
      <Button
        variant="secondary"
        size="sm"
        icon="history-alt"
        onClick={handleReset}
      >
        Reset to defaults
      </Button>
    </div>
  );
};

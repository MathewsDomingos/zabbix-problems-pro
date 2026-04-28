import React from 'react';
import { Button } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';
import { PanelOptions } from '../../types';
import { DEFAULT_OPTIONS } from '../../constants';

export const ResetOptionsButton = ({
  context,
}: StandardEditorProps<unknown, unknown, PanelOptions>) => {
  const handleReset = () => {
    // onOptionsChange is injected at runtime by Grafana for panel option editors
    // but is absent from the shared StandardEditorContext typings
    (context as any).onOptionsChange?.(DEFAULT_OPTIONS);
  };

  return (
    <div style={{ paddingTop: '8px' }}>
      <Button
        variant="secondary"
        size="sm"
        icon="history-alt"
        onClick={handleReset}
        tooltip="Restore all settings to their default values"
      >
        Reset to defaults
      </Button>
    </div>
  );
};

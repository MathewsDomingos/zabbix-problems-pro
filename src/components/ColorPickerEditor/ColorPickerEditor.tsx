import React from 'react';
import { ColorPickerInput } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';

export const ColorPickerEditor = ({ value, onChange }: StandardEditorProps<string>) => {
  return <ColorPickerInput value={value ?? '#ffffff'} onChange={onChange} />;
};

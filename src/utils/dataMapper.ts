import { PanelData, Field } from '@grafana/data';
import { ZabbixProblem } from '../types';

function getValueAt(field: Field, index: number): unknown {
  const values = field.values as unknown;
  if (Array.isArray(values)) {
    return values[index] ?? null;
  }
  // suporte à API Vector legada de versões antigas do Grafana
  return (values as { get?: (i: number) => unknown }).get?.(index) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapJsonToProblem = (raw: any): ZabbixProblem => ({
  eventid: String(raw.eventid ?? ''),
  triggerid: String(raw.triggerid ?? ''),
  description: raw.name ?? raw.description ?? '',
  host: raw.hosts?.[0]?.name ?? raw.hosts?.[0]?.host ?? '',
  severity: parseInt(raw.severity ?? '0', 10),
  time: new Date((raw.timestamp ?? 0) * 1000),
  acknowledged: raw.acknowledged === '1',
  suppressed: raw.suppressed === '1',
  comments: raw.comments ?? '',
  expression: raw.expression ?? '',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: Array.isArray(raw.tags) ? raw.tags.map((t: any) => ({ tag: t.tag, value: t.value })) : [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groups: Array.isArray(raw.groups) ? raw.groups.map((g: any) => g.name) : [],
  items: Array.isArray(raw.items)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw.items.map((i: any) => ({ key: i.key_ ?? '', name: i.name ?? '', lastvalue: i.lastvalue ?? '' }))
    : [],
  datasourceUid: raw.datasource?.uid ?? '',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processField = (value: any): ZabbixProblem | null => {
  try {
    const raw = typeof value === 'string' ? JSON.parse(value) : value;
    if (!raw?.eventid && !raw?.triggerid) {
      return null;
    }
    return mapJsonToProblem(raw);
  } catch {
    return null;
  }
};

export function mapDataFrameToProblems(data: PanelData): ZabbixProblem[] {
  const problems: ZabbixProblem[] = [];

  for (const frame of data.series) {
    const problemsField = frame.fields.find((f) => f.name === 'Problems');

    if (problemsField) {
      for (let i = 0; i < frame.length; i++) {
        const value = getValueAt(problemsField, i);
        const problem = processField(value);
        if (problem) {
          problems.push(problem);
        }
      }
    }
  }

  return problems;
}

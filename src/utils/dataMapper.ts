import { PanelData, DataFrame } from '@grafana/data';
import { ZabbixProblem, ZabbixTag, ZabbixItem } from '../types';

function getFieldValue(frame: DataFrame, fieldName: string, rowIndex: number): unknown {
  const field = frame.fields.find((f) => f.name === fieldName);
  if (!field) {
    return undefined;
  }
  const values = field.values as unknown;
  if (Array.isArray(values)) {
    return values[rowIndex];
  }
  // suporte à API Vector legada de versões antigas do Grafana
  return (values as { get?: (i: number) => unknown }).get?.(rowIndex);
}

function parseJsonSafe<T>(value: unknown, fallback: T): T {
  if (!value || typeof value !== 'string') {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseTags(raw: unknown): ZabbixTag[] {
  if (Array.isArray(raw)) {
    return raw as ZabbixTag[];
  }
  return parseJsonSafe<ZabbixTag[]>(raw, []);
}

function parseItems(raw: unknown): ZabbixItem[] {
  if (Array.isArray(raw)) {
    return raw as ZabbixItem[];
  }
  return parseJsonSafe<ZabbixItem[]>(raw, []);
}

function parseGroups(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return (raw as unknown[]).map(String);
  }
  if (typeof raw !== 'string' || !raw) {
    return [];
  }
  return raw
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);
}

function toDate(raw: unknown): Date {
  if (raw instanceof Date) {
    return raw;
  }
  if (typeof raw === 'number') {
    // timestamps unix em segundos têm menos de 12 dígitos
    return new Date(raw < 1e12 ? raw * 1000 : raw);
  }
  if (typeof raw === 'string' && raw) {
    return new Date(raw);
  }
  return new Date();
}

export function mapDataFrameToProblems(data: PanelData): ZabbixProblem[] {
  const problems: ZabbixProblem[] = [];

  for (const frame of data.series) {
    const length = frame.length;
    for (let i = 0; i < length; i++) {
      const get = (name: string) => getFieldValue(frame, name, i);

      problems.push({
        eventid: String(get('eventid') ?? get('eventId') ?? ''),
        triggerid: String(get('triggerid') ?? get('triggerId') ?? ''),
        description: String(get('description') ?? get('name') ?? ''),
        host: String(get('host') ?? ''),
        severity: Number(get('severity') ?? 0),
        time: toDate(get('time') ?? get('clock') ?? null),
        acknowledged: Boolean(Number(get('acknowledged') ?? 0)),
        suppressed: Boolean(Number(get('suppressed') ?? 0)),
        comments: String(get('comments') ?? ''),
        expression: String(get('expression') ?? ''),
        tags: parseTags(get('tags')),
        groups: parseGroups(get('groups') ?? get('group') ?? ''),
        items: parseItems(get('items')),
      });
    }
  }

  return problems;
}

export function buildZabbixEventLink(baseUrl: string, triggerid: string, eventid: string): string {
  const path = `tr_events.php?triggerid=${triggerid}&eventid=${eventid}`;
  if (!baseUrl) {
    return path;
  }
  return `${baseUrl.replace(/\/$/, '')}/${path}`;
}

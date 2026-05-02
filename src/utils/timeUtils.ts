export const getAge = (time: Date): string => {
  const diffMs  = Date.now() - time.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHrs / 24);

  if (diffDay > 0) { return `${diffDay}d ${diffHrs % 24}h`; }
  if (diffHrs > 0) { return `${diffHrs}h ${diffMin % 60}m`; }
  return `${diffMin}m`;
};

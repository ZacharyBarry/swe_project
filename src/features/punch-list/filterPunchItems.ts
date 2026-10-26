import type { PunchItem, PunchItemStatus } from './punchItems';

export type PunchItemStatusFilter = 'All' | PunchItemStatus;

export function filterPunchItems(
  items: PunchItem[],
  status: PunchItemStatusFilter,
  search: string,
  category = '',
  roomLocation = ''
): PunchItem[] {
  const query = search.trim().toLocaleLowerCase();

  return items.filter(
    (item) =>
      (status === 'All' || item.status === status) &&
      (!category || item.category === category) &&
      (!roomLocation || item.roomLocation === roomLocation) &&
      (item.title.toLocaleLowerCase().includes(query) ||
        item.description.toLocaleLowerCase().includes(query))
  );
}

export function filterValues(items: PunchItem[], field: 'category' | 'roomLocation'): string[] {
  return [...new Set(items.map((item) => item[field]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

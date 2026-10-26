import type { PunchItem, PunchItemStatus } from './PunchListPage';

export type PunchItemStatusFilter = 'All' | PunchItemStatus;

export function filterPunchItems(
  items: PunchItem[],
  status: PunchItemStatusFilter,
  search: string
): PunchItem[] {
  const query = search.trim().toLocaleLowerCase();

  return items.filter(
    (item) =>
      (status === 'All' || item.status === status) &&
      (item.title.toLocaleLowerCase().includes(query) ||
        item.description.toLocaleLowerCase().includes(query))
  );
}

export type Page = 'overview' | 'drawings' | 'punch-list';
export const pages: { id: Page; title: string }[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'drawings', title: 'Drawings' },
  { id: 'punch-list', title: 'Punch List' },
];
export function readPage(): Page {
  const hash = window.location.hash.slice(1);
  return pages.some((p) => p.id === hash) ? (hash as Page) : 'overview';
}

export type Page = 'overview' | 'buffer';
export const pages: { id: Page; title: string; icon: string }[] = [
  { id: 'overview', title: 'Overview', icon: '◫' },
  { id: 'buffer', title: 'Buffer', icon: '▤' },
];
export function readPage(): Page {
  const hash = window.location.hash.slice(1);
  return pages.some((p) => p.id === hash) ? (hash as Page) : 'overview';
}

export type Page = 'overview' | 'buffer';
export const pages: { id: Page; title: string }[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'buffer', title: 'Buffer' },
];
export function readPage(): Page {
  const hash = window.location.hash.slice(1);
  return pages.some((p) => p.id === hash) ? (hash as Page) : 'overview';
}

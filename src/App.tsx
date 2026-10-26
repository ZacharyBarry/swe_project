import { useEffect, useState } from 'react';
import { ProjectOverview } from './features/projects/ProjectOverview';
import { Sidebar } from './components/Sidebar';
import { pages, readPage, type Page } from './navigation';
import { DrawingsPage } from './features/drawings/DrawingsPage';
import {
  PunchListPage,
  type PunchItem,
  type PunchItemStatus,
} from './features/punch-list/PunchListPage';

export function App() {
  const [page, setPage] = useState<Page>(readPage);
  const [punchItems, setPunchItems] = useState<PunchItem[]>([]);

  function addPunchItem(title: string, description: string) {
    setPunchItems((items) => [
      ...items,
      { id: crypto.randomUUID(), title, description, status: 'Open' },
    ]);
  }

  function updatePunchItemStatus(id: string, status: PunchItemStatus) {
    setPunchItems((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  useEffect(() => {
    const update = () => setPage(readPage());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const selected = pages.find((entry) => entry.id === page)!;

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar currentPage={page} />
      <div className="workspace">
        <header className="topbar">
          <span>
            Projects <span className="slash">/</span> Campus renovation
          </span>
          <span className="prototype-label">Sample workspace</span>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <h1>{selected.title}</h1>
              <p>
                {page === 'overview'
                  ? 'Project information and available tools.'
                  : page === 'drawings'
                    ? 'Open a PDF drawing from your computer.'
                    : 'Track issues in this browser session.'}
              </p>
            </div>
          </div>
          {page === 'overview' ? (
            <ProjectOverview />
          ) : page === 'drawings' ? (
            <DrawingsPage />
          ) : (
            <PunchListPage
              items={punchItems}
              onAddItem={addPunchItem}
              onStatusChange={updatePunchItemStatus}
            />
          )}
          <footer>
            Architectural Punch List <span>CMSC 447 · Group 5</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

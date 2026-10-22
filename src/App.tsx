import { useEffect, useState } from 'react';
import { ProjectOverview } from './features/projects/ProjectOverview';
import { Sidebar } from './components/Sidebar';
import { pages, readPage, type Page } from './navigation';
import { BufferPage } from './features/buffer/BufferPage';

export function App() {
  const [page, setPage] = useState<Page>(readPage);

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
          <span className="prototype-badge">STARTER PROTOTYPE</span>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">PROJECT WORKSPACE</p>
              <h1>{selected.title}</h1>
              <p>
                {page === 'overview'
                  ? 'The starting point for your next walkthrough.'
                  : 'A space for what comes next.'}
              </p>
            </div>
            <span className="sample-tag">Sample data</span>
          </div>
          {page === 'overview' ? <ProjectOverview /> : <BufferPage />}
          <footer>
            Architectural Punch List <span>CMSC 447 · Group 5</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

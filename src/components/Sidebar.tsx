import { pages, type Page } from '../navigation';

type SidebarProps = { currentPage: Page };

export function Sidebar({ currentPage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#overview">
        <span>
          Punch List<small>Project workspace</small>
        </span>
      </a>
      <div className="sidebar-label">CURRENT PROJECT</div>
      <div className="project-switch">

        <div>
          Campus renovation<small>Sample project</small>
        </div>
      </div>
      <nav aria-label="Project navigation">
        {pages.map((page) => (
          <a
            key={page.id}
            href={'#' + page.id}
            className={currentPage === page.id ? 'active' : ''}
            aria-current={currentPage === page.id ? 'page' : undefined}
          >
            {page.title}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        Version 0.1
      </div>
    </aside>
  );
}

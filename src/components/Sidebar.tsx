import { pages, type Page } from '../navigation';

type SidebarProps = { currentPage: Page };

export function Sidebar({ currentPage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#overview">
        <span className="brand-mark">
          p<span>•</span>
        </span>
        <span>
          Punch List<small>GROUP 5 / WORKSPACE</small>
        </span>
      </a>
      <div className="sidebar-label">CURRENT PROJECT</div>
      <div className="project-switch">
        <span className="project-avatar">CR</span>
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
            <span aria-hidden="true">{page.icon}</span>
            {page.title}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="status-dot" />
        Prototype 0.1
      </div>
    </aside>
  );
}

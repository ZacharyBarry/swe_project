import { sampleProject } from './sampleProject';

export function ProjectOverview() {
  return (
    <>
      <section className="project-summary" aria-labelledby="project-name">
        <div className="project-copy">
          <p className="project-label">Project overview</p>
          <h2 id="project-name">{sampleProject.name}</h2>
          <p>{sampleProject.description}</p>
        </div>
        <dl className="project-details">
          <div>
            <dt>Location</dt>
            <dd>UMBC</dd>
          </div>
          <div>
            <dt>Workspace</dt>
            <dd>Sample project</dd>
          </div>
        </dl>
      </section>

      <section className="project-tools" aria-labelledby="tools-title">
        <div className="section-heading">
          <h2 id="tools-title">Workspace</h2>
          <span>Available sections</span>
        </div>
        <div className="tool-row">
          <span className="tool-number" aria-hidden="true">
            01
          </span>
          <div className="tool-description">
            <h3>Drawings</h3>
            <p>Open and view a PDF drawing.</p>
          </div>
          <a className="open-link" href="#drawings">
            Open drawings
          </a>
        </div>
        <div className="tool-row">
          <span className="tool-number" aria-hidden="true">
            02
          </span>
          <div className="tool-description">
            <h3>Punch List</h3>
            <p>Add issues and track their status during this session.</p>
          </div>
          <a className="open-link" href="#punch-list">
            Open punch list
          </a>
        </div>
      </section>
      <p className="prototype-note">
        PDFs are viewed locally. Punch-list items are temporary and are lost
        when this page is refreshed.
      </p>
    </>
  );
}

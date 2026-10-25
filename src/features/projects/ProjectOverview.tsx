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
          <span className="tool-number" aria-hidden="true">01</span>
          <div className="tool-description">
            <h3>Buffer</h3>
            <p>A reserved space for the next feature.</p>
          </div>
          <a className="open-link" href="#buffer">Open Buffer</a>
        </div>
      </section>
      <p className="prototype-note">
        This version uses sample data. Drawings and punch-list items are not available yet.
      </p>
    </>
  );
}

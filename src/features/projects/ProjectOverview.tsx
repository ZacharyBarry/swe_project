import { sampleProject } from './sampleProject';

export function ProjectOverview() {
  return (
    <>
      <section className="project-card">
        <div className="project-copy">
          <span className="outline-tag">PROJECT 001</span>
          <h2>{sampleProject.name}</h2>
          <p>{sampleProject.description}</p>
          <div className="location">
            <span aria-hidden="true">⌖</span> {sampleProject.location}
          </div>
        </div>
        <div className="plan-art" aria-hidden="true">
          <div className="plan-label">PROJECT FOUNDATION</div>
          <svg viewBox="0 0 280 180" fill="none">
            <path d="M35 25H245V155H35Z M120 25V95H245 M35 95H80V155 M165 95V155 M120 65H165V25 M205 95V125H245" />
            <path
              className="plan-faint"
              d="M15 10H260M15 170H260M20 5V175M260 5V175"
            />
            <path d="M95 95 A25 25 0 0 1 120 120 M95 95V120H120" />
            <circle cx="188" cy="62" r="13" />
            <path d="M183 62H193M188 57V67" />
          </svg>
          <span>Room for what comes next.</span>
        </div>
      </section>
      <div className="section-heading">
        <h2>Coming next</h2>
      </div>
      <div className="essential-grid">
        <a className="essential-card" href="#buffer">
          <span className="card-icon" aria-hidden="true">
            ▤
          </span>
          <h3>Buffer</h3>
          <p>A placeholder for future features.</p>
          <span className="card-link">
            Open placeholder <span aria-hidden="true">↗</span>
          </span>
        </a>
      </div>
      <div className="prototype-note">
        <span className="note-icon" aria-hidden="true">
          i
        </span>
        <div>
          <strong>A foundation for the team</strong>
          <p>
            This first prototype includes navigation and a sample project. The
            rest is ready for your team to build.
          </p>
        </div>
      </div>
    </>
  );
}

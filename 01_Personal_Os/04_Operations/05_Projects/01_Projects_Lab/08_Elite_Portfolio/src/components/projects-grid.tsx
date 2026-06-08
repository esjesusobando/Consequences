interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
}

const projects: Project[] = [
  { id: "1", title: "Estudio Jurídico Ríos", category: "Office Installation", year: "2024" },
  { id: "2", title: "Corporativo Brickell", category: "Full Setup", year: "2024" },
  { id: "3", title: "Tech Hub Midtown", category: "Reconfiguration", year: "2023" },
  { id: "4", title: "WeWork Buckhead", category: "Commercial", year: "2023" },
  { id: "5", title: "Northside Medical", category: "Office Setup", year: "2023" },
  { id: "6", title: "Creative Agency NW", category: "Installation", year: "2022" },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`#project-${project.id}`}
      className="group block aspect-[4/3] bg-subtle hover:bg-ink transition-colors duration-500 relative"
    >
      {/* Minimal overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <p className="text-xs uppercase tracking-widest text-paper/70">
          {project.category} · {project.year}
        </p>
        <p className="text-base text-paper mt-2 font-medium">
          {project.title}
        </p>
      </div>
    </a>
  );
}

export function ProjectsGrid() {
  return (
    <section id="projects" className="section-padding" style={{ background: "var(--paper)" }}>
      <div className="container">
        {/* Section header - minimal */}
        <div className="flex items-baseline justify-between mb-12 pb-4 border-b border-subtle">
          <p className="text-sm uppercase tracking-widest text-muted">Selected Work</p>
          <p className="text-sm text-muted">{projects.length} projects</p>
        </div>

        {/* Simple grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
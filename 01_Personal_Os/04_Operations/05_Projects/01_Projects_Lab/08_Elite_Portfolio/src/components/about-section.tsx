const expertise = ["Product Design", "Brand Identity", "UI/UX Systems", "Creative Direction"];
const clients = ["Tech startups", "Creative agencies", "Local businesses", "Corporate environments"];
const skills = ["Figma", "UI/UX", "Brand Design", "Prototyping", "Design Systems", "User Research", "Motion", "Art Direction"];

export function AboutSection() {
  return (
    <section id="about" className="section-padding" style={{ background: "var(--paper)" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Bio */}
          <div>
            <p className="text-sm uppercase tracking-widest text-muted mb-8">About</p>
            <h2 className="display-lg text-ink mb-8">
              Design that lives in the real world.
            </h2>
            <p className="text-lg text-muted mb-6">
              I'm a product designer with 6+ years building interfaces that balance clarity, emotion, and function. I work across brand identity, digital product, and creative direction.
            </p>
            <p className="text-base text-muted">
              Based in Atlanta. Open to remote collaborations worldwide.
            </p>
          </div>

          {/* Right column - Skills & Expertise */}
          <div className="flex flex-col gap-12">
            {/* Expertise tags */}
            <div>
              <p className="text-sm uppercase tracking-widest text-muted mb-4">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-4 py-2 border border-subtle text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills tags */}
            <div>
              <p className="text-sm uppercase tracking-widest text-muted mb-4">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-4 py-2 bg-subtle text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Clients */}
            <div>
              <p className="text-sm uppercase tracking-widest text-muted mb-4">Clients</p>
              <div className="flex flex-wrap gap-2">
                {clients.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-4 py-2 border border-subtle text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
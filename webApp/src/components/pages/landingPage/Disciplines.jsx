const DISCIPLINES = [
  {
    number: "01",
    tag: "Capture",
    tagClass: "disc-tag-neutral",
    title: "Intentional Capture",
    description:
      "Log roles in seconds without uploading sensitive documents to third-party scrapers. Retain the exact job posting verbatim before it disappears behind closed doors.",
    icon: "bookmark",
    footer: "Zero-friction log",
  },
  {
    number: "02",
    tag: "Rhythm",
    tagClass: "disc-tag-accent",
    title: "Ledger & Heatmap",
    description:
      "Track your daily rhythm and momentum with serene streak tracking, not anxiety badges. Review conversion rates across roles with calm, uncluttered clarity.",
    icon: "schedule",
    footer: "Peaceful cadence",
  },
  {
    number: "03",
    tag: "Enclave",
    tagClass: "disc-tag-neutral",
    title: "Local Enclave",
    description:
      "Keep your confirmation emails and proof screenshots stored strictly on your local filesystem. Export everything to standard JSON whenever you please.",
    icon: "folder_managed",
    footer: "Air-gapped by default",
  },
];

export default function Disciplines() {
  return (
    <section className="disc-section">
      <div className="disc-container">
        <p className="disc-eyebrow">The three disciplines</p>
        <h2 className="disc-heading">Engineered for quiet longevity</h2>

        <div className="disc-grid">
          {DISCIPLINES.map(({ number, tag, tagClass, title, description, icon, footer }) => (
            <article key={number} className="disc-card">
              <div className="disc-card-top">
                <span className="disc-number">{number}</span>
                <span className={`disc-tag ${tagClass}`}>{tag}</span>
              </div>

              <h3 className="disc-title">{title}</h3>
              <p className="disc-description">{description}</p>

              <div className="disc-footer">
                <span className="material-symbols-outlined !text-sm disc-footer-icon" aria-hidden="true">
                  {icon}
                </span>
                <span>{footer}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
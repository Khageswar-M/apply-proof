const FOOTER_LINKS = [
  { label: "Zero-Telemetry Pledge", href: "#pledge" },
  { label: "Local Storage Specs", href: "#storage" },
  { label: "Source Vault", href: "#source" },
];

export default function FooterBar() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="foot-section">
      <div className="foot-container">
        <div className="foot-left">
          <span className="foot-brand">ApplyProof</span>
          <span className="foot-dot" aria-hidden="true">·</span>
          <span className="foot-tagline">Crafted for thoughtful engineers &amp; designers</span>
          <span className="foot-dot" aria-hidden="true">·</span>
          <span className="foot-copy">© {currentYear}</span>
        </div>

        <nav className="foot-nav" aria-label="Footer">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="foot-link">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
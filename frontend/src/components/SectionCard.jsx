function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`section-card ${className}`.trim()}>
      <header className="section-card__header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  )
}

export default SectionCard

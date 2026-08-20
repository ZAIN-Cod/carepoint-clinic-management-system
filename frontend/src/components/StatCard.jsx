function StatCard({ label, value, note, tone, symbol }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__symbol" aria-hidden="true">{symbol}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

export default StatCard

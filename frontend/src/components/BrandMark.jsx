import Icon from './Icon.jsx'

function BrandMark({ light = false, compact = false }) {
  const classes = `brand-mark${light ? ' brand-mark--light' : ''}${compact ? ' brand-mark--compact' : ''}`

  return (
    <div className={classes}>
      <span className="brand-mark__tile"><Icon name="brand" className="brand-symbol" /></span>
      <span>CarePoint<span className="brand-mark__dot">.</span></span>
    </div>
  )
}

export default BrandMark

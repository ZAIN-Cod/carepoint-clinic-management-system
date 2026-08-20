import BrandMark from './BrandMark.jsx'
import Icon from './Icon.jsx'
import NavItem from './NavItem.jsx'
import { primaryNavigation, settingsNavigation } from '../routes/navigation.js'

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <button className={`app-overlay${isOpen ? ' app-overlay--visible' : ''}`} type="button" aria-label="Close navigation" onClick={onClose} />
      <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ''}`}>
        <div className="app-sidebar__brand">
          <BrandMark light />
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}><Icon name="close" /></button>
        </div>
        <nav className="app-sidebar__navigation" aria-label="Main navigation">
          {primaryNavigation.map((item) => <NavItem item={item} key={item.to} onNavigate={onClose} />)}
        </nav>
        <nav className="app-sidebar__settings" aria-label="Settings navigation">
          <NavItem item={settingsNavigation} onNavigate={onClose} />
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

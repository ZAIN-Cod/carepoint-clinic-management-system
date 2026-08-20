import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
      onClick={onNavigate}
      to={item.to}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default NavItem

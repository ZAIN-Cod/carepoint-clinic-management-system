import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from './Icon.jsx'

function AppHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const userName = user?.name || 'Admin User'
  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Clinic Manager'
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <button className="header-menu" type="button" aria-label="Open navigation" onClick={onMenuClick}><Icon name="menu" /></button>
      <label className="header-search">
        <span className="visually-hidden">Search patient records</span>
        <Icon name="search" />
        <input type="search" placeholder="Search patient records..." />
      </label>
      <div className="header-actions">
        <Link className="quick-appointment" to="/appointments/new"><Icon name="plus" className="icon--small" /> <span>Quick appointment</span></Link>
        <span className="header-divider" />
        <button className="icon-button" type="button" aria-label="Notifications"><Icon name="bell" /></button>
        <div style={{ position: 'relative' }}>
          <button
            className="profile-summary"
            type="button"
            aria-label="Open account menu"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span className="profile-summary__details">
              <strong>{userName}</strong>
              <small>{userRole}</small>
            </span>
            <span className="profile-summary__avatar">{userInitials}</span>
          </button>
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--color-surface, #111827)',
                border: '1px solid var(--color-border, #1f2937)',
                borderRadius: '8px',
                padding: '0.5rem',
                minWidth: '160px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  borderRadius: '4px',
                }}
              >
                <Icon name="key" className="icon--small" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader

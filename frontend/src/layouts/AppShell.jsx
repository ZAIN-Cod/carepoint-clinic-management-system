import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import Sidebar from '../components/Sidebar.jsx'

function AppShell() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  return (
    <div className="application-shell">
      <Sidebar isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} />
      <div className="application-content">
        <AppHeader onMenuClick={() => setIsNavigationOpen(true)} />
        <main className="application-main"><Outlet /></main>
      </div>
    </div>
  )
}

export default AppShell

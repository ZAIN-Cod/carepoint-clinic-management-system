import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark.jsx'
import Icon from '../components/Icon.jsx'
import TextField from '../components/TextField.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials and backend server status.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function fillDemoCredentials() {
    setEmail('admin@carepoint.com')
    setPassword('AdminPass123!')
    setErrorMessage('')
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-labelledby="showcase-title">
        <div className="showcase-content">
          <BrandMark light />

          <div className="showcase-copy">
            <div className="compliance-badge"><Icon name="shield" className="icon--small" /> HIPAA COMPLIANT</div>
            <h1 id="showcase-title">Precision care,<br />powered by data.</h1>
            <p>Access real-time patient insights, predictive analytics, and streamlined workflows in one secure environment.</p>
          </div>

          <div className="social-proof" aria-label="Trusted by top clinicians">
            <div className="avatars" aria-hidden="true">
              <span className="avatar">SJ</span><span className="avatar">MC</span><span className="avatar avatar-count">+2k</span>
            </div>
            <div className="rating">
              <span className="rating-stars">{Array.from({ length: 5 }, (_, index) => <Icon name="star" key={index} className="icon--small" />)}</span>
              <span>Trusted by top clinicians</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="mobile-brand"><BrandMark compact /></div>
        <div className="login-form">
          <header className="login-heading">
            <h2 id="login-title">Welcome back</h2>
            <p>Enter your credentials to access your dashboard.</p>
          </header>

          {errorMessage && (
            <div className="error-banner" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '0.875rem' }}>
              <strong>Authentication Error:</strong> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              id="email"
              label="Email Address"
              type="email"
              placeholder="dr.smith@carepoint.com"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              onAction={() => setShowPassword((visible) => !visible)}
              actionLabel={showPassword ? 'Hide password' : 'Show password'}
            />
            <label className="remember-option"><input type="checkbox" name="remember" /><span>Remember me for 30 days</span></label>
            <div className="login-actions">
              <button className="button button--primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Secure Login'} <Icon name="arrowRight" className="icon--small" />
              </button>
              <button className="button button--secondary" type="button"><Icon name="key" className="icon--small" /> Single Sign-On (SSO)</button>
            </div>
          </form>

          <button
            type="button"
            onClick={fillDemoCredentials}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(13,148,136,0.1)',
              border: '1px solid rgba(13,148,136,0.4)',
              color: '#2dd4bf',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ✦ Try Demo Login (Autofill Credentials)
          </button>

          <p className="access-request">Don&apos;t have an account? <a className="text-link" href="#request-access" onClick={(event) => event.preventDefault()}>Request access</a></p>
        </div>
        <div className="status">System Status: Optimal</div>
      </section>
    </main>
  )
}

export default LoginPage
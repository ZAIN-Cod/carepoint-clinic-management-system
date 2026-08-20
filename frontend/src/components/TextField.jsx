import Icon from './Icon.jsx'

function TextField({ id, label, type, placeholder, icon, onAction, actionLabel, value, onChange, disabled, required = true, ...rest }) {
  const isPassword = id === 'password'

  return (
    <div className="field">
      <div className="field__label-row">
        <label htmlFor={id}>{label}</label>
        {isPassword && <a className="text-link text-link--small" href="#forgot-password" onClick={(event) => event.preventDefault()}>Forgot password?</a>}
      </div>
      <div className="field__control">
        <Icon name={icon} className="field__icon" />
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={isPassword ? 'current-password' : 'email'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...rest}
        />
        {onAction && <button className="password-visibility" type="button" onClick={onAction} aria-label={actionLabel}><Icon name={type === 'password' ? 'eyeOff' : 'eye'} /></button>}
      </div>
    </div>
  )
}

export default TextField

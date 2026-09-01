import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import './Button.css'

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  motionProps,
  disabled,
  type = 'button',
  href,
  target,
  rel,
  ...props
}, ref) => {
  const baseClasses = 'btn-base'
  const variantClasses = `btn-${variant}`
  const sizeClasses = `btn-${size}`

  const inner = (
    <>
      {loading ? (
        <Loader2 className="btn-icon animate-spin" />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      {children && <span className="btn-label">{children}</span>}
    </>
  )

  if (href) {
    const linkEl = (
      <Link
        ref={ref}
        to={href}
        target={target}
        rel={rel}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {inner}
      </Link>
    )

    if (motionProps) {
      return (
        <motion.div {...motionProps} className="inline-flex">
          {linkEl}
        </motion.div>
      )
    }

    return linkEl
  }

  const btnEl = (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {inner}
    </button>
  )

  if (motionProps) {
    return (
      <motion.button
        {...motionProps}
        type={type}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        ref={ref}
        {...props}
      >
        {inner}
      </motion.button>
    )
  }

  return btnEl
})

Button.displayName = 'Button'

export default Button
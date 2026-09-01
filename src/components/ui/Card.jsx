import { motion } from 'framer-motion'
import './Card.css'

const paddingClasses = {
  sm: 'card-padding-sm',
  md: 'card-padding-md',
  lg: 'card-padding-lg',
}

export default function Card({ children, motionProps, hover = true, glow = false, padding = 'md', className = '', ...props }) {
  const classes = [
    'card-base',
    hover ? 'card-hover' : '',
    glow ? 'card-glow' : '',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={classes} {...props}>
      {children}
    </div>
  )

  if (motionProps) {
    return <motion.div className={classes} {...motionProps} {...props}>{children}</motion.div>
  }

  return content
}

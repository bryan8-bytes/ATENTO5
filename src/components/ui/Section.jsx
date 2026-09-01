import { motion } from 'framer-motion'
import './Section.css'

const spacingClasses = {
  sm: 'section-spacing-sm',
  md: 'section-spacing-md',
  lg: 'section-spacing-lg',
}

export default function Section({ children, motionProps, spacing = 'lg', container = true, className = '', id, ...props }) {
  const classes = [spacingClasses[spacing], container ? 'section-container' : '', className].filter(Boolean).join(' ')

  const content = (
    <section id={id} className={classes} {...props}>
      {container ? <div className="section-inner">{children}</div> : children}
    </section>
  )

  if (motionProps) {
    return <motion.section id={id} className={classes} {...motionProps} {...props}>{container ? <div className="section-inner">{children}</div> : children}</motion.section>
  }

  return content
}

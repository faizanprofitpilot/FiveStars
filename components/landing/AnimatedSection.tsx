'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  animation?: 'fade-in-up' | 'fade-in-down' | 'fade-in' | 'scale-in' | 'slide-in-left' | 'slide-in-right'
}

export function AnimatedSection({
  children,
  delay = 0,
  className = '',
  animation = 'fade-in-up',
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const animationClasses = {
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'fade-in': 'animate-fade-in',
    'scale-in': 'animate-scale-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
  }

  return (
    <div
      ref={ref}
      className={`${className} ${
        isVisible ? animationClasses[animation] : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}


import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an epoch to a time-relative string
 * @param date
 * @returns
 */
export function formatTimeRelativeToNow(date: number): string {
  const now = Date.now()

  // seconds ago
  if (now - date < 60 * 1000) {
    return 'Just now'
  }
  // minutes ago
  if (now - date < 60 * 60 * 1000) {
    const mins = Math.floor((now - date) / 60 / 1000)
    return `${mins} ${mins <= 1 ? 'min' : 'mins'} ago`
  }
  // hours ago
  if (now - date < 24 * 60 * 60 * 1000) {
    const hours = Math.floor((now - date) / 60 / 60 / 1000)
    return `${hours} ${hours <= 1 ? 'hour' : 'hours'} ago`
  }
  // days ago
  if (now - date < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor((now - date) / 24 / 60 / 60 / 1000)
    return `${days} ${days <= 1 ? 'day' : 'days'} ago`
  }
  // months ago
  if (now - date < 365 * 24 * 60 * 60 * 1000) {
    const months = Math.floor((now - date) / 30 / 24 / 60 / 60 / 1000)
    return `${months} ${months <= 1 ? 'month' : 'months'} ago`
  }
  // years ago
  const years = Math.floor((now - date) / 365 / 24 / 60 / 60 / 1000)
  return `${years} ${years <= 1 ? 'year' : 'years'} ago`
}

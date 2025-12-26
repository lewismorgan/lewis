import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { cn, formatTimeRelativeToNow, sleep } from '~/lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle conditionals', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toContain('base')
      expect(cn('base', isActive && 'active')).toContain('active')
    })

    it('should merge tailwind classes without duplicates', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toContain('px-4')
      expect(result).toContain('py-1')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })
  })

  describe('formatTimeRelativeToNow', () => {
    let now: number

    beforeEach(() => {
      now = Date.now()
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "Just now" for times less than 60 seconds ago', () => {
      const thirtySecondsAgo = now - 30 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(thirtySecondsAgo)).toBe('Just now')
    })

    it('should return minutes ago', () => {
      const fiveMinutesAgo = now - 5 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(fiveMinutesAgo)).toBe('5 mins ago')
    })

    it('should return singular minute ago', () => {
      const oneMinuteAgo = now - 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(oneMinuteAgo)).toBe('1 min ago')
    })

    it('should return hours ago', () => {
      const threeHoursAgo = now - 3 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(threeHoursAgo)).toBe('3 hours ago')
    })

    it('should return singular hour ago', () => {
      const oneHourAgo = now - 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(oneHourAgo)).toBe('1 hour ago')
    })

    it('should return days ago', () => {
      const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(fiveDaysAgo)).toBe('5 days ago')
    })

    it('should return singular day ago', () => {
      const oneDayAgo = now - 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(oneDayAgo)).toBe('1 day ago')
    })

    it('should return months ago', () => {
      const threeMonthsAgo = now - 3 * 30 * 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(threeMonthsAgo)).toBe('3 months ago')
    })

    it('should return singular month ago', () => {
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(oneMonthAgo)).toBe('1 month ago')
    })

    it('should return years ago', () => {
      const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(twoYearsAgo)).toBe('2 years ago')
    })

    it('should return singular year ago', () => {
      const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000
      vi.setSystemTime(new Date(now))
      expect(formatTimeRelativeToNow(oneYearAgo)).toBe('1 year ago')
    })
  })

  describe('sleep', () => {
    it('should resolve after the specified time', async () => {
      vi.useFakeTimers()
      const promise = sleep(1000)
      vi.runAllTimers()
      await expect(promise).resolves.toBeUndefined()
      vi.useRealTimers()
    })

    it('should handle zero milliseconds', async () => {
      vi.useFakeTimers()
      const promise = sleep(0)
      vi.runAllTimers()
      await expect(promise).resolves.toBeUndefined()
      vi.useRealTimers()
    })
  })
})

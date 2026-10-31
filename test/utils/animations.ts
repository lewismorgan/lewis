import { type Page } from '@playwright/test'

export type RecordedAnimation = {
  name: string
  role: string | null
  state: string | null
  testId: string | null
}

type AnimationWindow = Window & { __animations?: RecordedAnimation[] }

/**
 * Starts recording every CSS `animationstart` on the page and returns a getter
 * for the recorded list. Recording events (instead of sampling computed styles
 * mid-animation) is race-free and still catches exit animations whose element
 * unmounts as soon as the animation ends.
 *
 * tw-animate-css `animate-in` / `animate-out` classes run keyframes named
 * `enter` / `exit`. If the stylesheet isn't loaded, no animation starts at all.
 */
export async function recordAnimations(
  page: Page,
): Promise<() => Promise<RecordedAnimation[]>> {
  await page.evaluate(() => {
    const w = window as AnimationWindow
    const recorded: RecordedAnimation[] = []
    w.__animations = recorded
    document.addEventListener('animationstart', event => {
      const target = event.target as HTMLElement
      recorded.push({
        name: event.animationName,
        role: target.getAttribute('role'),
        state: target.getAttribute('data-state'),
        testId: target.getAttribute('data-testid'),
      })
    })
  })

  return () =>
    page.evaluate(() => (window as AnimationWindow).__animations ?? [])
}

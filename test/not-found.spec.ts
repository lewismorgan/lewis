import { expect, test } from '@playwright/test'

const starWarsQuotes = [
  "These are not the droids you're looking for.",
  'Lost a planet Master Obi-Wan has. How embarrassing.',
  'Perhaps the archives are incomplete.',
  'Failed, I have. Into exile, I must go.',
  "In my experience, there's no such thing as luck.",
  'Do or do not. There is no try.',
  'Your focus determines your reality.',
  'The Force will be with you. Always.',
  'I have a bad feeling about this.',
  'This is not the page you were looking for.',
]

test.describe('404 Not Found Page', () => {
  test('should display 404 heading', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  })

  test('should display Star Wars quote', async ({ page }) => {
    await page.goto('/nonexistent-page')

    // Check that at least one of the quotes is visible (without the wrapping quotes)
    const quotePromises = starWarsQuotes.map(quote =>
      page
        .getByText(quote)
        .isVisible()
        .catch(() => false),
    )
    const results = await Promise.all(quotePromises)
    const hasVisibleQuote = results.some(isVisible => isVisible)

    expect(hasVisibleQuote).toBe(true)
  })

  test('should display helper text', async ({ page }) => {
    await page.goto('/invalid-url')

    await expect(
      page.getByText("The page you're looking for doesn't exist."),
    ).toBeVisible()
  })

  test('should have Go Home button', async ({ page }) => {
    await page.goto('/missing-page')

    const button = page.getByRole('link', { name: 'Go Home' })
    await expect(button).toBeVisible()
    await expect(button).toHaveAttribute('href', '/')
  })

  test('should navigate back to home page', async ({ page }) => {
    await page.goto('/does-not-exist')

    await page.getByRole('link', { name: 'Go Home' }).click()
    await page.waitForURL('/')

    await expect(
      page.getByRole('heading', { name: 'Hello_Internet' }),
    ).toBeVisible()
  })

  test('should render correctly in dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/not-a-real-page')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    const button = page.getByRole('link', { name: 'Go Home' })
    await expect(button).toBeVisible()
  })

  test('should render correctly in light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/another-missing-page')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    const button = page.getByRole('link', { name: 'Go Home' })
    await expect(button).toBeVisible()
  })
})

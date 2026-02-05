import { expect, test } from '@playwright/test'

test.describe('Main Content', () => {
  test('should display hero section with typing greeting', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Hello_Internet' }),
    ).toBeVisible()
  })

  test('should display welcome message', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Welcome to the digital space')).toBeVisible()
  })

  test('should display Software Engineer link', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('link', { name: 'Software Engineer' })

    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://github.com/lewismorgan')
  })

  test('should display GitHub bio on hover', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Software Engineer' }).hover()
    await expect(
      page
        .locator('div')
        .filter({ hasText: 'lewismorganis a developer' })
        .nth(4),
    ).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: 'Toggle theme' })

    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    await expect(themeButton).toBeVisible()

    await expect(page.locator('html')).toHaveAttribute('class', /dark/)
    await themeButton.click()
    await expect(page.locator('html')).toHaveAttribute('class', /light/)
  })
})

test.describe('Repository Section', () => {
  test('should display repository section', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('text=You can find most of the projects'),
    ).toBeVisible()
  })

  test('should have GitHub profile link', async ({ page }) => {
    await page.goto('/')
    const githubLink = page.locator('a[href*="github.com/lewismorgan"]')
    await expect(githubLink.first()).toBeVisible()
  })
})

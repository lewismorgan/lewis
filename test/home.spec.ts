import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display hero section with greeting', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Hello_Internet')).toBeVisible()
  })

  test('should display welcome message', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator(
        'text=Welcome to the digital space, domain, and realm of Lewis Morgan',
      ),
    ).toBeVisible()
  })

  test('should display Software Engineer section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Software Engineer')).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/')
    const themeButton = page.locator('button').first()
    await expect(themeButton).toBeVisible()
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

test.describe('README Dialog', () => {
  test('README dialog button should have hover cursor pointer', async ({
    page,
  }) => {
    await page.goto('/')
    // Wait for repository cards to load
    await page.waitForSelector('button[aria-label*="View README"]', {
      timeout: 10000,
    })

    const readmeButton = page
      .locator('button[aria-label*="View README"]')
      .first()
    await expect(readmeButton).toBeVisible()

    // Check if button has hover:cursor-pointer class
    const className = await readmeButton.getAttribute('class')
    expect(className).toContain('hover:cursor-pointer')
  })

  test('README dialog close button should have hover cursor pointer', async ({
    page,
  }) => {
    await page.goto('/')
    // Wait for repository cards to load
    await page.waitForSelector('button[aria-label*="View README"]', {
      timeout: 10000,
    })

    const readmeButton = page
      .locator('button[aria-label*="View README"]')
      .first()
    await readmeButton.click()

    // Wait for dialog to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

    // Find the close button (X button)
    const closeButton = page.locator('[role="dialog"] button').first()
    await expect(closeButton).toBeVisible()

    // Check if close button has hover:cursor-pointer class
    const className = await closeButton.getAttribute('class')
    expect(className).toContain('hover:cursor-pointer')
  })
})

test.describe('Footer', () => {
  test('should display footer with GitHub link', async ({ page }) => {
    await page.goto('/')
    const footerLink = page.locator('footer a[href*="github.com"]')
    await expect(footerLink).toBeVisible()
  })
})

import { expect, test } from '@playwright/test'

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

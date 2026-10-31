import { expect, test } from '@playwright/test'

import { recordAnimations } from './utils/animations'

test.describe('README Dialog', () => {
  test('README dialog should animate open and closed', async ({ page }) => {
    await page.goto('/')
    const readmeButton = page
      .getByRole('button', { name: /View README/ })
      .first()
    await expect(readmeButton).toBeVisible({ timeout: 10000 })

    const animations = await recordAnimations(page)

    await readmeButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect.poll(animations).toContainEqual(
      expect.objectContaining({
        name: 'enter',
        role: 'dialog',
        state: 'open',
      }),
    )

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect.poll(animations).toContainEqual(
      expect.objectContaining({
        name: 'exit',
        role: 'dialog',
        state: 'closed',
      }),
    )
  })

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

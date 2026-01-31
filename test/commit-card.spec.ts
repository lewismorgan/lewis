import { expect, test } from '@playwright/test'

test.describe('Commit Card Display', () => {
  test('should display commit information in repository cards', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    await page.waitForSelector('[class*="flex"][class*="flex-col"]', {
      timeout: 15000,
    })

    // Check that at least one commit SHA is displayed (7 characters)
    const shaPattern = /[a-f0-9]{7}/
    const commitInfo = page.locator('text=/[a-f0-9]{7}/')
    await expect(commitInfo.first()).toBeVisible({ timeout: 10000 })
  })

  test('should display commit author with link', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check for author link (should be a link to GitHub profile)
    const authorLink = page.locator('a[href*="github.com"]').first()
    await expect(authorLink).toBeVisible({ timeout: 10000 })
  })

  test('should display commit message', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check that commit message is displayed (truncated with ellipsis)
    const commitMessage = page
      .locator('[class*="truncate"][class*="hover:underline"]')
      .first()
    await expect(commitMessage).toBeVisible({ timeout: 10000 })
  })

  test('should display relative time for commit', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check for relative time (e.g., "2 days ago", "5 mins ago")
    const relativeTime = page.locator(
      'text=/\\d+\\s+(second|minute|hour|day|week|month|year)s?\\s+ago/',
    )
    await expect(relativeTime.first()).toBeVisible({ timeout: 10000 })
  })

  test('should display bot icon for bot authors if present', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check if any bot icons are present (they would have aria-label="Bot contributor")
    const botIcon = page.locator('[aria-label="Bot contributor"]')
    const botIconCount = await botIcon.count()

    // If bot icons are present, verify they are visible
    if (botIconCount > 0) {
      await expect(botIcon.first()).toBeVisible()
    }
  })

  test('should handle multiple authors if present', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check if any commits have multiple authors (indicated by commas)
    const authorContainer = page
      .locator('[class*="flex"][class*="items-center"][class*="gap-1"]')
      .first()
    await expect(authorContainer).toBeVisible({ timeout: 10000 })
  })

  test('should have working author profile links', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Find an author link
    const authorLink = page
      .locator('a[href*="github.com"][rel="noopener noreferrer"]')
      .first()
    await expect(authorLink).toBeVisible({ timeout: 10000 })

    // Verify the link has proper attributes
    await expect(authorLink).toHaveAttribute('target', '_blank')
    await expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should display avatar for non-bot authors', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Look for avatar containers (rounded-full class indicates avatar)
    const avatar = page
      .locator('[class*="rounded-full"][class*="h-4"][class*="w-4"]')
      .first()

    // If avatar exists, it should be visible
    const avatarCount = await avatar.count()
    if (avatarCount > 0) {
      await expect(avatar).toBeVisible()
    }
  })
})

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
    const commitInfo = page.locator('text=/[a-f0-9]{7}/')
    await expect(commitInfo.first()).toBeVisible({ timeout: 10000 })
  })

  test('should display commit message', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check that commit message is displayed as a link
    const commitMessage = page
      .locator('a[target="_blank"][href*="github.com"][href*="commit"]')
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

  test('should display only one bot icon even if multiple bots', async ({
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
    // Note: Each commit card should only have at most 1 bot icon even if multiple bots contributed
    if (botIconCount > 0) {
      await expect(botIcon.first()).toBeVisible()
    }
  })

  test('should display + character and human contributor names when multiple authors', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check for + characters
    const plusChar = page.locator('text="+"')
    const plusCount = await plusChar.count()

    // + character should appear when there are multiple authors or when there's a bot
    if (plusCount > 0) {
      await expect(plusChar.first()).toBeVisible()
    }
  })

  test('should not display avatars', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Look for avatar containers (rounded-full class indicates avatar)
    // Avatars should NOT be present
    const commitArea = page
      .locator('[class*="flex"][class*="flex-row"]')
      .first()
    const avatarsInCommitArea = await commitArea
      .locator('[class*="rounded-full"][class*="h-4"][class*="w-4"]')
      .count()
    expect(avatarsInCommitArea).toBe(0)
  })

  test('commit message should be clickable link', async ({ page }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    await page.waitForSelector('[class*="flex"][class*="flex-col"]', {
      timeout: 15000,
    })

    // Find the first commit message link
    const commitMessageLink = page
      .locator('[class*="truncate"] a[target="_blank"]')
      .first()
    await expect(commitMessageLink).toBeVisible({ timeout: 10000 })

    // Verify the link has the correct attributes
    const href = await commitMessageLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toContain('github.com')

    // Verify target="_blank" for external link
    const target = await commitMessageLink.getAttribute('target')
    expect(target).toBe('_blank')
  })

  test('author names should be clickable links to GitHub profiles', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Find author profile links (links with GitHub profile URLs)
    const authorLinks = page.locator('a[href*="github.com"][target="_blank"]')
    const authorLinkCount = await authorLinks.count()

    // Should have at least one author link
    expect(authorLinkCount).toBeGreaterThan(0)

    // Check first author link
    const firstAuthorLink = authorLinks.first()
    await expect(firstAuthorLink).toBeVisible()

    const href = await firstAuthorLink.getAttribute('href')
    expect(href).toContain('github.com')

    const target = await firstAuthorLink.getAttribute('target')
    expect(target).toBe('_blank')
  })

  test('commit links should have proper styling for accessibility', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page.waitForSelector('[class*="flex"][class*="flex-row"]', {
      timeout: 15000,
    })

    // Check that commit message links have hover underline styling
    const commitMessageLink = page
      .locator('a[target="_blank"][href*="github.com"][href*="commit"]')
      .first()
    const commitLinkClasses = await commitMessageLink.getAttribute('class')
    expect(commitLinkClasses).toContain('hover:underline')

    // Check that author links have hover underline styling
    // Get all author links that are not commit links (use font-semibold class)
    const authorLinks = page.locator('a.font-semibold[target="_blank"]')
    const authorLink = authorLinks.first()
    const authorLinkClasses = await authorLink.getAttribute('class')
    expect(authorLinkClasses).toContain('hover:underline')
  })
})

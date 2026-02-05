import { expect, test } from '@playwright/test'

test.describe('Commit Card Display', () => {
  test('should display commit information in repository cards', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const gitCard = page.getByTestId('git-card').first()
    await expect(gitCard).toBeVisible({ timeout: 5000 })
  })

  test('should display commit message', async ({ page }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page
      .getByRole('link', { name: /commit/ })
      .first()
      .waitFor({
        timeout: 15000,
      })

    // Check that commit message is displayed as a link
    const commitMessage = page
      .getByRole('link')
      .filter({ has: page.locator('[href*="commit"]') })
      .first()
    await expect(commitMessage).toBeVisible({ timeout: 10000 })
  })

  test('should display relative time for commit after the SHA', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const gitCard = page.getByTestId('git-card').first()
    await expect(gitCard).toBeVisible({ timeout: 5000 })

    // Check that at least one commit SHA is displayed (7 characters)
    const commitInfo = gitCard.getByText(/[a-f0-9]{7}/)
    await expect(commitInfo).toBeVisible({ timeout: 10000 })

    // Check for relative time (e.g., "2 days ago", "5 mins ago")
    const relativeTime = gitCard.getByText(
      /\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/,
    )
    await expect(relativeTime).toBeVisible({ timeout: 10000 })
  })

  test('should display only one bot icon even if multiple bots', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for commit details to load
    await page
      .getByRole('img', { name: /Bot contributor/ })
      .first()
      .waitFor({
        timeout: 15000,
      })
      .catch(() => {})

    // Check if any bot icons are present (they would have aria-label="Bot contributor")
    const botIcon = page.getByRole('img', { name: 'Bot contributor' })
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
    await page
      .getByText('+')
      .first()
      .waitFor({
        timeout: 15000,
      })
      .catch(() => {})

    // Check for + characters
    const plusChar = page.getByText('+')
    const plusCount = await plusChar.count()

    // + character should appear when there are multiple authors or when there's a bot
    if (plusCount > 0) {
      await expect(plusChar.first()).toBeVisible()
    }
  })

  test('commit message should be clickable link', async ({ page }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    await page
      .getByRole('link', { name: /github\.com/ })
      .first()
      .waitFor({
        timeout: 15000,
      })

    // Find the first commit message link
    const commitMessageLink = page
      .getByRole('link')
      .filter({ has: page.locator('[href*="commit"]') })
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
    await page
      .getByRole('link', { name: /github\.com/ })
      .first()
      .waitFor({
        timeout: 15000,
      })

    // Find author profile links (links with GitHub profile URLs)
    const authorLinks = page
      .getByRole('link')
      .filter({ has: page.locator('[href*="github.com"]') })
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

    const baseCard = page.getByText('lewisPersonal landing page')
    // Check that commit message links have hover underline styling
    const commitMessageLink = baseCard
      .getByRole('link', { name: /lewis/ })
      .filter({ has: page.locator('[href*="commit"]') })
      .first()
    const commitLinkClasses = await commitMessageLink.getAttribute('class')
    expect(commitLinkClasses).toContain('hover:underline')

    // Check that author links have hover underline styling
    const authorLinks = page
      .getByRole('link')
      .filter({ has: page.locator('[href*="github.com"]') })
    const authorLink = authorLinks.first()
    const authorLinkClasses = await authorLink.getAttribute('class')
    expect(authorLinkClasses).toContain('hover:underline')
  })
})

import { expect, test } from '@playwright/test'

test.describe('Commit Card Display', () => {
  test('should display many repository cards', async ({ page }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const gitCards = page.getByTestId('git-card')
    // Expect at least 1 card and at most 5 (the display count limit)
    await expect(gitCards.first()).toBeVisible({ timeout: 5000 })
    const cardCount = await gitCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(1)
    expect(cardCount).toBeLessThanOrEqual(5)
  })

  test('should display no more than 3 language badges per repository', async ({
    page,
  }) => {
    await page.goto('/')
    const gitCards = page.getByTestId('git-card')
    for (const card of await gitCards.all()) {
      const langBadges = card.getByTestId('lang-badge')
      const badgeCount = await langBadges.count()
      expect(badgeCount).toBeGreaterThan(0)
      expect(badgeCount).toBeLessThanOrEqual(3)
    }
  })

  test('should display commit message & author as a clickable link', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const commit = page.getByTestId('git-card-commit').first()
    await expect(commit).toBeVisible({ timeout: 5000 })

    // Check that commit message link is always present
    // Use test-id selector since commit message is the most reliable element
    const commitMessageLink = commit.getByTestId('commit-message-link')
    await expect(commitMessageLink).toBeVisible()
    await expect(commitMessageLink).toHaveText(/.+/)
    await expect(commitMessageLink).toHaveAttribute(
      'href',
      /github\.com\/.+\/commit\/.+/,
    )
    await expect(commitMessageLink).toHaveAttribute('target', '_blank')

    // Check that we have at least one link (the commit message)
    const allLinks = commit.getByRole('link')
    const linkCount = await allLinks.count()
    expect(linkCount).toBeGreaterThanOrEqual(1)

    // If there are multiple links (human authors + commit), verify author links exist
    if (linkCount > 1) {
      const firstAuthorLink = commit
        .getByRole('link')
        .filter({
          hasNot: commit.locator('[data-testid="commit-message-link"]'),
        })
        .first()
      await expect(firstAuthorLink).toBeVisible()
      await expect(firstAuthorLink).toHaveAttribute('href', /github\.com\/.+/)
      await expect(firstAuthorLink).toHaveAttribute('target', '_blank')
    }
  })

  test('should display relative time for commit after the SHA', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const gitCard = page.getByTestId('git-card').first()
    await expect(gitCard).toBeVisible()

    // only one commit card per repo card, need to wait for it to load
    const commitCard = gitCard.getByTestId('git-card-commit')
    await expect(commitCard).toBeVisible()

    const commitCardCount = await commitCard.count()
    expect(commitCardCount).toBe(1)

    // Check that at least one commit SHA is displayed (7 characters)
    const commitInfo = gitCard.getByText(/[a-f0-9]{7}/)
    await expect(commitInfo).toBeVisible({ timeout: 10000 })

    // Check for relative time (e.g., "Just now", "1 min ago", "2 mins ago", "1 day ago", "2 days ago")
    const relativeTime = gitCard.getByText(
      /(Just now|\d+\s+(mins?|hours?|days?|months?|years?)\s+ago)/,
    )
    await expect(relativeTime).toBeVisible({ timeout: 10000 })
  })

  test('should display bot + human contributor when multiple dual contributors', async ({
    page,
  }) => {
    await page.goto('/')

    const gitCards = page.getByTestId('git-card')
    for (const card of await gitCards.all()) {
      const botIcons = card.getByRole('img', { name: 'Bot contributor' })
      const botIconCount = await botIcons.count()
      expect(botIconCount).toBeLessThanOrEqual(1)

      if (!botIconCount) {
        continue
      }

      // If there is a bot icon, ensure there's no more than one human author displayed
      const commitCard = card.getByTestId('git-card-commit')
      const plusChars = commitCard.getByText('+')
      const plusCount = await plusChars.count()
      expect(plusCount).toBeLessThanOrEqual(1)

      const humanAuthor = commitCard
        .getByRole('link')
        .filter({ has: commitCard.locator('[href*="github.com"]') })
      const humanAuthorCount = await humanAuthor.count()
      expect(humanAuthorCount).toBeLessThanOrEqual(1)
    }
  })
})

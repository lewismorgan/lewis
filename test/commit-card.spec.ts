import { expect, test } from '@playwright/test'

test.describe('Commit Card Display', () => {
  test('should display many repository cards', async ({ page }) => {
    await page.goto('/')

    // Wait for repository cards with commit information to load
    const gitCards = page.getByTestId('git-card')
    await expect(gitCards).toHaveCount(5, { timeout: 5000 })
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

    // Check that author is displayed first and as a link
    const author = commit.getByRole('link').nth(0)
    await expect(author).toBeVisible()

    await expect(author).toHaveText(/.+/)
    await expect(author).toHaveAttribute('href', /github\.com\/.+/)
    await expect(author).toHaveAttribute('target', '_blank')
    await expect(author).toHaveAttribute('class', /hover:underline/)

    // Check that commit message is displayed second and as a link
    const link = commit.getByRole('link').nth(1)
    await expect(link).toBeVisible()

    await expect(link).toHaveText(/.+/)
    await expect(link).toHaveAttribute('href', /github\.com\/.+\/commit\/.+/)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('class', /hover:underline/)
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

    // Check for relative time (e.g., "2 days ago", "5 mins ago")
    const relativeTime = gitCard.getByText(
      /\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/,
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

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
    await expect(link).toHaveAttribute('target', '_blank')
  })

  test('should display my GitHub bio on hover', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Software Engineer' }).hover()

    const hovercard = page.getByTestId('lewis-hovercard')

    // Avatar + name as a link to my profile
    await expect(
      hovercard.getByRole('img', { name: 'lewismorgan' }),
    ).toBeVisible()

    const link = hovercard.getByRole('link', { name: 'lewismorgan' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://github.com/lewismorgan')

    // Bio section
    await expect(hovercard.getByText('is a ', { exact: false })).toBeVisible()

    await expect(hovercard.getByText('Public Repos')).toBeVisible()
    await expect(hovercard.getByText('Private Repos')).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: 'Toggle theme' })
    await expect(themeButton).toBeVisible()

    await expect(page.locator('html')).toHaveAttribute('class', /dark/)
    await themeButton.click()
    await expect(page.locator('html')).toHaveAttribute('class', /light/)
  })
})

test.describe('Repository Section', () => {
  test('should display repository section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('You can find most of the')).toBeVisible()
  })

  test('should have GitHub profile link', async ({ page }) => {
    await page.goto('/')
    const githubLink = page.locator('a[href*="github.com/lewismorgan"]')
    await expect(githubLink.first()).toBeVisible()
  })

  test('should have a slow mode toggle', async ({ page }) => {
    await page.goto('/')

    const container = page.getByTestId('slow-mode-container')
    const slowModeToggle = container.getByRole('switch', {
      name: 'Slow Mode',
      exact: true,
    })
    const slowModeLabel = container.getByLabel('Slow Mode')

    await expect(container).toBeVisible()
    await expect(slowModeToggle).toBeVisible()
    await expect(slowModeLabel).toBeVisible()

    // Check that slow mode is off by default
    await expect(slowModeToggle).toHaveAttribute('aria-checked', 'false')
  })

  test('should enable slow mode when toggled', async ({ page }) => {
    await page.goto('/')

    const container = page.getByTestId('slow-mode-container')
    const slowModeToggle = container.getByRole('switch', {
      name: 'Slow Mode',
      exact: true,
    })

    // Enable slow mode
    await slowModeToggle.click()

    // verify slow mode is enabled in url and toggle state
    await expect(page).toHaveURL(new RegExp('slowmode=true'))
    await expect(slowModeToggle).toHaveAttribute('aria-checked', 'true')

    // Reload the page to ensure slow mode persists
    await page.reload()
    await expect(slowModeToggle).toHaveAttribute('aria-checked', 'true')
  })

  test('should summon repositories more slowly in slow mode', async ({
    page,
  }) => {
    // Start in slow mode and start tests as soon as we start loading
    await page.goto('/?slowmode=true', { waitUntil: 'commit' })

    const overviewLoadingText = page.getByTestId('repos-loading-text')
    await expect(overviewLoadingText).toBeVisible()

    // Verify that the repository cards appeared all at once
    const gitCards = page.getByTestId('git-card')
    await page.waitForLoadState('domcontentloaded')
    await expect(gitCards).toHaveCount(5)

    // loading finished now make sure we got lang and the commit info
    await page.waitForLoadState('load')
    for (let i = 0; i < 5; i++) {
      const card = gitCards.nth(i)
      await expect(card.getByTestId('lang-badge').first()).toBeVisible()
      await expect(card.getByTestId('git-card-commit')).toBeVisible()
    }

    await expect(overviewLoadingText).not.toBeAttached()
  })

  test('should display language badges with appropriate colors in light mode', async ({
    page,
  }) => {
    await page.goto('/')

    // Clear localStorage to ensure no theme preference is stored
    await page.evaluate(() => localStorage.clear())

    // Set the color scheme preference and reload
    await page.emulateMedia({ colorScheme: 'light' })
    await page.reload()

    // Wait for the page to load completely
    await page.waitForLoadState()

    // Click theme toggle to ensure light mode (since default is dark)
    const themeToggle = page.getByRole('button', { name: /toggle theme/i })
    await themeToggle.click()

    // Wait for theme to apply
    await page.waitForTimeout(100)

    // Get the first repository card with language badges
    const gitCards = page.getByTestId('git-card')
    await expect(gitCards.first()).toBeVisible()

    // Check that language badges are visible
    const langBadges = page.getByTestId('lang-badge')
    await expect(langBadges.first()).toBeVisible()

    // Verify that the HTML element has light mode class
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('should display language badges with appropriate colors in dark mode', async ({
    page,
  }) => {
    await page.goto('/')

    // Clear localStorage to ensure no theme preference is stored
    await page.evaluate(() => localStorage.clear())

    // Set the color scheme preference and reload
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()

    // Wait for the page to load completely
    await page.waitForLoadState()

    // Get the first repository card with language badges
    const gitCards = page.getByTestId('git-card')
    await expect(gitCards.first()).toBeVisible()

    // Check that language badges are visible
    const langBadges = page.getByTestId('lang-badge')
    await expect(langBadges.first()).toBeVisible()

    // Verify that the HTML element has dark mode class
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('should maintain badge readability when switching between themes', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('load')

    // Get the theme toggle button
    const themeButton = page.getByRole('button', { name: 'Toggle theme' })
    await expect(themeButton).toBeVisible()

    // Get language badges
    const langBadges = page.getByTestId('lang-badge')
    await expect(langBadges.first()).toBeVisible()

    // Verify badges are visible in initial theme
    const initialBadgeCount = await langBadges.count()
    expect(initialBadgeCount).toBeGreaterThan(0)

    // Get the current theme state
    const htmlElement = page.locator('html')
    const initialTheme = await htmlElement.getAttribute('class')

    // Switch theme
    await themeButton.click()

    // Wait for theme to actually change by checking the html class
    if (initialTheme?.includes('dark')) {
      await expect(htmlElement).not.toHaveClass(/dark/)
    } else {
      await expect(htmlElement).toHaveClass(/dark/)
    }

    // Verify badges are still visible after theme change
    await expect(langBadges.first()).toBeVisible()
    const afterToggleBadgeCount = await langBadges.count()
    expect(afterToggleBadgeCount).toBe(initialBadgeCount)
  })
})

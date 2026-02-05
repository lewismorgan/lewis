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
})

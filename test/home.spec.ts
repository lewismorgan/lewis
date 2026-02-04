import { expect, test } from '@playwright/test'

test.describe('Main Content', () => {
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
    await page.goto('/')
    const themeButton = page.locator('button').first()
    await expect(themeButton).toBeVisible()
  })
})

test.describe('Easter Eggs', () => {
  test('clicking "glowsticks" should change avatar based on theme', async ({
    page,
  }) => {
    await page.goto('/')

    // Get initial avatar src
    const avatar = page.locator('img[alt="lewismorgan"]')
    await expect(avatar).toBeVisible()
    const initialSrc = await avatar.getAttribute('src')

    // Click on glowsticks
    const glowsticks = page.locator('text=glowsticks')
    await glowsticks.click()

    // Wait for avatar src attribute to change
    await expect(avatar).toHaveAttribute(
      'src',
      new RegExp(`^(?!${initialSrc}).*`),
    )

    // Avatar should change
    const newSrc = await avatar.getAttribute('src')
    expect(newSrc).not.toBe(initialSrc!)
  })

  test('clicking "space-lizards" should display lizard avatar', async ({
    page,
  }) => {
    await page.goto('/')

    // Click on space-lizards
    const spaceLizards = page.locator('text=space-lizards')
    await spaceLizards.click()

    // Wait for avatar to change to lizard image
    const avatar = page.locator('img[alt="lewismorgan"]')
    await expect(avatar).toHaveAttribute('src', /lizard/)

    const src = await avatar.getAttribute('src')
    expect(src).toMatch(/lizard/)
  })

  test('clicking "space-lizards" again should toggle back', async ({
    page,
  }) => {
    await page.goto('/')

    // Get initial avatar
    const avatar = page.locator('img[alt="lewismorgan"]')

    // Click space-lizards to show lizard
    const spaceLizards = page.locator('text=space-lizards')
    await spaceLizards.click()
    await expect(avatar).toHaveAttribute('src', /lizard/)

    const lizardSrc = await avatar.getAttribute('src')
    expect(lizardSrc).toMatch(/lizard/)

    // Click again to toggle back
    await spaceLizards.click()
    await expect(avatar).not.toHaveAttribute('src', /lizard/)

    const toggledBackSrc = await avatar.getAttribute('src')
    expect(toggledBackSrc).not.toMatch(/lizard/)
  })

  test('clicking "code" should replay typing animation', async ({ page }) => {
    await page.goto('/')

    // Get initial typing animation state
    const typingText = page.locator('text=Hello_Internet')
    await expect(typingText).toBeVisible()

    // Click on code (use more specific selector to avoid matching other elements)
    const code = page.locator(
      'span.font-mono.tracking-wider.hover\\:cursor-pointer',
    )
    await code.click()

    // Text should still be visible (animation replays)
    await expect(typingText).toBeVisible()
  })

  test('glowsticks and space-lizards should not show together', async ({
    page,
  }) => {
    await page.goto('/')

    // Click space-lizards first
    const spaceLizards = page.locator('text=space-lizards')
    await spaceLizards.click()
    await expect(page.locator('img[alt="lewismorgan"]')).toHaveAttribute(
      'src',
      /lizard/,
    )

    // Get lizard avatar
    const avatar = page.locator('img[alt="lewismorgan"]')
    let src = await avatar.getAttribute('src')
    expect(src).toMatch(/lizard/)

    // Now click glowsticks - should override and show Force avatar
    const glowsticks = page.locator('text=glowsticks')
    await glowsticks.click()
    await expect(avatar).not.toHaveAttribute('src', /lizard/)

    // Avatar should change from lizard
    src = await avatar.getAttribute('src')
    expect(src).not.toMatch(/lizard/)
  })

  test('easter egg clickable elements should have hover cursor pointer styling', async ({
    page,
  }) => {
    await page.goto('/')

    // Check glowsticks (within spiel - more specific)
    const glowsticks = page.locator(
      'span.relative:has(> span) >> text=glowsticks',
    )
    const glowsticksClasses = await glowsticks.getAttribute('class')
    expect(glowsticksClasses).toContain('hover:cursor-pointer')

    // Check space-lizards
    const spaceLizards = page.locator('text=space-lizards')
    const lizardsClasses = await spaceLizards.getAttribute('class')
    expect(lizardsClasses).toContain('hover:cursor-pointer')

    // Check code (use specific span selector)
    const code = page.locator(
      'span.font-mono.tracking-wider.hover\\:cursor-pointer',
    )
    const codeClasses = await code.getAttribute('class')
    expect(codeClasses).toContain('hover:cursor-pointer')
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

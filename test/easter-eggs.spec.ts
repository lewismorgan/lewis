import { expect, test } from '@playwright/test'

type ColorScheme = null | 'light' | 'dark' | 'no-preference'

test.describe('Easter Eggs', () => {
  ;[
    { colorScheme: 'dark' as ColorScheme, expected: 'anakin.png' },
    { colorScheme: 'light' as ColorScheme, expected: 'grogu.jpg' },
  ].forEach(({ colorScheme, expected }) => {
    test(`clicking "glowsticks" should change to proper force avatar in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.goto('/')

      // Get the theme toggle button
      const themeButton = page.getByRole('button', { name: 'Toggle theme' })
      await expect(themeButton).toBeVisible()

      // Click the theme button until we get the desired theme (site forces to dark mode by default)
      // Check current theme by looking at the html class
      const currentClass = await page.locator('html').getAttribute('class')
      const needsToggle =
        (colorScheme === 'light' && currentClass?.includes('dark')) ??
        (colorScheme === 'dark' && currentClass?.includes('light'))

      if (needsToggle) {
        await themeButton.click()
        // Wait for theme to be applied
        // make the type checker happy and ensure always running the locator
        expect(colorScheme).not.toBeNull()
        if (colorScheme !== null) {
          await expect(page.locator('html')).toHaveAttribute(
            'class',
            new RegExp(colorScheme),
          )
        }
      }

      // avatar should change to force avatar based on the theme
      const avatar = page.getByRole('img', { name: 'lewismorgan' })
      const glowsticks = page.getByText('glowsticks', { exact: true }).first()

      await expect(avatar).toBeVisible()
      await expect(glowsticks).toBeVisible()
      await glowsticks.click()

      await expect(avatar).toBeVisible()
      await expect(avatar).toHaveAttribute('src', new RegExp(`.*${expected}`))
    })
  })

  test('clicking "space-lizards" should display lizard avatar', async ({
    page,
  }) => {
    await page.goto('/')

    const avatar = page.getByRole('img', { name: 'lewismorgan' })
    const spaceLizards = page.getByText('space-lizards', { exact: true })

    // Wait for avatar to change to lizard image
    await expect(avatar).toBeVisible()
    await expect(spaceLizards).toBeVisible()

    await spaceLizards.click()

    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveAttribute('src', /lizard/)
  })

  test('clicking "space-lizards" again should toggle back', async ({
    page,
  }) => {
    await page.goto('/')

    // Get initial avatar
    const avatar = page.getByRole('img', { name: 'lewismorgan' })

    // Click space-lizards to show lizard
    const spaceLizards = page.getByText('space-lizards', { exact: true })
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

    // Get initial typing animation state played in full
    const typingText = page.getByText('Hello_Internet', { exact: true })
    await expect(typingText).toBeVisible()

    // Click on code (use more specific selector to avoid matching other elements)
    const code = page.getByText('code', { exact: true })
    await code.click()

    // Text should still be visible, actual functionality of this test is done through unit tests
    await expect(typingText).toBeVisible()
  })

  test('glowsticks and space-lizards should not show together', async ({
    page,
  }) => {
    await page.goto('/')

    // Click space-lizards first
    const spaceLizards = page.getByText('space-lizards', { exact: true })
    await spaceLizards.click()
    await expect(
      page.getByRole('img', { name: 'lewismorgan' }),
    ).toHaveAttribute('src', /lizard/)

    // Get lizard avatar
    const avatar = page.getByRole('img', { name: 'lewismorgan' })
    let src = await avatar.getAttribute('src')
    expect(src).toMatch(/lizard/)

    // Now click glowsticks - should override and show Force avatar
    const glowsticks = page.getByText('glowsticks', { exact: true })
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
    const glowsticks = page.getByText('glowsticks', { exact: true })
    const glowsticksClasses = await glowsticks.getAttribute('class')
    expect(glowsticksClasses).toContain('hover:cursor-pointer')

    // Check space-lizards
    const spaceLizards = page.getByText('space-lizards', { exact: true })
    const lizardsClasses = await spaceLizards.getAttribute('class')
    expect(lizardsClasses).toContain('hover:cursor-pointer')

    // Check code
    const code = page.getByText('code', { exact: true })
    const codeClasses = await code.getAttribute('class')
    expect(codeClasses).toContain('hover:cursor-pointer')
  })
})

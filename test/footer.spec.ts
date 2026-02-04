import { expect, test } from '@playwright/test'

test.describe('Footer', () => {
  test('should display footer with GitHub repository link', async ({
    page,
  }) => {
    await page.goto('/')
    const footerLink = page.locator(
      'footer a[href="https://github.com/lewismorgan/lewis"]',
    )
    await expect(footerLink).toBeVisible()
    await expect(footerLink).toHaveText('GitHub')
  })

  test('should display commit SHA link and text in footer', async ({
    page,
  }) => {
    await page.goto('/')
    const commitLink = page.locator(
      'footer a[href*="github.com"][href*="commit"]',
    )
    await expect(commitLink).toBeVisible()

    const text = await commitLink.textContent()
    const href = await commitLink.getAttribute('href')

    const envSha = process.env.VERCEL_GIT_COMMIT_SHA

    if (envSha) {
      // In CI, verify it shows the correct short SHA from the env var
      const expectedShortSha = envSha.substring(0, 7)
      expect(text).toBe(expectedShortSha)
      expect(href).toBe(`https://github.com/lewismorgan/lewis/commit/${envSha}`)
    } else {
      // In local dev without env var, should default to "PREVIEW"
      expect(text).toBe('PREVIEW')
      expect(href).toBe('https://github.com/lewismorgan/lewis/commit/PREVIEW')
    }
  })

  test('should display creator attribution in footer', async ({ page }) => {
    await page.goto('/')
    // Footer is fixed at bottom, check the text content includes creator attribution
    const footerContent = await page.locator('footer').textContent()
    expect(footerContent).toContain('Created by Lewis Morgan')
  })

  test('should display deployment status with commit reference', async ({
    page,
  }) => {
    await page.goto('/')
    // Footer is fixed at bottom, check the text content includes deployment info
    const footerContent = await page.locator('footer').textContent()
    expect(footerContent).toContain('Deployed from commit')
  })

  test('all footer links should open in new tab', async ({ page }) => {
    await page.goto('/')
    const footerLinks = page.locator('footer a')
    const count = await footerLinks.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const link = footerLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
    }
  })

  test('footer should be fixed and floating as you scroll', async ({
    page,
  }) => {
    await page.goto('/')
    const footerContent = page.locator('footer > div')

    // Verify footer is positioned as fixed element at bottom so it floats through the page
    const classes = await footerContent.getAttribute('class')
    expect(classes).toContain('fixed')
    expect(classes).toContain('bottom-0')
  })
})

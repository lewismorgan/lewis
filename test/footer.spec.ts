import { expect, test } from '@playwright/test'

test.describe('Footer', () => {
  test('should display footer with GitHub repository link', async ({
    page,
  }) => {
    await page.goto('/')

    const footer = page.getByText(
      'Created by Lewis Morgan. Source code @ GitHub.',
      { exact: false },
    )
    await expect(footer).toBeVisible()

    const footerLink = page.getByText('GitHub', { exact: true })
    await expect(footerLink).toBeVisible()
    await expect(footerLink).toHaveAttribute(
      'href',
      'https://github.com/lewismorgan/lewis',
    )
    // opens in new tab
    await expect(footerLink).toHaveAttribute('target', '_blank')
  })

  test('should display commit SHA link and text in footer', async ({
    page,
  }) => {
    await page.goto('/')

    const deploymentText = page.getByText('Deployed from commit', {
      exact: false,
    })
    await expect(deploymentText).toBeVisible()

    const commitLink = deploymentText.getByRole('link')
    await expect(commitLink).toBeVisible()

    // In CI, verify it shows the correct short SHA from the env var
    const sha =
      process.env.VERCEL_GIT_COMMIT_SHA ??
      '5dddcb5fdfeb49f34f92e9d763a10da0105bd1a8'
    const shortSha = sha.substring(0, 7)

    // opens commit link in new tab labeled as short sha
    await expect(commitLink).toHaveText(shortSha)
    await expect(commitLink).toHaveAttribute(
      'href',
      `https://github.com/lewismorgan/lewis/commit/${sha}`,
    )
    await expect(commitLink).toHaveAttribute('target', '_blank')
  })

  test('footer should be static at the end of the page content', async ({
    page,
  }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()

    // Footer sits in normal flow (not floating) so it can't clash with
    // mobile browser toolbars
    const positions = await footer.evaluate(el =>
      [el, ...Array.from(el.querySelectorAll('*'))].map(
        node => getComputedStyle(node).position,
      ),
    )
    expect(positions).not.toContain('fixed')

    const mainBox = await page.getByRole('main').boundingBox()
    const footerBox = await footer.boundingBox()
    expect(mainBox).not.toBeNull()
    expect(footerBox).not.toBeNull()
    expect(footerBox!.y).toBeGreaterThanOrEqual(mainBox!.y + mainBox!.height)
  })

  test('footer should stay at the bottom of short pages', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    const viewport = page.viewportSize()
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    const footerBox = await footer.boundingBox()
    expect(viewport).not.toBeNull()
    expect(footerBox).not.toBeNull()
    expect(Math.round(footerBox!.y + footerBox!.height)).toBeGreaterThanOrEqual(
      viewport!.height - 1,
    )
  })
})

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

    const envSha = process.env.VERCEL_GIT_COMMIT_SHA
    let shortSha = envSha
    if (envSha) {
      // In CI, verify it shows the correct short SHA from the env var
      shortSha = envSha.substring(0, 7)
    } else {
      // In local dev without env var, should default to "PREVIEW"
      shortSha = 'PREVIEW'
    }

    // opens commit link in new tab labeled as short sha
    await expect(commitLink).toHaveText(shortSha)
    await expect(commitLink).toHaveAttribute(
      'href',
      `https://github.com/lewismorgan/lewis/commit/${envSha}`,
    )
    await expect(commitLink).toHaveAttribute('target', '_blank')
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

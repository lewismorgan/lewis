import { expect, type Page, test } from '@playwright/test'

const viewports = [
  { name: 'phone', width: 390, height: 844, columns: 1 },
  { name: 'tablet', width: 1024, height: 768, columns: 2 },
  { name: 'desktop', width: 1440, height: 900, columns: 3 },
]

// Distinct left edges across all cards equals the number of grid columns
const countColumns = async (page: Page): Promise<number> => {
  const lefts = await page
    .getByTestId('git-card')
    .evaluateAll(cards =>
      cards.map(card => Math.round(card.getBoundingClientRect().left)),
    )
  return new Set(lefts).size
}

test.describe('Repository card layout', () => {
  for (const { name, width, height, columns } of viewports) {
    test(`cards fill the available width on ${name} (${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const cards = page.getByTestId('git-card')
      await expect(cards.first()).toBeVisible()
      const cardCount = await cards.count()

      // Fewer repositories than columns can't fill a row
      expect(await countColumns(page)).toBe(Math.min(columns, cardCount))

      const grid = await page.getByTestId('repo-grid').boundingBox()
      expect(grid).not.toBeNull()
      // Grid spans the page minus side padding, up to its max width (72rem)
      expect(grid!.width).toBeGreaterThanOrEqual(Math.min(width - 64, 1152))

      // Each card fills its column instead of sitting at a fixed width
      const gap = columns > 1 ? 20 : 0
      const expectedCardWidth = (grid!.width - gap * (columns - 1)) / columns
      const card = await cards.first().boundingBox()
      expect(card).not.toBeNull()
      expect(card!.width).toBeGreaterThanOrEqual(expectedCardWidth - 2)
    })
  }

  test('loading text spans the whole grid in slow mode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/?slowmode=true', { waitUntil: 'commit' })

    const loadingText = page.getByTestId('repos-loading-text')
    await expect(loadingText).toBeVisible()

    const grid = await page.getByTestId('repo-grid').boundingBox()
    const text = await loadingText.boundingBox()
    expect(grid).not.toBeNull()
    expect(text).not.toBeNull()
    expect(text!.width).toBeGreaterThanOrEqual(grid!.width - 2)
  })
})

import { test, expect } from '@playwright/test'

test.describe('Smoke / System tests', () => {
  test.setTimeout(30000)

  test('application loads and displays landing or splash', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Lee Roo|Wood|Design|ලී|රූ/i)
  })

  test('shop route is accessible', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })

  test('main content or root is visible after load', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForSelector('#root', { timeout: 15000 })
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })

  test('navigation or main structure exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#root', { timeout: 15000 })
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })
})

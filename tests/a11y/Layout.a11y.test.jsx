import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '../../src/components/layout/Layout'

describe('Layout accessibility', () => {
  it('has no axe violations on shop route', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/shop" element={<div>Shop content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })

  it('skip link is accessible', () => {
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/shop" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })
})

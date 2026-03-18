import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'

describe('routing integration', () => {
  it('renders shop route when path is /shop', () => {
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route path="/shop" element={<div data-testid="shop">Shop</div>} />
          <Route path="/cart" element={<div data-testid="cart">Cart</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByTestId('shop')).toBeInTheDocument()
  })

  it('renders cart route when path is /cart', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route path="/shop" element={<div data-testid="shop">Shop</div>} />
          <Route path="/cart" element={<div data-testid="cart">Cart</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByTestId('cart')).toBeInTheDocument()
  })

  it('Layout with Outlet renders nested route content', () => {
    function Layout() {
      return (
        <div data-testid="layout">
          <nav>Nav</nav>
          <main>
            <Outlet />
          </main>
        </div>
      )
    }
    render(
      <MemoryRouter initialEntries={['/editor']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/editor" element={<div data-testid="editor">Editor</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })
})

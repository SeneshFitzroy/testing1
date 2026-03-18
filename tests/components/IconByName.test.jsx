import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IconByName } from '../../src/lib/iconMap'
import ICON_MAP from '../../src/lib/iconMap'

describe('ICON_MAP', () => {
  it('exports icon map with expected keys', () => {
    expect(ICON_MAP).toBeDefined()
    expect(typeof ICON_MAP).toBe('object')
    expect(ICON_MAP.Sofa).toBeDefined()
    expect(ICON_MAP.Bed).toBeDefined()
    expect(ICON_MAP.Home).toBeDefined()
  })
})

describe('IconByName', () => {
  it('renders Sofa icon when name is Sofa', () => {
    const { container } = render(<IconByName name="Sofa" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders Bed icon when name is Bed', () => {
    const { container } = render(<IconByName name="Bed" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders fallback (Package) for unknown name', () => {
    const { container } = render(<IconByName name="NonExistentIcon" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies className prop', () => {
    const { container } = render(<IconByName name="Sofa" className="h-8 w-8" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-8', 'w-8')
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import ConfirmDialog from '../../src/components/ConfirmDialog'

describe('ConfirmDialog accessibility', () => {
  it('has no axe violations when open', async () => {
    const { container } = render(
      <ConfirmDialog
        open={true}
        title="Confirm action"
        message="Are you sure you want to proceed?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('dialog has correct ARIA attributes', () => {
    const { container } = render(
      <ConfirmDialog
        open={true}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-desc')
  })
})

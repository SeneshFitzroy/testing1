import '@testing-library/jest-dom/vitest'
import * as matchers from 'vitest-axe/matchers'
import { expect } from 'vitest'
expect.extend(matchers)

// jsdom does not implement IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

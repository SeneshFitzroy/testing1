# Lee Roo — Furniture Visualization & Interior Design Platform

[![CI](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml/badge.svg)](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Coursework-blue.svg)](https://www.plymouth.ac.uk)

**Module:** PUSL3122 HCI, Computer Graphics, and Visualisation  
**Institution:** University of Plymouth  
**Team:** 01 | **Term:** 2 2025–26 | **Submission:** 19 March 2026

---

## Abstract

Lee Roo is a web-based furniture visualization and interior design platform for the furniture retail use case. Designers and retail staff can collaborate with customers to visualize how selected furniture fits within room specifications—dimensions, shape, and colour scheme. The system provides **2D spatial layout** creation (Konva canvas) and **3D real-time rendering** (Three.js) to support HCI and usability requirements.

---

## Table of Contents

- [Overview](#overview)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Technical Architecture](#technical-architecture)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [HCI Principles](#hci-principles)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Assets & Credits](#assets--credits)
- [License](#license)

---

## Overview

The application supports:

- Room specifications: size, shape, colour scheme
- 2D design creation: drag-and-drop furniture placement
- 3D visualization: WebGL rendering for realistic preview
- Dynamic scaling, colour and shading for furniture
- Save, edit, duplicate, and delete designs
- Multi-room support within a single project
- Export to PNG, JPG, and PDF
- E-commerce: product catalog, cart, checkout, wishlist
- Designer booking, admin dashboard, designer panel
- Dark mode, internationalization (EN, SI, TA, JA, ZH), multi-currency

---

## Functional Requirements

### Designer / Administration

| Requirement | Implementation |
|-------------|----------------|
| Room specifications | Enter and persist room size, shape, colour scheme |
| 2D design creation | Drag-and-drop on Konva canvas (RoomCanvas2D) |
| 3D visualization | Real-time WebGL via Three.js (RoomViewer3D) |
| Dynamic scaling | Proportionally scale furniture to room dimensions |
| Colour & shading | Apply colours to design or selected items |
| Persistence | Save, edit, duplicate, delete designs (Firestore) |
| Multi-room support | Design multiple rooms per project |
| Export | PNG, JPG, PDF via jsPDF |

### E-Commerce & Extensions

- Product catalog with 3D previews (Real3DViewer, Mini3DPreview)
- Designer consultation booking (MeetDesigner)
- Designer panel for customer design review
- Admin dashboard: products, analytics, orders
- Dark mode, i18n, multi-currency (USD, EUR, GBP, LKR, JPY, AUD, INR, CNY)

---

## Non-Functional Requirements

| Category | Specification |
|----------|----------------|
| **Usability** | Nielsen's heuristics, intuitive interface |
| **Performance** | Lazy loading, code splitting, efficient 3D rendering |
| **Accessibility** | WCAG 2.1 AA — skip links, keyboard nav, focus indicators |
| **Feedback** | Toast notifications (Sonner), auto-save, boundary alerts |
| **Error Prevention** | Confirmation dialogs, form validation |
| **Efficiency** | Keyboard shortcuts, room templates, drag-and-drop |
| **Engagement** | WebGL, Framer Motion animations |
| **Internationalization** | English, Sinhala, Tamil, Japanese, Chinese |
| **Multi-Currency** | USD, EUR, GBP, LKR, JPY, AUD, INR, CNY |

---

## Technical Architecture

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build | Vite 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| Backend | Firebase (Auth, Firestore, Storage) |
| 3D Rendering | Three.js, @react-three/fiber, @react-three/drei |
| 2D Canvas | Konva, react-konva |
| Animations | Framer Motion 11 |
| i18n | i18next, react-i18next |
| Testing | Vitest, React Testing Library, Playwright, vitest-axe |
| Linting | ESLint 9 |

---

## Quick Start

### Prerequisites

- Node.js ≥18.0.0
- npm ≥9

### Installation

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Testing

| Type | Scope | Command |
|------|-------|---------|
| Unit | lib, store, hooks | `npm run test:unit` |
| Component | UI components | `npm run test:run` |
| Integration | Routing, flows | `npm run test:integration` |
| Accessibility | WCAG (axe-core) | `npm run test:a11y` |
| E2E | Full application | `npm run test:e2e` |

### Commands

```bash
npm run test          # Watch mode
npm run test:run      # All Vitest tests
npm run test:unit     # Unit tests only
npm run test:integration
npm run test:a11y
npm run test:coverage # Coverage report
npm run test:e2e      # Playwright E2E
npm run test:all      # Vitest + E2E
```

---

## CI/CD Pipeline

GitHub Actions workflows in `.github/workflows/`:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **CI** | Push/PR to `main` or `master` | Lint, test, coverage, build |
| **CD** | Push to `main` or `master` | Deploy to Vercel (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) |

---

## Project Structure

```
├── .github/workflows/    # ci.yml, cd.yml
├── e2e/                  # Playwright E2E (smoke.spec.js)
├── public/               # Static assets (favicon, images, audio)
├── src/
│   ├── components/
│   │   ├── auth/         # ProtectedRoute, RedirectIfDesigner
│   │   ├── editor/       # RoomCanvas2D, RoomViewer3D, FurniturePanel, PropertiesPanel, etc.
│   │   └── layout/       # Layout, Navbar, Footer
│   ├── hooks/            # useInView
│   ├── lib/              # firebase, constants, utils, designService, colorUtils
│   ├── pages/            # Landing, Shop, Cart, RoomEditor, MyDesigns, Admin, etc.
│   ├── store/            # useAuthStore, useCartStore, useDesignStore, useThemeStore
│   ├── App.jsx
│   ├── main.jsx
│   ├── i18n.js
│   └── index.css
├── tests/
│   ├── a11y/             # axe-core accessibility tests
│   ├── components/       # Component tests
│   ├── hooks/
│   ├── integration/     # routing.test.jsx
│   ├── lib/              # Unit tests (constants, utils, colorUtils, geolocation)
│   ├── store/
│   └── setup.js
├── eslint.config.js
├── playwright.config.js
├── vercel.json           # SPA rewrites
├── vite.config.js
└── vitest.config.js
```

Path alias: `@/` → `src/`.

---

## HCI Principles (Nielsen's 10 Heuristics)

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

---

## Accessibility

- Skip-to-main-content link
- ARIA labels and roles
- Keyboard navigation
- Focus-visible indicators (WCAG 2.1 AA)
- `prefers-reduced-motion` support
- `forced-colors` media query
- Semantic HTML, screen reader support

---

## Deployment

### Vercel

- SPA routing via `vercel.json`
- Connect repo for automatic deployments, or use CD workflow with Vercel secrets

### Firebase

1. **Authorized domains** — Add deployment URLs in Firebase Console → Authentication → Settings → Authorized domains
2. **Google Sign-In** — Configure HTTP referrers in Google Cloud Console for custom domains

---

## Assets & Credits

| Resource | License / Source |
|----------|------------------|
| Unsplash | Product and interior photography |
| Lucide | Icons (MIT) |
| Three.js | 3D rendering (MIT) |
| Firebase | Auth, Firestore, Storage |
| Framer Motion | Animation (MIT) |
| Tailwind CSS | Styling (MIT) |
| Konva | 2D canvas (MIT) |

---

## License

Developed as coursework for PUSL3122 HCI, Computer Graphics, and Visualisation at the University of Plymouth.

# Lee Roo — Furniture Visualization & Interior Design Platform

[![CI](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml/badge.svg)](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-vitest--v8-brightgreen)](./)
[![License](https://img.shields.io/badge/license-Coursework-blue.svg)](https://www.plymouth.ac.uk)

**Module:** PUSL3122 HCI, Computer Graphics, and Visualisation  
**Institution:** University of Plymouth  
**Term:** 2 2025–26 | **Submission:** 19 March 2026

---

## Abstract

Lee Roo is a production-grade, web-based furniture visualization and interior design platform. It enables professional designers and retail staff to collaborate with customers in real time, visualizing how selected furniture items integrate within room specifications—including dimensions, geometry, and colour palettes. The system combines **2D spatial layout** creation with **3D real-time rendering** to deliver an industrial-standard, Human–Computer Interaction (HCI) compliant user experience.

---

## Table of Contents

- [Overview](#overview)
- [Documentation](#documentation)
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

The application addresses the furniture retail use case where in-store designers must:

- Capture customer room specifications (size, shape, colour scheme)
- Construct virtual room layouts with drag-and-drop furniture placement
- Render immersive 3D visualizations for realistic presentation
- Export designs for client review and archival

Core capabilities include **dynamic scaling**, **colour and shading** application, **multi-room** design support, and **export** to PNG, JPG, and PDF. The system is built for usability, performance, accessibility, and engagement in alignment with industry best practices.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Product Images Guide](docs/PRODUCT_IMAGES_GUIDE.md) | Asset management, image naming, and product gallery configuration |
| [Repository](https://github.com/SeneshFitzroy/testing1) | Source code and version history |

---

## Functional Requirements

### Designer / Administration

| Requirement | Implementation |
|-------------|----------------|
| Room specifications | Enter and persist room size, shape, colour scheme |
| 2D design creation | Drag-and-drop furniture placement on Konva canvas |
| 3D visualization | Real-time WebGL rendering via Three.js |
| Dynamic scaling | Proportionally scale furniture to room dimensions |
| Colour & shading | Apply colours to entire design or selected items |
| Persistence | Save, edit, duplicate, and delete designs |
| Multi-room support | Design multiple rooms within a single project |
| Export | PNG, JPG, PDF export with jsPDF |

### E-Commerce & Extensions

- Product catalog with 3D previews
- Designer consultation booking
- Designer review panel for customer designs
- Admin dashboard: products, analytics, orders
- Dark mode, internationalization, multi-currency

---

## Non-Functional Requirements

| Category | Specification |
|----------|---------------|
| **Usability** | Intuitive interface aligned with Nielsen's 10 Heuristics |
| **Performance** | Lazy loading, code splitting, 60fps 3D rendering |
| **Accessibility** | WCAG 2.1 AA — skip links, keyboard nav, focus indicators, screen reader support |
| **Feedback** | Toast notifications, auto-save indicators, boundary alerts |
| **Error Prevention** | Undo/redo, confirmation dialogs, form validation |
| **Efficiency** | Keyboard shortcuts, room templates, drag-and-drop |
| **Engagement** | Real-time WebGL, Framer Motion animations |
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
| Internationalization | i18next, react-i18next |
| Testing | Vitest, React Testing Library, jsdom |
| Linting | ESLint |

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

Application available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Interactive test watch mode |
| `npm run test:run` | Single-pass test execution |
| `npm run test:coverage` | Test execution with coverage report |

```bash
npm run test:run
npm run test:coverage
```

---

## CI/CD Pipeline

Continuous integration and deployment are implemented via GitHub Actions.

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **CI** | Push, pull request to `main` / `master` | Lint, test, coverage, build |
| **CD** | Push to `main` / `master` | Deploy to Vercel (when secrets configured) |

Pipeline definitions: `.github/workflows/`

---

## Project Structure

```
├── .github/
│   └── workflows/           # CI/CD (ci.yml, cd.yml)
├── docs/
│   └── PRODUCT_IMAGES_GUIDE.md
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── auth/            # ProtectedRoute, RedirectIfDesigner
│   │   ├── editor/          # RoomCanvas2D, RoomViewer3D, panels
│   │   └── layout/         # Layout, Navbar, Footer
│   ├── hooks/               # useInView, etc.
│   ├── lib/                 # Firebase, designService, constants, utils
│   ├── pages/               # Route pages
│   ├── store/               # Zustand stores
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests/                   # Test suites
│   ├── components/
│   ├── lib/
│   └── setup.js
├── jsconfig.json
├── vite.config.js
├── vitest.config.js
└── package.json
```

**Path alias:** `@/` maps to `src/` (e.g. `import X from '@/components/X'`).

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
- ARIA labels and roles on interactive elements  
- Full keyboard navigation  
- Focus-visible indicators (WCAG 2.1 AA)  
- `prefers-reduced-motion` support  
- `forced-colors` (high contrast) media query  
- Semantic HTML  
- Screen reader compatibility  

---

## Deployment

### Vercel

- SPA routing configured via `vercel.json`
- Connect repository for automatic deployments

### Firebase

1. **Authorized domains** — Add deployment domains under Firebase Console → Authentication → Settings → Authorized domains  
2. **Google Cloud API** — Configure HTTP referrers for custom domains if using Google Sign-In  

---

## Assets & Credits

| Resource | License / Source |
|----------|------------------|
| Unsplash | Product and interior photography |
| Lucide | Icons (MIT) |
| Three.js | 3D rendering (MIT) |
| Firebase | Authentication and database |
| Framer Motion | Animation (MIT) |
| Tailwind CSS | Styling (MIT) |
| Konva | 2D canvas (MIT) |

---

## License

Developed as coursework for PUSL3122 HCI, Computer Graphics, and Visualisation at the University of Plymouth.

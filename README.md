# Lee Roo — Furniture Visualization & Interior Design Platform

**Module:** PUSL3122 HCI, Computer Graphics, and Visualisation  
**Institution:** University of Plymouth  
**Team:** 01
**Repository:** [pusl3122-hci-leeroo-team01](https://github.com/SeneshFitzroy/pusl3122-hci-leeroo-team01)

---

## 1. Introduction

This document describes the Lee Roo web application, developed as group coursework for PUSL3122. The system fulfils the furniture retail scenario (Appendix A): designers collaborate with customers to visualize furniture within room specifications using 2D layout design and 3D real-time rendering. Links to the source code and video demonstration are provided in the submitted PDF report.

---

## 2. Scenario & Context

A furniture retailer requires a web-based application to improve the in-store customer experience. Designers must:

- Capture room specifications (size, shape, colour scheme)
- Create virtual room layouts with drag-and-drop furniture placement
- Render 3D visualizations for realistic presentation
- Scale furniture to room dimensions and apply colour/shading
- Save, edit, and export designs for client review

The application is designed for professional designers, retail staff, and end customers, with usability, accessibility, and HCI principles applied throughout.

---

## 3. Functional Requirements

### Designer / Administration

| Requirement | Implementation |
|-------------|----------------|
| Room specifications | RoomSettingsPanel: size, shape, wall/floor colours |
| 2D design creation | RoomCanvas2D (Konva): drag-and-drop, resize, rotate |
| 3D visualization | RoomViewer3D (Three.js): real-time WebGL rendering |
| Dynamic scaling | Furniture scaled proportionally to room dimensions |
| Colour & shading | PropertiesPanel: apply to design or selected items |
| Persistence | Firestore: save, edit, duplicate, delete designs |
| Multi-room support | Multiple rooms per project |
| Export | PNG, JPG, PDF via jsPDF |

### E-Commerce & Extensions

- Product catalog with 3D previews (Real3DViewer, Mini3DPreview)
- Designer consultation booking (MeetDesigner)
- Designer panel for customer design review
- Admin dashboard: products, analytics, orders
- Dark mode, internationalization (EN, SI, TA, JA, ZH), multi-currency

---

## 4. Non-Functional Requirements (HCI/UX)

| Category | Implementation |
|----------|-----------------|
| **Usability** | Nielsen's heuristics, consistent interface, minimal training |
| **Performance** | Lazy loading, code splitting, efficient 3D rendering |
| **Accessibility** | WCAG 2.1 AA — skip links, keyboard nav, focus indicators, screen reader support |
| **Feedback** | Toast notifications (Sonner), auto-save indicators, boundary alerts |
| **Error Prevention** | Confirmation dialogs, form validation |
| **Efficiency** | Keyboard shortcuts, room templates, drag-and-drop |
| **Engagement** | WebGL 3D, Framer Motion animations |
| **Internationalization** | English, Sinhala, Tamil, Japanese, Chinese |
| **Multi-Currency** | USD, EUR, GBP, LKR, JPY, AUD, INR, CNY |

---

## 5. Technical Architecture

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

## 6. Quick Start

**Prerequisites:** Node.js ≥18.0.0, npm ≥9

```bash
git clone https://github.com/SeneshFitzroy/pusl3122-hci-leeroo-team01.git
cd pusl3122-hci-leeroo-team01
npm install
npm run dev
```

Open `http://localhost:5173`.

**Production build:** `npm run build` then `npm run preview`

---

## 7. Testing

| Type | Command | Scope |
|------|---------|-------|
| Unit | `npm run test:unit` | lib, store, hooks |
| Component | `npm run test:run` | UI components |
| Integration | `npm run test:integration` | Routing, flows |
| Accessibility | `npm run test:a11y` | WCAG (axe-core) |
| E2E | `npm run test:e2e` | Playwright system tests |
| Coverage | `npm run test:coverage` | v8 coverage report |

---

## 8. Project Structure

```
├── .github/workflows/    # CI (lint, test, build), CD (Vercel)
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets (favicon, images, audio)
├── src/
│   ├── components/
│   │   ├── auth/         # ProtectedRoute, RedirectIfDesigner
│   │   ├── editor/       # RoomCanvas2D, RoomViewer3D, FurniturePanel, PropertiesPanel
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
│   ├── components/
│   ├── hooks/
│   ├── integration/
│   ├── lib/
│   ├── store/
│   └── setup.js
├── vercel.json           # SPA rewrites
├── vite.config.js
├── vitest.config.js
└── playwright.config.js
```

Path alias: `@/` → `src/`

---

## 9. HCI Principles (Nielsen's 10 Heuristics)

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

## 10. Accessibility (WCAG 2.1 AA)

- Skip-to-main-content link  
- ARIA labels and roles on interactive elements  
- Full keyboard navigation  
- Focus-visible indicators  
- `prefers-reduced-motion` support  
- `forced-colors` media query for high contrast  
- Semantic HTML and screen reader compatibility  

---

## 11. Deployment

**Vercel:** SPA routing via `vercel.json`. Connect repository for automatic deployments.

**Firebase:** Add deployment domains in Firebase Console → Authentication → Authorized domains. Configure Google Cloud HTTP referrers for Google Sign-In on custom domains.

---

## 12. Assets & Credits

All additional resources are fully credited. No compressed project versions (e.g. .zip) are stored in the repository.

| Resource | License / Source |
|----------|------------------|
| Unsplash | Product and interior photography |
| Lucide | Icons (MIT) |
| Three.js | 3D rendering (MIT) |
| Firebase | Authentication, Firestore, Storage |
| Framer Motion | Animation (MIT) |
| Tailwind CSS | Styling (MIT) |
| Konva | 2D canvas (MIT) |
| jsPDF | PDF export (MIT) |
| Sonner | Toast notifications (MIT) |
| react-colorful | Colour picker (MIT) |

---

## 13. License

Developed as coursework for PUSL3122 HCI, Computer Graphics, and Visualisation at the University of Plymouth.

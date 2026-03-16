# ලී රූ (Lee Roo) — Wood Designs

A web-based furniture visualization and interior design platform built for **PUSL3122 HCI, Computer Graphics, and Visualisation** coursework at the University of Plymouth.

## Overview

Lee Roo allows furniture designers to work with customers to visualize how selected furniture items would look in their rooms, taking into account room size, shape, and colour scheme. The application supports both **2D layout creation** and **3D visualization** to provide a realistic view of room designs.

## Features

### Functional Requirements (Designer/Admin Side)
- **Room Specifications**: Enter and store room size, shape, and colour scheme
- **2D Design Creation**: Create new designs based on room specs with drag-and-drop furniture placement
- **3D Visualization**: Convert designs into immersive 3D views using Three.js/WebGL
- **Dynamic Scaling**: Scale furniture items to fit room dimensions accurately
- **Colour & Shading**: Apply colours to the entire design or individual furniture pieces
- **Save & Manage**: Save completed designs, edit, duplicate, or delete existing work
- **Multi-Room Support**: Design multiple rooms within a single project
- **Export**: Export designs as PNG, JPG, or PDF

### Non-Functional Requirements (HCI/UX)
- **Usability**: Intuitive interface following Nielsen's 10 Heuristics
- **Performance**: Lazy loading, code splitting, optimized 3D rendering at 60fps
- **Accessibility (WCAG 2.1)**: Skip links, keyboard navigation, focus indicators, screen reader support, reduced-motion preferences, high contrast support
- **Feedback**: Toast notifications for all actions, auto-save indicators, boundary alerts
- **Error Prevention**: Undo/redo history, confirmation dialogs, form validation
- **Efficiency**: Keyboard shortcuts, room templates, drag-and-drop
- **Engagement**: Real-time WebGL 3D visualization, smooth Framer Motion animations
- **Internationalization**: English, Sinhala, Tamil, Japanese, Chinese
- **Multi-Currency**: USD, EUR, GBP, LKR, JPY, AUD, INR, CNY

### Additional Features
- **E-Commerce Shop**: Browse and purchase furniture with 3D product previews
- **Designer Consultation Booking**: Schedule meetings with interior designers
- **Designer Review Panel**: Designers can review and comment on customer designs
- **Admin Dashboard**: Product management, analytics, and order tracking
- **Dark Mode**: Full dark/light theme support
- **Authentication**: Firebase Auth with email/password and Google Sign-In
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM 6 |
| **Styling** | Tailwind CSS 3.4 |
| **State Management** | Zustand 4.5 |
| **Backend/Auth** | Firebase (Auth, Firestore, Storage) |
| **3D Rendering** | Three.js, @react-three/fiber, @react-three/drei |
| **2D Canvas** | Konva, react-konva |
| **Animations** | Framer Motion 11 |
| **i18n** | i18next, react-i18next |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **PDF Export** | jsPDF |
| **Color Picker** | react-colorful |

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
git clone <repository-url>
cd HCI
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel + Firebase)

### Vercel
The project includes `vercel.json` for SPA routing. Deploy with:

```bash
vercel
```

Or connect your GitHub repo to Vercel for auto-deploys.

### Firebase — Fix 400 on Sign Up/Login
For auth to work on your Vercel domain (e.g. `lee-roo-wood-designs.vercel.app`):

1. Open [Firebase Console](https://console.firebase.google.com) → your project
2. Go to **Authentication** → **Settings** (gear) → **Authorized domains**
3. Click **Add domain**
4. Add your Vercel domain(s): `lee-roo-wood-designs.vercel.app`, `d-designs.vercel.app`, or whatever `*.vercel.app` URL your deployment uses
5. Save

Without this, Firebase rejects requests with `400` from unauthorized domains.

### Cloudflare (optional — CDN/DNS proxy)

To add Cloudflare in front of your deployment:

1. **Sign up** at [Cloudflare](https://dash.cloudflare.com) and add your site.
2. **Update DNS** so your domain (or subdomain) points to Cloudflare’s nameservers.
3. **Add a CNAME record** pointing to your Vercel domain (e.g. `lee-roo-wood-designs.vercel.app` or `cname.vercel-dns.com`).
4. **Enable Proxy** (orange cloud) for DDoS protection, caching, and HTTPS.
5. **Firebase Authorized domains**: Add your Cloudflare domain (e.g. `yourdomain.com`, `app.yourdomain.com`) in [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Settings** → **Authorized domains**. This is required for Google Sign-In when using a custom domain via Cloudflare.

If you use Cloudflare Pages instead of Vercel, build the project with `npm run build` and deploy the `dist` folder.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout, Navbar, Footer
│   ├── auth/            # ProtectedRoute
│   ├── editor/          # Room editor components (2D canvas, 3D viewer, panels)
│   ├── SplashScreen.jsx
│   ├── ConfirmDialog.jsx
│   ├── Mini3DPreview.jsx
│   ├── FurnitureModel3D.jsx
│   ├── Product3DViewer.jsx
│   └── Real3DViewer.jsx
├── pages/               # Route pages (Landing, Shop, Editor, etc.)
├── store/               # Zustand stores (auth, theme, cart, design)
├── lib/                 # Utilities, constants, Firebase config
├── i18n.js              # Internationalization config
├── App.jsx              # Route definitions
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## HCI Principles Applied (Nielsen's 10 Heuristics)

1. **Visibility of System Status**: Loading states, save indicators, toast notifications
2. **Match Between System and Real World**: Familiar furniture terminology, intuitive icons
3. **User Control and Freedom**: Undo/redo, confirmation dialogs, reset options
4. **Consistency and Standards**: Unified design language, consistent navigation
5. **Error Prevention**: Form validation, boundary alerts, disabled states
6. **Recognition Rather Than Recall**: Visual furniture catalog, color presets, templates
7. **Flexibility and Efficiency of Use**: Keyboard shortcuts, templates, drag-and-drop
8. **Aesthetic and Minimalist Design**: Clean UI, progressive disclosure
9. **Help Users Recognize, Diagnose, and Recover from Errors**: Clear error messages, recovery options
10. **Help and Documentation**: Onboarding tour, keyboard shortcuts panel

## Accessibility Features

- Skip-to-main-content link
- ARIA labels and roles on all interactive elements
- Keyboard navigable interface
- Focus-visible indicators (WCAG 2.1 AA compliant)
- `prefers-reduced-motion` support
- `forced-colors` (high contrast) media query support
- Semantic HTML structure
- Screen reader compatible

## Author

**Senesh Fitzroy**  
- GitHub: [@SeneshFitzroy](https://github.com/SeneshFitzroy)  
- Repository: [testing1](https://github.com/SeneshFitzroy/testing1)  
- Email: 10952757@students.plymouth.ac.uk  

## Author

**SeneshFitzroy**  
- GitHub: [SeneshFitzroy](https://github.com/SeneshFitzroy)  
- Repo: [testing1](https://github.com/SeneshFitzroy/testing1)  
- Email: 10952757@students.plymouth.ac.uk  
- University of Plymouth — PUSL3122 HCI Coursework

## Credits

- **Unsplash** — Product and interior photography
- **Lucide** — Icon set (MIT License)
- **Three.js** — 3D rendering engine (MIT License)
- **Firebase** — Authentication and database services
- **Framer Motion** — Animation library (MIT License)
- **Tailwind CSS** — Utility-first CSS framework (MIT License)
- **Konva** — 2D canvas library (MIT License)

## License

This project was developed as coursework for PUSL3122 at the University of Plymouth.

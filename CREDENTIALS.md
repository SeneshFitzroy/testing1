# Lee Roo Wood Designs – Demo Credentials

## Admin Access

**Admin Email:** `admin@leeroo.com`  
**Admin Password:** Set via `.env.local` → `VITE_DEMO_ADMIN_PASSWORD`

To use demo accounts:

1. Copy `.env.example` to `.env.local`
2. Set:
   ```
   VITE_DEMO_PROVISION=1
   VITE_DEMO_ADMIN_EMAIL=admin@leeroo.com
   VITE_DEMO_ADMIN_PASSWORD=YourSecurePassword123
   ```
3. Restart the dev server – accounts are created on first load
4. All three demo accounts (admin, designer, user) share the same password by default unless you set `VITE_DEMO_DESIGNER_PASSWORD` and `VITE_DEMO_USER_PASSWORD` separately

## Default Demo Accounts (after provisioning)

| Role     | Email              | Password                    |
|----------|--------------------|-----------------------------|
| Admin    | admin@leeroo.com   | Your `VITE_DEMO_ADMIN_PASSWORD` |
| Designer | designer@leeroo.com| Same as admin (or custom)   |
| User     | user@leeroo.com    | Same as admin (or custom)   |

## Admin Features

- **Products:** Add, edit, delete products – synced with Firestore and the Shop
- **Orders:** View orders at `/admin/orders`
- **Add Designer:** At `/admin/team` – create new designer accounts (requires your admin password to restore session)

## Data Sync

- Admin product changes → Firestore `products` collection → Shop
- Cart/Wishlist → Firestore `carts/{uid}` for logged-in users
- Designs → Firestore `designs` collection
- All data is real and connected – no fake/mock data in production flow

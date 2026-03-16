# Product Images Guide - Lee Roo Shop

Where and how to add real furniture images for the shop.

## Quick Reference: Where to Put Images

### Option 1: Local files (recommended for your own photos)

1. Create folder: `public/images/products/`
2. Add images named by product ID, e.g.:
   - `sp-1.jpg` – Velvet Tufted Sofa
   - `sp-2.jpg` – Windsor Dining Chair Set
   - `sp-3.jpg` – Oval Coffee Table
   - etc.

3. Update `src/lib/constants.js` – set the `image` and `images` for each product:

```js
{
  id: 'sp-1',
  name: 'Velvet Tufted Sofa',
  image: '/images/products/sp-1.jpg',
  images: [
    '/images/products/sp-1.jpg',
    '/images/products/sp-1-2.jpg',
    '/images/products/sp-1-3.jpg',
  ],
  // ... rest of product
}
```

### Option 2: External URLs (current setup)

Products use Unsplash URLs. To replace with your own:

- Edit `image` and `images` in `src/lib/constants.js`
- Use direct image URLs (e.g. from your CDN or hosting)

## Product ID → File Mapping

| Product ID | Product Name            | Suggested filename   |
|------------|-------------------------|----------------------|
| sp-1      | Velvet Tufted Sofa      | sp-1.jpg             |
| sp-2      | Windsor Dining Chair Set| sp-2.jpg             |
| sp-3      | Oval Coffee Table       | sp-3.jpg             |
| sp-4      | Upholstered Platform Bed| sp-4.jpg             |
| sp-5      | Industrial Bookshelf    | sp-5.jpg             |
| sp-7      | Mango Wood TV Console   | sp-7.jpg             |
| sp-8      | Accent Wingback Chair   | sp-8.jpg             |
| sp-9      | Farmhouse Dining Table  | sp-9.jpg             |
| sp-10     | Scandi Nightstand       | sp-10.jpg            |
| sp-11     | Globe Pendant Light     | sp-11.jpg            |
| sp-12     | Leather Chesterfield Sofa| sp-12.jpg          |
| sp-13     | Round Wall Mirror       | sp-13.jpg            |
| sp-14     | Shaker Wardrobe         | sp-14.jpg            |
| sp-15     | Ergonomic Office Chair  | sp-15.jpg            |
| sp-16     | Live-Edge Console Table | sp-16.jpg            |
| sp-17     | Linen Sectional Sofa    | sp-17.jpg            |
| sp-18     | Rattan Lounge Chair     | sp-18.jpg            |

## File Location Summary

```
HCI/
├── public/
│   └── images/
│       └── products/      ← Put your furniture images here
│           ├── sp-1.jpg
│           ├── sp-2.jpg
│           └── ...
└── src/
    └── lib/
        └── constants.js   ← Edit SHOP_PRODUCTS array to reference images
```

## Image Naming: 1, 2, or 3 Images Per Product

| # of images | Primary (main) | 2nd image | 3rd image |
|-------------|----------------|-----------|-----------|
| **1 image** | `sp-X.jpg` | — | — |
| **2 images** | `sp-X.jpg` | `sp-X-2.jpg` | — |
| **3 images** | `sp-X.jpg` | `sp-X-2.jpg` | `sp-X-3.jpg` |

**Examples:**
- **1 image:** `sp-1.jpg` → use as both `image` and `images: ['/images/products/sp-1.jpg']`
- **2 images:** `sp-1.jpg`, `sp-1-2.jpg` → `image: '/images/products/sp-1.jpg'`, `images: ['/images/products/sp-1.jpg','/images/products/sp-1-2.jpg']`
- **3 images:** `sp-1.jpg`, `sp-1-2.jpg`, `sp-1-3.jpg` → `image: '/images/products/sp-1.jpg'`, `images: ['/images/products/sp-1.jpg','/images/products/sp-1-2.jpg','/images/products/sp-1-3.jpg']`

**To remove extra images:** In `constants.js`, set `images` to only the files you have. If you have 1 image, use `images: ['/images/products/sp-X.jpg']`.

## Updating Products in Code

1. Open `src/lib/constants.js`
2. Find the product (e.g. `id: 'sp-1'`)
3. Update `image` and `images`:

```js
// 1 image
image: '/images/products/sp-1.jpg',
images: ['/images/products/sp-1.jpg'],

// 2 images
image: '/images/products/sp-1.jpg',
images: ['/images/products/sp-1.jpg', '/images/products/sp-1-2.jpg'],

// 3 images
image: '/images/products/sp-1.jpg',
images: ['/images/products/sp-1.jpg', '/images/products/sp-1-2.jpg', '/images/products/sp-1-3.jpg'],
```

Use high-quality product shots; minimum ~800×800 px recommended.

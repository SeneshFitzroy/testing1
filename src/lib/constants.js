// Room templates for quick setup
export const ROOM_TEMPLATES = [
  { id: 'small-bedroom', name: 'Small Bedroom', width: 3, depth: 3, height: 2.8, shape: 'rectangular', wallColor: '#F4EFEA', floorColor: '#D9C7B8' },
  { id: 'medium-living', name: 'Medium Living Room', width: 5, depth: 4, height: 3, shape: 'rectangular', wallColor: '#FFFFFF', floorColor: '#C4A88E' },
  { id: 'large-living', name: 'Large Living Room', width: 7, depth: 5, height: 3, shape: 'rectangular', wallColor: '#F4EFEA', floorColor: '#8B6F47' },
  { id: 'dining-room', name: 'Dining Room', width: 4, depth: 5, height: 3, shape: 'rectangular', wallColor: '#E8DFD5', floorColor: '#4A2F21' },
  { id: 'studio', name: 'Studio Apartment', width: 6, depth: 4, height: 2.8, shape: 'rectangular', wallColor: '#FFFFFF', floorColor: '#D9C7B8' },
  { id: 'office', name: 'Office Room', width: 4, depth: 3, height: 2.8, shape: 'rectangular', wallColor: '#F0F0F0', floorColor: '#B0B0B0' },
  { id: 'l-shaped', name: 'L-Shaped Room', width: 6, depth: 5, height: 3, shape: 'l-shaped', wallColor: '#F4EFEA', floorColor: '#C4A88E' },
]

// Furniture catalog items
export const FURNITURE_ITEMS = [
  { id: 'sofa-1', name: 'Modern Sofa', category: 'seating', width: 2.0, depth: 0.9, height: 0.85, color: '#8B6F47', price: 899, icon: 'Sofa', description: 'A comfortable modern 3-seater sofa with clean lines.' },
  { id: 'chair-1', name: 'Dining Chair', category: 'seating', width: 0.5, depth: 0.5, height: 0.9, color: '#4A2F21', price: 149, icon: 'Armchair', description: 'Elegant wooden dining chair with cushioned seat.' },
  { id: 'armchair-1', name: 'Armchair', category: 'seating', width: 0.85, depth: 0.85, height: 0.95, color: '#3F5E45', price: 549, icon: 'Armchair', description: 'Plush armchair perfect for reading corners.' },
  { id: 'table-dining', name: 'Dining Table', category: 'tables', width: 1.8, depth: 0.9, height: 0.75, color: '#5C3A2A', price: 699, icon: 'Table', description: 'Solid wood dining table for 6 persons.' },
  { id: 'table-coffee', name: 'Coffee Table', category: 'tables', width: 1.2, depth: 0.6, height: 0.45, color: '#8B6F47', price: 299, icon: 'Coffee', description: 'Oval coffee table with storage shelf.' },
  { id: 'table-side', name: 'Side Table', category: 'tables', width: 0.5, depth: 0.5, height: 0.55, color: '#D9C7B8', price: 129, icon: 'Square', description: 'Minimalist side table with brass legs.' },
  { id: 'bed-1', name: 'King Bed', category: 'bedroom', width: 2.0, depth: 2.1, height: 0.5, color: '#E8DFD5', price: 1299, icon: 'Bed', description: 'Upholstered king-size platform bed.' },
  { id: 'cabinet-1', name: 'Storage Cabinet', category: 'storage', width: 1.0, depth: 0.4, height: 1.8, color: '#4A2F21', price: 449, icon: 'Archive', description: 'Tall storage cabinet with adjustable shelves.' },
  { id: 'bookshelf-1', name: 'Bookshelf', category: 'storage', width: 0.8, depth: 0.35, height: 1.9, color: '#5C3A2A', price: 349, icon: 'BookOpen', description: 'Open bookshelf with 5 tiers.' },
  { id: 'tvstand-1', name: 'TV Stand', category: 'entertainment', width: 1.5, depth: 0.4, height: 0.5, color: '#2E1C12', price: 399, icon: 'Monitor', description: 'Media console with cable management.' },
  { id: 'lamp-floor', name: 'Floor Lamp', category: 'lighting', width: 0.3, depth: 0.3, height: 1.6, color: '#B66E41', price: 179, icon: 'Lightbulb', description: 'Arc floor lamp with linen shade.' },
  { id: 'desk-1', name: 'Office Desk', category: 'tables', width: 1.4, depth: 0.7, height: 0.75, color: '#8B6F47', price: 499, icon: 'MonitorSmartphone', description: 'Spacious office desk with drawer unit.' },
]

// Furniture categories for filtering (matches e-commerce + editor)
export const FURNITURE_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'Home' },
  { id: 'Living Room', name: 'Living Room', icon: 'Sofa' },
  { id: 'Dining Room', name: 'Dining Room', icon: 'UtensilsCrossed' },
  { id: 'Bedroom', name: 'Bedroom', icon: 'Bed' },
  { id: 'Storage', name: 'Storage', icon: 'Archive' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'Monitor' },
  { id: 'Lighting', name: 'Lighting', icon: 'Lightbulb' },
  { id: 'Office', name: 'Office', icon: 'Briefcase' },
  { id: 'Decor', name: 'Decor', icon: 'Image' },
]

// Parse dimensions "220 x 95 x 82 cm" -> { width: 2.2, depth: 0.95, height: 0.82 }
function parseDimensions(str) {
  if (!str || typeof str !== 'string') return { width: 1, depth: 0.8, height: 0.8 }
  const nums = str.match(/\d+(?:\.\d+)?/g)
  if (!nums || nums.length < 3) return { width: 1, depth: 0.8, height: 0.8 }
  const w = Math.min(8, Math.max(0.3, parseFloat(nums[0]) / 100))
  const d = Math.min(8, Math.max(0.2, parseFloat(nums[1]) / 100))
  const h = Math.min(3, Math.max(0.2, parseFloat(nums[2]) / 100))
  return { width: w, depth: d, height: h }
}

// Map shop category to editor category for 3D geometry
function shopCategoryToEditor(shopCat) {
  const map = { 'Living Room': 'seating', 'Dining Room': 'seating', 'Bedroom': 'beds', 'Storage': 'storage', 'Entertainment': 'tables', 'Lighting': 'lighting', 'Office': 'tables', 'Decor': 'decor' }
  return map[shopCat] || 'tables'
}

// Default wall color presets
export const WALL_COLOR_PRESETS = [
  '#FFFFFF', '#F4EFEA', '#E8DFD5', '#D9C7B8', '#F0E6D3',
  '#E0D5C5', '#C4B5A0', '#A39281', '#87CEEB', '#B8D4E3',
  '#D4E6D4', '#F5E6CC', '#FFE4E1', '#E6E6FA', '#F0F0F0',
]

// Site-wide policy constants (USD base — formatPrice converts to selected currency)
export const FREE_SHIPPING_THRESHOLD = 46
export const STANDARD_SHIPPING_COST = 9.99
export const WARRANTY_YEARS = 2
export const RETURNS_DAYS = 30

export const FLOOR_COLOR_PRESETS = [
  '#D9C7B8', '#C4A88E', '#8B6F47', '#5C3A2A', '#4A2F21',
  '#2E1C12', '#B0B0B0', '#808080', '#D4B896', '#A0826D',
  '#E8DFD5', '#F4EFEA', '#CDAA7D', '#8B7355', '#654321',
]

// Shop products with extended info
// Each product has a UNIQUE primary image. Gallery images are different crops/views of the SAME piece.
// Zero image duplication across products. All images are high-quality studio product photography.
// Each product has a UNIQUE discount percentage (15–31%). Synced across Shop, ProductDetail, Real3DViewer, Product3DViewer.
export const SHOP_PRODUCTS = [
  {
    id: 'sp-1', name: 'Velvet Tufted Sofa', category: 'Living Room', discountPercent: 15, price: 1019, originalPrice: 1199, rating: 4.8, reviews: 124, inStock: true, featured: true, onSale: true,
    colors: ['#2F5233', '#4A2F21', '#D9C7B8', '#1B3A4B'], colorNames: ['Emerald', 'Walnut', 'Sand', 'Navy'], material: 'Premium Velvet', dimensions: '220 x 95 x 82 cm', weight: '52 kg',
    woodType: { name: 'Mahogany', slug: 'mahogany' },
    specs: { dimensionsFull: 'W86" x D37" x H32"', seatableWidth: '86"', seatingDepth: '39"', seatingHeight: '19"', backrestHeight: '12"', productWeight: '115 lbs', packagingDimensions: '2 boxes', maxBearingSupport: '3 x 330 lbs' },
    description: 'Hand-tufted emerald velvet sofa with solid brass legs and kiln-dried hardwood frame. Deep button tufting and high-density foam cushions deliver exceptional comfort and timeless style.',
    features: ['Hand-tufted button detailing', 'Solid brass tapered legs', 'Kiln-dried hardwood frame', 'Stain-resistant velvet'],
    sku: 'SP-1',
    image: '/images/products/sp-1.jpg',
    images: ['/images/products/sp-1.jpg'],
    reviewsList: [
      { name: 'Sarah Mitchell', rating: 5, text: 'Absolutely stunning. The velvet is luxurious and the build quality is exceptional.' },
      { name: 'James Chen', rating: 5, text: 'Best sofa we have ever owned. Perfect for our living room.' },
      { name: 'Emily Rodriguez', rating: 4, text: 'Beautiful design. Delivery was smooth. One cushion had a slight wrinkle but settled after a week.' },
    ],
  },
  {
    id: 'sp-2', name: 'Windsor Dining Chair Set', category: 'Dining Room', discountPercent: 16, price: 669, originalPrice: 796, rating: 4.6, reviews: 89, inStock: true, featured: true, onSale: true,
    colors: ['#4A2F21', '#8B6F47', '#FFFFFF'], colorNames: ['Dark Walnut', 'Honey Oak', 'White'], material: 'Solid Oak', dimensions: '50 x 54 x 92 cm each', weight: '6 kg each',
    woodType: { name: 'Oak', slug: 'oak' },
    specs: { dimensionsFull: 'W20" x D21" x H36"', seatableWidth: '18"', seatingDepth: '17"', seatingHeight: '18"', backrestHeight: '22"', productWeight: '13 lbs each', packagingDimensions: '4 boxes', maxBearingSupport: '1 x 300 lbs' },
    description: 'Set of 4 Windsor-style dining chairs in solid white oak with contoured spindle backs. Hand-sanded to a satin finish with cushioned drop-in seats.',
    features: ['Solid oak construction', 'Contoured spindle back', 'Cushioned drop-in seat', 'Mortise-and-tenon joints'],
    sku: 'SP-2',
    image: '/images/products/sp-2.jpg',
    images: ['/images/products/sp-2.jpg'],
    reviewsList: [
      { name: 'Sarah Chen', rating: 5, text: 'Beautiful craftsmanship. The oak has a lovely grain and the chairs feel incredibly solid.' },
      { name: 'Michael O\'Brien', rating: 5, text: 'Exactly what we wanted for our dining room. Assembly was straightforward.' },
      { name: 'Priya Sharma', rating: 4, text: 'Stylish and comfortable. Wish they came in a set of 6 for larger tables.' },
    ],
  },
  {
    id: 'sp-3', name: 'Oval Coffee Table', category: 'Living Room', discountPercent: 17, price: 331, originalPrice: 399, rating: 4.9, reviews: 201, inStock: true, featured: true, onSale: true,
    colors: ['#8B6F47', '#4A2F21', '#FFFFFF'], colorNames: ['Natural Walnut', 'Espresso', 'White Oak'], material: 'Walnut Veneer & Steel', dimensions: '120 x 60 x 45 cm', weight: '18 kg',
    woodType: { name: 'Walnut', slug: 'walnut' },
    specs: { dimensionsFull: 'W47" x D24" x H18"', productWeight: '40 lbs', packagingDimensions: '1 box' },
    description: 'Mid-century oval coffee table with walnut veneer top and powder-coated hairpin steel legs. Integrated lower shelf for magazines and remotes.',
    features: ['Lower storage shelf', 'Scratch-resistant veneer', 'Hairpin steel legs', 'Anti-scratch floor pads'],
    sku: 'SP-3',
    image: '/images/products/sp-3.jpg',
    images: ['/images/products/sp-3.jpg'],
    reviewsList: [
      { name: 'Emma Wilson', rating: 5, text: 'Perfect mid-century vibe. The walnut top is gorgeous and the shelf is so handy.' },
      { name: 'David Kim', rating: 5, text: 'Great value for the quality. Sturdy and looks more expensive than it is.' },
      { name: 'Rachel Foster', rating: 4, text: 'Love the hairpin legs. Table arrived well packaged with no damage.' },
    ],
  },
  {
    id: 'sp-4', name: 'Upholstered Platform Bed', category: 'Bedroom', discountPercent: 18, price: 1311, originalPrice: 1599, rating: 4.7, reviews: 156, inStock: true, onSale: true,
    colors: ['#E8DFD5', '#D9C7B8', '#4A2F21'], colorNames: ['Ivory', 'Latte', 'Cocoa'], material: 'Belgian Linen', dimensions: '200 x 210 x 120 cm', weight: '68 kg',
    woodType: { name: 'Birch', slug: 'birch' },
    specs: { dimensionsFull: 'W79" x D83" x H47"', productWeight: '150 lbs', packagingDimensions: '3 boxes', headboardHeight: '47"' },
    description: 'King-size platform bed with channel-tufted headboard in Belgian linen. Engineered slat system eliminates the need for a box spring.',
    features: ['Channel-tufted headboard', 'Engineered slat base', 'No box spring needed', 'Under-bed clearance 15 cm'],
    sku: 'SP-4',
    image: '/images/products/sp-4.jpg',
    images: ['/images/products/sp-4.jpg'],
    reviewsList: [
      { name: 'Jennifer Martinez', rating: 5, text: 'Our bedroom feels like a hotel now. The headboard is stunning and the bed is rock solid.' },
      { name: 'Thomas Nguyen', rating: 5, text: 'No box spring needed—saved us money and hassle. Assembly took about 2 hours.' },
      { name: 'Lisa Anderson', rating: 4, text: 'Beautiful bed. The linen fabric is soft but I wish it came in more colours.' },
    ],
  },
  {
    id: 'sp-5', name: 'Industrial Bookshelf', category: 'Storage', discountPercent: 19, price: 364, originalPrice: 449, rating: 4.5, reviews: 73, inStock: true, onSale: true,
    colors: ['#5C3A2A', '#4A2F21', '#FFFFFF'], colorNames: ['Rustic Brown', 'Dark Walnut', 'White Wash'], material: 'Reclaimed Pine & Iron', dimensions: '80 x 35 x 190 cm', weight: '32 kg',
    woodType: { name: 'Pine', slug: 'pine' },
    specs: { dimensionsFull: 'W31" x D14" x H75"', productWeight: '70 lbs', packagingDimensions: '1 box', shelfCount: 5 },
    description: 'Open 5-tier industrial bookshelf combining reclaimed pine shelves and a matte black iron frame. Each wood plank has unique grain character.',
    features: ['5 adjustable shelves', 'Anti-tip wall anchor', 'Matte black iron frame', 'Reclaimed pine planks'],
    sku: 'SP-5',
    image: '/images/products/sp-5.jpg',
    images: ['/images/products/sp-5.jpg'],
    reviewsList: [
      { name: 'Alex Thompson', rating: 5, text: 'Love the industrial look. Each shelf has unique character. Held my books and decor perfectly.' },
      { name: 'Maria Santos', rating: 4, text: 'Solid construction. Took a while to assemble but worth it. Very sturdy.' },
      { name: 'James O\'Connor', rating: 5, text: 'Perfect for my home office. The reclaimed wood has such nice grain variation.' },
    ],
  },
  {
    id: 'sp-7', name: 'Mango Wood TV Console', category: 'Entertainment', discountPercent: 20, price: 399, originalPrice: 499, rating: 4.6, reviews: 112, inStock: true, onSale: true,
    colors: ['#2E1C12', '#4A2F21', '#8B6F47'], colorNames: ['Ebony', 'Dark Walnut', 'Honey'], material: 'Solid Mango Wood', dimensions: '150 x 40 x 50 cm', weight: '28 kg',
    woodType: { name: 'Mango', slug: 'mango' },
    specs: { dimensionsFull: 'W59" x D16" x H20"', productWeight: '62 lbs', packagingDimensions: '2 boxes', tvSize: 'Up to 65"' },
    description: 'Low-profile TV console in solid mango wood with integrated cable management and soft-close cabinets. Fits TVs up to 65 inches.',
    features: ['Cable management cutouts', '2 soft-close cabinets', 'Open center shelf', 'Fits up to 65″ TV'],
    sku: 'SP-7',
    image: '/images/products/sp-7.jpg',
    images: ['/images/products/sp-7.jpg'],
    reviewsList: [
      { name: 'Robert Hayes', rating: 5, text: 'Cable management is a game-changer. No more tangled wires. Beautiful mango wood grain.' },
      { name: 'Amanda Wright', rating: 4, text: 'Soft-close cabinets work perfectly. Our 55" TV fits with room to spare. Very happy.' },
      { name: 'Kevin Park', rating: 5, text: 'Exactly what we needed. Sturdy, stylish, and the storage is fantastic.' },
    ],
  },
  {
    id: 'sp-8', name: 'Accent Wingback Chair', category: 'Living Room', discountPercent: 21, price: 552, originalPrice: 699, rating: 4.8, reviews: 87, inStock: true, onSale: true,
    colors: ['#C59539', '#3F5E45', '#D9C7B8'], colorNames: ['Mustard', 'Forest Green', 'Cream'], material: 'Velvet & Walnut', dimensions: '78 x 82 x 98 cm', weight: '22 kg',
    woodType: { name: 'Walnut', slug: 'walnut' },
    specs: { dimensionsFull: 'W31" x D32" x H39"', seatableWidth: '22"', seatingDepth: '20"', seatingHeight: '19"', backrestHeight: '24"', productWeight: '48 lbs', packagingDimensions: '1 box', maxBearingSupport: '1 x 300 lbs' },
    description: 'Sculptural wingback accent chair in mustard velvet with solid walnut dowel legs. Generous seat depth and curved wings provide enveloping comfort.',
    features: ['Wingback silhouette', 'Solid walnut legs', 'High-resilience foam', 'Removable seat cushion'],
    sku: 'SP-8',
    image: '/images/products/sp-8.jpg',
    images: ['/images/products/sp-8.jpg'],
    reviewsList: [
      { name: 'Nicole Bennett', rating: 5, text: 'Gorgeous statement piece. The mustard velvet pops beautifully against our grey walls.' },
      { name: 'Daniel Lee', rating: 5, text: 'Super comfortable for reading. The wings give great support. Walnut legs are elegant.' },
      { name: 'Sofia Garcia', rating: 4, text: 'Love it! Wish they sold a matching ottoman. Quality is excellent.' },
    ],
  },
  {
    id: 'sp-9', name: 'Farmhouse Dining Table', category: 'Dining Room', discountPercent: 22, price: 780, originalPrice: 999, rating: 4.7, reviews: 143, inStock: true, featured: true, onSale: true,
    colors: ['#5C3A2A', '#8B6F47', '#2E1C12'], colorNames: ['Classic Walnut', 'Honey', 'Ebony'], material: 'Solid Walnut', dimensions: '180 x 90 x 76 cm', weight: '42 kg',
    woodType: { name: 'Walnut', slug: 'walnut' },
    specs: { dimensionsFull: 'W71" x D35" x H30"', productWeight: '92 lbs', packagingDimensions: '1 box', seats: '6-8' },
    description: 'Handcrafted solid walnut farmhouse table with breadboard ends and turned legs. Each table displays unique grain patterns sealed under a matte polyurethane finish.',
    features: ['Seats 6-8 people', 'Breadboard end construction', 'Turned legs', 'Natural grain satin finish'],
    sku: 'SP-9',
    image: '/images/products/sp-9.jpg',
    images: ['/images/products/sp-9.jpg'],
    reviewsList: [
      { name: 'Catherine Moore', rating: 5, text: 'Stunning table. The walnut grain is unique and beautiful. Seats our family of eight comfortably.' },
      { name: 'Patrick Sullivan', rating: 5, text: 'Heirloom quality. Heavy, solid, exactly as described. Worth every penny.' },
      { name: 'Laura Evans', rating: 4, text: 'Beautiful craftsmanship. Delivery crew was careful. Minor finish touch-up needed on one leg.' },
    ],
  },
  {
    id: 'sp-10', name: 'Scandi Nightstand', category: 'Bedroom', discountPercent: 23, price: 199, originalPrice: 259, rating: 4.6, reviews: 98, inStock: true, featured: true, onSale: true,
    colors: ['#D9C7B8', '#4A2F21', '#FFFFFF'], colorNames: ['Bleached Birch', 'Walnut', 'Glacier White'], material: 'Solid Birch', dimensions: '45 x 40 x 55 cm', weight: '8 kg',
    woodType: { name: 'Birch', slug: 'birch' },
    specs: { dimensionsFull: 'W18" x D16" x H22"', productWeight: '18 lbs', packagingDimensions: '1 box' },
    description: 'Scandinavian-inspired nightstand in bleached birch with single soft-close drawer and open cubby. Tapered splayed legs give a light, airy profile.',
    features: ['Soft-close drawer', 'Open cubby shelf', 'Splayed tapered legs', 'Pre-assembled'],
    sku: 'SP-10',
    image: '/images/products/sp-10.jpg',
    images: ['/images/products/sp-10.jpg'],
    reviewsList: [
      { name: 'Helen Brooks', rating: 5, text: 'Perfect size for our bedroom. The drawer glides smoothly and the birch finish is lovely.' },
      { name: 'Mark Taylor', rating: 5, text: 'Clean Scandinavian design. Arrived pre-assembled as stated. Very happy with the purchase.' },
      { name: 'Anna Kowalski', rating: 4, text: 'Light and airy. Matches our bedroom decor perfectly. Minor scuff on delivery but barely noticeable.' },
    ],
  },
  {
    id: 'sp-11', name: 'Globe Pendant Light', category: 'Lighting', discountPercent: 24, price: 151, originalPrice: 199, rating: 4.5, reviews: 67, inStock: true, featured: true, onSale: true,
    colors: ['#B66E41', '#2E1C12', '#FFFFFF'], colorNames: ['Antique Brass', 'Matte Black', 'Chrome'], material: 'Mouth-Blown Glass & Brass', dimensions: 'Ø 35 x H 40 cm', weight: '2.5 kg',
    woodType: null,
    specs: { dimensionsFull: 'Ø14" x H16"', productWeight: '5.5 lbs', packagingDimensions: '1 box' },
    description: 'Artisan globe pendant in mouth-blown smoke glass with an antique brass canopy and woven cord. Creates warm ambient light through its translucent shade.',
    features: ['Mouth-blown glass globe', 'Adjustable drop length', 'Dimmable compatible', 'LED bulb included'],
    sku: 'SP-11',
    image: '/images/products/sp-11.jpg',
    images: ['/images/products/sp-11.jpg'],
    reviewsList: [
      { name: 'Chris Anderson', rating: 5, text: 'Stunning pendant. The glass catches light beautifully. Easy to install and dimmable.' },
      { name: 'Michelle Torres', rating: 4, text: 'Love the antique brass finish. Creates such warm ambient lighting in our dining room.' },
      { name: 'Ryan Mitchell', rating: 5, text: 'Quality is obvious. The mouth-blown glass has subtle variations that make it feel handcrafted.' },
    ],
  },
  {
    id: 'sp-12', name: 'Leather Chesterfield Sofa', category: 'Living Room', discountPercent: 25, price: 1424, originalPrice: 1899, rating: 4.9, reviews: 105, inStock: true, onSale: true,
    colors: ['#6B3A2A', '#2E1C12', '#D9C7B8'], colorNames: ['Cognac', 'Espresso', 'Parchment'], material: 'Full-Grain Leather', dimensions: '230 x 98 x 78 cm', weight: '58 kg',
    woodType: { name: 'Oak', slug: 'oak' },
    specs: { dimensionsFull: 'W91" x D39" x H31"', seatableWidth: '82"', seatingDepth: '22"', seatingHeight: '18"', backrestHeight: '28"', productWeight: '128 lbs', packagingDimensions: '2 boxes', maxBearingSupport: '3 x 350 lbs' },
    description: 'Classic Chesterfield silhouette in distressed full-grain leather with deep diamond tufting, rolled arms, and turned bun feet. Ages beautifully with a rich patina.',
    features: ['Full-grain leather', 'Diamond button tufting', 'Turned bun feet', 'Eight-way hand-tied springs'],
    sku: 'SP-12',
    image: '/images/products/sp-12.jpg',
    images: ['/images/products/sp-12.jpg'],
    reviewsList: [
      { name: 'George Harrison', rating: 5, text: 'A true Chesterfield. The leather is thick and will age beautifully. Worth every cent.' },
      { name: 'Olivia Clarke', rating: 5, text: 'Stunning piece. The diamond tufting is immaculate. Our living room centrepiece.' },
      { name: 'Nathan Bell', rating: 4, text: 'Incredible build quality. Heavy and substantial. Delivery took 3 weeks but worth the wait.' },
    ],
  },
  {
    id: 'sp-13', name: 'Round Wall Mirror', category: 'Decor', discountPercent: 26, price: 184, originalPrice: 249, rating: 4.8, reviews: 76, inStock: true, onSale: true,
    colors: ['#B66E41', '#2E1C12', '#D9C7B8'], colorNames: ['Brass', 'Iron Black', 'Champagne Gold'], material: 'Solid Brass Frame', dimensions: 'Ø 80 x D 3 cm', weight: '4 kg',
    woodType: null,
    specs: { dimensionsFull: 'Ø31" x D1"', productWeight: '9 lbs', packagingDimensions: '1 box' },
    description: 'Over-sized round mirror with a forged solid brass frame and bevelled edge. Wall-mount hardware included for a flush, floating appearance.',
    features: ['Bevelled mirror edge', 'Flush wall mount', 'Solid brass frame', 'Shatter-resistant backing'],
    sku: 'SP-13',
    image: '/images/products/sp-13.jpg',
    images: ['/images/products/sp-13.jpg'],
    reviewsList: [
      { name: 'Emma Foster', rating: 5, text: 'Beautiful mirror. The brass frame adds such elegance. Perfect above our console.' },
      { name: 'Jake Morrison', rating: 5, text: 'Large and impactful. The bevelled edge catches light beautifully. Easy to mount.' },
      { name: 'Rebecca Chen', rating: 4, text: 'Stunning quality. Makes our entryway feel much larger. Brass is substantial, not flimsy.' },
    ],
  },
  {
    id: 'sp-14', name: 'Shaker Wardrobe', category: 'Storage', discountPercent: 27, price: 948, originalPrice: 1299, rating: 4.6, reviews: 58, inStock: true, onSale: true,
    colors: ['#4A2F21', '#FFFFFF', '#2E1C12'], colorNames: ['Dark Oak', 'Pure White', 'Charcoal'], material: 'Solid Oak & MDF', dimensions: '120 x 60 x 200 cm', weight: '75 kg',
    woodType: { name: 'Oak', slug: 'oak' },
    specs: { dimensionsFull: 'W47" x D24" x H79"', productWeight: '165 lbs', packagingDimensions: '2 boxes', hangingRail: 'Full-width' },
    description: 'Full-height Shaker-style wardrobe with two panelled doors, internal adjustable shelves, and a full-width hanging rail. Soft-close hinges for quiet operation.',
    features: ['Soft-close hinges', 'Adjustable shelves', 'Full-width hanging rail', 'Anti-tip wall bracket'],
    sku: 'SP-14',
    image: '/images/products/sp-14.jpg',
    images: ['/images/products/sp-14.jpg'],
    reviewsList: [
      { name: 'Diana Roberts', rating: 5, text: 'Holds all our clothes with room to spare. Soft-close doors are a nice touch. Solid construction.' },
      { name: 'Brian Cooper', rating: 4, text: 'Classic Shaker design. Assembly took a few hours but straightforward. Shelves are very adjustable.' },
      { name: 'Julia Adams', rating: 5, text: 'Transformed our bedroom storage. The oak finish is rich and consistent. Highly recommend.' },
    ],
  },
  {
    id: 'sp-15', name: 'Ergonomic Office Chair', category: 'Office', discountPercent: 28, price: 417, originalPrice: 579, rating: 4.7, reviews: 134, inStock: true, onSale: true,
    colors: ['#2E1C12', '#8B6F47', '#3F5E45'], colorNames: ['Midnight Black', 'Tan', 'Olive'], material: 'Top-Grain Leather & Chrome', dimensions: '65 x 65 x 115 cm', weight: '15 kg',
    woodType: null,
    specs: { dimensionsFull: 'W26" x D26" x H45"', seatableWidth: '20"', seatingDepth: '19"', seatingHeight: '19"', backrestHeight: '22"', productWeight: '33 lbs', packagingDimensions: '1 box', maxBearingSupport: '1 x 250 lbs' },
    description: 'High-back ergonomic chair with top-grain leather, synchro-tilt mechanism, adjustable lumbar support, and polished chrome five-star base.',
    features: ['Adjustable lumbar support', 'Synchro-tilt mechanism', '360° swivel', 'Polished chrome base'],
    sku: 'SP-15',
    image: '/images/products/sp-15.jpg',
    images: ['/images/products/sp-15.jpg'],
    reviewsList: [
      { name: 'Steven Phillips', rating: 5, text: 'Best home office chair I have owned. Lumbar support is adjustable and makes long days comfortable.' },
      { name: 'Carolyn White', rating: 5, text: 'Synchro-tilt works smoothly. Leather is soft and durable. Chrome base looks professional.' },
      { name: 'Peter Jenkins', rating: 4, text: 'Comfortable for 8-hour days. Assembly was a bit fiddly but doable. Great value.' },
    ],
  },
  {
    id: 'sp-16', name: 'Live-Edge Console Table', category: 'Living Room', discountPercent: 29, price: 305, originalPrice: 429, rating: 4.5, reviews: 91, inStock: true, onSale: true,
    colors: ['#8B6F47', '#2E1C12', '#D9C7B8'], colorNames: ['Natural Acacia', 'Ebony', 'Driftwood'], material: 'Live-Edge Acacia & Iron', dimensions: '120 x 35 x 80 cm', weight: '18 kg',
    woodType: { name: 'Acacia', slug: 'acacia' },
    specs: { dimensionsFull: 'W47" x D14" x H31"', productWeight: '40 lbs', packagingDimensions: '1 box' },
    description: 'Showpiece console table featuring a live-edge acacia wood slab on a geometric matte iron base. Every slab is one-of-a-kind with natural edge and grain.',
    features: ['Live-edge acacia slab', 'Geometric iron base', 'Clear lacquer seal', 'Every piece unique'],
    sku: 'SP-16',
    image: '/images/products/sp-16.jpg',
    images: ['/images/products/sp-16.jpg'],
    reviewsList: [
      { name: 'Victoria Lane', rating: 5, text: 'Stunning piece. The live edge has so much character. Every slab truly is unique.' },
      { name: 'Andrew Scott', rating: 4, text: 'Love the organic shape. Iron base is sturdy. Perfect behind our sofa.' },
      { name: 'Grace Murphy', rating: 5, text: 'Showstopper in our entryway. The acacia grain is breathtaking. Well finished.' },
    ],
  },
  {
    id: 'sp-17', name: 'Linen Sectional Sofa', category: 'Living Room', discountPercent: 30, price: 1469, originalPrice: 2099, rating: 4.9, reviews: 215, inStock: true, onSale: true,
    colors: ['#E8DFD5', '#D9C7B8', '#B0B0B0'], colorNames: ['Ivory Linen', 'Oat', 'Slate Grey'], material: 'Stonewashed Linen', dimensions: '290 x 180 x 82 cm', weight: '72 kg',
    woodType: { name: 'Maple', slug: 'maple' },
    specs: { dimensionsFull: 'W114" x D71" x H32"', seatableWidth: '98"', seatingDepth: '28"', seatingHeight: '19"', backrestHeight: '26"', productWeight: '159 lbs', packagingDimensions: '4 boxes', maxBearingSupport: '5 x 330 lbs' },
    description: 'L-shaped modular sectional in pre-washed European linen with feather-and-down filled cushions. Loose slipcovers are fully removable and machine washable.',
    features: ['Modular L-shape design', 'Removable slipcovers', 'Feather-down cushions', 'Machine washable linen'],
    sku: 'SP-17',
    image: '/images/products/sp-17.jpg',
    images: ['/images/products/sp-17.jpg'],
    reviewsList: [
      { name: 'Elizabeth Hughes', rating: 5, text: 'Dream sectional! The linen is soft and the chaise is perfect for movie nights. Slipcovers washed beautifully.' },
      { name: 'William Clark', rating: 5, text: 'Fits our space perfectly. Feather-down cushions are incredibly comfortable. Worth the investment.' },
      { name: 'Susan Wright', rating: 4, text: 'Stunning L-shape. Delivery was smooth. One cushion had a slight odour that faded after a week.' },
    ],
  },
  {
    id: 'sp-18', name: 'Rattan Lounge Chair', category: 'Living Room', discountPercent: 31, price: 344, originalPrice: 499, rating: 4.7, reviews: 82, inStock: true, onSale: true,
    colors: ['#C4A88E', '#4A2F21', '#FFFFFF'], colorNames: ['Natural Rattan', 'Dark Teak', 'Whitewash'], material: 'Natural Rattan & Teak', dimensions: '72 x 78 x 88 cm', weight: '9 kg',
    woodType: { name: 'Teak', slug: 'teak' },
    specs: { dimensionsFull: 'W28" x D31" x H35"', seatableWidth: '22"', seatingDepth: '20"', seatingHeight: '17"', backrestHeight: '28"', productWeight: '20 lbs', packagingDimensions: '1 box', maxBearingSupport: '1 x 275 lbs' },
    description: 'Hand-woven natural rattan lounge chair on a solid teak frame. Open-weave barrel back lets air flow freely, perfect for sunrooms and covered patios.',
    features: ['Hand-woven rattan', 'Solid teak frame', 'Includes linen cushion', 'Indoor-outdoor use'],
    sku: 'SP-18',
    image: '/images/products/sp-18.jpg',
    images: ['/images/products/sp-18.jpg'],
    reviewsList: [
      { name: 'Margaret Turner', rating: 5, text: 'Perfect for our sunroom. Lightweight, breathable, and the teak frame is solid. Cushion is comfortable.' },
      { name: 'Richard Baker', rating: 5, text: 'Hand-woven rattan has such nice texture. Use it indoors and on our covered patio. Holding up well.' },
      { name: 'Patricia Green', rating: 4, text: 'Beautiful lounge chair. Barrel back is supportive. Wish it came in a loveseat version too.' },
    ],
  },
]

// Editor furniture: only e-commerce shop products (same names & images as shop)
export const EDITOR_FURNITURE = SHOP_PRODUCTS.map((p) => {
  const dims = parseDimensions(p.dimensions)
  return {
    id: p.id,
    name: p.name,
    category: shopCategoryToEditor(p.category),
    shopCategory: p.category,
    width: dims.width,
    depth: dims.depth,
    height: dims.height,
    color: (p.colors && p.colors[0]) || '#8B6F47',
    price: p.price,
    icon: 'Box',
    description: p.description || '',
    image: p.image || null,
    sku: p.sku,
  }
})

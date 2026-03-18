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
  { id: 'Office', name: 'Office', icon: 'Briefcase' },
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
  const map = { 'Living Room': 'seating', 'Dining Room': 'seating', 'Bedroom': 'beds', 'Storage': 'storage', 'Entertainment': 'tables', 'Office': 'tables' }
  return map[shopCat] || 'tables'
}

// Default wall color presets
export const WALL_COLOR_PRESETS = [
  '#FFFFFF', '#F4EFEA', '#E8DFD5', '#D9C7B8', '#F0E6D3',
  '#E0D5C5', '#C4B5A0', '#A39281', '#87CEEB', '#B8D4E3',
  '#D4E6D4', '#F5E6CC', '#FFE4E1', '#E6E6FA', '#F0F0F0',
]

// Site-wide policy constants (USD base for cart logic; display in LKR)
export const FREE_SHIPPING_THRESHOLD = 14950 / 325 // ~46 USD = Rs 14,950
export const FREE_SHIPPING_DISPLAY = 'Rs 14,950.00' // Consistent site-wide display
export const STANDARD_SHIPPING_COST = 9.99
export const WARRANTY_YEARS = 2
export const RETURNS_DAYS = 30

export const FLOOR_COLOR_PRESETS = [
  '#D9C7B8', '#C4A88E', '#8B6F47', '#5C3A2A', '#4A2F21',
  '#2E1C12', '#B0B0B0', '#808080', '#D4B896', '#A0826D',
  '#E8DFD5', '#F4EFEA', '#CDAA7D', '#8B7355', '#654321',
]

// Products excluded from shop, editor, admin, and client everywhere (synced across all surfaces)
export const PRODUCTS_TO_EXCLUDE = ['Arc Floor Lamp', 'Round Wall Mirror', 'Globe Pendant Light']

// Shop products with extended info
// Each product has a UNIQUE primary image. Gallery images are different crops/views of the SAME piece.
// Zero image duplication across products. All images are high-quality studio product photography.
// Each product has a UNIQUE discount percentage (15–31%). Synced across Shop, ProductDetail, Real3DViewer.
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
      { name: 'Zara Okafor', rating: 5, text: 'The tufting depth is exactly what we wanted—holds its shape even after our two kids bounce on it daily. Brass legs have a nice weight to them.' },
      { name: 'Viktor Kowalczyk', rating: 5, text: 'Replaced a 12-year-old IKEA sofa. Night and day. Frame creaks zero. Velvet hasn’t pilled after 4 months.' },
      { name: 'Rina Tanaka', rating: 4, text: 'Delivery team left one cushion slightly crooked in the packaging—it flattened out in about a week. Otherwise spot-on.' },
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
      { name: 'Lars Eriksen', rating: 5, text: 'Spindle backs line up perfectly—no wobble. Sanded so smooth you can run your hand down the back without catching.' },
      { name: 'Amara Nkrumah', rating: 5, text: 'Set of four for our farm table. Mortise joints are tight. Dropped one during move—not a scratch.' },
      { name: 'Yuki Watanabe', rating: 4, text: 'Love the grain. Would buy a 6-pack if they offered it. Cushion covers are removable which is a plus.' },
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
      { name: 'Dmitri Volkov', rating: 5, text: 'Hairpin legs sit flush—no rocking. Lower shelf holds our art books. Veneer edge is clean, no chipping.' },
      { name: 'Fatima Al-Hassan', rating: 5, text: 'Paired it with a mustard armchair. The walnut finish picks up the light differently at dusk. Understated.' },
      { name: 'Connor McBride', rating: 4, text: 'Powder coat on the legs is even. One of the floor pads was slightly off—easy fix with a replacement.' },
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
      { name: 'Ingrid Lindqvist', rating: 5, text: 'Channel tufting stays crisp—no puckering. Slat system is quiet. Our 14" mattress sits flush.' },
      { name: 'Kwame Asante', rating: 5, text: 'Skipped the box spring. Base is engineered wood, not particle. Headboard bolts are concealed. Smart design.' },
      { name: 'Nadia Petrova', rating: 4, text: 'Linen breathes. Would have liked a fifth fabric option. Delivery crew carried it to the third floor no problem.' },
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
      { name: 'Rafael Mendoza', rating: 5, text: 'Iron frame has zero flex. Each pine plank is book-matched differently—one shelf has a knot that looks intentional.' },
      { name: 'Svetlana Kozlov', rating: 4, text: 'Wall anchor is non-negotiable with a toddler. Took 90 min to assemble. Shelves hold 25 lbs each no problem.' },
      { name: 'Arjun Patel', rating: 5, text: 'Replaced a wire Metro rack. This has presence. Matte black on the frame doesn’t show fingerprints.' },
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
      { name: 'Hassan Ibrahim', rating: 5, text: 'Mustard in Forest Green—went bold. Wings block the AC draft. Dowel legs are chunky, not spindly.' },
      { name: 'Freya Nielsen', rating: 5, text: 'Foam density is right. Back doesn’t collapse after an hour of reading. Walnut matches our credenza.' },
      { name: 'Tariq Mahmoud', rating: 4, text: 'Cushion zips off for dry clean. No ottoman in the line—using a pouf for now. Legs need felt pads.' },
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
      { name: 'Klaus Bauer', rating: 5, text: 'Breadboard ends are mortised—no screws. Table weighs 92 lbs. Seats eight with elbows. Grain runs long.' },
      { name: 'Aisha Okonkwo', rating: 5, text: 'Turned legs are substantial. Polyurethane is matte, not plasticky. Had to reinforce the floor underneath.' },
      { name: 'Björn Lindström', rating: 4, text: 'One leg had a small finish drip. Sanded and touched up. Otherwise flawless. Delivery crew knew their stuff.' },
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
      { name: 'Astrid Johansson', rating: 5, text: 'Drawer has soft-close—no slam. Cubby fits a charging station. Tapered legs give it lift without looking fragile.' },
      { name: 'Jasper van der Berg', rating: 5, text: 'Pre-assembled, no tools. Birch is pale, not yellow. Splayed legs are stable on uneven floors.' },
      { name: 'Mira Kowalczyk', rating: 4, text: 'One corner had a shipping scuff. Rubbed with Restor-a-Finish—gone. Otherwise perfect proportions.' },
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
      { name: 'Aldo Rossi', rating: 5, text: 'Leather is full-grain—you can feel the pores. Diamond tufting is hand-tied. Bun feet are solid, not plastic caps.' },
      { name: 'Yara Nassar', rating: 5, text: 'Distressed Cognac shows variation. Cushions have eight-way springs. Arrived in two crates, white-glove.' },
      { name: 'Marcus Webb', rating: 4, text: '3-week lead time as stated. One arm is slightly firmer than the other—breaking in. Worth it.' },
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
      { name: 'Fionn O\'Connor', rating: 5, text: 'Full-width hanging rail fits 40 hangers. Shelves use pins—adjust every 2". Soft-close is hydraulic, not spring.' },
      { name: 'Zeynep Yilmaz', rating: 4, text: 'Assembly 3 hrs with two people. Doors align. One shelf had a chip on the edge—they sent a replacement.' },
      { name: 'Santiago Reyes', rating: 5, text: 'Oak panels are veneer over MDF—solid where it matters. Anti-tip bracket is mandatory. Fits a king bedroom.' },
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
      { name: 'Theo van Essen', rating: 5, text: 'Lumbar dial actually works—no more cushion hack. Synchro-tilt has a firm stop. Base is polished chrome, five-star.' },
      { name: 'Ananya Reddy', rating: 5, text: 'Top-grain on seat and back. Arms are padded. 8 hrs a day, 4 months in—no sag. Mesh would have given out.' },
      { name: 'Felix Kowalski', rating: 4, text: 'Assembly took 40 min—armrest bolts are tight. Seat height goes low enough for my 5-foot-4 wife. Good value.' },
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
      { name: 'Isadora Costa', rating: 5, text: 'Live edge has bark inclusion on one side—kept it. Lacquer seal is thin, grain texture shows through. Iron base is geometric.' },
      { name: 'Kai Nakamura', rating: 4, text: 'Slab is 1.5" thick. Behind our sofa it works. One corner had a small fill—disclosed in listing. Acceptable.' },
      { name: 'Anouk Visser', rating: 5, text: 'Every slab is one-off. Ours has a sap line that catches the light. Base bolts from below—invisible.' },
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
      { name: 'Cormac Byrne', rating: 5, text: 'L-shape fits our 14x18 room. Feather-down cushions need fluffing weekly—part of the deal. Slipcovers washed at 30° with no shrink.' },
      { name: 'Selma Öztürk', rating: 5, text: 'Modular—chaise detaches. We flipped the L for a different layout. Linen is pre-washed, no stiffness.' },
      { name: 'Dmitri Sokolov', rating: 4, text: 'One cushion had a faint factory smell. Air out 48 hrs. Now fine. Sectional anchors the room. Delivery was 4 boxes.' },
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
      { name: 'Priyanka Sharma', rating: 5, text: 'Teak frame stays out year-round under the pergola. Rattan weave is tight—no snags. Cushion is removable, quick-dry.' },
      { name: 'Nils Eriksen', rating: 5, text: 'Barrel back supports lumbar. Open weave breathes. Moved it from sunroom to bedroom—works in both. Lightweight.' },
      { name: 'Adaeze Okafor', rating: 4, text: 'No loveseat in the line. Bought two. Rattan has slight colour variation between them—natural. Solid build.' },
    ],
  },
]

// Editor furniture: only e-commerce shop products (same names & images as shop)
// Filters out PRODUCTS_TO_EXCLUDE so they never appear in Room Editor
export const EDITOR_FURNITURE = SHOP_PRODUCTS
  .filter((p) => !PRODUCTS_TO_EXCLUDE.includes(p.name))
  .map((p) => {
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

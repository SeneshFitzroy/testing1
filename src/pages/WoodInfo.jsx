import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, TreePine, Shield, Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WOOD_DATABASE = {
  mahogany: {
    name: 'Mahogany',
    description: 'A premium tropical hardwood with a rich reddish-brown hue and straight, fine grain. Mahogany is prized for its durability, dimensional stability, and natural resistance to rot and insects. Ideal for high-end furniture, musical instruments, and fine woodworking.',
    origin: 'Central & South America, Africa',
    hardness: 'Janka 800-900 lbf',
    durability: 'Highly durable',
    grain: 'Straight to interlocked',
    colorRange: 'Reddish-brown to deep red',
    uses: ['Furniture frames', 'High-end cabinetry', 'Boat building', 'Musical instruments'],
  },
  oak: {
    name: 'Oak',
    description: 'Classic European and American hardwood known for its strength and distinctive grain. White oak is water-resistant and often used in barrels; red oak offers a warmer tone. Both provide excellent durability for furniture and flooring.',
    origin: 'North America, Europe',
    hardness: 'White: 1360 lbf · Red: 1290 lbf',
    durability: 'Very durable',
    grain: 'Open, prominent grain',
    colorRange: 'Light tan to reddish-brown',
    uses: ['Dining tables', 'Chairs', 'Wardrobes', 'Flooring', 'Wine barrels'],
  },
  walnut: {
    name: 'Walnut',
    description: 'American black walnut is a cherished domestic hardwood with a rich chocolate-brown color and occasional purple undertones. Its straight grain and easy workability make it a favorite among furniture makers and woodworkers.',
    origin: 'Eastern North America',
    hardness: '1010 lbf',
    durability: 'Moderate to high',
    grain: 'Straight to wavy',
    colorRange: 'Light brown to dark chocolate',
    uses: ['Desks', 'Tables', 'Gunstocks', 'Veneers', 'Accent furniture'],
  },
  teak: {
    name: 'Teak',
    description: 'Tropical teak is renowned for its natural oil content, which provides exceptional weather resistance. Golden-brown when new, it ages to a silvery grey outdoors. A top choice for outdoor furniture, decks, and marine applications.',
    origin: 'Southeast Asia (Myanmar, Thailand, Indonesia)',
    hardness: '1070 lbf',
    durability: 'Extremely durable',
    grain: 'Straight, occasionally wavy',
    colorRange: 'Golden-brown to honey',
    uses: ['Outdoor furniture', 'Decking', 'Boat decks', 'Cutting boards', 'Lounge chairs'],
  },
  birch: {
    name: 'Birch',
    description: 'Light-coloured hardwood with a fine, uniform texture. Yellow birch is strong and often used as a maple substitute; paper birch is lighter. Both take stains and finishes beautifully for a clean, Scandinavian aesthetic.',
    origin: 'Northern Hemisphere',
    hardness: 'Yellow: 1260 lbf · Paper: 910 lbf',
    durability: 'Moderate',
    grain: 'Fine, uniform',
    colorRange: 'Cream to pale yellow',
    uses: ['Nightstands', 'Cabinetry', 'Plywood', 'Cabinet interiors'],
  },
  maple: {
    name: 'Maple',
    description: 'Hard maple (sugar maple) is one of the hardest North American woods, prized for its pale cream colour and fine grain. Soft maple is lighter and often used when strength is less critical. Excellent for furniture and flooring.',
    origin: 'North America',
    hardness: 'Hard: 1450 lbf · Soft: 950 lbf',
    durability: 'Very durable',
    grain: 'Fine, uniform to curly',
    colorRange: 'Cream to light reddish-brown',
    uses: ['Furniture frames', 'Cutting boards', 'Flooring', 'Kitchen cabinets'],
  },
  pine: {
    name: 'Pine',
    description: 'A versatile softwood with a light colour and prominent knots. Reclaimed pine adds character with weathered patina; new pine is economical for shelving and casual furniture. Often stained or painted.',
    origin: 'North America, Europe',
    hardness: 'Eastern White: 380 lbf · Southern Yellow: 870 lbf',
    durability: 'Moderate',
    grain: 'Straight, knotty',
    colorRange: 'Cream to pale yellow',
    uses: ['Shelving', 'Industrial furniture', 'Construction', 'Rustic décor'],
  },
  mango: {
    name: 'Mango',
    description: 'Sustainable fruitwood with warm tones and varied grain. Mango wood is eco-friendly, as it comes from trees no longer producing fruit. Often used for contemporary and mid-century style furniture.',
    origin: 'Tropical regions (India, Southeast Asia)',
    hardness: '1070 lbf',
    durability: 'Moderate',
    grain: 'Varied, often figured',
    colorRange: 'Light tan to dark brown',
    uses: ['TV consoles', 'Sideboards', 'Desks', 'Accent tables'],
  },
  acacia: {
    name: 'Acacia',
    description: 'Durable tropical hardwood with striking grain patterns. Live-edge acacia slabs showcase natural edges and unique character. Resistant to moisture and wear, ideal for statement pieces.',
    origin: 'Australia, Africa, Asia',
    hardness: '1750 lbf (Australian Blackwood)',
    durability: 'Very durable',
    grain: 'Varied, often interlocked',
    colorRange: 'Golden to dark brown',
    uses: ['Console tables', 'Live-edge furniture', 'Flooring', 'Boat building'],
  },
  hardwood: {
    name: 'Hardwood',
    description: 'Kiln-dried hardwood frames provide structural integrity for upholstered furniture. Common species include maple, birch, and oak. Ensures longevity and stable support for sofas, chairs, and beds.',
    origin: 'Varies by species',
    hardness: 'Varies',
    durability: 'High (when kiln-dried)',
    grain: 'Varies',
    colorRange: 'Typically concealed under upholstery',
    uses: ['Sofa frames', 'Chair frames', 'Bed frames', 'Structural components'],
  },
}

export default function WoodInfo() {
  const { woodSlug } = useParams()
  const { t } = useTranslation()
  const wood = woodSlug ? WOOD_DATABASE[woodSlug.toLowerCase()] : null

  if (!wood) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-darkwood dark:text-white mb-4">
            {t('woodInfo.notFound') || 'Wood type not found'}
          </h2>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('product.backToShop')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.nav
          className="flex items-center gap-2 text-sm text-darkwood/50 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/shop" className="hover:text-clay transition-colors">{t('nav.shop')}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-clay transition-colors">{t('woodInfo.materials') || 'Materials'}</Link>
          <span>/</span>
          <span className="text-darkwood dark:text-white">{wood.name}</span>
        </motion.nav>

        <motion.button
          as={Link}
          to="/shop"
          className="flex items-center gap-2 text-darkwood dark:text-white hover:text-clay transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{t('product.back')}</span>
        </motion.button>

        <motion.div
          className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-clay/10 dark:bg-clay/20">
                <TreePine className="h-8 w-8 text-clay" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-darkwood dark:text-white font-display">
                  {wood.name}
                </h1>
                <p className="text-sm text-darkwood/50 dark:text-white uppercase tracking-wider">
                  {t('woodInfo.woodType') || 'Wood Type'}
                </p>
              </div>
            </div>

            <p className="text-darkwood dark:text-white leading-relaxed mb-8">
              {wood.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warm-50 dark:bg-dark-surface">
                <Leaf className="h-5 w-5 text-clay flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-darkwood/50 dark:text-white uppercase tracking-wider mb-1">
                    {t('woodInfo.origin') || 'Origin'}
                  </p>
                  <p className="text-darkwood dark:text-white font-medium">{wood.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warm-50 dark:bg-dark-surface">
                <Shield className="h-5 w-5 text-clay flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-darkwood/50 dark:text-white uppercase tracking-wider mb-1">
                    {t('woodInfo.hardness') || 'Janka Hardness'}
                  </p>
                  <p className="text-darkwood dark:text-white font-medium">{wood.hardness}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warm-50 dark:bg-dark-surface">
                <TreePine className="h-5 w-5 text-clay flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-darkwood/50 dark:text-white uppercase tracking-wider mb-1">
                    {t('woodInfo.grain') || 'Grain'}
                  </p>
                  <p className="text-darkwood dark:text-white font-medium">{wood.grain}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warm-50 dark:bg-dark-surface">
                <div className="h-5 w-5 rounded-full border-2 border-clay flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-darkwood/50 dark:text-white uppercase tracking-wider mb-1">
                    {t('woodInfo.colorRange') || 'Color Range'}
                  </p>
                  <p className="text-darkwood dark:text-white font-medium">{wood.colorRange}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-darkwood dark:text-white mb-3">
                {t('woodInfo.commonUses') || 'Common Uses'}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {wood.uses.map((use, i) => (
                  <li
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-clay/10 dark:bg-clay/20 text-clay dark:text-clay font-medium text-sm"
                  >
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-clay text-white font-semibold hover:bg-clay-dark transition-colors"
          >
            {t('woodInfo.browseFurniture') || 'Browse furniture in'} {wood.name}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

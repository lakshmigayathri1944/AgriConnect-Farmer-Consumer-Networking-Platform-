import alasql from 'alasql';
import {
  User,
  FarmerProfile,
  Crop,
  Order,
  OrderItem,
  PaymentRecord,
  MarketPrice,
  CropInquiry,
  Review,
  TableSchema
} from '../types';

const STORAGE_KEY_DB = 'agriconnect_db_state_v2';

// Initial Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 1,
    email: 'ramesh.farmer@agriconnect.org',
    full_name: 'Ramesh Patel',
    role: 'farmer',
    phone: '+91 98765 43210',
    address: 'Survey No. 42, Green Valley Farm, Village Karjat',
    city: 'Raigad',
    state: 'Maharashtra',
    pincode: '410201',
    github_username: 'ramesh-greenvalley',
    created_at: '2026-03-15 08:30:00'
  },
  {
    id: 2,
    email: 'sunita.farmer@agriconnect.org',
    full_name: 'Sunita Devi',
    role: 'farmer',
    phone: '+91 98234 56789',
    address: 'Plot 18, Kisan Marg, Tehsil Bilaspur',
    city: 'Bilaspur',
    state: 'Haryana',
    pincode: '122001',
    github_username: '',
    created_at: '2026-03-18 10:15:00'
  },
  {
    id: 3,
    email: 'baljit.farmer@agriconnect.org',
    full_name: 'Baljit Singh',
    role: 'farmer',
    phone: '+91 98111 22334',
    address: 'Golden Agro Farm, Nabha Road',
    city: 'Patiala',
    state: 'Punjab',
    pincode: '147001',
    github_username: '',
    created_at: '2026-03-20 09:00:00'
  },
  {
    id: 4,
    email: 'gayathri.consumer@gmail.com',
    full_name: 'Gayathri Devi',
    role: 'consumer',
    phone: '+91 99887 76655',
    address: '402 Sunrise Heights, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    github_username: 'kolligayathri33',
    created_at: '2026-04-01 11:20:00'
  },
  {
    id: 5,
    email: 'admin.priya@agriconnect.org',
    full_name: 'Priya Sharma (Inspector)',
    role: 'admin',
    phone: '+91 91234 56780',
    address: 'AgriConnect Central Registry, Cyber Hub',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    github_username: '',
    created_at: '2026-01-10 09:00:00'
  }
];

const DEFAULT_FARMERS: FarmerProfile[] = [
  {
    id: 1,
    user_id: 1,
    farm_name: 'GreenValley Organic Sanctuary',
    farm_location: 'Karjat, Western Ghats',
    state: 'Maharashtra',
    total_acres: 14.5,
    organic_certified: true,
    upi_id: 'rameshpatel@okhdfcbank',
    rating: 4.95,
    total_sales_kg: 3420,
    bio: 'Third-generation organic farmer practicing regenerative agriculture, chemical-free compost fertilization, and zero-tillage soil revitalization.',
    phone: '+91 98765 43210'
  },
  {
    id: 2,
    user_id: 2,
    farm_name: 'Meera Fresh Organic Orchards',
    farm_location: 'Bilaspur Organic Belt',
    state: 'Haryana',
    total_acres: 8.0,
    organic_certified: true,
    upi_id: 'sunitadevi@icici',
    rating: 4.85,
    total_sales_kg: 1890,
    bio: 'Dedicated to heirloom seasonal vegetables and traditional heirloom seed preservation with pure drip-irrigation practices.',
    phone: '+91 98234 56789'
  },
  {
    id: 3,
    user_id: 3,
    farm_name: 'Punjab Golden Grains Agro',
    farm_location: 'Patiala Granary District',
    state: 'Punjab',
    total_acres: 26.0,
    organic_certified: true,
    upi_id: 'baljitsingh@sbi',
    rating: 4.98,
    total_sales_kg: 8900,
    bio: 'Cultivating pure traditional Sharbati wheat, aged 1121 Basmati paddy, and nutrient-dense golden pulses without synthetic pesticides.',
    phone: '+91 98111 22334'
  }
];

const DEFAULT_CROPS: Crop[] = [
  {
    id: 1,
    farmer_id: 1,
    farmer_name: 'Ramesh Patel',
    farm_name: 'GreenValley Organic Sanctuary',
    location: 'Karjat, Maharashtra',
    crop_name: 'Heirloom Vine-Ripened Tomatoes',
    category: 'Vegetables',
    variety: 'Heritage Desi Roman',
    price_per_kg: 42,
    stock_quantity_kg: 480,
    harvest_date: '2026-10-27',
    shelf_life_days: 8,
    organic_certified: true,
    image_url: '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg',
    description: 'Juicy, naturally ripened sweet heirloom tomatoes packed with rich lycopene. Plucked fresh at dawn directly from fertile hillside soil.',
    min_order_kg: 3,
    status: 'available'
  },
  {
    id: 2,
    farmer_id: 3,
    farmer_name: 'Baljit Singh',
    farm_name: 'Punjab Golden Grains Agro',
    location: 'Patiala, Punjab',
    crop_name: 'Golden Sharbati Wheat (Stone-Milled Grade)',
    category: 'Grains',
    variety: 'C-306 Sharbati Premium',
    price_per_kg: 56,
    stock_quantity_kg: 1650,
    harvest_date: '2026-10-18',
    shelf_life_days: 360,
    organic_certified: true,
    image_url: '/src/assets/images/crop_golden_wheat_grains_1793338569436.jpg',
    description: 'Aromatic heavy golden Sharbati wheat kernels grown in mineral-rich canal waters. Makes exceptionally soft, naturally sweet chapatis.',
    min_order_kg: 10,
    status: 'available'
  },
  {
    id: 3,
    farmer_id: 1,
    farmer_name: 'Ramesh Patel',
    farm_name: 'GreenValley Organic Sanctuary',
    location: 'Karjat, Maharashtra',
    crop_name: 'GI-Tagged Ratnagiri Alphonso Mangoes',
    category: 'Fruits',
    variety: 'Hapus Pure Grade-A',
    price_per_kg: 280,
    stock_quantity_kg: 320,
    harvest_date: '2026-10-24',
    shelf_life_days: 12,
    organic_certified: true,
    image_url: '/src/assets/images/crop_organic_alphonso_mangoes_1793338569448.jpg',
    description: 'Unblemished tree-ripened Alphonso mangoes with royal sweetness and intoxicating floral fragrance. Hay-cured naturally with zero chemicals.',
    min_order_kg: 4,
    status: 'available'
  },
  {
    id: 4,
    farmer_id: 2,
    farmer_name: 'Sunita Devi',
    farm_name: 'Meera Fresh Organic Orchards',
    location: 'Bilaspur, Haryana',
    crop_name: 'Crisp Hydro-Clean Baby Spinach (Palak)',
    category: 'Vegetables',
    variety: 'All-Green Tender Leaf',
    price_per_kg: 38,
    stock_quantity_kg: 140,
    harvest_date: '2026-10-28',
    shelf_life_days: 4,
    organic_certified: true,
    image_url: '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg',
    description: 'Crisp, velvety baby spinach harvested in the early morning dew. Packed with iron, calcium, and zero chemical pesticide residues.',
    min_order_kg: 2,
    status: 'available'
  },
  {
    id: 5,
    farmer_id: 3,
    farmer_name: 'Baljit Singh',
    farm_name: 'Punjab Golden Grains Agro',
    location: 'Patiala, Punjab',
    crop_name: 'Traditional Aged Basmati Rice 1121',
    category: 'Grains',
    variety: '1121 Raw Extra Long Grain',
    price_per_kg: 98,
    stock_quantity_kg: 1200,
    harvest_date: '2026-09-30',
    shelf_life_days: 720,
    organic_certified: true,
    image_url: '/src/assets/images/crop_golden_wheat_grains_1793338569436.jpg',
    description: 'Aged for 18 months for non-sticky elongation and delicate traditional basmati aroma. Direct from farmer to table.',
    min_order_kg: 5,
    status: 'available'
  },
  {
    id: 6,
    farmer_id: 2,
    farmer_name: 'Sunita Devi',
    farm_name: 'Meera Fresh Organic Orchards',
    location: 'Bilaspur, Haryana',
    crop_name: 'Crunchy Sweet Organic Carrots',
    category: 'Vegetables',
    variety: 'Pusa Kesar Sweet Red',
    price_per_kg: 34,
    stock_quantity_kg: 350,
    harvest_date: '2026-10-26',
    shelf_life_days: 14,
    organic_certified: true,
    image_url: '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg',
    description: 'Deep red, crisp and naturally sugary garden carrots. High beta-carotene content, harvested straight from loose sandy-loam farm soil.',
    min_order_kg: 3,
    status: 'available'
  },
  {
    id: 7,
    farmer_id: 1,
    farmer_name: 'Ramesh Patel',
    farm_name: 'GreenValley Organic Sanctuary',
    location: 'Karjat, Maharashtra',
    crop_name: 'Farm-Fresh Shimla Bell Peppers (Capsicum)',
    category: 'Vegetables',
    variety: 'Indra Sweet Green & Yellow',
    price_per_kg: 52,
    stock_quantity_kg: 190,
    harvest_date: '2026-10-27',
    shelf_life_days: 9,
    organic_certified: true,
    image_url: '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg',
    description: 'Thick-walled crunchy bell peppers with vivid gloss and mild sweetness. Hand-picked at peak crispness.',
    min_order_kg: 2,
    status: 'available'
  },
  {
    id: 8,
    farmer_id: 3,
    farmer_name: 'Baljit Singh',
    farm_name: 'Punjab Golden Grains Agro',
    location: 'Patiala, Punjab',
    crop_name: 'Unpolished Organic Yellow Toor Dal',
    category: 'Pulses',
    variety: 'Desi Khari Baigani',
    price_per_kg: 142,
    stock_quantity_kg: 740,
    harvest_date: '2026-10-12',
    shelf_life_days: 360,
    organic_certified: true,
    image_url: '/src/assets/images/crop_golden_wheat_grains_1793338569436.jpg',
    description: 'Raw unpolished pigeon pea pulses retaining the natural high-protein bran coat. Never oil-treated or water-glazed.',
    min_order_kg: 2,
    status: 'available'
  }
];

const DEFAULT_MARKET_PRICES: MarketPrice[] = [
  {
    id: 1,
    crop_name: 'Tomato (Local)',
    category: 'Vegetables',
    modal_price: 38,
    min_price: 28,
    max_price: 48,
    trend: 'up',
    mandi_name: 'Vashi APMC Market',
    state: 'Maharashtra',
    updated_at: '2026-10-29'
  },
  {
    id: 2,
    crop_name: 'Wheat Sharbati',
    category: 'Grains',
    modal_price: 52,
    min_price: 46,
    max_price: 60,
    trend: 'stable',
    mandi_name: 'Khanna Grain Market',
    state: 'Punjab',
    updated_at: '2026-10-29'
  },
  {
    id: 3,
    crop_name: 'Alphonso Mango',
    category: 'Fruits',
    modal_price: 260,
    min_price: 220,
    max_price: 310,
    trend: 'up',
    mandi_name: 'Ratnagiri Mandi',
    state: 'Maharashtra',
    updated_at: '2026-10-28'
  },
  {
    id: 4,
    crop_name: 'Spinach (Palak)',
    category: 'Vegetables',
    modal_price: 32,
    min_price: 24,
    max_price: 42,
    trend: 'down',
    mandi_name: 'Azadpur Mandi',
    state: 'Delhi NCR',
    updated_at: '2026-10-29'
  },
  {
    id: 5,
    crop_name: 'Basmati Rice 1121',
    category: 'Grains',
    modal_price: 92,
    min_price: 85,
    max_price: 110,
    trend: 'stable',
    mandi_name: 'Karnal Grain Exchange',
    state: 'Haryana',
    updated_at: '2026-10-29'
  },
  {
    id: 6,
    crop_name: 'Carrot (Red)',
    category: 'Vegetables',
    modal_price: 30,
    min_price: 22,
    max_price: 38,
    trend: 'stable',
    mandi_name: 'Azadpur Mandi',
    state: 'Delhi NCR',
    updated_at: '2026-10-29'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'ORD-2026-8812',
    consumer_id: 4,
    consumer_name: 'Gayathri Devi',
    farmer_id: 1,
    farmer_name: 'Ramesh Patel',
    total_amount: 336,
    delivery_fee: 0,
    platform_fee: 10,
    status: 'delivered',
    payment_status: 'released',
    payment_method: 'upi',
    shipping_address: '402 Sunrise Heights, Indiranagar, Bengaluru, KA - 560038',
    order_date: '2026-10-28 14:32:00',
    estimated_delivery: '2026-10-31',
    has_reviewed: true,
    items: [
      {
        id: 1,
        order_id: 1,
        crop_id: 1,
        crop_name: 'Heirloom Vine-Ripened Tomatoes',
        quantity_kg: 8,
        unit_price: 42,
        subtotal: 336
      }
    ],
    tracking_steps: [
      {
        title: 'Order Placed & Escrow Funded',
        description: 'Payment of ₹336 locked securely in AgriConnect Escrow vault.',
        timestamp: '2026-10-28 14:32',
        completed: true,
        current: false
      },
      {
        title: 'Order Confirmed by Farmer',
        description: 'Ramesh Patel accepted order for fresh harvest batch #KRJ-42.',
        timestamp: '2026-10-28 15:10',
        completed: true,
        current: false
      },
      {
        title: 'Harvested & Quality Graded',
        description: '8kg heirloom tomatoes harvested at dawn, zero chemical residue checked.',
        timestamp: '2026-10-29 07:15',
        completed: true,
        current: false
      },
      {
        title: 'Dispatched via Direct AgriLogistics',
        description: 'Delivered in Bengaluru distribution hub (Vehicle MH-14-GH-4192).',
        timestamp: '2026-10-29 11:45',
        completed: true,
        current: false
      },
      {
        title: 'Delivered & Escrow Payout',
        description: 'Consumer verified quality; funds released to farmer UPI account.',
        timestamp: '2026-10-29 16:30',
        completed: true,
        current: true
      }
    ]
  }
];

const DEFAULT_PAYMENTS: PaymentRecord[] = [
  {
    id: 1,
    order_id: 1,
    transaction_ref: 'TXN-UPI-9948217390',
    amount: 346,
    method: 'upi',
    status: 'released',
    escrow_released: true,
    timestamp: '2026-10-28 14:32:15'
  }
];

const DEFAULT_INQUIRIES: CropInquiry[] = [
  {
    id: 1,
    crop_id: 2,
    crop_name: 'Golden Sharbati Wheat (Stone-Milled Grade)',
    farmer_id: 3,
    consumer_id: 4,
    consumer_name: 'Gayathri Devi',
    consumer_phone: '+91 99887 76655',
    offered_price_per_kg: 52,
    quantity_kg: 100,
    message: 'Seeking a 100kg bulk bag for housing society organic collective. Can we arrange dispatch next Monday?',
    status: 'accepted',
    created_at: '2026-10-28 16:40:00'
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    farmer_id: 1,
    farmer_name: 'Ramesh Patel',
    consumer_id: 4,
    consumer_name: 'Gayathri Devi',
    order_id: 1,
    rating: 5,
    comment: 'Exceptional heirloom tomatoes! The flavor was sweet, juicy, and packed with that authentic farm richness. Arrived without a single bruise thanks to careful natural straw packaging.',
    created_at: '2026-10-29 17:30:00'
  },
  {
    id: 2,
    farmer_id: 3,
    farmer_name: 'Baljit Singh',
    consumer_id: 4,
    consumer_name: 'Gayathri Devi',
    rating: 5,
    comment: 'The Sharbati wheat quality is second to none! Freshly harvested golden grains that make extraordinarily soft chapatis. 100% genuine farmer direct purchase.',
    created_at: '2026-10-26 12:15:00'
  },
  {
    id: 3,
    farmer_id: 2,
    farmer_name: 'Sunita Devi',
    consumer_id: 4,
    consumer_name: 'Gayathri Devi',
    rating: 5,
    comment: 'Crisp baby spinach and naturally sweet carrots harvested that very morning. You can truly taste the difference of zero-chemical organic soil.',
    created_at: '2026-10-25 09:40:00'
  }
];

export const MYSQL_SCHEMA_DEFINITIONS: TableSchema[] = [
  {
    tableName: 'users',
    description: 'Core user authentication, contact credentials, GitHub links, and RBAC roles (farmer, consumer, admin).',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'email', type: 'VARCHAR(255) UNIQUE NOT NULL', description: 'User login email' },
      { name: 'full_name', type: 'VARCHAR(150) NOT NULL', description: 'Full legal/display name' },
      { name: 'role', type: "ENUM('farmer','consumer','admin') NOT NULL", description: 'Role-Based Access Control' },
      { name: 'phone', type: 'VARCHAR(20)', description: 'Verified contact phone number' },
      { name: 'address', type: 'VARCHAR(255)', description: 'Street address' },
      { name: 'city', type: 'VARCHAR(100)', description: 'City/District' },
      { name: 'state', type: 'VARCHAR(100)', description: 'State jurisdiction' },
      { name: 'pincode', type: 'VARCHAR(10)', description: 'Postal area code' },
      { name: 'github_username', type: 'VARCHAR(100)', description: 'Connected GitHub username' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', description: 'Registration timestamp' }
    ]
  },
  {
    tableName: 'farmers',
    description: 'Extended profile details for verified agricultural producers, land acreage, certifications, and escrow payout IDs.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'user_id', type: 'INT NOT NULL', isForeign: true, references: 'users(id)', description: 'Foreign Key referencing users table' },
      { name: 'farm_name', type: 'VARCHAR(200) NOT NULL', description: 'Registered Farm / Cooperative Title' },
      { name: 'farm_location', type: 'VARCHAR(255) NOT NULL', description: 'Village/Tehsil/Region' },
      { name: 'state', type: 'VARCHAR(100) NOT NULL', description: 'State location' },
      { name: 'total_acres', type: 'DECIMAL(6,2)', description: 'Agricultural land size in acres' },
      { name: 'organic_certified', type: 'BOOLEAN DEFAULT FALSE', description: 'NPOP / PGS-India Certification status' },
      { name: 'upi_id', type: 'VARCHAR(100)', description: 'Direct farmer settlement UPI address' },
      { name: 'rating', type: 'DECIMAL(3,2) DEFAULT 5.00', description: 'Consumer satisfaction average rating (1-5)' },
      { name: 'total_sales_kg', type: 'DECIMAL(10,2) DEFAULT 0', description: 'Cumulative produce dispatched' }
    ]
  },
  {
    tableName: 'crops',
    description: 'Structured agricultural inventory managed by farmers, including harvest dates, quantities, and pricing.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'farmer_id', type: 'INT NOT NULL', isForeign: true, references: 'farmers(id)', description: 'Foreign Key referencing farmers table' },
      { name: 'crop_name', type: 'VARCHAR(200) NOT NULL', description: 'Produce variety display name' },
      { name: 'category', type: "ENUM('Vegetables','Grains','Fruits','Pulses','Spices')", description: 'Agricultural produce category' },
      { name: 'variety', type: 'VARCHAR(100)', description: 'Sub-species or cultivar name' },
      { name: 'price_per_kg', type: 'DECIMAL(8,2) NOT NULL', description: 'Direct farmer price (₹ / kg)' },
      { name: 'stock_quantity_kg', type: 'DECIMAL(10,2) NOT NULL', description: 'Available unsold harvest in kg' },
      { name: 'harvest_date', type: 'DATE NOT NULL', description: 'Date of plucking / harvesting' },
      { name: 'shelf_life_days', type: 'INT DEFAULT 7', description: 'Estimated freshness window in days' },
      { name: 'organic_certified', type: 'BOOLEAN DEFAULT FALSE', description: 'Organic cultivation flag' },
      { name: 'image_url', type: 'TEXT', description: 'Produce visual asset URL' },
      { name: 'description', type: 'TEXT', description: 'Detailed cultivation and flavor profile' },
      { name: 'min_order_kg', type: 'DECIMAL(6,2) DEFAULT 1.00', description: 'Minimum allowed order weight' },
      { name: 'status', type: "ENUM('available','low_stock','sold_out')", description: 'Current listing inventory state' }
    ]
  },
  {
    tableName: 'orders',
    description: 'Marketplace trade contracts between consumers and farmers with escrow payment locks.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'order_number', type: 'VARCHAR(50) UNIQUE NOT NULL', description: 'Unique invoice reference' },
      { name: 'consumer_id', type: 'INT NOT NULL', isForeign: true, references: 'users(id)', description: 'Purchaser account reference' },
      { name: 'farmer_id', type: 'INT NOT NULL', isForeign: true, references: 'farmers(id)', description: 'Fulfilling farmer reference' },
      { name: 'total_amount', type: 'DECIMAL(10,2) NOT NULL', description: 'Total crop value' },
      { name: 'delivery_fee', type: 'DECIMAL(6,2) DEFAULT 0', description: 'Direct farm freight cost' },
      { name: 'status', type: "ENUM('pending','confirmed','harvested','in_transit','delivered','cancelled')", description: 'Fulfillment milestone' },
      { name: 'payment_status', type: "ENUM('pending','escrow_held','released','refunded')", description: 'Escrow clearing status' },
      { name: 'payment_method', type: "ENUM('upi','card','netbanking','cod')", description: 'Chosen payment gateway' },
      { name: 'shipping_address', type: 'TEXT NOT NULL', description: 'Destination delivery address' },
      { name: 'order_date', type: 'DATETIME NOT NULL', description: 'Order creation timestamp' }
    ]
  },
  {
    tableName: 'reviews',
    description: 'Consumer star ratings (1-5) and written feedback for verified farmer fulfillment and harvest quality.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'farmer_id', type: 'INT NOT NULL', isForeign: true, references: 'farmers(id)', description: 'Target farmer being reviewed' },
      { name: 'farmer_name', type: 'VARCHAR(150) NOT NULL', description: 'Farmer / Farm title' },
      { name: 'consumer_id', type: 'INT NOT NULL', isForeign: true, references: 'users(id)', description: 'Consumer submitting review' },
      { name: 'consumer_name', type: 'VARCHAR(150) NOT NULL', description: 'Consumer display name' },
      { name: 'order_id', type: 'INT', isForeign: true, references: 'orders(id)', description: 'Associated order reference' },
      { name: 'rating', type: 'INT NOT NULL', description: 'Score from 1 to 5 stars' },
      { name: 'comment', type: 'TEXT NOT NULL', description: 'Detailed consumer review prose' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', description: 'Review submission timestamp' }
    ]
  },
  {
    tableName: 'order_items',
    description: 'Line item breakdown of crops and weights included in each order.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'order_id', type: 'INT NOT NULL', isForeign: true, references: 'orders(id)', description: 'Parent order reference' },
      { name: 'crop_id', type: 'INT NOT NULL', isForeign: true, references: 'crops(id)', description: 'Purchased crop reference' },
      { name: 'quantity_kg', type: 'DECIMAL(8,2) NOT NULL', description: 'Purchased weight in kg' },
      { name: 'unit_price', type: 'DECIMAL(8,2) NOT NULL', description: 'Fixed lock price per kg at purchase' },
      { name: 'subtotal', type: 'DECIMAL(10,2) NOT NULL', description: 'Line item total (quantity * unit_price)' }
    ]
  },
  {
    tableName: 'payments',
    description: 'Financial ledger tracking payment gateway intents, authorizations, and escrow disbursements.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'order_id', type: 'INT NOT NULL', isForeign: true, references: 'orders(id)', description: 'Associated order reference' },
      { name: 'transaction_ref', type: 'VARCHAR(100) UNIQUE NOT NULL', description: 'Banking / UPI Transaction ID' },
      { name: 'amount', type: 'DECIMAL(10,2) NOT NULL', description: 'Processed currency amount' },
      { name: 'method', type: 'VARCHAR(50) NOT NULL', description: 'Payment method channel' },
      { name: 'status', type: 'VARCHAR(50) NOT NULL', description: 'Gateway authorization state' },
      { name: 'escrow_released', type: 'BOOLEAN DEFAULT FALSE', description: 'Farmer disbursement flag' },
      { name: 'timestamp', type: 'DATETIME NOT NULL', description: 'Ledger entry timestamp' }
    ]
  },
  {
    tableName: 'market_prices',
    description: 'Government APMC Mandi wholesale price benchmarks for regional comparative pricing.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'crop_name', type: 'VARCHAR(150) NOT NULL', description: 'Commodity name' },
      { name: 'category', type: 'VARCHAR(50) NOT NULL', description: 'Crop grouping' },
      { name: 'modal_price', type: 'DECIMAL(8,2) NOT NULL', description: 'Standard Mandi modal rate' },
      { name: 'min_price', type: 'DECIMAL(8,2)', description: 'Mandi low threshold' },
      { name: 'max_price', type: 'DECIMAL(8,2)', description: 'Mandi high threshold' },
      { name: 'trend', type: "ENUM('up','down','stable')", description: 'Recent market direction' },
      { name: 'mandi_name', type: 'VARCHAR(150)', description: 'Reporting wholesale APMC market' },
      { name: 'state', type: 'VARCHAR(100)', description: 'Market jurisdiction' }
    ]
  },
  {
    tableName: 'crop_inquiries',
    description: 'Direct wholesale inquiries, negotiations, and custom bids from consumers to farmers.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true, description: 'Primary Key' },
      { name: 'crop_id', type: 'INT NOT NULL', isForeign: true, references: 'crops(id)', description: 'Target crop' },
      { name: 'farmer_id', type: 'INT NOT NULL', isForeign: true, references: 'farmers(id)', description: 'Farmer recipient' },
      { name: 'consumer_id', type: 'INT NOT NULL', isForeign: true, references: 'users(id)', description: 'Buyer initiating bid' },
      { name: 'offered_price_per_kg', type: 'DECIMAL(8,2) NOT NULL', description: 'Proposed unit price' },
      { name: 'quantity_kg', type: 'DECIMAL(10,2) NOT NULL', description: 'Requested bulk weight' },
      { name: 'message', type: 'TEXT', description: 'Buyer note / requirement details' },
      { name: 'status', type: "ENUM('pending','accepted','declined')", description: 'Farmer response status' }
    ]
  }
];

class SQLDatabase {
  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.initialized) return;

    try {
      // Create Database schema in AlaSQL
      alasql('CREATE DATABASE IF NOT EXISTS agriconnect;');
      alasql('USE agriconnect;');

      // Create Tables
      alasql(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email STRING,
          full_name STRING,
          role STRING,
          phone STRING,
          address STRING,
          city STRING,
          state STRING,
          pincode STRING,
          github_username STRING,
          created_at STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS farmers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          farm_name STRING,
          farm_location STRING,
          state STRING,
          total_acres NUMBER,
          organic_certified BOOLEAN,
          upi_id STRING,
          rating NUMBER,
          total_sales_kg NUMBER,
          bio STRING,
          phone STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS crops (
          id INT AUTO_INCREMENT PRIMARY KEY,
          farmer_id INT,
          farmer_name STRING,
          farm_name STRING,
          location STRING,
          crop_name STRING,
          category STRING,
          variety STRING,
          price_per_kg NUMBER,
          stock_quantity_kg NUMBER,
          harvest_date STRING,
          shelf_life_days INT,
          organic_certified BOOLEAN,
          image_url STRING,
          description STRING,
          min_order_kg NUMBER,
          status STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_number STRING,
          consumer_id INT,
          consumer_name STRING,
          farmer_id INT,
          farmer_name STRING,
          total_amount NUMBER,
          delivery_fee NUMBER,
          platform_fee NUMBER,
          status STRING,
          payment_status STRING,
          payment_method STRING,
          shipping_address STRING,
          order_date STRING,
          estimated_delivery STRING,
          tracking_steps_json STRING,
          has_reviewed BOOLEAN
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          farmer_id INT,
          farmer_name STRING,
          consumer_id INT,
          consumer_name STRING,
          order_id INT,
          rating INT,
          comment STRING,
          created_at STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          crop_id INT,
          crop_name STRING,
          quantity_kg NUMBER,
          unit_price NUMBER,
          subtotal NUMBER
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          transaction_ref STRING,
          amount NUMBER,
          method STRING,
          status STRING,
          escrow_released BOOLEAN,
          timestamp STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS market_prices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          crop_name STRING,
          category STRING,
          modal_price NUMBER,
          min_price NUMBER,
          max_price NUMBER,
          trend STRING,
          mandi_name STRING,
          state STRING,
          updated_at STRING
        );
      `);

      alasql(`
        CREATE TABLE IF NOT EXISTS crop_inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          crop_id INT,
          crop_name STRING,
          farmer_id INT,
          consumer_id INT,
          consumer_name STRING,
          consumer_phone STRING,
          offered_price_per_kg NUMBER,
          quantity_kg NUMBER,
          message STRING,
          status STRING,
          created_at STRING
        );
      `);

      // Load persistent state from localStorage or seed
      const savedState = localStorage.getItem(STORAGE_KEY_DB);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.populateTable('users', parsed.users || DEFAULT_USERS);
        this.populateTable('farmers', parsed.farmers || DEFAULT_FARMERS);
        this.populateTable('crops', parsed.crops || DEFAULT_CROPS);
        this.populateTable('orders', parsed.orders || this.serializeOrders(DEFAULT_ORDERS));
        this.populateTable('order_items', parsed.order_items || this.extractOrderItems(DEFAULT_ORDERS));
        this.populateTable('reviews', parsed.reviews || DEFAULT_REVIEWS);
        this.populateTable('payments', parsed.payments || DEFAULT_PAYMENTS);
        this.populateTable('market_prices', parsed.market_prices || DEFAULT_MARKET_PRICES);
        this.populateTable('crop_inquiries', parsed.crop_inquiries || DEFAULT_INQUIRIES);
      } else {
        this.populateTable('users', DEFAULT_USERS);
        this.populateTable('farmers', DEFAULT_FARMERS);
        this.populateTable('crops', DEFAULT_CROPS);
        this.populateTable('orders', this.serializeOrders(DEFAULT_ORDERS));
        this.populateTable('order_items', this.extractOrderItems(DEFAULT_ORDERS));
        this.populateTable('reviews', DEFAULT_REVIEWS);
        this.populateTable('payments', DEFAULT_PAYMENTS);
        this.populateTable('market_prices', DEFAULT_MARKET_PRICES);
        this.populateTable('crop_inquiries', DEFAULT_INQUIRIES);
        this.persist();
      }

      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize SQL database:', err);
    }
  }

  private populateTable(tableName: string, records: any[]) {
    alasql(`DELETE FROM ${tableName}`);
    if (records && records.length > 0) {
      records.forEach(row => {
        alasql(`INSERT INTO ${tableName} VALUES ?`, [row]);
      });
    }
  }

  private serializeOrders(orders: Order[]): any[] {
    return orders.map(ord => ({
      id: ord.id,
      order_number: ord.order_number,
      consumer_id: ord.consumer_id,
      consumer_name: ord.consumer_name,
      farmer_id: ord.farmer_id,
      farmer_name: ord.farmer_name,
      total_amount: ord.total_amount,
      delivery_fee: ord.delivery_fee,
      platform_fee: ord.platform_fee,
      status: ord.status,
      payment_status: ord.payment_status,
      payment_method: ord.payment_method,
      shipping_address: ord.shipping_address,
      order_date: ord.order_date,
      estimated_delivery: ord.estimated_delivery,
      tracking_steps_json: JSON.stringify(ord.tracking_steps),
      has_reviewed: ord.has_reviewed ? 1 : 0
    }));
  }

  private extractOrderItems(orders: Order[]): OrderItem[] {
    const items: OrderItem[] = [];
    orders.forEach(o => {
      if (o.items && o.items.length) {
        items.push(...o.items);
      }
    });
    return items;
  }

  public persist() {
    try {
      const state = {
        users: (alasql('SELECT * FROM users') as any[]) || [],
        farmers: (alasql('SELECT * FROM farmers') as any[]) || [],
        crops: (alasql('SELECT * FROM crops') as any[]) || [],
        orders: (alasql('SELECT * FROM orders') as any[]) || [],
        order_items: (alasql('SELECT * FROM order_items') as any[]) || [],
        reviews: (alasql('SELECT * FROM reviews') as any[]) || [],
        payments: (alasql('SELECT * FROM payments') as any[]) || [],
        market_prices: (alasql('SELECT * FROM market_prices') as any[]) || [],
        crop_inquiries: (alasql('SELECT * FROM crop_inquiries') as any[]) || []
      };
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist SQL state to localStorage', e);
    }
  }

  public executeRawSQL(sqlQuery: string): {
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    executionTimeMs: number;
    affectedRows?: number;
  } {
    const startTime = performance.now();
    try {
      const result: any = alasql(sqlQuery);
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      this.persist();

      if (Array.isArray(result)) {
        const columns = result.length > 0 ? Object.keys(result[0]) : [];
        return {
          success: true,
          data: result,
          columns,
          executionTimeMs,
          affectedRows: result.length
        };
      } else {
        return {
          success: true,
          data: [{ result }],
          columns: ['result'],
          executionTimeMs,
          affectedRows: typeof result === 'number' ? result : 1
        };
      }
    } catch (err: any) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: false,
        error: err.message || 'SQL Execution error',
        executionTimeMs
      };
    }
  }

  // Domain accessors
  public getAllCrops(): Crop[] {
    const crops = (alasql('SELECT * FROM crops ORDER BY id DESC') as any[]) || [];
    return crops.map((c: any) => ({
      ...c,
      organic_certified: Boolean(c.organic_certified)
    }));
  }

  public getCropById(id: number): Crop | undefined {
    const res = (alasql('SELECT * FROM crops WHERE id = ?', [id]) as any[]) || [];
    if (res && res.length > 0) {
      return {
        ...res[0],
        organic_certified: Boolean(res[0].organic_certified)
      };
    }
    return undefined;
  }

  public addCrop(cropData: Omit<Crop, 'id'>): Crop {
    const maxRows = (alasql('SELECT MAX(id) as maxId FROM crops') as any[]) || [];
    const currentMax = maxRows[0]?.maxId || 0;
    const newId = currentMax + 1;
    const newCrop: Crop = {
      ...cropData,
      id: newId
    };

    alasql('INSERT INTO crops VALUES ?', [newCrop]);
    this.persist();
    return newCrop;
  }

  public updateCrop(id: number, patch: Partial<Crop>): boolean {
    const existing = this.getCropById(id);
    if (!existing) return false;

    const updated = { ...existing, ...patch };
    alasql('DELETE FROM crops WHERE id = ?', [id]);
    alasql('INSERT INTO crops VALUES ?', [updated]);
    this.persist();
    return true;
  }

  public deleteCrop(id: number): boolean {
    alasql('DELETE FROM crops WHERE id = ?', [id]);
    this.persist();
    return true;
  }

  public getAllFarmers(): FarmerProfile[] {
    return (alasql('SELECT * FROM farmers') as FarmerProfile[]) || [];
  }

  public getFarmerByUserId(userId: number): FarmerProfile | undefined {
    const res = (alasql('SELECT * FROM farmers WHERE user_id = ?', [userId]) as FarmerProfile[]) || [];
    return res && res.length > 0 ? res[0] : undefined;
  }

  public getFarmerById(id: number): FarmerProfile | undefined {
    const res = (alasql('SELECT * FROM farmers WHERE id = ?', [id]) as FarmerProfile[]) || [];
    return res && res.length > 0 ? res[0] : undefined;
  }

  public getAllOrders(): Order[] {
    const rawOrders = (alasql('SELECT * FROM orders ORDER BY id DESC') as any[]) || [];
    return rawOrders.map((ord: any) => {
      const items = (alasql('SELECT * FROM order_items WHERE order_id = ?', [ord.id]) as OrderItem[]) || [];
      let trackingSteps = [];
      try {
        trackingSteps = JSON.parse(ord.tracking_steps_json || '[]');
      } catch {
        trackingSteps = [];
      }
      return {
        id: ord.id,
        order_number: ord.order_number,
        consumer_id: ord.consumer_id,
        consumer_name: ord.consumer_name,
        farmer_id: ord.farmer_id,
        farmer_name: ord.farmer_name,
        total_amount: ord.total_amount,
        delivery_fee: ord.delivery_fee,
        platform_fee: ord.platform_fee,
        status: ord.status,
        payment_status: ord.payment_status,
        payment_method: ord.payment_method,
        shipping_address: ord.shipping_address,
        order_date: ord.order_date,
        estimated_delivery: ord.estimated_delivery,
        has_reviewed: Boolean(ord.has_reviewed),
        items,
        tracking_steps: trackingSteps
      };
    });
  }

  public createOrder(
    consumer: User,
    farmerId: number,
    items: { crop: Crop; quantity_kg: number }[],
    paymentMethod: Order['payment_method'],
    shippingAddress: string
  ): { order: Order; payment: PaymentRecord } {
    const maxOrders = (alasql('SELECT MAX(id) as maxId FROM orders') as any[]) || [];
    const currentOrderMax = maxOrders[0]?.maxId || 0;
    const newOrderId = currentOrderMax + 1;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const farmer = this.getFarmerById(farmerId);
    const farmerName = farmer ? farmer.farm_name : 'Direct Farmer';

    const subtotal = items.reduce((acc, it) => acc + it.crop.price_per_kg * it.quantity_kg, 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const platformFee = 5;
    const totalAmount = subtotal + deliveryFee + platformFee;

    const today = new Date();
    const orderDate = today.toISOString().replace('T', ' ').substring(0, 19);
    const estDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

    const initialTracking: Order['tracking_steps'] = [
      {
        title: 'Order Placed & Escrow Funded',
        description: `Payment of ₹${totalAmount} secured in AgriConnect Escrow vault.`,
        timestamp: orderDate.substring(0, 16),
        completed: true,
        current: true
      },
      {
        title: 'Order Confirmed by Farmer',
        description: `${farmerName} notified for fresh harvest allocation.`,
        timestamp: 'Pending farmer verification',
        completed: false,
        current: false
      },
      {
        title: 'Harvested & Quality Graded',
        description: 'Fresh farm harvest & organic grading inspection.',
        timestamp: 'Scheduled upon confirmation',
        completed: false,
        current: false
      },
      {
        title: 'Dispatched via Direct AgriLogistics',
        description: 'Refrigerated/protected transit to destination.',
        timestamp: 'Estimated +2 days',
        completed: false,
        current: false
      },
      {
        title: 'Delivered & Escrow Payout',
        description: 'Consumer verifies quality; funds released to farmer UPI account.',
        timestamp: `Estimated ${estDate}`,
        completed: false,
        current: false
      }
    ];

    const newOrderRecord = {
      id: newOrderId,
      order_number: orderNumber,
      consumer_id: consumer.id,
      consumer_name: consumer.full_name,
      farmer_id: farmerId,
      farmer_name: farmerName,
      total_amount: totalAmount,
      delivery_fee: deliveryFee,
      platform_fee: platformFee,
      status: 'confirmed',
      payment_status: paymentMethod === 'cod' ? 'pending' : 'escrow_held',
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      order_date: orderDate,
      estimated_delivery: estDate,
      tracking_steps_json: JSON.stringify(initialTracking),
      has_reviewed: 0
    };

    alasql('INSERT INTO orders VALUES ?', [newOrderRecord]);

    // Insert order items and deduct stock in crops table
    const maxItems = (alasql('SELECT MAX(id) as maxId FROM order_items') as any[]) || [];
    let currentItemMax = maxItems[0]?.maxId || 0;
    const createdItems: OrderItem[] = [];

    items.forEach(it => {
      currentItemMax++;
      const itemSubtotal = it.crop.price_per_kg * it.quantity_kg;
      const orderItem: OrderItem = {
        id: currentItemMax,
        order_id: newOrderId,
        crop_id: it.crop.id,
        crop_name: it.crop.crop_name,
        quantity_kg: it.quantity_kg,
        unit_price: it.crop.price_per_kg,
        subtotal: itemSubtotal
      };
      alasql('INSERT INTO order_items VALUES ?', [orderItem]);
      createdItems.push(orderItem);

      // Deduct crop stock via SQL
      const newStock = Math.max(0, it.crop.stock_quantity_kg - it.quantity_kg);
      const newStatus = newStock === 0 ? 'sold_out' : newStock < 50 ? 'low_stock' : 'available';
      alasql('UPDATE crops SET stock_quantity_kg = ?, status = ? WHERE id = ?', [
        newStock,
        newStatus,
        it.crop.id
      ]);
    });

    // Create payment ledger record
    const maxPay = (alasql('SELECT MAX(id) as maxId FROM payments') as any[]) || [];
    const currentPayMax = maxPay[0]?.maxId || 0;
    const paymentId = currentPayMax + 1;
    const txnRef = `TXN-${paymentMethod.toUpperCase()}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const paymentRecord: PaymentRecord = {
      id: paymentId,
      order_id: newOrderId,
      transaction_ref: txnRef,
      amount: totalAmount,
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'escrow_held' : 'successful',
      escrow_released: false,
      timestamp: orderDate
    };

    alasql('INSERT INTO payments VALUES ?', [paymentRecord]);
    this.persist();

    const completeOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      consumer_id: consumer.id,
      consumer_name: consumer.full_name,
      farmer_id: farmerId,
      farmer_name: farmerName,
      total_amount: totalAmount,
      delivery_fee: deliveryFee,
      platform_fee: platformFee,
      status: 'confirmed',
      payment_status: paymentMethod === 'cod' ? 'pending' : 'escrow_held',
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      order_date: orderDate,
      estimated_delivery: estDate,
      has_reviewed: false,
      items: createdItems,
      tracking_steps: initialTracking
    };

    return { order: completeOrder, payment: paymentRecord };
  }

  public updateOrderStatus(orderId: number, newStatus: Order['status']): boolean {
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // Update tracking steps logically
    const steps = [...order.tracking_steps];
    const nowStr = new Date().toISOString().substring(0, 16).replace('T', ' ');

    if (newStatus === 'confirmed') {
      if (steps[1]) {
        steps[1].completed = true;
        steps[1].current = true;
        steps[1].timestamp = nowStr;
      }
    } else if (newStatus === 'harvested') {
      if (steps[1]) {
        steps[1].completed = true;
        steps[1].current = false;
      }
      if (steps[2]) {
        steps[2].completed = true;
        steps[2].current = true;
        steps[2].timestamp = nowStr;
      }
    } else if (newStatus === 'in_transit') {
      if (steps[1]) steps[1].completed = true;
      if (steps[2]) steps[2].completed = true;
      if (steps[3]) {
        steps[3].completed = true;
        steps[3].current = true;
        steps[3].timestamp = nowStr;
      }
    } else if (newStatus === 'delivered') {
      steps.forEach(s => {
        s.completed = true;
        s.current = false;
      });
      if (steps[4]) {
        steps[4].current = true;
        steps[4].timestamp = nowStr;
      }
    }

    alasql('UPDATE orders SET status = ?, tracking_steps_json = ? WHERE id = ?', [
      newStatus,
      JSON.stringify(steps),
      orderId
    ]);

    this.persist();
    return true;
  }

  public releaseEscrow(orderId: number): boolean {
    alasql('UPDATE orders SET payment_status = ? WHERE id = ?', ['released', orderId]);
    alasql('UPDATE payments SET escrow_released = TRUE, status = ? WHERE id = ?', ['released', orderId]);
    this.persist();
    return true;
  }

  public getMarketPrices(): MarketPrice[] {
    return (alasql('SELECT * FROM market_prices ORDER BY id ASC') as MarketPrice[]) || [];
  }

  public getAllInquiries(): CropInquiry[] {
    return (alasql('SELECT * FROM crop_inquiries ORDER BY id DESC') as CropInquiry[]) || [];
  }

  public submitInquiry(inquiry: Omit<CropInquiry, 'id' | 'created_at' | 'status'>): CropInquiry {
    const maxInq = (alasql('SELECT MAX(id) as maxId FROM crop_inquiries') as any[]) || [];
    const currentMax = maxInq[0]?.maxId || 0;
    const newInquiry: CropInquiry = {
      ...inquiry,
      id: currentMax + 1,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    alasql('INSERT INTO crop_inquiries VALUES ?', [newInquiry]);
    this.persist();
    return newInquiry;
  }

  public updateInquiryStatus(id: number, status: 'accepted' | 'declined'): boolean {
    alasql('UPDATE crop_inquiries SET status = ? WHERE id = ?', [status, id]);
    this.persist();
    return true;
  }

  // Reviews and ratings methods
  public getAllReviews(): Review[] {
    return (alasql('SELECT * FROM reviews ORDER BY id DESC') as Review[]) || [];
  }

  public getFarmerReviews(farmerId: number): Review[] {
    return (alasql('SELECT * FROM reviews WHERE farmer_id = ? ORDER BY id DESC', [farmerId]) as Review[]) || [];
  }

  public addReview(reviewData: Omit<Review, 'id' | 'created_at'>): Review {
    const maxReview = (alasql('SELECT MAX(id) as maxId FROM reviews') as any[]) || [];
    const newId = (maxReview[0]?.maxId || 0) + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newReview: Review = {
      ...reviewData,
      id: newId,
      created_at: nowStr
    };

    alasql('INSERT INTO reviews VALUES ?', [newReview]);

    // Recalculate average rating for farmer
    const farmerReviews = (alasql('SELECT rating FROM reviews WHERE farmer_id = ?', [reviewData.farmer_id]) as any[]) || [];
    if (farmerReviews.length > 0) {
      const avg = farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length;
      const roundedAvg = Math.round(avg * 10) / 10;
      alasql('UPDATE farmers SET rating = ? WHERE id = ?', [roundedAvg, reviewData.farmer_id]);
    }

    if (reviewData.order_id) {
      alasql('UPDATE orders SET has_reviewed = 1 WHERE id = ?', [reviewData.order_id]);
    }

    this.persist();
    return newReview;
  }

  public updateUserGithub(userId: number, githubUsername: string): boolean {
    alasql('UPDATE users SET github_username = ? WHERE id = ?', [githubUsername.trim(), userId]);
    this.persist();
    return true;
  }

  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY_DB);
    this.initialized = false;
    this.init();
  }

  public exportMySQLDump(): string {
    let sqlDump = `-- ================================================================\n`;
    sqlDump += `-- AgriConnect Farmer-Consumer Platform - MySQL Database Dump\n`;
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
    sqlDump += `-- Compatible with MySQL 8.0+ / MariaDB\n`;
    sqlDump += `-- ================================================================\n\n`;

    sqlDump += `CREATE DATABASE IF NOT EXISTS \`agriconnect\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sqlDump += `USE \`agriconnect\`;\n\n`;

    MYSQL_SCHEMA_DEFINITIONS.forEach(table => {
      sqlDump += `-- --------------------------------------------------------\n`;
      sqlDump += `-- Table structure for table \`${table.tableName}\`\n`;
      sqlDump += `-- Description: ${table.description}\n`;
      sqlDump += `-- --------------------------------------------------------\n`;
      sqlDump += `DROP TABLE IF EXISTS \`${table.tableName}\`;\n`;
      sqlDump += `CREATE TABLE \`${table.tableName}\` (\n`;

      const colDefs = table.columns.map(col => {
        let def = `  \`${col.name}\` ${col.type}`;
        if (col.isPrimary) def += ' PRIMARY KEY';
        return def;
      });

      sqlDump += colDefs.join(',\n') + '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n';

      // Insert rows
      const rows = (alasql(`SELECT * FROM ${table.tableName}`) as any[]) || [];
      if (rows.length > 0) {
        sqlDump += `-- Dumping data for table \`${table.tableName}\`\n`;
        rows.forEach((r: any) => {
          const keys = Object.keys(r);
          const values = keys.map(k => {
            const v = r[k];
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'boolean') return v ? '1' : '0';
            if (typeof v === 'number') return v;
            return `'${String(v).replace(/'/g, "\\'")}'`;
          });
          sqlDump += `INSERT INTO \`${table.tableName}\` (\`${keys.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
        });
        sqlDump += '\n';
      }
    });

    return sqlDump;
  }
}

export const db = new SQLDatabase();

-- ============================================================================
-- ShopKart - Seed Data (3 Warehouses, 8 Categories, 40 Products, Users, Coupons)
-- Passwords:
-- admin@shopkart.com -> admin123 ($2a$10$fV3157wR3rWq9mHk/E/wEu82vY1D8/8G6c65b1cQfE7gYQxGqfLrq)
-- customer1@shopkart.com -> customer123
-- customer2@shopkart.com -> customer123
-- ============================================================================

-- 1. Seed Warehouses
INSERT OR REPLACE INTO warehouses (id, name, code, city, state, capacity, is_active) VALUES
('wh-mum-01', 'Mumbai Central Fulfillment Hub', 'MUM-01', 'Mumbai', 'Maharashtra', 75000, 1),
('wh-del-02', 'Delhi NCR Regional Hub', 'DEL-02', 'Gurugram', 'Haryana', 60000, 1),
('wh-blr-03', 'Bengaluru Southern Logistics Hub', 'BLR-03', 'Bengaluru', 'Karnataka', 80000, 1);

-- 2. Seed Users
-- Password bcrypt hashes generated with cost 10
INSERT OR REPLACE INTO users (id, name, email, password_hash, role, phone) VALUES
('usr-admin-01', 'Super Administrator', 'admin@shopkart.com', '$2a$10$SbQLUzQML/tDtF2kJidLmeZ34e.OfAVs7iTZ5/tdJ6UangEoBiBBW', 'admin', '+91 9876543210'),
('usr-cust-01', 'Praveen Kumar', 'customer1@shopkart.com', '$2a$10$oAaNKm3gjhKn.Rss7l2XPumb3EdVvJEMB7920IgAQ6w60yMUHCvwi', 'customer', '+91 9811223344'),
('usr-cust-02', 'Ananya Sharma', 'customer2@shopkart.com', '$2a$10$/QoiSkagKxnWiYueDMSzgeE1W.l7ts0GsrOKL64JZ4pXhVZdBT81S', 'customer', '+91 9822334455');

-- 3. Seed Addresses
INSERT OR REPLACE INTO addresses (id, user_id, full_name, phone, street_address, city, state, postal_code, is_default) VALUES
('addr-01', 'usr-cust-01', 'Praveen Kumar', '+91 9811223344', 'Flat 402, Royal Palms, Outer Ring Road', 'Bengaluru', 'Karnataka', '560103', 1),
('addr-02', 'usr-cust-02', 'Ananya Sharma', '+91 9822334455', 'B-12/4, Vasant Vihar', 'New Delhi', 'Delhi', '110057', 1);

-- 4. Seed 8 Categories
INSERT OR REPLACE INTO categories (id, name, slug, icon_emoji, parent_id, image_url) VALUES
('cat-mobiles', 'Mobiles & Tablets', 'mobiles', '📱', NULL, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'),
('cat-laptops', 'Laptops & Computers', 'laptops', '💻', NULL, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
('cat-audio', 'Audio & Headphones', 'audio', '🎧', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('cat-watches', 'Smartwatches & Wearables', 'watches', '⌚', NULL, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('cat-fashion', 'Fashion & Apparel', 'fashion', '👕', NULL, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400'),
('cat-home', 'Home & Living', 'home', '🏠', NULL, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'),
('cat-appliances', 'Smart Home Appliances', 'appliances', '⚡', NULL, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400'),
('cat-beauty', 'Beauty & Personal Care', 'beauty', '✨', NULL, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400');

-- 5. Seed 40 Realistic Products
INSERT OR REPLACE INTO products (id, name, slug, description, brand, category_id, price, mrp, rating, review_count, image_urls, attributes) VALUES
-- Mobiles (1-5)
('p-01', 'Apple iPhone 15 Pro Max (256 GB, Titanium Blue)', 'apple-iphone-15-pro-max-256gb', 'Forged in titanium with aerospace-grade strength, super-fast A17 Pro chip, custom Action button, and 5x optical telephoto lens.', 'Apple', 'cat-mobiles', 134900, 159900, 4.9, 3420, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"]', '{"RAM":"8GB","Storage":"256GB","Processor":"A17 Pro","Camera":"48MP+12MP+12MP"}'),
('p-02', 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)', 'samsung-galaxy-s24-ultra-5g', 'Galaxy AI built-in with live call translation, Circle to Search, 200MP sensor, and titanium framed chassis with integrated S-Pen.', 'Samsung', 'cat-mobiles', 129999, 144999, 4.8, 2890, '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"]', '{"RAM":"12GB","Storage":"512GB","Processor":"Snapdragon 8 Gen 3","Battery":"5000mAh"}'),
('p-03', 'Google Pixel 8 Pro (Bay Blue, 128GB)', 'google-pixel-8-pro-128gb', 'Google Tensor G3 chip, fully upgraded triple camera system, and innovative editing tools like Magic Editor and Best Take.', 'Google', 'cat-mobiles', 89999, 106999, 4.7, 1420, '["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"]', '{"RAM":"12GB","Storage":"128GB","Display":"6.7 LTPO OLED 120Hz"}'),
('p-04', 'OnePlus 12 5G (Flowy Emerald, 256GB)', 'oneplus-12-5g-flowy-emerald', 'Featuring Qualcomm Snapdragon 8 Gen 3, Hasselblad Camera for Mobile 4th Gen, and 100W SUPERVOOC hyper charging.', 'OnePlus', 'cat-mobiles', 64999, 69999, 4.8, 1980, '["https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600"]', '{"RAM":"16GB","Storage":"256GB","Charging":"100W Wired + 50W Wireless"}'),
('p-05', 'Nothing Phone (2) (Dark Grey, 256GB)', 'nothing-phone-2-dark-grey', 'Unique Glyph Interface LED matrix, Snapdragon 8+ Gen 1 flagship silicon, and clean bloat-free Nothing OS 2.5.', 'Nothing', 'cat-mobiles', 36999, 44999, 4.6, 950, '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"]', '{"RAM":"12GB","Storage":"256GB","Display":"6.7 FHD+ OLED"}'),

-- Laptops (6-10)
('p-06', 'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)', 'apple-macbook-pro-16-m3-max', 'Monster speed with 16-core CPU, 40-core GPU, Liquid Retina XDR display, and up to 22 hours of continuous battery life.', 'Apple', 'cat-laptops', 299900, 349900, 5.0, 620, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"]', '{"Processor":"M3 Max 16-Core","RAM":"36GB Unified","Storage":"1TB NVMe"}'),
('p-07', 'Dell XPS 15 9530 OLED Touch', 'dell-xps-15-9530-oled-touch', '13th Gen Intel Core i9-13900H, NVIDIA GeForce RTX 4070, 3.5K OLED InfinityEdge touch display with CNC aluminum body.', 'Dell', 'cat-laptops', 249990, 279990, 4.7, 430, '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600"]', '{"Processor":"Intel i9-13900H","GPU":"RTX 4070 8GB","RAM":"32GB DDR5"}'),
('p-08', 'ASUS ROG Zephyrus G14 Gaming Laptop', 'asus-rog-zephyrus-g14-gaming', 'Ultraportable gaming with AMD Ryzen 9 8945HS, RTX 4060, ROG Nebula 3K 120Hz OLED screen, and AniMe Matrix lid lighting.', 'ASUS', 'cat-laptops', 159990, 189990, 4.9, 870, '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"]', '{"Weight":"1.5 kg","GPU":"RTX 4060","RefreshRate":"120Hz"}'),
('p-09', 'Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon-gen-11', 'Ultralight carbon-fiber business laptop engineered with Intel Evo Platform, Dolby Atmos sound, and legendary spill-resistant keyboard.', 'Lenovo', 'cat-laptops', 145000, 169990, 4.8, 510, '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"]', '{"Display":"14 2.8K OLED","Weight":"1.12 kg","Security":"dTPM 2.0 + Fingerprint"}'),
('p-10', 'HP Spectre x360 2-in-1 Convertible', 'hp-spectre-x360-convertible', 'Gem-cut dual tone chassis, Intel Core Ultra 7 with dedicated NPU for AI acceleration, and 9MP IR smart webcam.', 'HP', 'cat-laptops', 164990, 189990, 4.7, 390, '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600"]', '{"FormFactor":"2-in-1 Touch 360","Stylus":"Included Rechargeable MPP2.0"}'),

-- Audio (11-15)
('p-11', 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'sony-wh-1000xm5-wireless-headphones', 'Industry-leading noise cancellation powered by two processors and 8 microphones, with ultra-comfortable lightweight design.', 'Sony', 'cat-audio', 24990, 34990, 4.9, 4320, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]', '{"Battery":"30 Hours","Codecs":"LDAC, AAC, SBC","Weight":"250g"}'),
('p-12', 'Bose QuietComfort Ultra Spatial Headphones', 'bose-quietcomfort-ultra-headphones', 'Breakthrough spatial audio with CustomTune sound calibration tailored specifically to the physical acoustic contours of your ears.', 'Bose', 'cat-audio', 32900, 38900, 4.8, 1290, '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"]', '{"Modes":"Quiet, Aware, Immersion","Battery":"24 Hours"}'),
('p-13', 'Apple AirPods Pro (2nd Generation with USB-C)', 'apple-airpods-pro-2nd-gen-usb-c', 'Next-level Active Noise Cancellation with Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.', 'Apple', 'cat-audio', 20990, 24900, 4.9, 7840, '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"]', '{"Chip":"H2 Headphone Chip","DustWaterResistance":"IP54"}'),
('p-14', 'Marshall Stanmore III Bluetooth Speaker', 'marshall-stanmore-iii-bluetooth-speaker', 'Iconic rock-and-roll styling with wider soundstage, angled tweeters, updated waveguides, and dynamic loudness compensation.', 'Marshall', 'cat-audio', 31999, 39999, 4.8, 890, '["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"]', '{"Power":"80 Watts Class D","Connectivity":"Bluetooth 5.2, AUX, RCA"}'),
('p-15', 'Sennheiser Momentum 4 Wireless Audiophile', 'sennheiser-momentum-4-wireless', 'Incredible 60-hour marathon battery life with audiophile-grade 42mm transducer system and customizable equalizer presets.', 'Sennheiser', 'cat-audio', 27990, 34990, 4.7, 720, '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"]', '{"Battery":"60 Hours","Driver":"42mm Transducer"}'),

-- Watches & Wearables (16-20)
('p-16', 'Apple Watch Series 9 GPS + Cellular (45mm Starlight)', 'apple-watch-series-9-45mm', 'S9 SiP chip enabling magic double tap gestures, 2000 nits edge-to-edge Retina display, and ECG heart health app.', 'Apple', 'cat-watches', 44900, 49900, 4.9, 1920, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]', '{"Sensors":"Blood Oxygen, ECG, Temperature","WaterResistance":"50m"}'),
('p-17', 'Samsung Galaxy Watch6 Classic (47mm Black LTE)', 'samsung-galaxy-watch6-classic-47mm', 'The return of the iconic physical rotating bezel with sapphire crystal glass and comprehensive body composition analysis.', 'Samsung', 'cat-watches', 36999, 43999, 4.7, 1140, '["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"]', '{"Bezel":"Physical Rotating","OS":"Wear OS 4 Powered by Samsung"}'),
('p-18', 'Garmin Fenix 7X Pro Solar Multisport GPS', 'garmin-fenix-7x-pro-solar', 'Ultimate solar-powered multisport endurance watch with built-in multi-LED flashlight, TopoActive vector maps, and 37-day battery.', 'Garmin', 'cat-watches', 98990, 119990, 5.0, 410, '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600"]', '{"Battery":"Up to 37 Days Solar","Lens":"Power Sapphire"}'),
('p-19', 'Fossil Gen 6 Smartwatch Smoke Stainless Steel', 'fossil-gen-6-smoke-stainless-steel', 'Qualcomm Snapdragon Wear 4100+ platform with rapid fast charging (80% in 30 minutes) and customizable watch dials.', 'Fossil', 'cat-watches', 18495, 24995, 4.4, 630, '["https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600"]', '{"Material":"Stainless Steel Case","Charging":"Fast Magnetic"}'),
('p-20', 'OnePlus Watch 2 (Radiant Steel with Dual Engines)', 'oneplus-watch-2-radiant-steel', 'Dual Engine Architecture featuring Snapdragon W5 + BES2700 chips yielding up to 100 hours of continuous smart battery.', 'OnePlus', 'cat-watches', 24999, 27999, 4.8, 810, '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"]', '{"Battery":"100 Hours Smart Mode","Glass":"Sapphire Crystal"}'),

-- Fashion (21-25)
('p-21', 'Nike Air Jordan 1 Retro High OG Chicago', 'nike-air-jordan-1-retro-high-og', 'Iconic high-top sneaker crafted with premium full-grain leather, padded collar, and encapsulated Nike Air-Sole unit.', 'Nike', 'cat-fashion', 16995, 19995, 4.9, 2140, '["https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600"]', '{"Upper":"100% Genuine Leather","Sole":"Rubber Cupsole"}'),
('p-22', 'Levis Mens 511 Slim Fit Stretch Denim Jeans', 'levis-mens-511-slim-fit-jeans', 'Modern slim fit with room to move, upgraded with Levi Flex high-performance stretch technology for ultimate all-day comfort.', 'Levis', 'cat-fashion', 2799, 4199, 4.6, 5210, '["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"]', '{"Material":"99% Cotton 1% Elastane","Fit":"Slim from hip to ankle"}'),
('p-23', 'Ray-Ban Classic Aviator Gradient Sunglasses', 'ray-ban-classic-aviator-gradient', 'Timeless teardrop frame originally designed for aviators in 1937, with gold polished metal rims and polarized crystal lenses.', 'Ray-Ban', 'cat-fashion', 9490, 11990, 4.8, 1830, '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"]', '{"Frame":"Monel Metal","Lens":"Polarized 100% UV Protection"}'),
('p-24', 'Zara Structured Oversized Wool Blend Blazer', 'zara-structured-oversized-blazer', 'Single-breasted tailoring featuring peak lapels, flap front pockets, and tortoiseshell button detailing for contemporary silhouette.', 'Zara', 'cat-fashion', 7990, 9990, 4.5, 420, '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"]', '{"Fabric":"65% Wool 35% Polyester","Fit":"Relaxed Tailored"}'),
('p-25', 'Tommy Hilfiger Classic Icon Chronograph Dial', 'tommy-hilfiger-classic-icon-watch', 'Navy sunray dial with signature tricolor accents, stainless steel link bracelet, and water resistant up to 5 ATM.', 'Tommy Hilfiger', 'cat-fashion', 11995, 14995, 4.6, 680, '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600"]', '{"CaseDiameter":"44mm","Movement":"Multi-function Quartz"}'),

-- Home & Living (26-30)
('p-26', 'Xiaomi Smart Air Purifier 4 Pro with OLED', 'xiaomi-smart-air-purifier-4-pro', 'High-efficiency PM0.3 filtration capturing 99.97% of airborne allergens, with voice control support and negative air ionization.', 'Xiaomi', 'cat-home', 14999, 19999, 4.8, 2670, '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"]', '{"Coverage":"60 sq m","CADR":"500 m3/h","FilterLife":"Up to 12 Months"}'),
('p-27', 'Philips Hue White & Color Ambiance Starter Kit', 'philips-hue-starter-kit-e27', '16 million vibrant colors with bridge included, syncing dynamically with music, PC games, and home entertainment setups.', 'Philips', 'cat-home', 8999, 11999, 4.7, 1340, '["https://images.unsplash.com/photo-1550985616-10810253b84d?w=600"]', '{"Base":"E27","Brightness":"1100 Lumens","Connectivity":"Zigbee+Bluetooth"}'),
('p-28', 'Dyson V12 Detect Slim Cordless Vacuum', 'dyson-v12-detect-slim-cordless', 'Laser reveals microscopic invisible dust particles on hard floors, with piezoelectric sensor counting dust particles in real-time.', 'Dyson', 'cat-home', 49900, 58900, 4.9, 1690, '["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600"]', '{"SuctionPower":"150 AW","RunTime":"Up to 60 Mins","Weight":"2.2 kg"}'),
('p-29', 'Nespresso Vertuo Next Espresso & Coffee Maker', 'nespresso-vertuo-next-espresso-maker', 'Centrifusion extraction technology spinning at 4000 RPM to craft rich aromatic crema across five brew cup sizes.', 'Nespresso', 'cat-home', 16999, 21999, 4.8, 910, '["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600"]', '{"ExtractionSpeed":"4000 RPM","WaterTank":"1.1 Liters"}'),
('p-30', 'IKEA POÄNG Armchair with Hillared Dark Blue Cushion', 'ikea-poang-armchair-dark-blue', 'Layer-glued bent oak frame provides comfortable resilience and gentle rocking motion, tested to withstand 170kg loads.', 'IKEA', 'cat-home', 8490, 10990, 4.7, 3120, '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"]', '{"Frame":"Bentwood Birch","Fabric":"100% Recycled Hillared"}'),

-- Appliances (31-35)
('p-31', 'LG 55" OLED evo C3 4K Smart Cinema TV', 'lg-55-oled-evo-c3-4k-smart-tv', 'Self-lit pixels with Brightness Booster, α9 AI Processor Gen6, 0.1ms response time with 144Hz VRR support for elite gaming.', 'LG', 'cat-appliances', 119990, 169990, 4.9, 2110, '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600"]', '{"Panel":"OLED evo","RefreshRate":"120Hz/144Hz VRR","HDR":"Dolby Vision"}'),
('p-32', 'Samsung 653L French Door Smart Refrigerator', 'samsung-653l-french-door-refrigerator', 'Twin Cooling Plus technology with convertible 5-in-1 zones, embedded Wi-Fi smart energy reporting, and fingerprint resistant steel.', 'Samsung', 'cat-appliances', 79990, 99990, 4.7, 840, '["https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600"]', '{"Capacity":"653 Liters","Inverter":"Digital Inverter 20-Yr Warranty"}'),
('p-33', 'IFB 9kg 5-Star Front Load AI Washing Machine', 'ifb-9kg-front-load-ai-washing-machine', 'AI-driven sensor detects fabric type and weight to curate optimal wash rhythm, with steam sanitize eliminating 99.99% germs.', 'IFB', 'cat-appliances', 38990, 47990, 4.6, 1250, '["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600"]', '{"RPM":"1400 Max Spin","EnergyRating":"5 Star BEE Rating"}'),
('p-34', 'Panasonic 1.5 Ton 5 Star Wi-Fi Inverter AC', 'panasonic-1-5-ton-5-star-inverter-ac', 'Shielded with nanoeX air purification, AI mode adjusting cooling based on room occupancy, and voice assistant integrations.', 'Panasonic', 'cat-appliances', 42990, 56990, 4.7, 1890, '["https://images.unsplash.com/photo-1614633837726-0e1b6f00db18?w=600"]', '{"Capacity":"1.5 Ton","ISEER":"5.10","Refrigerant":"R32 Eco-Friendly"}'),
('p-35', 'Philips Digital Airfryer XXL 7.2L with Rapid Air', 'philips-digital-airfryer-xxl-7-2l', 'Patented starfish bottom design for even 360° heat circulation using up to 90% less oil for crispy fried meals.', 'Philips', 'cat-appliances', 13999, 18999, 4.8, 4120, '["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600"]', '{"Capacity":"7.2 Liters XXL","Presets":"16-in-1 Cooking Presets"}'),

-- Beauty & Care (36-40)
('p-36', 'Dyson Airwrap Multi-Styler Complete Long', 'dyson-airwrap-multi-styler-complete', 'Harnesses the aerodynamic Coanda effect to curl, shape, and hide flyaways without extreme heat damage.', 'Dyson', 'cat-beauty', 49900, 52900, 4.9, 3120, '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"]', '{"Attachments":"6 Included Styling Barrels","Motor":"V9 Digital Motor"}'),
('p-37', 'Estée Lauder Advanced Night Repair Serum (50ml)', 'estee-lauder-advanced-night-repair', 'Patented Chronolux Power Signal Technology promotes natural skin renewal overnight for radiant firmness.', 'Estée Lauder', 'cat-beauty', 8400, 9500, 4.8, 1780, '["https://images.unsplash.com/photo-1608248597358-1f1c7d23d8c1?w=600"]', '{"Volume":"50ml","SkinType":"All Skin Types","KeyIngredient":"Hyaluronic Acid"}'),
('p-38', 'Forest Essentials Soundarya Radiance Cream Gold 50g', 'forest-essentials-soundarya-radiance-cream', 'Enriched with 24K pure gold bhasma and cow milk ghee to deeply nourish, revitalize, and restore youthful luminescence.', 'Forest Essentials', 'cat-beauty', 5975, 6500, 4.7, 940, '["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"]', '{"Ingredient":"24K Pure Gold Bhasma","SPF":"SPF 25 PA++"}'),
('p-39', 'Chanel Coco Mademoiselle Eau De Parfum 100ml', 'chanel-coco-mademoiselle-edp-100ml', 'An ambery fragrance with a strong personality and surprising freshness, blending vibrant orange, rose, and patchouli accents.', 'Chanel', 'cat-beauty', 15500, 17500, 4.9, 1450, '["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"]', '{"Concentration":"Eau De Parfum","Volume":"100ml"}'),
('p-40', 'Oral-B iO Series 9 Electric Toothbrush with AI', 'oral-b-io-series-9-electric-toothbrush', 'Magnetic iO drive with interactive color display, 3D teeth tracking AI, and 7 personalized smart brushing modes.', 'Oral-B', 'cat-beauty', 17999, 23999, 4.8, 830, '["https://images.unsplash.com/photo-1559591937-e1032b4b4ffb?w=600"]', '{"Modes":"7 Smart Modes","Charging":"3-Hr Magnetic Fast Charger"}');

-- 6. Seed Inventory (Distributing 40 products across 3 Warehouses with real stock and low stock examples)
INSERT OR REPLACE INTO inventory (id, product_id, warehouse_id, stock_qty, reserved_qty, low_stock_threshold) VALUES
-- Product 1 (iPhone 15 Pro Max) - Low stock in Mumbai
('inv-01-mum', 'p-01', 'wh-mum-01', 2, 0, 5),
('inv-01-del', 'p-01', 'wh-del-02', 3, 0, 5),
('inv-01-blr', 'p-01', 'wh-blr-03', 4, 0, 5),

-- Product 2 (Samsung S24 Ultra)
('inv-02-mum', 'p-02', 'wh-mum-01', 12, 0, 5),
('inv-02-del', 'p-02', 'wh-del-02', 8, 0, 5),
('inv-02-blr', 'p-02', 'wh-blr-03', 15, 0, 5),

-- Product 3 (Pixel 8 Pro)
('inv-03-mum', 'p-03', 'wh-mum-01', 5, 0, 5),
('inv-03-del', 'p-03', 'wh-del-02', 10, 0, 5),
('inv-03-blr', 'p-03', 'wh-blr-03', 7, 0, 5),

-- Product 6 (MacBook Pro M3 Max) - Urgent stock
('inv-06-mum', 'p-06', 'wh-mum-01', 1, 0, 3),
('inv-06-del', 'p-06', 'wh-del-02', 2, 0, 3),
('inv-06-blr', 'p-06', 'wh-blr-03', 4, 0, 3),

-- Product 11 (Sony WH-1000XM5) - Only 2 left in Mumbai
('inv-11-mum', 'p-11', 'wh-mum-01', 2, 0, 5),
('inv-11-del', 'p-11', 'wh-del-02', 6, 0, 5),
('inv-11-blr', 'p-11', 'wh-blr-03', 9, 0, 5),

-- Product 26 (Smart Air Purifier) - Only 1 left in Mumbai
('inv-26-mum', 'p-26', 'wh-mum-01', 1, 0, 5),
('inv-26-del', 'p-26', 'wh-del-02', 8, 0, 5),
('inv-26-blr', 'p-26', 'wh-blr-03', 11, 0, 5);

-- Populate Remaining Products across warehouses with healthy inventory
INSERT OR IGNORE INTO inventory (id, product_id, warehouse_id, stock_qty, reserved_qty, low_stock_threshold)
SELECT 
    'inv-' || p.id || '-' || substr(w.id, 4, 3),
    p.id,
    w.id,
    25,
    0,
    5
FROM products p
CROSS JOIN warehouses w;

-- 7. Seed Coupons
INSERT OR REPLACE INTO coupons (id, code, discount_pct, min_order_value, max_discount_amount, expiry_date, usage_limit, times_used, is_active) VALUES
('cp-01', 'FESTIVE20', 20, 999, 5000, '2027-12-31 23:59:59', 5000, 142, 1),
('cp-02', 'BIGBILLION', 25, 2999, 10000, '2027-12-31 23:59:59', 1000, 48, 1),
('cp-03', 'WELCOME50', 50, 499, 500, '2027-12-31 23:59:59', 10000, 890, 1);

-- 8. Seed Banners
INSERT OR REPLACE INTO banners (id, title, subtitle, image_url, action_type, action_value, display_order, is_active) VALUES
('ban-01', 'Big Billion Preview Day', 'UP TO 80% OFF on Flagship Electronics', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', 'deal', 'top-discounts', 1, 1),
('ban-02', 'Smartphone Super Sale', 'Extra ₹5,000 Exchange Bonus on Pro Phones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200', 'category', 'cat-mobiles', 2, 1),
('ban-03', 'Home & Living Essentials', 'Upgrade your living space with smart gadgets', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200', 'category', 'cat-home', 3, 1);

-- 9. Seed Sample Orders
INSERT OR REPLACE INTO orders (id, user_id, status, subtotal, discount, delivery_fee, total, address_id, coupon_id, payment_method, payment_status, created_at) VALUES
('ord-1001', 'usr-cust-01', 'DELIVERED', 24990, 4998, 0, 19992, 'addr-01', 'cp-01', 'UPI', 'PAID', datetime('now', '-3 days')),
('ord-1002', 'usr-cust-01', 'SHIPPED', 41900, 0, 0, 41900, 'addr-01', NULL, 'CARD', 'PAID', datetime('now', '-1 day')),
('ord-1003', 'usr-cust-02', 'CONFIRMED', 14999, 2999, 0, 12000, 'addr-02', 'cp-01', 'COD', 'PENDING', datetime('now', '-2 hours'));

-- Order Items
INSERT OR REPLACE INTO order_items (id, order_id, product_id, warehouse_id, quantity, unit_price, total_price) VALUES
('oi-01', 'ord-1001', 'p-11', 'wh-mum-01', 1, 24990, 24990),
('oi-02', 'ord-1002', 'p-16', 'wh-blr-03', 1, 41900, 41900),
('oi-03', 'ord-1003', 'p-26', 'wh-mum-01', 1, 14999, 14999);

-- 10. Seed Initial Inventory Logs
INSERT OR REPLACE INTO inventory_logs (id, product_id, warehouse_id, change_qty, new_stock_qty, reason, actor, timestamp) VALUES
('log-01', 'p-11', 'wh-mum-01', -1, 2, 'ORDER_PLACED', 'ord-1001', datetime('now', '-3 days')),
('log-02', 'p-16', 'wh-blr-03', -1, 18, 'ORDER_PLACED', 'ord-1002', datetime('now', '-1 day')),
('log-03', 'p-26', 'wh-mum-01', -1, 1, 'ORDER_PLACED', 'ord-1003', datetime('now', '-2 hours'));

-- 11. Seed Admin Notifications
INSERT OR REPLACE INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES
('notif-01', NULL, 'LOW_STOCK', 'Critical Low Stock Alert', 'Xiaomi Smart Air Purifier 4 Pro has only 1 unit remaining in Mumbai Central WH-01.', 0, datetime('now', '-2 hours')),
('notif-02', NULL, 'LOW_STOCK', 'Low Stock Notice', 'Sony WH-1000XM5 has reached 2 units in Mumbai Central WH-01.', 0, datetime('now', '-1 day')),
('notif-03', 'usr-cust-01', 'ORDER_UPDATE', 'Order Shipped', 'Your Apple Watch Series 9 has been dispatched from Bengaluru Southern Logistics Hub.', 1, datetime('now', '-1 day'));

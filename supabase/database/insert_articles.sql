INSERT INTO public.article (id, name, sku, ingredient_name, category, nutrition_table, nutriscore, carbon_footprint, is_biological, description, allergy_labels, image_url, is_available) 
VALUES 
(gen_random_uuid(), 'Vollkornbrot', 'BRO-001', 'Vollkornmehl, Wasser, Hefe, Salz', 'Brot', '100g: Energie 250kcal, Fett 1.2g, Kohlenhydrate 45g, Eiweiß 8g', 'A', 0.8, false, 'Traditionell gebackenes Vollkornbrot aus regionalem Getreide', ARRAY['Gluten'], 'https://example.com/bread.jpg', true),

(gen_random_uuid(), 'Apfelsaft', 'JUI-001', 'Äpfel', 'Getränke', '100ml: Energie 45kcal, Fett 0g, Kohlenhydrate 11g, Eiweiß 0g', 'B', 0.5, false, 'Direktsaft aus regionalen Äpfeln', ARRAY['None'], 'https://example.com/juice.jpg', true),

(gen_random_uuid(), 'Vollmilch 3.5%', 'DAI-001', 'Milch', 'Milchprodukte', '100ml: Energie 65kcal, Fett 3.5g, Kohlenhydrate 4.8g, Eiweiß 3.3g', 'B', 1.2, false, 'Frische Vollmilch aus der Region', ARRAY['Laktose'], 'https://example.com/milk.jpg', true),

(gen_random_uuid(), 'Bananen', 'FRU-001', 'Bananen', 'Obst', '100g: Energie 89kcal, Fett 0.3g, Kohlenhydrate 22g, Eiweiß 1.1g', 'A', 0.9, false, 'Bananen aus Ecuador', ARRAY['None'], 'https://example.com/banana.jpg', true),

(gen_random_uuid(), 'Bio Eier', 'EGG-001', 'Eier', 'Eier', '100g: Energie 155kcal, Fett 11g, Kohlenhydrate 0.7g, Eiweiß 13g', 'A', 1.5, true, 'Freilandhaltung, Bio-zertifiziert', ARRAY['Eier'], 'https://example.com/eggs.jpg', true),

(gen_random_uuid(), 'Tomaten', 'VEG-001', 'Tomaten', 'Gemüse', '100g: Energie 18kcal, Fett 0.2g, Kohlenhydrate 3.9g, Eiweiß 0.9g', 'A', 0.3, false, 'Frische Tomaten aus regionalem Anbau', ARRAY['None'], 'https://example.com/tomatoes.jpg', true),

(gen_random_uuid(), 'Haferflocken', 'CER-001', 'Hafer', 'Getreide', '100g: Energie 370kcal, Fett 7g, Kohlenhydrate 63g, Eiweiß 13g', 'A', 0.4, false, 'Vollkorn-Haferflocken', ARRAY['Gluten'], 'https://example.com/oats.jpg', true),

(gen_random_uuid(), 'Honig', 'CON-001', 'Honig', 'Süßwaren', '100g: Energie 304kcal, Fett 0g, Kohlenhydrate 82g, Eiweiß 0.3g', 'C', 0.2, false, 'Regionaler Honig aus Blütennektar', ARRAY['None'], 'https://example.com/honey.jpg', true),

(gen_random_uuid(), 'Naturjoghurt', 'DAI-002', 'Milch, Joghurtkulturen', 'Milchprodukte', '100g: Energie 62kcal, Fett 3.5g, Kohlenhydrate 4.7g, Eiweiß 3.3g', 'A', 1.0, false, 'Cremiger Naturjoghurt', ARRAY['Laktose'], 'https://example.com/yogurt.jpg', true),

(gen_random_uuid(), 'Bio Karotten', 'VEG-002', 'Karotten', 'Gemüse', '100g: Energie 41kcal, Fett 0.2g, Kohlenhydrate 9.6g, Eiweiß 0.9g', 'A', 0.3, true, 'Frische Bio-Karotten aus regionalem Anbau', ARRAY['None'], 'https://example.com/carrots.jpg', true),

(gen_random_uuid(), 'Rindfleisch', 'MEA-001', 'Rindfleisch', 'Fleisch', '100g: Energie 250kcal, Fett 15g, Kohlenhydrate 0g, Eiweiß 26g', 'C', 15.0, false, 'Rindfleisch aus artgerechter Haltung', ARRAY['None'], 'https://example.com/beef.jpg', true),

(gen_random_uuid(), 'Lachs', 'FIS-001', 'Lachs', 'Fisch', '100g: Energie 208kcal, Fett 13g, Kohlenhydrate 0g, Eiweiß 20g', 'B', 3.5, false, 'Lachs aus nachhaltiger Aquakultur', ARRAY['Fisch'], 'https://example.com/salmon.jpg', true),

(gen_random_uuid(), 'Bio Quinoa', 'CER-002', 'Quinoa', 'Getreide', '100g: Energie 368kcal, Fett 6g, Kohlenhydrate 64g, Eiweiß 14g', 'A', 0.6, true, 'Bio-Quinoa aus fairem Handel', ARRAY['None'], 'https://example.com/quinoa.jpg', true),

(gen_random_uuid(), 'Mandeln', 'NUT-001', 'Mandeln', 'Nüsse', '100g: Energie 579kcal, Fett 50g, Kohlenhydrate 22g, Eiweiß 21g', 'B', 0.8, false, 'Mandeln aus Spanien', ARRAY['Nüsse'], 'https://example.com/almonds.jpg', true),

(gen_random_uuid(), 'Olivenöl', 'OIL-001', 'Oliven', 'Öle', '100ml: Energie 884kcal, Fett 100g, Kohlenhydrate 0g, Eiweiß 0g', 'C', 1.2, false, 'Natives Olivenöl extra', ARRAY['None'], 'https://example.com/oliveoil.jpg', true),

(gen_random_uuid(), 'Zucchini', 'VEG-003', 'Zucchini', 'Gemüse', '100g: Energie 17kcal, Fett 0.3g, Kohlenhydrate 3.1g, Eiweiß 1.2g', 'A', 0.3, false, 'Frische Zucchini aus regionalem Anbau', ARRAY['None'], 'https://example.com/zucchini.jpg', true),

(gen_random_uuid(), 'Himbeeren', 'FRU-002', 'Himbeeren', 'Obst', '100g: Energie 52kcal, Fett 0.7g, Kohlenhydrate 12g, Eiweiß 1.2g', 'A', 0.4, false, 'Frische Himbeeren', ARRAY['None'], 'https://example.com/raspberries.jpg', true),

(gen_random_uuid(), 'Kichererbsen', 'LEG-001', 'Kichererbsen', 'Hülsenfrüchte', '100g: Energie 164kcal, Fett 2.6g, Kohlenhydrate 27g, Eiweiß 8.9g', 'A', 0.5, false, 'Kichererbsen aus fairem Handel', ARRAY['None'], 'https://example.com/chickpeas.jpg', true),

(gen_random_uuid(), 'Schokolade 70%', 'CHO-001', 'Kakaobohnen, Zucker', 'Süßwaren', '100g: Energie 580kcal, Fett 42g, Kohlenhydrate 33g, Eiweiß 8g', 'C', 1.0, false, 'Schokolade mit 70% Kakaoanteil', ARRAY['Milch'], 'https://example.com/chocolate.jpg', true),

(gen_random_uuid(), 'Basilikum', 'HER-001', 'Basilikum', 'Kräuter', '100g: Energie 23kcal, Fett 0.6g, Kohlenhydrate 2.7g, Eiweiß 3.2g', 'A', 0.2, false, 'Frisches Basilikum', ARRAY['None'], 'https://example.com/basil.jpg', true); 
-- Insert example user
INSERT INTO "user" (id, name, address, country, house_hold_size)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Max Mustermann',
    'Musterstraße 123, 12345 Berlin',
    'Germany',
    3
);

-- Insert example hub
INSERT INTO hub (id, address, country)
VALUES (
    'HUB001',
    'Logistikstraße 1, 10115 Berlin',
    'Germany'
);

-- Insert example fc (fulfillment center)
INSERT INTO fc (id, address, country)
VALUES (
    'FC001',
    'Lagerweg 42, 20457 Hamburg',
    'Germany'
);

-- Insert example article
INSERT INTO article (
    id, 
    name, 
    sku, 
    ingredient_name, 
    category, 
    nutrition_table, 
    nutriscore, 
    carbon_footprint,
    is_biological,
    description,
    allergy_labels,
    image_url,
    is_available
)
VALUES (
    'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Bio Vollkornbrot',
    'BRD-001',
    'Vollkornmehl',
    'Backwaren',
    'Energie: 220kcal, Protein: 8g, Kohlenhydrate: 45g, Fett: 1g',
    'A',
    0.5,
    TRUE,
    'Frisches Bio-Vollkornbrot aus regionaler Herstellung',
    ARRAY['Gluten', 'Kann Spuren von Nüssen enthalten'],
    'https://example.com/images/vollkornbrot.jpg',
    TRUE
);

-- Insert example recipe
INSERT INTO recipe (id, name, ingredients, portion_quantity, instructions)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Avocado Toast',
    '{"BRD-001": 2, "AVO-001": 1}',
    2,
    ARRAY[
        'Toast rösten',
        'Avocado zerdrücken und würzen',
        'Avocado auf Toast verteilen'
    ]
);

-- Insert example stock
INSERT INTO stock (sku, fc_id, stock_location, quantity, last_delivery_timestamp, is_marked_imperfect)
VALUES (
    'BRD-001',
    'FC001',
    'SHELF-A1-01',
    100,
    '2024-03-20 08:00:00',
    FALSE
);

-- Insert example delivery
INSERT INTO delivery (delivery_id, customer, timeslot, trip_id, hub_id, fc_id)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '2024-03-21 14:00-16:00',
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'HUB001',
    'FC001'
);

-- Insert example orderline
INSERT INTO orderline (id, delivery_id, sku, quantity)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'BRD-001',
    2
);

-- Insert example delivery_recipe
INSERT INTO delivery_recipe (delivery_id, recipe_id)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'
); 
-- Create User table
CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    house_hold_size INTEGER NOT NULL
);

-- Create Hub table
CREATE TABLE hub (
    id VARCHAR(255) PRIMARY KEY,
    address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- Create FC (Fulfillment Center) table
CREATE TABLE fc (
    id VARCHAR(255) PRIMARY KEY,
    address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- Create Article table
CREATE TABLE article (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    ingredient_name VARCHAR(255),
    category VARCHAR(100),
    nutrition_table TEXT,
    nutriscore VARCHAR(1),
    carbon_footprint DECIMAL,
    is_biological BOOLEAN DEFAULT FALSE,
    description TEXT,
    allergy_labels TEXT[],
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

-- Create Recipe table
CREATE TABLE recipe (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients JSONB NOT NULL, -- Map of String to Number
    portion_quantity INTEGER NOT NULL,
    instructions TEXT[]
);

-- Create Stock table
CREATE TABLE stock (
    sku VARCHAR(100) NOT NULL,
    fc_id VARCHAR(255) NOT NULL,
    stock_location VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    last_delivery_timestamp TIMESTAMP,
    is_marked_imperfect BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (sku, fc_id),
    FOREIGN KEY (fc_id) REFERENCES fc(id)
);

-- Create Delivery table
CREATE TABLE delivery (
    delivery_id UUID PRIMARY KEY,
    customer UUID NOT NULL,
    timeslot VARCHAR(255) NOT NULL,
    trip_id UUID,
    hub_id VARCHAR(255),
    fc_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer) REFERENCES "user"(id),
    FOREIGN KEY (hub_id) REFERENCES hub(id),
    FOREIGN KEY (fc_id) REFERENCES fc(id)
);

-- Create Orderline table
CREATE TABLE orderline (
    id UUID PRIMARY KEY,
    delivery_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (delivery_id) REFERENCES delivery(delivery_id)
);

-- Create Delivery_Recipe junction table
CREATE TABLE delivery_recipe (
    delivery_id UUID,
    recipe_id UUID,
    PRIMARY KEY (delivery_id, recipe_id),
    FOREIGN KEY (delivery_id) REFERENCES delivery(delivery_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_stock_sku ON stock(sku);
CREATE INDEX idx_stock_fc_id ON stock(fc_id);
CREATE INDEX idx_delivery_customer ON delivery(customer);
CREATE INDEX idx_orderline_delivery_id ON orderline(delivery_id);
CREATE INDEX idx_orderline_sku ON orderline(sku); 
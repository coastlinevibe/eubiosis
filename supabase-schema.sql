-- Create orders table for storing customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_confirmation VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  province VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'South Africa',
  
  -- Order Details
  product_size VARCHAR(10) NOT NULL CHECK (product_size IN ('50ml', '100ml')),
  quantity INTEGER NOT NULL DEFAULT 1,
  is_bundle BOOLEAN DEFAULT FALSE,
  email_discount BOOLEAN DEFAULT FALSE,
  upsell_discount INTEGER DEFAULT 0,
  took_big_offer BOOLEAN DEFAULT FALSE,
  oto_offer VARCHAR(20),
  oto_price INTEGER DEFAULT 0,
  
  -- Pricing (stored in cents to avoid decimal issues)
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  
  -- Email tracking
  mail_sent BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for new orders)
CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reading orders (you might want to restrict this)
CREATE POLICY "Allow order reading" ON orders
    FOR SELECT USING (true);

-- Grant permissions to authenticated users
GRANT ALL ON orders TO authenticated;
GRANT ALL ON orders TO anon;

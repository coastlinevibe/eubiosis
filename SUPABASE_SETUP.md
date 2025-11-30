# Supabase Order Tracking Setup

## Setup Steps

### 1. Apply Database Schema

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (keqaosmbblccidztklaj)
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql`
6. Click **Run** to execute the SQL

This will create:
- `orders` table with all required fields
- Indexes for better performance
- Row Level Security policies
- Auto-update trigger for `updated_at` field

### 2. Verify Table Creation

After running the SQL, go to **Table Editor** in the left sidebar and verify that the `orders` table exists with these columns:
- id, created_at, updated_at
- first_name, last_name, email, phone, address, city, postal_code, province, country
- product_size, quantity, is_bundle, email_discount, upsell_discount, took_big_offer, oto_offer, oto_price
- subtotal, discount_amount, total_amount
- status

### 3. Test Order Submission

1. Run your development server: `npm run dev`
2. Go through the checkout flow
3. Fill in customer details on step 2
4. Select a province on step 3
5. Click "Pay with PayFast"
6. Check the browser console for logs:
   - `🚀 About to save order to Supabase...`
   - `=== saveOrder called ===`
   - `✅ Order saved successfully`

### 4. Verify in Supabase

1. Go to **Table Editor** > **orders**
2. You should see your test order with all the details
3. Pricing values are stored in cents (e.g., R324 = 32400)

## How It Works

When a user clicks "Pay with PayFast" on step 3:

1. **Order is saved to Supabase** with all customer and order details
2. **User is redirected to PayFast** for payment
3. Order status starts as 'pending'
4. After payment, PayFast sends a notification to update the order status

## Troubleshooting

### Orders not saving?

Check browser console for error messages. Common issues:
- Table doesn't exist (run the SQL schema)
- RLS policies blocking inserts (schema includes policies)
- Network issues (check Supabase URL in .env.local)

### Can't see orders in Supabase?

- Make sure you're looking at the correct project
- Check the Table Editor, not the SQL Editor
- Verify RLS policies allow SELECT (included in schema)

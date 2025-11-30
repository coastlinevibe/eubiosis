# Supabase Setup Guide

## Overview
This project uses Supabase to store customer orders when users complete a purchase. The order data is automatically saved before redirecting to PayFast for payment.

## Setup Steps

### 1. Create a Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details and create it

### 2. Run the Database Schema
1. In your Supabase project, go to the **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to create the tables and indexes

### 3. Get Your API Keys
1. Go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon Key** (under "Project API keys")

### 4. Add Environment Variables

#### For Local Development
Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### For Vercel Production
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the same two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy your project

### 5. Test the Integration
1. Run the development server: `npm run dev`
2. Go through the checkout flow
3. Check your Supabase project's **orders** table to verify the order was saved
4. You should see the customer information and order details

## What Gets Saved

When a user completes checkout, the following information is saved to the `orders` table:

**Customer Information:**
- First name & last name
- Email address
- Phone number
- Province
- Address (to be confirmed)
- City (to be confirmed)
- Postal code (to be confirmed)

**Order Details:**
- Product size (50ml or 100ml)
- Quantity
- Bundle status
- Email discount applied
- Upsell discount amount
- Big offer status
- OTO offer details
- Pricing (subtotal, discount, total)
- Order status (pending)

## Database Schema

The `orders` table includes:
- **id**: Unique order identifier (UUID)
- **created_at**: Timestamp when order was created
- **updated_at**: Timestamp when order was last updated
- **status**: Order status (pending, processing, completed, cancelled)
- All customer and order fields listed above

Indexes are created on:
- `email` - for quick customer lookups
- `created_at` - for sorting orders by date
- `status` - for filtering orders by status

## Row Level Security (RLS)

The table has RLS enabled with policies that allow:
- Anyone to insert new orders (for checkout)
- Anyone to read orders (you may want to restrict this later)

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` is created with the correct values
- Restart your development server after adding environment variables

### Orders not saving
- Check the browser console for error messages
- Verify your Supabase URL and Anon Key are correct
- Make sure the `orders` table was created by running the SQL schema

### Connection issues
- Verify your Supabase project is active
- Check that your API keys haven't been revoked
- Ensure your project's network settings allow connections from your domain

## Next Steps

After setup, you may want to:
1. Add authentication to restrict order viewing
2. Create an admin dashboard to view orders
3. Set up webhooks to handle order status updates
4. Add email notifications when orders are received

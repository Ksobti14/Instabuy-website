/*
  # Add Sample Products for InstaBuy

  1. Purpose
    - Add sample products to demonstrate the e-commerce platform
    - Products use the first available seller_id
    - Link products to existing categories

  2. Products
    - Electronics: Headphones, smartwatch, laptop, earbuds, speaker
    - Fashion: Sneakers, bag, jacket, running shoes, sunglasses
    - Home & Garden: Bedding, lamp, plants, table
    - Sports: Yoga mat, dumbbells, resistance bands
    - Books: Self-help, web dev, journal

  3. Important Notes
    - Products only inserted if they don't already exist
    - Uses the first available seller_id
    - All products are active and in stock
*/

DO $$
DECLARE
  existing_seller_id uuid;
  electronics_cat uuid;
  fashion_cat uuid;
  home_cat uuid;
  sports_cat uuid;
  books_cat uuid;
BEGIN
  SELECT id INTO existing_seller_id FROM seller_profiles LIMIT 1;
  
  IF existing_seller_id IS NULL THEN
    RETURN;
  END IF;

  SELECT id INTO electronics_cat FROM categories WHERE name = 'Electronics' LIMIT 1;
  SELECT id INTO fashion_cat FROM categories WHERE name = 'Fashion' LIMIT 1;
  SELECT id INTO home_cat FROM categories WHERE name = 'Home & Garden' LIMIT 1;
  SELECT id INTO sports_cat FROM categories WHERE name = 'Sports' LIMIT 1;
  SELECT id INTO books_cat FROM categories WHERE name = 'Books' LIMIT 1;

  IF electronics_cat IS NOT NULL THEN
    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, emi_available, emi_months, status)
    SELECT existing_seller_id, electronics_cat, 'Premium Wireless Headphones', 'High-quality noise-canceling wireless headphones with 40-hour battery life and premium sound quality.', 299.99, 249.99, ARRAY['https://images.pexels.com/photos/3394662/pexels-photo-3394662.jpeg?auto=compress&cs=tinysrgb&w=800'], 45, true, ARRAY[3, 6, 9, 12], 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Wireless Headphones');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, emi_available, emi_months, status)
    SELECT existing_seller_id, electronics_cat, 'Smart Watch Series X', 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.', 399.99, 349.99, ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'], 30, true, ARRAY[3, 6, 9, 12], 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Series X');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, emi_available, emi_months, status)
    SELECT existing_seller_id, electronics_cat, 'Ultra-Slim Laptop', 'Powerful laptop with Intel i7 processor, 16GB RAM, 512GB SSD.', 999.99, NULL, ARRAY['https://images.pexels.com/photos/18105221/pexels-photo-18105221.jpeg?auto=compress&cs=tinysrgb&w=800'], 20, true, ARRAY[3, 6, 9, 12, 18, 24], 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ultra-Slim Laptop');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, electronics_cat, 'Wireless Earbuds Pro', 'True wireless earbuds with active noise cancellation and premium sound.', 149.99, 119.99, ARRAY['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'], 75, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Earbuds Pro');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, electronics_cat, 'Portable Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound and 24-hour playtime.', 89.99, NULL, ARRAY['https://images.pexels.com/photos/12712873/pexels-photo-12712873.jpeg?auto=compress&cs=tinysrgb&w=800'], 55, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Portable Bluetooth Speaker');
  END IF;

  IF fashion_cat IS NOT NULL THEN
    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, fashion_cat, 'Classic White Sneakers', 'Comfortable and stylish white sneakers for everyday wear.', 79.99, 59.99, ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'], 40, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Classic White Sneakers');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, fashion_cat, 'Leather Crossbody Bag', 'Genuine leather crossbody bag with adjustable strap and multiple compartments.', 129.99, NULL, ARRAY['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'], 35, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Leather Crossbody Bag');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, fashion_cat, 'Denim Jacket', 'Classic denim jacket with modern fit and premium quality.', 89.99, 69.99, ARRAY['https://images.pexels.com/photos/1340685/pexels-photo-1340685.jpeg?auto=compress&cs=tinysrgb&w=800'], 50, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Denim Jacket');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, fashion_cat, 'Running Shoes Elite', 'High-performance running shoes with advanced cushioning and support.', 159.99, NULL, ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'], 60, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Running Shoes Elite');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, fashion_cat, 'Premium Sunglasses', 'UV-protected designer sunglasses with polarized lenses.', 199.99, 149.99, ARRAY['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800'], 25, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Sunglasses');
  END IF;

  IF home_cat IS NOT NULL THEN
    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, home_cat, 'Organic Cotton Bedding Set', 'Luxury 400-thread-count organic cotton sheet set in queen size.', 179.99, 149.99, ARRAY['https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800'], 30, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Organic Cotton Bedding Set');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, home_cat, 'Modern Floor Lamp', 'Minimalist LED floor lamp with adjustable brightness and dimmer.', 199.99, NULL, ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 25, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Modern Floor Lamp');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, home_cat, 'Indoor Plant Collection', 'Set of 3 low-maintenance indoor plants with decorative pots.', 79.99, NULL, ARRAY['https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800'], 50, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Indoor Plant Collection');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, home_cat, 'Coffee Table', 'Modern wooden coffee table with shelf storage.', 349.99, 299.99, ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'], 15, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coffee Table');
  END IF;

  IF sports_cat IS NOT NULL THEN
    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, sports_cat, 'Premium Yoga Mat', 'Eco-friendly non-slip yoga mat with carrying strap.', 49.99, NULL, ARRAY['https://images.pexels.com/photos/3758123/pexels-photo-3758123.jpeg?auto=compress&cs=tinysrgb&w=800'], 80, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Yoga Mat');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, emi_available, status)
    SELECT existing_seller_id, sports_cat, 'Adjustable Dumbbell Set', 'Space-saving adjustable dumbbell set from 5 to 50 lbs.', 349.99, 299.99, ARRAY['https://images.pexels.com/photos/260324/pexels-photo-260324.jpeg?auto=compress&cs=tinysrgb&w=800'], 20, true, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Adjustable Dumbbell Set');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, sports_cat, 'Resistance Band Kit', 'Complete set with 5 resistance levels for home workouts.', 29.99, NULL, ARRAY['https://images.pexels.com/photos/4162492/pexels-photo-4162492.jpeg?auto=compress&cs=tinysrgb&w=800'], 120, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Resistance Band Kit');
  END IF;

  IF books_cat IS NOT NULL THEN
    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, books_cat, 'The Art of Thinking Clearly', 'Bestseller book on decision-making and cognitive biases.', 16.99, NULL, ARRAY['https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=800'], 100, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'The Art of Thinking Clearly');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, books_cat, 'Modern Web Development', 'Complete guide to React, Node.js, and modern tools.', 49.99, 39.99, ARRAY['https://images.pexels.com/photos/159711/books-paper-reader-paperback-159711.jpeg?auto=compress&cs=tinysrgb&w=800'], 60, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Modern Web Development');

    INSERT INTO products (seller_id, category_id, name, description, price, discount_price, image_urls, stock, status)
    SELECT existing_seller_id, books_cat, 'Mindful Living Journal', 'Daily reflection journal with prompts for mindfulness.', 24.99, NULL, ARRAY['https://images.pexels.com/photos/694587/pexels-photo-694587.jpeg?auto=compress&cs=tinysrgb&w=800'], 90, 'active'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mindful Living Journal');
  END IF;

END $$;

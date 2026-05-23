import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string;
          phone?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      seller_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          gst_number: string;
          account_number: string;
          ifsc_code: string;
          bank_name: string;
          pickup_address: string;
          pickup_city: string;
          pickup_state: string;
          pickup_postal_code: string;
          verification_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          gst_number: string;
          account_number: string;
          ifsc_code: string;
          bank_name: string;
          pickup_address: string;
          pickup_city: string;
          pickup_state: string;
          pickup_postal_code: string;
          verification_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          gst_number?: string;
          account_number?: string;
          ifsc_code?: string;
          bank_name?: string;
          pickup_address?: string;
          pickup_city?: string;
          pickup_state?: string;
          pickup_postal_code?: string;
          verification_status?: string;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          discount_price: number | null;
          image_urls: string[];
          stock: number;
          emi_available: boolean | null;
          emi_months: number[] | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          discount_price?: number | null;
          image_urls?: string[];
          stock?: number;
          emi_available?: boolean | null;
          emi_months?: number[] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: number;
          discount_price?: number | null;
          image_urls?: string[];
          stock?: number;
          emi_available?: boolean | null;
          emi_months?: number[] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          seller_id: string;
          status: string;
          total_amount: number;
          discount_amount: number | null;
          final_amount: number;
          shipping_address_id: string;
          payment_method: string;
          payment_status: string;
          emi_selected: boolean | null;
          emi_months: number | null;
          emi_monthly_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          seller_id: string;
          status?: string;
          total_amount: number;
          discount_amount?: number | null;
          final_amount: number;
          shipping_address_id: string;
          payment_method: string;
          payment_status?: string;
          emi_selected?: boolean | null;
          emi_months?: number | null;
          emi_monthly_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          seller_id?: string;
          status?: string;
          total_amount?: number;
          discount_amount?: number | null;
          final_amount?: number;
          shipping_address_id?: string;
          payment_method?: string;
          payment_status?: string;
          emi_selected?: boolean | null;
          emi_months?: number | null;
          emi_monthly_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          discount_price: number | null;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          discount_price?: number | null;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          discount_price?: number | null;
          total_price?: number;
          created_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category: string;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string;
          order?: number;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          created_at?: string;
        };
      };
    };
  };
};

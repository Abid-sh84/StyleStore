import { supabase } from './supabase';
import { Address, Order, UserProfile } from '../types';

export const api = {
  // Profile Management
  async getUserProfile(): Promise<UserProfile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;
    return profile;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Address Management
  async getAddresses(): Promise<Address[]> {
    const { data, error } = await supabase
      .from('addresses')
      .select('id, name, street, city, state, zip_code, country, phone, is_default, user_id')
      .order('is_default', { ascending: false });

    if (error) {
      if (error.code === '406') {
        throw new Error('Invalid response format from server. Please try again.');
      }
      throw error;
    }
    return data;
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        country: address.country,
        phone: address.phone,
        is_default: address.is_default,
        user_id: address.user_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(address: Address): Promise<Address> {
    const { data, error } = await supabase
      .from('addresses')
      .update({
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        country: address.country,
        phone: address.phone,
        is_default: address.is_default
      })
      .eq('id', address.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAddress(id: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async setDefaultAddress(id: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id);

    if (error) throw error;
  },

  // Order Management
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const { data, error } = await supabase
      .from('order')
      .insert({
        user_id: order.userId,
        status: order.status,
        total_amount: order.totalAmount,
        shipping_address_id: order.shippingAddress.id,
        payment_method: order.paymentMethod,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: data.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return data;
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('order')
      .select(`
        *,
        shipping_address:addresses(*),
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const { data, error } = await supabase
      .from('order')
      .select(`
        *,
        shipping_address:addresses(*),
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async cancelOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('order')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  },
};
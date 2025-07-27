// src/lib/stores/cartStore.ts
// Zustand store for cart state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: string[];
    stockQuantity: number;
  };
  variant?: {
    id: string;
    name: string;
    stock: number;
    attributes: Record<string, any> | null;
  };
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
};

type CartActions = {
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateTotals: () => void;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      totalItems: 0,
      totalPrice: 0,

      // Actions
      addItem: async (newItem) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: newItem.productId,
              variantId: newItem.variantId,
              quantity: newItem.quantity,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item to cart');
          }

          const result = await response.json();
          
          if (result.success) {
            // Find existing item
            const existingItemIndex = get().items.findIndex(
              item => item.productId === newItem.productId && 
                      item.variantId === newItem.variantId
            );

            if (existingItemIndex >= 0) {
              // Update existing item
              const updatedItems = [...get().items];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
              };
              set({ items: updatedItems });
            } else {
              // Add new item
              const cartItem: CartItem = {
                id: result.data.id,
                ...newItem,
              };
              set({ items: [...get().items, cartItem] });
            }
            
            get().calculateTotals();
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to add item' });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          const result = await response.json();
          
          if (result.success) {
            set({ 
              items: get().items.filter(item => item.id !== itemId)
            });
            get().calculateTotals();
          }
        } catch (error) {
          console.error('Error removing item from cart:', error);
          set({ error: 'Failed to remove item' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) {
            throw new Error('Failed to update item quantity');
          }

          const result = await response.json();
          
          if (result.success) {
            const updatedItems = get().items.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            );
            set({ items: updatedItems });
            get().calculateTotals();
          }
        } catch (error) {
          console.error('Error updating item quantity:', error);
          set({ error: 'Failed to update quantity' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

          const result = await response.json();
          
          if (result.success) {
            set({ items: [], totalItems: 0, totalPrice: 0 });
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ error: 'Failed to clear cart' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart');
          
          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }

          const result = await response.json();
          
          if (result.success) {
            set({ items: result.data });
            get().calculateTotals();
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ error: 'Failed to fetch cart' });
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      calculateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
        
        set({ totalItems, totalPrice });
      },
    }),
    {
      name: 'cart-storage',
      // Only persist the items, not loading states
      partialize: (state) => ({ items: state.items }),
      // Rehydrate totals after loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateTotals();
        }
      },
    }
  )
); 
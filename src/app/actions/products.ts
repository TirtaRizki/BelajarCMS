
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (API)');
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['products'] },
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to fetch products." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction for', newProductData.name);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProductData),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to add product." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Add Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction for ID', productId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update product." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction for ID', productId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 204 || response.status === 200) {
        const text = await response.text();
        try {
            const result = text ? JSON.parse(text) : {};
             if (result.success === false) {
                 return { success: false, error: result.message || "Deletion failed."};
             }
        } catch(e) {}
        return { success: true };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to delete product." };
    }
    return { success: true };
  } catch (error) {
    console.error('Delete Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

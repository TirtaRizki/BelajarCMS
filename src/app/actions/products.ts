
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction');
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch Products failed:', errorText);
        return { success: false, error: `The server returned an unexpected response (Status: ${response.status}).` };
    }
    
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to fetch products." };
    }
    
    // The API wraps the data in a `data` property
    const products: ProductItem[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    }));

    return { success: true, data: products };
  } catch (error) {
    console.error('Fetch Products Error:', error);
    if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
        return { success: false, error: `Could not connect to the backend at ${API_BASE_URL}. Is the backend server running?` };
    }
    return { success: false, error: 'An unexpected error occurred while fetching products.' };
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
    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Failed to add product." };
    }

    revalidatePath('/dashboard/products');
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
    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Failed to update product." };
    }
    
    revalidatePath('/dashboard/products');
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
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
       const result = await response.json().catch(() => ({ message: 'Failed to delete product.' }));
       return { success: false, error: result.message };
    }
    
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Delete Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

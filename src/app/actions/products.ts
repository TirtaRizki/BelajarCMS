
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL;

async function handleApiResponse<T>(response: Response): Promise<ServerActionResponse<T>> {
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('API call failed with non-JSON response:', errorText);
        const errorMessage = `The server returned an unexpected response (Status: ${response.status}). Please check the backend server logs.`;
        return { success: false, error: errorMessage };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || 'An unknown API error occurred.' };
    }
    
    // The API wraps data in a 'data' property. Let's normalize it.
    const responseData = result.data;
    
    // The product endpoints return a slightly different structure. Let's normalize here.
    const normalizedData = Array.isArray(responseData) 
        ? responseData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }))
        : {
            id: responseData.id,
            name: responseData.name,
            price: responseData.price,
            description: responseData.description,
            image: responseData.image,
            category: responseData.category,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        };

    return { success: true, data: normalizedData as T };
}

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (Real API)');
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store', // Ensure fresh data on every fetch
    });
    return await handleApiResponse<ProductItem[]>(response);
  } catch (error) {
     if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
        return { success: false, error: `Could not connect to the backend at ${API_BASE_URL}. Is the backend server running?` };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction (Real API) for', newProductData.name);
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

    const result = await handleApiResponse<ProductItem>(response);
    if(result.success) {
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/analytics');
    }
    return result;
  } catch (error) {
    console.error('Add Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction (Real API) for ID', productId);
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

    const result = await handleApiResponse<ProductItem>(response);
    if(result.success) {
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/analytics');
    }
    return result;
  } catch (error) {
    console.error('Update Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction (Real API) for ID', productId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    // Delete might not return a JSON body, so handle differently
    if(response.ok) {
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/analytics');
        return { success: true };
    } else {
        const errorText = await response.text();
        console.error('Delete failed with response:', errorText);
        const errorMessage = `The server returned an unexpected response (Status: ${response.status}).`;
        return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

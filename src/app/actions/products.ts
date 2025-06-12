
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';

let mockProductStore: ProductItem[] = []; 

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockProductStore].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction for', newProductData.name);
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const productToSave: ProductItem = {
    ...newProductData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockProductStore.unshift(productToSave);
  console.log('Server Action: product added successfully for', newProductData.name);
  return { success: true, data: productToSave };
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction for ID', productId, 'with updates:', updates);
  await new Promise(resolve => setTimeout(resolve, 50));

  const itemIndex = mockProductStore.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    return { success: false, error: "Product not found." };
  }
  
  mockProductStore[itemIndex] = { 
    ...mockProductStore[itemIndex], 
    ...updates, 
    updatedAt: new Date() 
  };
  
  console.log('Server Action: product update successful for', productId);
  return { success: true, data: mockProductStore[itemIndex] };
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction for ID', productId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockProductStore.length;
  mockProductStore = mockProductStore.filter(item => item.id !== productId);
  
  if (mockProductStore.length === initialLength) {
     return { success: false, error: "Product not found for deletion." };
  }
  
  console.log('Server Action: product deletion successful for', productId);
  return { success: true };
}

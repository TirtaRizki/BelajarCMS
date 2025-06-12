
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';

// let mockProductStore: ProductItem[] = []; // In-memory store for demo

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
  // return { success: true, data: mockProductStore };
  // For a fresh start or client-side demo, return empty or some defaults
  const defaultProducts: ProductItem[] = [
    // {
    //   id: crypto.randomUUID(),
    //   name: "Keripik Pisang Pedas",
    //   price: 12000,
    //   description: "Keripik pisang dengan rasa pedas mantap.",
    //   imageUrl: "https://placehold.co/600x400.png",
    //   category: "Keripik Pisang",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    //   updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    // },
    // {
    //   id: crypto.randomUUID(),
    //   name: "Keripik Singkong Original",
    //   price: 10000,
    //   description: "Rasa original singkong yang renyah.",
    //   imageUrl: "https://placehold.co/600x400.png",
    //   category: "Keripik Singkong",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    //   updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    // }
  ];
  // mockProductStore = defaultProducts; // Initialize if empty
  return { success: true, data: defaultProducts };
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
  
  // mockProductStore.unshift(productToSave);
  console.log('Server Action: product added successfully for', newProductData.name);
  return { success: true, data: productToSave };
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction for ID', productId, 'with updates:', updates);
  await new Promise(resolve => setTimeout(resolve, 50));

  // const itemIndex = mockProductStore.findIndex(item => item.id === productId);
  // if (itemIndex === -1) {
  //   return { success: false, error: "Product not found." };
  // }
  // mockProductStore[itemIndex] = { 
  //   ...mockProductStore[itemIndex], 
  //   ...updates, 
  //   updatedAt: new Date() 
  // };
  // return { success: true, data: mockProductStore[itemIndex] };

  // Mock update
  const mockUpdatedProduct: ProductItem = {
    id: productId,
    name: updates.name || `Product ${productId.substring(0,4)}`,
    price: updates.price || 0,
    description: updates.description,
    imageUrl: updates.imageUrl || `https://placehold.co/600x400.png?text=Product`,
    category: updates.category || 'Uncategorized',
    createdAt: new Date(Date.now() - 1000000), // Keep original or fetch
    updatedAt: new Date() 
  };
  return { success: true, data: mockUpdatedProduct };
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction for ID', productId);
  await new Promise(resolve => setTimeout(resolve, 50));

  // const initialLength = mockProductStore.length;
  // mockProductStore = mockProductStore.filter(item => item.id !== productId);
  // if (mockProductStore.length === initialLength) {
  //    return { success: false, error: "Product not found." };
  // }
  
  console.log('Server Action: product deletion successful for', productId);
  return { success: true };
}


'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

// Mock in-memory store for products. This will reset on server restart.
let mockProductStore: ProductItem[] = [
    {
        id: 'prod_1',
        name: 'Keripik Pisang Original',
        price: 15000,
        description: 'Rasa original yang renyah dan gurih, dibuat dari pisang pilihan.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
    },
    {
        id: 'prod_2',
        name: 'Keripik Singkong Balado',
        price: 18000,
        description: 'Pedas manis bumbu balado yang meresap sempurna.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
    },
    {
        id: 'prod_3',
        name: 'Basreng Pedas Daun Jeruk',
        price: 22000,
        description: 'Bakso goreng renyah dengan aroma daun jeruk yang khas.',
        image: 'https://placehold.co/600x400.png',
        category: 'Cemilan Kering',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

// Helper to sort products by creation date
const sortProducts = () => {
    mockProductStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
sortProducts();


export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (Mock)');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockProductStore] };
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction (Mock) for', newProductData.name);
  await new Promise(resolve => setTimeout(resolve, 50));

  const newProduct: ProductItem = {
    ...newProductData,
    id: `prod_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockProductStore.unshift(newProduct);
  sortProducts();

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');

  return { success: true, data: newProduct };
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction (Mock) for ID', productId);
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const productIndex = mockProductStore.findIndex(p => String(p.id) === productId);

  if (productIndex === -1) {
    return { success: false, error: "Product not found." };
  }
  
  mockProductStore[productIndex] = {
    ...mockProductStore[productIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');

  return { success: true, data: mockProductStore[productIndex] };
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction (Mock) for ID', productId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockProductStore.length;
  mockProductStore = mockProductStore.filter(p => String(p.id) !== productId);

  if (mockProductStore.length === initialLength) {
    return { success: false, error: "Product not found for deletion." };
  }

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');

  return { success: true };
}

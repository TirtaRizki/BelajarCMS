
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ProductItem } from '@/types';
import { ProductForm } from './ProductForm'; 
import { ProductCard } from './ProductCard'; 
import { EditProductModal } from './EditProductModal';
import { PackageSearch, Loader2, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchProductsAction, addProductAction, updateProductAction, deleteProductAction } from '@/app/actions/products';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';

const MOCK_PRODUCTS: ProductItem[] = [
    {
        id: 99901,
        name: 'Keripik Pisang Original (Contoh)',
        price: 15000,
        description: 'Rasa original yang renyah dan gurih, dibuat dari pisang pilihan.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
    },
    {
        id: 99902,
        name: 'Keripik Singkong Balado (Contoh)',
        price: 12000,
        description: 'Pedas manisnya pas, bikin nagih!',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
    },
];

export function ProductManagementClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { backendOnline } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    if (!backendOnline) {
        console.warn("Backend offline. Loading mock products.");
        setProducts(MOCK_PRODUCTS);
        setIsLoading(false);
        return;
    }
    const response = await fetchProductsAction();
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      toast({ title: "Error", description: response.error || "Could not load products.", variant: "destructive" });
      setProducts(MOCK_PRODUCTS); // Fallback to mock data on error
    }
    setIsLoading(false);
  }, [toast, backendOnline]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductAdded = async (newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsProcessing(true);
    const response = await addProductAction(newProductData);
    if (response.success && response.data) {
       toast({
        title: "Product Added",
        description: `"${response.data.name}" has been added to the catalog.`,
      });
      await loadProducts(); // Reload all products to get the latest state
    } else {
      toast({ title: "Add Error", description: response.error || "Could not add product.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (productId: number, updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setIsProcessing(true);
    const response = await updateProductAction(productId, updates);
    if (response.success && response.data) {
      toast({
        title: "Product Updated",
        description: `Details for "${response.data.name}" have been updated.`,
      });
      await loadProducts(); // Reload all
    } else {
       toast({ title: "Update Error", description: response.error || "Could not update product details.", variant: "destructive" });
    }
    setIsProcessing(false);
    setIsEditModalOpen(false);
  };
  
  const handleDeleteProduct = async (productId: number) => {
    setIsProcessing(true);
    const response = await deleteProductAction(productId);
    if (response.success) {
      toast({ title: "Product Deleted", description: "The product has been successfully deleted." });
      await loadProducts(); // Reload all
    } else {
      toast({ title: "Delete Error", description: response.error || "Could not delete product.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto px-0">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      
      {!backendOnline && (
        <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Backend Offline</AlertTitle>
            <AlertDescription>
                The application could not connect to the backend. You are currently in offline mode. Any changes made will not be saved.
            </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <ProductForm onProductAdded={handleProductAdded} isProcessing={isProcessing || !backendOnline} />
        </div>
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-2">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
             <Alert>
                <PackageSearch className="h-4 w-4" />
                <AlertTitle>No Products Yet</AlertTitle>
                <AlertDescription>
                    Your product catalog is empty. Add your first product using the form.
                </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteProduct}
                  isProcessing={isProcessing || !backendOnline}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          product={editingProduct}
          onSave={handleUpdateProduct}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

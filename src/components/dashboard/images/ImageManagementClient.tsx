
"use client";

import { useState, useEffect } from 'react';
import type { ImageItem } from '@/types';
import { ImageUploadForm } from './ImageUploadForm';
import { ImageCard } from './ImageCard';
import { EditImagePriceModal } from './EditImagePriceModal';
import { ImageIcon, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

const IMAGE_STORAGE_KEY = 'nextadminlite_images';

export function ImageManagementClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedImages = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages).map((img: ImageItem) => ({
          ...img,
          uploadedAt: new Date(img.uploadedAt) 
        }));
        setImages(parsedImages);
      }
    } catch (error) {
      console.error("Failed to load images from localStorage:", error);
       toast({ title: "Loading Error", description: "Could not load image data from local storage.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
      } catch (error) {
        console.error("Failed to save images to localStorage:", error);
        toast({ title: "Storage Error", description: "Could not save image data.", variant: "destructive" });
      }
    }
  }, [images, isClient, toast]);

  const handleImageUploaded = (newImage: ImageItem) => {
    setImages((prevImages) => [newImage, ...prevImages].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
  };

  const handleOpenEditPriceModal = (image: ImageItem) => {
    setEditingImage(image);
    setIsEditPriceModalOpen(true);
  };

  const handleUpdateImagePrice = (imageId: string, newPrice: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, price: newPrice } : img
      )
    );
  };
  
  const handleDeleteImage = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    toast({ title: "Image Deleted", description: "The image has been successfully deleted." });
  };

  if (!isClient) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
      <h1 className="text-3xl font-bold mb-6">Image Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <ImageUploadForm onImageUploaded={handleImageUploaded} />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Demo Information</AlertTitle>
            <AlertDescription>
              Uploaded data is stored in your browser's local storage and will persist on this device. No data is sent to a server.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-2">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Images Yet</h2>
              <p className="text-muted-foreground">Upload your first image using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((image) => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  onEditPrice={handleOpenEditPriceModal}
                  onDeleteImage={handleDeleteImage} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingImage && (
        <EditImagePriceModal
          isOpen={isEditPriceModalOpen}
          onOpenChange={setIsEditPriceModalOpen}
          image={editingImage}
          onSave={handleUpdateImagePrice}
        />
      )}
    </div>
  );
}

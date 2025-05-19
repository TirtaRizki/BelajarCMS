
"use client";

import { useState, useEffect } from 'react';
import type { ImageItem, ServerActionResponse } from '@/types';
import { ImageUploadForm } from '../ImageUploadForm'; 
import { ImageCard } from '../ImageCard'; 
import { EditImagePriceModal } from '../EditImagePriceModal';
import { ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchImagesAction, uploadImageAction, updateImagePriceAction, deleteImageAction } from '@/app/actions/images';

export function ImageManagementClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [isProcessing, setIsProcessing] = useState(false); // For CUD operations
  const { toast } = useToast();

  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const response = await fetchImagesAction();
      if (response.success && response.data) {
        setImages(response.data.map(img => ({...img, uploadedAt: new Date(img.uploadedAt)})));
      } else {
        toast({ title: "Error", description: response.error || "Could not load images.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    loadImages();
  }, [toast]);

  const handleImageUploaded = async (newImageDraft: Omit<ImageItem, 'id'|'uploadedAt'>) => {
    setIsProcessing(true);
    const response = await uploadImageAction(newImageDraft);
    if (response.success && response.data) {
      setImages((prevImages) => [response.data!, ...prevImages].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
       toast({
        title: "Image Uploaded",
        description: `${response.data.name} has been uploaded. Price can be set from the image card.`,
      });
    } else {
      toast({ title: "Upload Error", description: response.error || "Could not upload image.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const handleOpenEditPriceModal = (image: ImageItem) => {
    setEditingImage(image);
    setIsEditPriceModalOpen(true);
  };

  const handleUpdateImagePrice = async (imageId: string, newPrice: string) => {
    setIsProcessing(true);
    const response = await updateImagePriceAction(imageId, newPrice);
    if (response.success && response.data) {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, price: newPrice, uploadedAt: new Date(response.data!.uploadedAt) } : img
        )
      );
      toast({
        title: "Price Updated",
        description: `Price for ${response.data.name} has been updated.`,
      });
    } else {
       toast({ title: "Update Error", description: response.error || "Could not update price.", variant: "destructive" });
    }
    setIsProcessing(false);
    setIsEditPriceModalOpen(false);
  };
  
  const handleDeleteImage = async (imageId: string) => {
    setIsProcessing(true);
    const response = await deleteImageAction(imageId);
    if (response.success) {
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
      toast({ title: "Image Deleted", description: "The image has been successfully deleted." });
    } else {
      toast({ title: "Delete Error", description: response.error || "Could not delete image.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
      <h1 className="text-3xl font-bold mb-6">Image Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <ImageUploadForm onImageUploaded={handleImageUploaded} isProcessing={isProcessing} />
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
                  isProcessing={isProcessing}
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
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

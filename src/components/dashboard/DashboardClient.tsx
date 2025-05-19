
"use client";

import { useState, useEffect } from 'react';
import type { ImageItem } from '@/types';
import { ImageUploadForm } from './ImageUploadForm';
import { ImageCard } from './ImageCard';
import { ImageIcon, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const IMAGE_STORAGE_KEY = 'nextadminlite_images';

export function DashboardClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedImages = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (storedImages) {
        // Parse and ensure dates are Date objects
        const parsedImages = JSON.parse(storedImages).map((img: ImageItem) => ({
          ...img,
          uploadedAt: new Date(img.uploadedAt) 
        }));
        setImages(parsedImages);
      }
    } catch (error) {
      console.error("Failed to load images from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) { // Only run on client after initial mount
      try {
        localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
      } catch (error) {
        console.error("Failed to save images to localStorage:", error);
      }
    }
  }, [images, isClient]);

  const handleImageUploaded = (newImage: ImageItem) => {
    setImages((prevImages) => [newImage, ...prevImages]); // Add new image to the top
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-24"> {/* Make upload form sticky on larger screens */}
          <ImageUploadForm onImageUploaded={handleImageUploaded} />
           <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Demo Information</AlertTitle>
            <AlertDescription>
              Uploaded images and data are stored in your browser's local storage and will persist on this device. No data is sent to a server.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-2">
          {images.length === 0 && isClient ? (
            <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Images Yet</h2>
              <p className="text-muted-foreground">Upload your first image using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}
          {!isClient && ( // Skeleton or loading state for SSR/initial load
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                    <Card key={i} className="shadow-lg h-full flex flex-col">
                        <CardHeader className="p-0">
                            <div className="relative w-full aspect-[16/10] bg-muted/50 animate-pulse"></div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                            <div className="h-6 bg-muted/50 rounded w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-8 bg-muted/50 rounded w-1/4 mb-3 animate-pulse"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/2 mb-1 animate-pulse"></div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse"></div>
                                <div className="h-6 w-20 bg-muted/50 rounded-full animate-pulse"></div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30 border-t">
                            <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

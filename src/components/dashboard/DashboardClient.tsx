
"use client";

import { useState, useEffect } from 'react';
import type { ImageItem, TestimonialItem } from '@/types';
import { ImageUploadForm } from './ImageUploadForm';
import { ImageCard } from './ImageCard';
import { EditImagePriceModal } from './EditImagePriceModal';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialCard } from './TestimonialCard';
import { ImageIcon, Info, MessageSquareIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IMAGE_STORAGE_KEY = 'nextadminlite_images';
const TESTIMONIAL_STORAGE_KEY = 'nextadminlite_testimonials';

export function DashboardClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isClient, setIsClient] = useState(false);

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

      const storedTestimonials = localStorage.getItem(TESTIMONIAL_STORAGE_KEY);
      if (storedTestimonials) {
        const parsedTestimonials = JSON.parse(storedTestimonials).map((item: TestimonialItem) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setTestimonials(parsedTestimonials);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
      } catch (error) {
        console.error("Failed to save images to localStorage:", error);
      }
    }
  }, [images, isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(TESTIMONIAL_STORAGE_KEY, JSON.stringify(testimonials));
      } catch (error) {
        console.error("Failed to save testimonials to localStorage:", error);
      }
    }
  }, [testimonials, isClient]);

  const handleImageUploaded = (newImage: ImageItem) => {
    setImages((prevImages) => [newImage, ...prevImages]);
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

  const handleTestimonialAdded = (newTestimonial: TestimonialItem) => {
    setTestimonials((prevTestimonials) => [newTestimonial, ...prevTestimonials]);
  };

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="images">Image Management</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonial Management</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <ImageUploadForm onImageUploaded={handleImageUploaded} />
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Demo Information</AlertTitle>
                <AlertDescription>
                  Uploaded data is stored in your browser's local storage and will persist on this device. No data is sent to a server.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="lg:col-span-2">
              {images.length === 0 && isClient ? (
                <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">No Images Yet</h2>
                  <p className="text-muted-foreground">Upload your first image using the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.map((image) => (
                    <ImageCard key={image.id} image={image} onEditPrice={handleOpenEditPriceModal} />
                  ))}
                </div>
              )}
              {!isClient && (
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
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <TestimonialForm onTestimonialAdded={handleTestimonialAdded} />
            </div>
            <div className="lg:col-span-2">
              {testimonials.length === 0 && isClient ? (
                <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
                  <MessageSquareIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">No Testimonials Yet</h2>
                  <p className="text-muted-foreground">Add your first testimonial using the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </div>
              )}
               {!isClient && ( // Skeleton for testimonials
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1,2].map(i => (
                        <Card key={i} className="shadow-lg h-full flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="h-6 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="h-4 bg-muted/50 rounded w-full mb-2 animate-pulse"></div>
                                <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                            </CardContent>
                            <CardFooter className="p-4 bg-muted/30 border-t">
                                <div className="h-4 bg-muted/50 rounded w-1/3 animate-pulse"></div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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

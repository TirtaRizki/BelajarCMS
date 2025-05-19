
"use client";

import { useState, useEffect } from 'react';
import type { ImageItem, TestimonialItem } from '@/types';
import { ImageUploadForm } from './ImageUploadForm';
import { ImageCard } from './ImageCard';
import { EditImagePriceModal } from './EditImagePriceModal';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialCard } from './TestimonialCard';
import { EditTestimonialModal } from './EditTestimonialModal'; // New Import
import { ImageIcon, Info, MessageSquareIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const IMAGE_STORAGE_KEY = 'nextadminlite_images';
const TESTIMONIAL_STORAGE_KEY = 'nextadminlite_testimonials';

export function DashboardClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);


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
       toast({ title: "Loading Error", description: "Could not load data from local storage.", variant: "destructive" });
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

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(TESTIMONIAL_STORAGE_KEY, JSON.stringify(testimonials));
      } catch (error) {
        console.error("Failed to save testimonials to localStorage:", error);
        toast({ title: "Storage Error", description: "Could not save testimonial data.", variant: "destructive" });
      }
    }
  }, [testimonials, isClient, toast]);

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


  const handleTestimonialAdded = (newTestimonial: TestimonialItem) => {
    setTestimonials((prevTestimonials) => [newTestimonial, ...prevTestimonials].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleOpenEditTestimonialModal = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setIsEditTestimonialModalOpen(true);
  };

  const handleUpdateTestimonial = (testimonialId: string, newAuthor: string, newQuote: string) => {
    setTestimonials((prevTestimonials) =>
      prevTestimonials.map((item) =>
        item.id === testimonialId ? { ...item, author: newAuthor, quote: newQuote } : item
      )
    );
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    setTestimonials((prevTestimonials) => prevTestimonials.filter((item) => item.id !== testimonialId));
    toast({ title: "Testimonial Deleted", description: "The testimonial has been successfully deleted." });
  };


  if (!isClient) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="images">Image Management</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonial Management</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
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
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <TestimonialForm onTestimonialAdded={handleTestimonialAdded} />
            </div>
            <div className="lg:col-span-2">
              {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
                  <MessageSquareIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">No Testimonials Yet</h2>
                  <p className="text-muted-foreground">Add your first testimonial using the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard 
                        key={testimonial.id} 
                        testimonial={testimonial} 
                        onEditTestimonial={handleOpenEditTestimonialModal}
                        onDeleteTestimonial={handleDeleteTestimonial}
                    />
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

      {editingTestimonial && (
        <EditTestimonialModal
          isOpen={isEditTestimonialModalOpen}
          onOpenChange={setIsEditTestimonialModalOpen}
          testimonial={editingTestimonial}
          onSave={handleUpdateTestimonial}
        />
      )}
    </div>
  );
}

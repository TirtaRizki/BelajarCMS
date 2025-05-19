
"use client";

import { useState, useEffect } from 'react';
import type { TestimonialItem } from '@/types';
import { TestimonialForm } from '../TestimonialForm'; // Corrected import path
import { TestimonialCard } from '../TestimonialCard'; // Corrected import path
import { EditTestimonialModal } from '../EditTestimonialModal'; // Corrected import path
import { MessageSquareIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TESTIMONIAL_STORAGE_KEY = 'nextadminlite_testimonials';

export function TestimonialManagementClient() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedTestimonials = localStorage.getItem(TESTIMONIAL_STORAGE_KEY);
      if (storedTestimonials) {
        const parsedTestimonials = JSON.parse(storedTestimonials).map((item: TestimonialItem) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setTestimonials(parsedTestimonials);
      }
    } catch (error) {
      console.error("Failed to load testimonials from localStorage:", error);
       toast({ title: "Loading Error", description: "Could not load testimonial data.", variant: "destructive" });
    }
  }, [toast]);

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
    <div className="container mx-auto px-0">
      <h1 className="text-3xl font-bold mb-6">Testimonial Management</h1>
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

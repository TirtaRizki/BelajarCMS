
'use server';

import type { TestimonialItem, ServerActionResponse } from '@/types';

let mockTestimonialStore: TestimonialItem[] = [];

export async function fetchTestimonialsAction(): Promise<ServerActionResponse<TestimonialItem[]>> {
  console.log('Server Action: fetchTestimonialsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockTestimonialStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function addTestimonialAction(
  newTestimonial: Omit<TestimonialItem, 'id' | 'createdAt'> & { createdAt?: Date }
): Promise<ServerActionResponse<TestimonialItem>> {
  console.log('Server Action: addTestimonialAction for author', newTestimonial.author);
  await new Promise(resolve => setTimeout(resolve, 50)); 

  const testimonialToSave: TestimonialItem = {
    ...newTestimonial,
    id: crypto.randomUUID(),
    createdAt: newTestimonial.createdAt || new Date(),
  };

  mockTestimonialStore.unshift(testimonialToSave);
  
  console.log('Server Action: testimonial added successfully for', newTestimonial.author);
  return { success: true, data: testimonialToSave };
}

export async function updateTestimonialAction(
  testimonialId: string,
  updates: Pick<TestimonialItem, 'author' | 'quote'>
): Promise<ServerActionResponse<TestimonialItem>> {
  console.log('Server Action: updateTestimonialAction for ID', testimonialId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const testimonialIndex = mockTestimonialStore.findIndex(t => t.id === testimonialId);
  if (testimonialIndex === -1) {
    return { success: false, error: "Testimonial not found or not authorized."};
  }
  
  mockTestimonialStore[testimonialIndex] = { 
    ...mockTestimonialStore[testimonialIndex], 
    ...updates, 
    // createdAt: new Date(mockTestimonialStore[testimonialIndex].createdAt) // Keep original createdAt
  };
  
  console.log('Server Action: testimonial update successful for', testimonialId);
  return { success: true, data: mockTestimonialStore[testimonialIndex] };
}

export async function deleteTestimonialAction(testimonialId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteTestimonialAction for ID', testimonialId);
  await new Promise(resolve => setTimeout(resolve, 50)); 

  const initialLength = mockTestimonialStore.length;
  mockTestimonialStore = mockTestimonialStore.filter(t => t.id !== testimonialId);
  
  if (mockTestimonialStore.length === initialLength) {
     return { success: false, error: "Testimonial not found for deletion." };
  }
  
  console.log('Server Action: testimonial deletion successful for', testimonialId);
  return { success: true };
}

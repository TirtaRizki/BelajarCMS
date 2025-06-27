
'use server';

import type { TestimonialItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchTestimonialsAction(): Promise<ServerActionResponse<TestimonialItem[]>> {
  console.log('Server Action: fetchTestimonialsAction (API)');
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['testimonials'] },
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to fetch testimonials." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch Testimonials Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function addTestimonialAction(
  newTestimonial: Omit<TestimonialItem, 'id' | 'createdAt'>
): Promise<ServerActionResponse<TestimonialItem>> {
  console.log('Server Action: addTestimonialAction for author', newTestimonial.author);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newTestimonial),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to add testimonial." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Add Testimonial Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateTestimonialAction(
  testimonialId: string,
  updates: Pick<TestimonialItem, 'author' | 'quote'>
): Promise<ServerActionResponse<TestimonialItem>> {
  console.log('Server Action: updateTestimonialAction for ID', testimonialId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update testimonial." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteTestimonialAction(testimonialId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteTestimonialAction for ID', testimonialId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 204 || response.status === 200) {
        const text = await response.text();
        try {
            const result = text ? JSON.parse(text) : {};
             if (result.success === false) {
                 return { success: false, error: result.message || "Deletion failed."};
             }
        } catch(e) {}
        return { success: true };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to delete testimonial." };
    }
    return { success: true };
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

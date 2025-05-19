
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import type { ImageItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { DollarSign, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditImagePriceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  image: ImageItem | null;
  onSave: (imageId: string, newPrice: string) => void;
}

export function EditImagePriceModal({ isOpen, onOpenChange, image, onSave }: EditImagePriceModalProps) {
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (image) {
      setPrice(image.price === "Not set" ? '' : image.price);
    }
  }, [image]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image) return;

    if (!price.trim()) {
      toast({
        title: "Price required",
        description: "Please enter a price for the image.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(image.id, price);
    setIsLoading(false);
    onOpenChange(false);
    toast({
      title: "Price Updated",
      description: `Price for ${image.name} has been updated to ${price}.`,
    });
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Price for {image.name}</DialogTitle>
          <DialogDescription>
            Set or update the price for this image. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="price" className="flex items-center mb-1">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Price
            </Label>
            <Input
              id="price"
              type="text"
              placeholder="e.g., $19.99 or 25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Price
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

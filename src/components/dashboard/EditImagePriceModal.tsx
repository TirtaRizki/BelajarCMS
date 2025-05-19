
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
import { Loader2, XCircle } from 'lucide-react'; // DollarSign removed
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

    const numericPrice = price.trim().replace(/[^0-9]/g, ''); // Keep only numbers
    const finalPrice = numericPrice === '' ? "Not set" : numericPrice;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(image.id, finalPrice);
    setIsLoading(false);
    onOpenChange(false);
    toast({
      title: "Price Updated",
      description: `Price for ${image.name} has been updated to ${finalPrice === "Not set" ? "Not set" : `Rp ${Number(finalPrice).toLocaleString('id-ID')}`}.`,
    });
  };

  const handleRemovePrice = async () => {
    if (!image) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(image.id, "Not set");
    setIsLoading(false);
    onOpenChange(false);
    toast({
      title: "Price Removed",
      description: `Price for ${image.name} has been set to "Not set".`,
    });
  }

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Price for {image.name}</DialogTitle>
          <DialogDescription>
            Set or update the price in IDR (e.g., 150000). Leave blank to mark as "Not set".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="price" className="flex items-center mb-1">
              <span className="mr-2 text-muted-foreground">Rp</span>
              Price (IDR)
            </Label>
            <Input
              id="price"
              type="text" 
              inputMode="numeric"
              placeholder="e.g., 150000"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers or empty string
                if (/^\d*$/.test(value)) {
                  setPrice(value);
                }
              }}
            />
          </div>
          <DialogFooter className="sm:justify-between">
            {image.price !== "Not set" && price.trim() !== "" ? ( 
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="gap-1" disabled={isLoading}>
                    <XCircle className="h-4 w-4" /> Remove Price
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Price?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will set the price for "{image.name}" to "Not set". Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemovePrice} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Removal
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : <div></div>}
            
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Price
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

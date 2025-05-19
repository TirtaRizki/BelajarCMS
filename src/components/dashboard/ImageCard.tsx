
"use client";

import NextImage from 'next/image'; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ImageItem } from '@/types';
import { CalendarDays, Pencil, Trash2, Loader2 } from 'lucide-react'; 
import { format } from 'date-fns';
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
import type React from 'react';

interface ImageCardProps {
  image: ImageItem;
  onEditPrice: (image: ImageItem) => void;
  onDeleteImage: (imageId: string) => void;
  isProcessing: boolean; // To disable buttons during operations
}

function formatPrice(price: string) {
  if (price === "Not set" || price === null || price === undefined) return "Price not set";
  const number = parseFloat(price);
  if (isNaN(number)) return "Invalid price";
  return `Rp ${number.toLocaleString('id-ID')}`;
}

export function ImageCard({ image, onEditPrice, onDeleteImage, isProcessing }: ImageCardProps) {
  const isPriceSet = image.price && image.price !== "Not set";

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onDeleteImage(image.id);
  };

  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/10] bg-muted">
          <NextImage 
            src={image.dataUri} 
            alt={image.name} 
            layout="fill" 
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={image.name}>{image.name}</CardTitle>
        
        <div className="flex items-center justify-between mb-2">
          {isPriceSet ? (
            <div className="text-primary font-semibold text-xl">
              {formatPrice(image.price)}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Price not set</p>
          )}
           <Button variant="outline" size="sm" onClick={() => onEditPrice(image)} className="gap-1" disabled={isProcessing}>
            {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
            <Pencil className="h-3 w-3" />
            {isPriceSet ? 'Edit Price' : 'Set Price'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          Uploaded: {image.uploadedAt ? format(new Date(image.uploadedAt), "MMM dd, yyyy HH:mm") : 'N/A'}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1" disabled={isProcessing}>
              {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the image "{image.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Image
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

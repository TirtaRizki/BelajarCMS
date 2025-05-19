
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ImageItem } from '@/types';
import { DollarSign, Tag, CalendarDays, Pencil } from 'lucide-react';
import { format } from 'date-fns';

interface ImageCardProps {
  image: ImageItem;
  onEditPrice: (image: ImageItem) => void;
}

export function ImageCard({ image, onEditPrice }: ImageCardProps) {
  const isPriceSet = image.price && image.price !== "Not set";

  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/10] bg-muted">
          <Image 
            src={image.dataUri} 
            alt={image.name} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="product photography" 
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={image.name}>{image.name}</CardTitle>
        
        <div className="flex items-center justify-between mb-2">
          {isPriceSet ? (
            <div className="flex items-center text-primary font-semibold text-xl">
              <DollarSign className="mr-1 h-5 w-5" />
              {image.price}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Price not set</p>
          )}
           <Button variant="outline" size="sm" onClick={() => onEditPrice(image)} className="gap-1">
            <Pencil className="h-3 w-3" />
            {isPriceSet ? 'Edit Price' : 'Set Price'}
          </Button>
        </div>

        <div className="mb-3">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Tag className="mr-2 h-4 w-4" />
            AI Generated Tags:
          </div>
          {image.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {image.tags.slice(0, 5).map((tag) => ( // Show up to 5 tags
                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
              ))}
              {image.tags.length > 5 && <Badge variant="outline">+{image.tags.length - 5} more</Badge>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No tags generated.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          Uploaded: {format(new Date(image.uploadedAt), "MMM dd, yyyy HH:mm")}
        </div>
      </CardFooter>
    </Card>
  );
}


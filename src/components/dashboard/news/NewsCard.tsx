
"use client";

import NextImage from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsItem } from '@/types';
import { CalendarDays, Pencil, Trash2, ImageOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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

interface NewsCardProps {
  newsItem: NewsItem;
  onEditNews: (newsItem: NewsItem) => void;
  onDeleteNews: (newsId: string) => void;
  isProcessing: boolean;
}

export function NewsCard({ newsItem, onEditNews, onDeleteNews, isProcessing }: NewsCardProps) {

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteNews(newsItem.id);
  };

  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col">
      {newsItem.imageUrl ? (
        <CardHeader className="p-0">
          <div className="relative w-full aspect-[16/9] bg-muted">
            <NextImage 
              src={newsItem.imageUrl} 
              alt={newsItem.title} 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="news article"
            />
          </div>
        </CardHeader>
      ) : (
        <CardHeader className="p-4 bg-muted flex flex-row items-center justify-center aspect-[16/9]">
            <ImageOff className="h-12 w-12 text-muted-foreground" />
        </CardHeader>
      )}
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{newsItem.category}</Badge>
        <CardTitle className="text-xl mb-2">{newsItem.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {newsItem.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t flex flex-col items-start space-y-3">
        <div className="flex items-center text-xs text-muted-foreground w-full justify-between">
            <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                Published: {newsItem.publishedAt ? format(new Date(newsItem.publishedAt), "MMM dd, yyyy") : 'N/A'}
            </div>
             <Badge variant="outline">ID: {newsItem.id.substring(0,6)}...</Badge>
        </div>
        <div className="w-full flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEditNews(newsItem)} className="gap-1" disabled={isProcessing}>
            {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1" disabled={isProcessing}>
                {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the news item "{newsItem.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
                   {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete News Item
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TestimonialItem } from '@/types';
import { CalendarDays, Quote as QuoteIcon, User } from 'lucide-react';
import { format } from 'date-fns';

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{testimonial.author}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow relative">
        <QuoteIcon className="absolute top-0 left-0 h-8 w-8 text-muted-foreground/30 transform -translate-x-2 -translate-y-2" />
        <p className="text-muted-foreground italic leading-relaxed pl-4 border-l-2 border-primary/50">
          {testimonial.quote}
        </p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          Added: {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
        </div>
      </CardFooter>
    </Card>
  );
}


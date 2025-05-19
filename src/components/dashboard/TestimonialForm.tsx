
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { TestimonialItem } from '@/types';
import { MessageSquare, Loader2, User, Quote as QuoteIcon } from 'lucide-react';

interface TestimonialFormProps {
  onTestimonialAdded: (testimonial: TestimonialItem) => void;
}

export function TestimonialForm({ onTestimonialAdded }: TestimonialFormProps) {
  const [author, setAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!author.trim() || !quote.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both author and quote for the testimonial.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTestimonial: TestimonialItem = {
      id: crypto.randomUUID(),
      author,
      quote,
      createdAt: new Date(),
    };

    onTestimonialAdded(newTestimonial);
    toast({
      title: "Testimonial Added",
      description: `Testimonial by ${author} has been successfully added.`,
    });

    setAuthor('');
    setQuote('');
    setIsProcessing(false);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MessageSquare className="mr-3 h-7 w-7 text-primary" />
          Add New Testimonial
        </CardTitle>
        <CardDescription>Share a new customer testimonial.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="author" className="flex items-center mb-1">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Author
            </Label>
            <Input
              id="author"
              type="text"
              placeholder="e.g., Jane Doe"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="quote" className="flex items-center mb-1">
                <QuoteIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              Quote
            </Label>
            <Textarea
              id="quote"
              placeholder="Enter the testimonial content here..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full text-base py-3" disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Adding...' : 'Add Testimonial'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

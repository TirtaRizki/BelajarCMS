
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateImageTags, type GenerateImageTagsInput } from '@/ai/flows/generate-image-tags';
import type { ImageItem } from '@/types';
import { UploadCloud, Loader2, Tag, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadFormProps {
  onImageUploaded: (imageItem: ImageItem) => void;
}

export function ImageUploadForm({ onImageUploaded }: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        setFile(null);
        setPreview(null);
        event.target.value = ''; // Reset file input
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !preview) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!price.trim()) {
      toast({
        title: "Price required",
        description: "Please enter a price for the image.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const aiInput: GenerateImageTagsInput = { photoDataUri: preview };
      const aiOutput = await generateImageTags(aiInput);

      const newImageItem: ImageItem = {
        id: crypto.randomUUID(),
        dataUri: preview,
        name: file.name,
        price: price,
        tags: aiOutput.tags,
        uploadedAt: new Date(),
      };
      onImageUploaded(newImageItem);
      toast({
        title: "Image Uploaded",
        description: `${file.name} has been uploaded and tagged successfully.`,
      });
      // Reset form
      setFile(null);
      setPreview(null);
      setPrice('');
      (event.target as HTMLFormElement).reset();

    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing Error",
        description: "Could not process the image or generate tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <UploadCloud className="mr-3 h-7 w-7 text-primary" />
          Upload New Image
        </CardTitle>
        <CardDescription>Add an image, set its price, and let AI generate relevant tags.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="image-upload" className="block text-sm font-medium mb-1">Image File</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif, image/webp"
              onChange={handleFileChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {preview && (
              <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border">
                <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="price" className="flex items-center mb-1">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Price
            </Label>
            <Input
              id="price"
              type="text" // Using text to allow for currency symbols or ranges, though number might be stricter
              placeholder="e.g., $19.99 or 25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full text-base py-3" disabled={isProcessing || !file}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Tag className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Upload & Generate Tags'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

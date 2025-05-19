// src/ai/flows/generate-image-tags.ts
'use server';

/**
 * @fileOverview Image tag generation AI agent.
 *
 * - generateImageTags - A function that handles the image tag generation process.
 * - GenerateImageTagsInput - The input type for the generateImageTags function.
 * - GenerateImageTagsOutput - The return type for the generateImageTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageTagsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate tags for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageTagsInput = z.infer<typeof GenerateImageTagsInputSchema>;

const GenerateImageTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of tags generated for the image.'),
});
export type GenerateImageTagsOutput = z.infer<typeof GenerateImageTagsOutputSchema>;

export async function generateImageTags(input: GenerateImageTagsInput): Promise<GenerateImageTagsOutput> {
  return generateImageTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageTagsPrompt',
  input: {schema: GenerateImageTagsInputSchema},
  output: {schema: GenerateImageTagsOutputSchema},
  prompt: `You are an expert in generating tags for images.

  Given the following image, generate a list of tags that are relevant to the image.

  Image: {{media url=photoDataUri}}
  Tags:`, 
});

const generateImageTagsFlow = ai.defineFlow(
  {
    name: 'generateImageTagsFlow',
    inputSchema: GenerateImageTagsInputSchema,
    outputSchema: GenerateImageTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

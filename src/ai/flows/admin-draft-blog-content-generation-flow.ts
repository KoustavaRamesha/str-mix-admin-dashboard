'use server';
/**
 * @fileOverview An AI agent for generating draft blog post content based on a given topic.
 *
 * - adminDraftBlogContentGeneration - A function that handles the generation of blog post content.
 * - AdminDraftBlogContentGenerationInput - The input type for the adminDraftBlogContentGeneration function.
 * - AdminDraftBlogContentGenerationOutput - The return type for the adminDraftBlogContentGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminDraftBlogContentGenerationInputSchema = z.object({
  topic: z.string().describe('The topic for the blog post.'),
});
export type AdminDraftBlogContentGenerationInput = z.infer<typeof AdminDraftBlogContentGenerationInputSchema>;

const AdminDraftBlogContentGenerationOutputSchema = z.object({
  title: z.string().describe('A catchy title for the blog post.'),
  body: z.string().describe('The full body content of the blog post, formatted in Markdown.'),
  summary: z.string().describe('A brief summary of the blog post content.'),
});
export type AdminDraftBlogContentGenerationOutput = z.infer<typeof AdminDraftBlogContentGenerationOutputSchema>;

export async function adminDraftBlogContentGeneration(input: AdminDraftBlogContentGenerationInput): Promise<AdminDraftBlogContentGenerationOutput> {
  return adminDraftBlogContentGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminDraftBlogContentGenerationPrompt',
  input: {schema: AdminDraftBlogContentGenerationInputSchema},
  output: {schema: AdminDraftBlogContentGenerationOutputSchema},
  prompt: `You are an expert content writer for a concrete and construction-focused company blog.
Your task is to generate a draft blog post based on the provided topic.
The blog post should be informative, engaging, and relevant to the construction industry.

Generate a title, a detailed body in Markdown format, and a concise summary for the blog post.

Topic: {{{topic}}}`,
});

const adminDraftBlogContentGenerationFlow = ai.defineFlow(
  {
    name: 'adminDraftBlogContentGenerationFlow',
    inputSchema: AdminDraftBlogContentGenerationInputSchema,
    outputSchema: AdminDraftBlogContentGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI model returned no output for blog content generation. Please try again.');
    }
    return output;
  }
);

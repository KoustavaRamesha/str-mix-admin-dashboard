'use server';
/**
 * @fileOverview An AI agent that synthesizes summaries from user reviews.
 *
 * - generateReviewSummary - A function that handles the review summary generation process.
 * - AdminReviewSummaryGenerationInput - The input type for the generateReviewSummary function.
 * - AdminReviewSummaryGenerationOutput - The return type for the generateReviewSummary function.
 */

import {googleAI} from '@genkit-ai/google-genai';
import {genkit, z} from 'genkit';

const AdminReviewSummaryGenerationInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of user review texts.'),
  apiKey: z.string().optional().describe('Optional Gemini API key override for this request.'),
});
export type AdminReviewSummaryGenerationInput = z.infer<typeof AdminReviewSummaryGenerationInputSchema>;

const AdminReviewSummaryGenerationOutputSchema = z.object({
  summary: z.string().describe('A synthesized summary of the provided user reviews, highlighting overall sentiment and key themes.'),
});
export type AdminReviewSummaryGenerationOutput = z.infer<typeof AdminReviewSummaryGenerationOutputSchema>;

export async function generateReviewSummary(
  input: AdminReviewSummaryGenerationInput
): Promise<AdminReviewSummaryGenerationOutput> {
  const ai = genkit({
    plugins: [googleAI(input.apiKey ? {apiKey: input.apiKey} : undefined)],
    model: 'googleai/gemini-2.5-flash',
  });

  const prompt = ai.definePrompt({
    name: 'adminReviewSummaryPrompt',
    input: {schema: AdminReviewSummaryGenerationInputSchema},
    output: {schema: AdminReviewSummaryGenerationOutputSchema},
    prompt: `You are an AI assistant tasked with synthesizing summaries from user reviews.

Your goal is to provide a concise summary that captures the overall sentiment and identifies key themes or recurring feedback points without manually reading every review.

Here are the reviews:

{{#each reviews}}
- {{{this}}}
{{/each}}

Please provide a clear and brief summary of these reviews. Focus on the main opinions, common praises, and common complaints. Do not include any personal opinions or extraneous information.
`,
  });

  const {output} = await prompt(input);
  if (!output) {
    throw new Error('AI model returned no output for review summary generation. Please try again.');
  }

  return output;
}

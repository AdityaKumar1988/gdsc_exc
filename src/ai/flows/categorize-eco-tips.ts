'use server';
/**
 * @fileOverview This file defines a Genkit flow for categorizing eco-tips.
 *
 * - categorizeEcoTips - A function that categorizes eco-tips based on user context.
 * - CategorizeEcoTipsInput - The input type for the categorizeEcoTips function.
 * - CategorizeEcoTipsOutput - The return type for the categorizeEcoTips function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CategorizeEcoTipsInputSchema = z.object({
  tip: z.string().describe('The eco-tip to categorize.'),
  lifestyle: z.string().describe('The lifestyle preferences of the user.'),
  location: z.string().describe('The location of the user.'),
});
export type CategorizeEcoTipsInput = z.infer<typeof CategorizeEcoTipsInputSchema>;

const CategorizeEcoTipsOutputSchema = z.object({
  categories: z.array(
    z.string().describe('The categories the eco-tip belongs to.')
  ).describe('A list of categories for the eco-tip.'),
});
export type CategorizeEcoTipsOutput = z.infer<typeof CategorizeEcoTipsOutputSchema>;

export async function categorizeEcoTips(input: CategorizeEcoTipsInput): Promise<CategorizeEcoTipsOutput> {
  return categorizeEcoTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeEcoTipsPrompt',
  input: {
    schema: z.object({
      tip: z.string().describe('The eco-tip to categorize.'),
      lifestyle: z.string().describe('The lifestyle preferences of the user.'),
      location: z.string().describe('The location of the user.'),
    }),
  },
  output: {
    schema: z.object({
      categories: z.array(
        z.string().describe('The categories the eco-tip belongs to.')
      ).describe('A list of categories for the eco-tip.'),
    }),
  },
  prompt: `You are an expert in categorizing eco-tips. Given the eco-tip, user lifestyle, and location, determine the most relevant categories for the tip.

Eco-tip: {{{tip}}}
Lifestyle: {{{lifestyle}}}
Location: {{{location}}}

Categories:`, // The LLM should generate a list of categories, separated by commas.
});

const categorizeEcoTipsFlow = ai.defineFlow<
  typeof CategorizeEcoTipsInputSchema,
  typeof CategorizeEcoTipsOutputSchema
>({
  name: 'categorizeEcoTipsFlow',
  inputSchema: CategorizeEcoTipsInputSchema,
  outputSchema: CategorizeEcoTipsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

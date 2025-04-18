'use server';
/**
 * @fileOverview Generates personalized eco-tips based on user location and lifestyle.
 *
 * - generateEcoTip - A function that generates personalized eco-tips.
 * - GenerateEcoTipInput - The input type for the generateEcoTip function.
 * - GenerateEcoTipOutput - The return type for the generateEcoTip function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getCurrentLocation, Location} from '@/services/location';

const EcoTipCategorySchema = z.enum([
  'Recycling',
  'Energy Saving',
  'Water Conservation',
  'Sustainable Transportation',
  'Eco-Friendly Diet',
  'Reducing Waste',
]);

const GenerateEcoTipInputSchema = z.object({
  lifestyle: z
    .string()
    .describe(
      'Description of the users lifestyle, including diet, transportation, and habits.'
    ),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .describe('The location of the user.  Latitude and longitude.'),
});
export type GenerateEcoTipInput = z.infer<typeof GenerateEcoTipInputSchema>;

const GenerateEcoTipOutputSchema = z.object({
  tip: z.string().describe('The generated eco-tip.'),
  category: EcoTipCategorySchema.describe('The category of the eco-tip.'),
});
export type GenerateEcoTipOutput = z.infer<typeof GenerateEcoTipOutputSchema>;

export async function generateEcoTip(input: GenerateEcoTipInput): Promise<GenerateEcoTipOutput> {
  return generateEcoTipFlow(input);
}

const ecoTipPrompt = ai.definePrompt({
  name: 'ecoTipPrompt',
  input: {
    schema: z.object({
      lifestyle: z
        .string()
        .describe(
          'Description of the users lifestyle, including diet, transportation, and habits.'
        ),
      location: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional()
        .describe('The location of the user. Latitude and longitude.'),
    }),
  },
  output: {
    schema: z.object({
      tip: z.string().describe('The generated eco-tip.'),
      category: EcoTipCategorySchema.describe('The category of the eco-tip.'),
    }),
  },
  prompt: `You are an AI assistant designed to provide personalized eco-tips.

Generate an eco-tip based on the user's lifestyle and location.

Lifestyle: {{{lifestyle}}}
Location: {{{location}}}

Make the tip actionable and easy to adopt.

Ensure the category is relevant to the tip. Return a JSON object with the keys \"tip\" and \"category\".`,
});

const generateEcoTipFlow = ai.defineFlow<
  typeof GenerateEcoTipInputSchema,
  typeof GenerateEcoTipOutputSchema
>({
  name: 'generateEcoTipFlow',
  inputSchema: GenerateEcoTipInputSchema,
  outputSchema: GenerateEcoTipOutputSchema,
},
async input => {
  // If location is not provided in the input, get it from the service.
  let location = input.location;
  if (!location) {
    location = await getCurrentLocation();
  }

  const {output} = await ecoTipPrompt({
    ...input,
    location,
  });
  return output!;
});
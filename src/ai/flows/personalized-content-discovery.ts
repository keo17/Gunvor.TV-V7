'use server';

/**
 * @fileOverview Personalized content discovery flow.
 *
 * This flow allows users to provide a natural language prompt to receive content suggestions.
 * It uses the user's prompt to generate a list of content suggestions.
 *
 * @interface PersonalizedContentDiscoveryInput - Input type for the personalized content discovery flow.
 * @interface PersonalizedContentDiscoveryOutput - Output type for the personalized content discovery flow.
 * @function personalizedContentDiscovery - The main function to trigger the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedContentDiscoveryInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired content.'),
});
export type PersonalizedContentDiscoveryInput = z.infer<typeof PersonalizedContentDiscoveryInputSchema>;

const PersonalizedContentDiscoveryOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A content suggestion based on the user prompt.')
  ).describe('A list of content suggestions based on the user prompt.'),
});
export type PersonalizedContentDiscoveryOutput = z.infer<typeof PersonalizedContentDiscoveryOutputSchema>;

export async function personalizedContentDiscovery(
  input: PersonalizedContentDiscoveryInput
): Promise<PersonalizedContentDiscoveryOutput> {
  return personalizedContentDiscoveryFlow(input);
}

const personalizedContentDiscoveryPrompt = ai.definePrompt({
  name: 'personalizedContentDiscoveryPrompt',
  input: {schema: PersonalizedContentDiscoveryInputSchema},
  output: {schema: PersonalizedContentDiscoveryOutputSchema},
  prompt: `You are a content recommendation expert. A user has provided the following prompt:

  {{prompt}}

  Based on this prompt, provide a list of content suggestions. Each suggestion should be a title of a movie or series.
  Format your response as a JSON array of strings.`,
});

const personalizedContentDiscoveryFlow = ai.defineFlow(
  {
    name: 'personalizedContentDiscoveryFlow',
    inputSchema: PersonalizedContentDiscoveryInputSchema,
    outputSchema: PersonalizedContentDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await personalizedContentDiscoveryPrompt(input);
    return output!;
  }
);

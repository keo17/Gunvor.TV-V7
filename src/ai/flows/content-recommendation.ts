'use server';
/**
 * @fileOverview Content recommendation AI agent.
 *
 * - contentRecommendation - A function that handles the content recommendation process.
 * - ContentRecommendationInput - The input type for the contentRecommendation function.
 * - ContentRecommendationOutput - The return type for the contentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRecommendationInputSchema = z.object({
  viewingHistory: z.array(
    z.string().describe('The IDs of content the user has viewed.')
  ).optional().describe('The user viewing history, represented as an array of content IDs.'),
  wishlist: z.array(
    z.string().describe('The IDs of content in the user\'s wishlist.')
  ).optional().describe('The user\'s wishlist, represented as an array of content IDs.'),
  contentList: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      genre: z.string().optional(),
    })
  ).describe('A list of available content with their metadata.'),
  maxRecommendations: z.number().default(5).describe('The maximum number of content recommendations to return.'),
});
export type ContentRecommendationInput = z.infer<typeof ContentRecommendationInputSchema>;

const ContentRecommendationOutputSchema = z.array(
  z.object({
    id: z.string().describe('The ID of the recommended content.'),
    title: z.string().describe('The title of the recommended content.'),
    reason: z.string().describe('The reason why this content is recommended based on viewing history or wishlist.'),
  })
);
export type ContentRecommendationOutput = z.infer<typeof ContentRecommendationOutputSchema>;

export async function contentRecommendation(input: ContentRecommendationInput): Promise<ContentRecommendationOutput> {
  return contentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommendationPrompt',
  input: {schema: ContentRecommendationInputSchema},
  output: {schema: ContentRecommendationOutputSchema},
  prompt: `You are a content recommendation expert. Given a user's viewing history, wishlist, and a list of available content, you will recommend content that the user might like.

  Prioritize recommendations based on the following criteria:
  - Content that shares similar genres with the user's viewing history.
  - Content that is similar to items in the user's wishlist.
  - Content that the user has not yet viewed.

  Return a list of content recommendations, with a reason for each recommendation.

  Here is the user's viewing history (content IDs): {{#if viewingHistory}}{{{viewingHistory}}}{{else}}No viewing history available.{{/if}}
  Here is the user's wishlist (content IDs): {{#if wishlist}}{{{wishlist}}}{{else}}No wishlist available.{{/if}}

  Here is the list of available content:
  {{#each contentList}}
  - id: {{this.id}}, title: {{this.title}}, description: {{this.description}}, genre: {{this.genre}}
  {{/each}}

  Please provide at most {{maxRecommendations}} recommendations in JSON format:
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const contentRecommendationFlow = ai.defineFlow(
  {
    name: 'contentRecommendationFlow',
    inputSchema: ContentRecommendationInputSchema,
    outputSchema: ContentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

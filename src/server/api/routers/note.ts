import cohere from 'cohere-ai';

import { detectContentType } from "next/dist/server/image-optimizer";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
cohere.init(process.env.COHERE_API_KEY)


export const noteRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({ title: z.string(), content: z.string(), topicId: z.string(), generate: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      if(input.generate){
      const response = await cohere.generate({
  model:'command-xlarge-nightly',
  prompt:input.content,
  max_tokens:300,
  temperature:0.9,
  k:0,
  p:0.75,
  stop_sequences:[],
  return_likelihoods:'NONE'
      });
      console.log(response)
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          topicId: input.topicId,
          content: response.body.generations[0].text,
        },
      });
    }
    else{
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          topicId: input.topicId,
          content: input.content,
        },
      });
    }
    }),

  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          topicId: input.topicId,
        },
      });
    }),
});

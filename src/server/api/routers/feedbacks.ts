import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const feedbacksRouter = createTRPCRouter({
  createFeedback: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        content: z.string(),
        isRecomended: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { content, productId, isRecomended } = input;

      const userId = session.user.id;

      return await prisma.feedback.create({
        data: {
          content,
          reviewerId: userId,
          productId: productId,
          isRecomended: isRecomended,
        },
      });
    }),
});

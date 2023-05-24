import { z } from "zod";
import { type FeedbacksDataType } from "~/types/FeedbacksData";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
          isRecomended,
        },
      });
    }),

  getFeedbacks: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }): Promise<FeedbacksDataType[]> => {
      const { productId, cursor, limit } = input;
      const { prisma } = ctx;

      return await prisma.feedback.findMany({
        where: {
          productId,
        },
        orderBy: {
          created_at: "desc",
        },
        include: {
          reviewer: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
      });
    }),

  getFeedbackForUser: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId } = input;

      return await prisma.feedback.findFirst({
        where: {
          productId,
          reviewerId: session.user.id,
        },
      });
    }),

  updateFeedback: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        content: z.string(),
        isRecomended: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId, content, isRecomended } = input;

      await prisma.feedback.update({
        where: {
          productId_reviewerId: {
            productId,
            reviewerId: session.user.id,
          },
        },
        data: {
          content,
          isRecomended,
        },
      });
    }),
});

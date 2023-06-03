import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productRequestsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        budget: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const authorId = session.user.id;

      const { title, content, budget } = input;

      await prisma.requestThread.create({
        data: {
          title,
          content,
          budget,
          authorId,
        },
      });
    }),

  getRequests: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const requests = await prisma.requestThread.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return requests;
  }),

  getRequestById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const request = await prisma.requestThread.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return request;
    }),
});

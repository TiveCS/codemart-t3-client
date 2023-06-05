import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const { prisma } = ctx;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return user;
    }),

  getUserChatThreads: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;

    const threads = await prisma.chatThread.findMany({
      where: {
        audienceList: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        audienceList: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return threads;
  }),
});

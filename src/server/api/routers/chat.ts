import { type ChatMessage } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  newChatThread: protectedProcedure
    .input(
      z.object({
        audienceIds: z.array(z.string()),
        threadId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { audienceIds, threadId } = input;

      return await prisma.chatThread.create({
        data: {
          id: threadId,
          audienceList: {
            connect: audienceIds.map((id) => ({
              id,
            })),
          },
        },
        select: {
          id: true,
        },
      });
    }),

  getChatThread: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { threadId } = input;

      const thread = await prisma.chatThread.findUnique({
        where: {
          id: threadId,
        },
        include: {
          audienceList: true,
        },
      });

      if (!thread) {
        throw new Error("Thread not found");
      }

      if (!thread.audienceList.some((user) => user.id === session.user.id)) {
        throw new Error("You are not a member of this thread");
      }

      const messages = await prisma.chatMessage.findMany({
        where: {
          threadId,
        },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return { thread, messages };
    }),

  newChatMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<ChatMessage> => {
      const { prisma, session } = ctx;
      const { threadId, content } = input;

      return await prisma.chatMessage.create({
        data: {
          threadId,
          content,
          senderId: session.user.id,
        },
      });
    }),
});

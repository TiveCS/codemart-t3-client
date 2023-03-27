import { FileInputData } from "~/hooks/useFileInputEncoded";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productsRouter = createTRPCRouter({
  publish: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        codeFile: FileInputData,
        coverImgFile: FileInputData,
        version: z.string(),
        price: z.number().min(0),
        body: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { session, prisma, s3 } = ctx;

      const {
        title,
        description,
        version,
        price,
        codeFile,
        body,
        coverImgFile,
      } = input;

      const uploadResult = await s3.putObject(codeFile, {});
      const codeUrl = await s3.presignedUrl(uploadResult.key, 60 * 60 * 24 * 7);

      const product = await prisma.product.create({
        data: {
          title,
          description,
          price,
          owner: {
            connect: {
              id: session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      await prisma.productContent.create({
        data: {
          version,
          code_url: codeUrl,
          body,
          product: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }),

  getProductsForBrowse: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).optional().default(6),
        skip: z.number().min(0).optional().default(0),
        cursorId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const products = await ctx.prisma.product.findMany({
        cursor: {
          id: input.cursorId,
        },
        take: input.take,
        skip: input.skip,
        orderBy: {
          updated_at: "desc",
        },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
        },
      });

      return products;
    }),
});

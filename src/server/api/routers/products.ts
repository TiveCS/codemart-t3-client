import { z } from "zod";
import { FileInputData } from "~/types";
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

      const [codeUploadResult, coverImgUploadResult] = await Promise.all([
        s3.putObject(codeFile, {}),
        s3.putObject(coverImgFile, {}),
      ]);

      const [codeUrl, coverImgUrl] = await Promise.all([
        s3.presignedUrl(codeUploadResult.key, 60 * 60 * 24 * 7),
        s3.presignedUrl(coverImgUploadResult.key, 60 * 60 * 24 * 7),
      ]);

      const product = await prisma.product.create({
        data: {
          title,
          description,
          price,
          cover_url: coverImgUrl,
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
        take: z.number().min(1).nullish(),
        skip: z.number().min(0).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const take = input.take || 6;
      const skip = input.skip || 0;

      const products = await ctx.prisma.product.findMany({
        take,
        skip,
        orderBy: {
          updated_at: "desc",
        },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          cover_url: true,
          owner: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        products,
      };
    }),
});

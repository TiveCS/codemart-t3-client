import { z } from "zod";
import { FileInputData, type ProductBrowseData } from "~/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productsRouter = createTRPCRouter({
  publish: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        codeFile: FileInputData,
        coverImgFile: FileInputData,
        assets: z.array(FileInputData),
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
        assets,
      } = input;

      const [codeUploadResult, coverImgUploadResult, assetsUploadResult] =
        await Promise.all([
          s3.putObject(codeFile, {}),
          s3.putObject(coverImgFile, {}),
          s3.putMultiFileObject(assets, {}),
        ]);

      const [codeUrl, coverImgUrl, assetsUrl] = await Promise.all([
        s3.presignedUrl(codeUploadResult.key, 60 * 60 * 24 * 7),
        s3.presignedUrl(coverImgUploadResult.key, 60 * 60 * 24 * 7),
        Promise.all<string>(
          assetsUploadResult.map((result) =>
            s3.presignedUrl(result.key, 60 * 60 * 24 * 7)
          )
        ),
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
          images: {
            create: {
              images_url: assetsUrl,
            },
          },
          product: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }),

  getProductById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
      })
    ),

  getProductsForBrowse: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).nullish(),
        skip: z.number().min(0).nullish(),
        cursorId: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const take = input.take || 6;
      const skip = input.skip || 0;
      const cursorId = input.cursorId || undefined;

      const products: ProductBrowseData[] | undefined =
        await ctx.prisma.product.findMany({
          take,
          skip,
          cursor: cursorId ? { id: cursorId } : undefined,
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

      const nextCursor = products[products.length - 1]?.id;

      return { products, nextCursor };
    }),
});

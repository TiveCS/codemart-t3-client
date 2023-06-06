import { Prisma } from "@prisma/client";
import { z } from "zod";
import { FileInputData, type ProductBrowseData } from "~/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productsRouter = createTRPCRouter({
  deleteProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId } = input;

      return await prisma.$transaction([
        prisma.productContent.deleteMany({
          where: {
            productId,
          },
        }),
        prisma.product.deleteMany({
          where: {
            id: productId,
            ownerId: session.user.id,
          },
        }),
      ]);
    }),

  editProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        price: z.number().min(0),
        body: z.string(),
        categories: z.array(z.string()),
        demoUrl: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const { id, title, description, price, body, categories, demoUrl } =
        input;

      // TODO validate if the user is the owner of the product

      await prisma.product.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          price,
          body,
          categories,
          demo_url: demoUrl,
        },
      });
    }),

  publishNewVersion: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        version: z.string(),
        codeFile: FileInputData,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma, s3 } = ctx;

      const { version, codeFile, productId } = input;

      const codeUploadResult = await s3.putObject(codeFile, {});

      const codeUrl = await s3.presignedUrl(
        codeUploadResult.key,
        60 * 60 * 24 * 7
      );

      try {
        await prisma.productContent.create({
          data: {
            version,
            code_url: codeUrl,
            product: {
              connect: {
                id: productId,
              },
            },
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new Error("Version already exists");
          }
        }
        throw err;
      }
    }),

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
        categories: z.array(z.string()),
        demoUrl: z.string().nullish(),
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
        categories,
        demoUrl,
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
          body,
          demo_url: demoUrl,
          images: {
            create: {
              images_url: assetsUrl,
            },
          },
          categories,
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
          product: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }),

  getProductByIdForPurchase: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
      })
    ),

  getProductById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
        include: {
          images: true,
          purchases: input.userId
            ? {
                where: {
                  userId: input.userId,
                },
                select: {
                  id: true,
                  status: true,
                },
              }
            : false,
          contents: {
            orderBy: {
              created_at: "desc",
            },
            select: {
              code_url: true,
              version: true,
            },
          },
          owner: {
            select: {
              name: true,
            },
          },
        },
      })
    ),

  getProductsForBrowse: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).nullish(),
        skip: z.number().min(0).nullish(),
        cursorId: z.string().nullish(),
        search: z.string().nullish(),
        filters: z.array(z.string()).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const take = input.take || 6;
      const skip = input.skip || 0;
      const cursorId = input.cursorId || undefined;
      const search = input.search || undefined;
      const filters = input.filters || undefined;

      const products: ProductBrowseData[] | undefined =
        await ctx.prisma.product.findMany({
          take,
          skip,
          cursor: cursorId ? { id: cursorId } : undefined,
          orderBy: {
            updated_at: "desc",
          },
          where:
            search || filters
              ? {
                  title: { contains: search, mode: "insensitive" },
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                  categories: filters
                    ? {
                        hasSome: filters,
                      }
                    : undefined,
                }
              : undefined,
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            categories: true,
            cover_url: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

      const nextCursor = products[products.length - 1]?.id;

      return { products, nextCursor };
    }),

  getLatestCategories: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const take = 20;

    const productCategories: {
      categories: string[];
    }[] = await prisma.product.findMany({
      take,
      orderBy: {
        updated_at: "desc",
      },
      select: {
        categories: true,
      },
    });

    const categoriesSet = productCategories.reduce((set, product) => {
      product.categories.forEach((category) => {
        set.add(category);
      });
      return set;
    }, new Set<string>());

    return Array.from(categoriesSet);
  }),

  getUserProducts: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
      })
    )
    .query(async ({ ctx, input }): Promise<ProductBrowseData[]> => {
      const { prisma } = ctx;
      const { ownerId } = input;

      const products: ProductBrowseData[] = await prisma.product.findMany({
        where: {
          ownerId,
        },
        orderBy: {
          updated_at: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          categories: true,
          price: true,
          cover_url: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return products;
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuid } from "uuid";
import { env } from "~/env.mjs";
import {
  type ITransactionFail,
  type ITransactionStatus,
} from "hanif-midtrans-node";

export const purchasesRouter = createTRPCRouter({
  createTransaction: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, midtrans, prisma } = ctx;
      const { productId } = input;

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          title: true,
          price: true,
          owner: true,
        },
      });
      if (!product) {
        throw new Error("Product not found");
      }

      const orderId = uuid();

      await prisma.purchaseHistory.create({
        data: {
          orderId: orderId,
          price: product.price,
          userId: session.user.id,
          status: "pending",
          productId: product.id,
        },
      });

      return midtrans.createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: product.price,
        },
        customer_details: {
          email: session.user.email as string,
          first_name: session.user.name as string,
        },
        item_details: [
          {
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1,
            brand: product.owner.name as string,
          },
        ],
        callbacks: {
          finish: env.MIDTRANS_TRANSACTION_CALLBACK_URL,
        },
      });
    }),

  callbackTransactionConfirm: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        transactionStatus: z.enum(["capture", "deny", "expire", "pending"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orderId, transactionStatus } = input;
      const { midtrans, prisma } = ctx;

      const transactionStatusResponse: ITransactionStatus | ITransactionFail =
        await midtrans.statusTransaction(orderId);

      if (transactionStatusResponse.status_code !== "200") {
        await prisma.purchaseHistory.deleteMany({
          where: {
            orderId: orderId,
          },
        });

        throw new Error("Transaction not found");
      }

      const orderStatusInfo = transactionStatusResponse as ITransactionStatus;

      const { transaction_status } = orderStatusInfo;

      const purchaseHistoryData = await prisma.purchaseHistory.update({
        where: {
          orderId: orderId,
        },
        data: {
          status: transaction_status,
        },
        select: {
          productId: true,
        },
      });

      return {
        status: transaction_status,
        orderId: orderId,
        productId: purchaseHistoryData.productId,
      };
    }),
});

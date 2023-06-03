import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { productsRouter } from "./routers/products";
import { purchasesRouter } from "./routers/purchases";
import { feedbacksRouter } from "./routers/feedbacks";
import { productRequestsRouter } from "./routers/productRequests";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  products: productsRouter,
  purchases: purchasesRouter,
  feedbacks: feedbacksRouter,
  productRequests: productRequestsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import MidtransNode from "hanif-midtrans-node";
import { env } from "~/env.mjs";

const isProduction = env.NODE_ENV === "production";

export const midtrans = new MidtransNode(false, env.MIDTRANS_SERVER_KEY);

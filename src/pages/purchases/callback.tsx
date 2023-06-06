import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

type TransactionStatus = "capture" | "deny" | "pending" | "expire";

const validate = (
  orderId: string,
  statusCode: string,
  transactionStatus: TransactionStatus
) => {
  if (!orderId || !statusCode || !transactionStatus) {
    return false;
  }

  if (statusCode !== "200") {
    return false;
  }

  if (transactionStatus !== "capture") {
    return false;
  }

  return true;
};

interface PurchasesCallbackPageProps {
  orderId: string;
  statusCode: number;
  transactionStatus: TransactionStatus;
}

const PurchasesCallbackPage: NextPage<PurchasesCallbackPageProps> = ({
  orderId,
  transactionStatus,
}) => {
  const router = useRouter();
  const { data: transactionConfirm } =
    api.purchases.callbackTransactionConfirm.useQuery(
      {
        orderId,
        transactionStatus,
      },
      {
        onError() {
          void router.push("/products");
        },
      }
    );

  if (transactionConfirm?.status === "capture") {
    void router.push(
      "/products/[id]",
      `/products/${transactionConfirm.productId}`
    );
  }

  return (
    <>
      <Head>
        <title>| Payment</title>
      </Head>
      <p>Success payment</p>
    </>
  );
};

export default PurchasesCallbackPage;

const getServerSideProps: GetServerSideProps<
  PurchasesCallbackPageProps
> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const orderId = context.query.order_id as string;
  const statusCode = context.query.status_code as string;
  const transactionStatus = context.query
    .transaction_status as string as TransactionStatus;

  if (!validate(orderId, statusCode, transactionStatus)) {
    return {
      redirect: {
        destination: "/products",
        permanent: false,
        statusCode: 302,
      },
    };
  }

  return {
    props: {
      orderId,
      statusCode: Number(statusCode),
      transactionStatus: transactionStatus,
    },
  };
};

export { getServerSideProps };

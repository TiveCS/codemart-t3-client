import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/Button";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

interface ProductPurchasePageProps {
  id: string;
}

const ProductPurchasePage: NextPage<ProductPurchasePageProps> = ({ id }) => {
  const router = useRouter();

  const { data: product, isLoading } =
    api.products.getProductByIdForPurchase.useQuery(
      {
        id,
      },
      {
        onError: () => {
          void router.push("/products");
        },
        onSuccess: (data) => {
          if (!data) {
            void router.push("/products");
          }
        },
      }
    );

  const createTransaction = api.purchases.createTransaction.useMutation({
    onSuccess: (data) => {
      if (!data) return;

      window.open(data.redirect_url, "_blank");
    },
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading... | Purchase</title>
        </Head>
        <main>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Head>
          <title>Not Found | Purchase</title>
        </Head>
        <main>
          <p>Product not found</p>
        </main>
      </>
    );
  }

  const formattedPrice = product.price.toLocaleString("id-ID", {
    currency: "IDR",
    style: "currency",
    maximumFractionDigits: 0,
  });

  const handleStartTransaction = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const response = createTransaction.mutate({
      productId: product.id,
    });
  };

  return (
    <>
      <Head>
        <title>{product.title} | Purchase</title>
      </Head>
      <main>
        <p>{product.title}</p>
        <p>Price: {formattedPrice}</p>

        <Button onClick={(e) => handleStartTransaction(e)}>
          Confirm Purchase
        </Button>
      </main>
    </>
  );
};

export default ProductPurchasePage;

const getServerSideProps: GetServerSideProps<ProductPurchasePageProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (!context.params) {
    return {
      notFound: true,
    };
  }

  const id = context.params.id as string;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
};

export { getServerSideProps };

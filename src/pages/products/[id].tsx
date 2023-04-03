import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ProductDetails: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isLoading } = api.products.getProductById.useQuery({
    id,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>404</p>;
  }

  return (
    <>
      <Head>
        <title>{`${data.title} | CodeMart`}</title>
      </Head>
      <></>
    </>
  );
};

export default ProductDetails;

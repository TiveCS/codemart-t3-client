import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/Button";
import DetailsBodyArea from "~/components/ProductDetailsPage/DetailsBodyArea";
import { api } from "~/utils/api";

const formatPrice = (price: number) => {
  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
};

interface ProductDetailsProps {
  id: string;
}

const ProductDetails: NextPage<ProductDetailsProps> = ({ id }) => {
  const { data: session } = useSession();
  if (!id) {
    return <p>400</p>;
  }

  const { data: product, isLoading } = api.products.getProductById.useQuery({
    id,
    userId: session?.user.id,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>404</p>;
  }

  const priceTag =
    product.price === 0 ? "Free" : `${formatPrice(product.price)}`;

  const purchase = product.purchases?.at(0);
  const isOwner = product.ownerId === session?.user.id;
  const content = product.contents[0];
  const { body, images } = product;

  const versionDatas = product.contents.map((content) => ({
    version: content.version,
    code_url: content.code_url,
  }));

  if (!content) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
      <Head>
        <title>{`${product.title} | CodeMart`}</title>
      </Head>
      <>
        <div className="mx-auto max-w-6xl rounded-sm bg-white px-4 py-8 shadow md:px-6">
          <div id="product-header" className="flex flex-col gap-y-4">
            <div
              id="product-header-content"
              className="grid grid-flow-row items-center gap-y-6 md:grid-flow-col md:grid-cols-6 md:gap-y-0"
            >
              <div
                id="product-header-content-details"
                className="w-full md:col-span-4"
              >
                <h2 className="text-2xl font-semibold">
                  {product.title}{" "}
                  <span className="text-xl font-normal text-gray-400">
                    {content.version}
                  </span>
                </h2>
                <p>{product.description}</p>
              </div>

              <div
                id="product-header-content-actions"
                className="flex flex-col items-center justify-evenly md:col-span-2 md:gap-y-2 lg:flex-row"
              >
                {(purchase !== undefined && purchase.status === "capture") ||
                isOwner ? (
                  <Link
                    className="w-full lg:w-fit"
                    href={content.code_url}
                    target="_blank"
                  >
                    <Button>Download Latest</Button>
                  </Link>
                ) : (
                  <Link
                    href={"/products/[id]/purchase"}
                    as={`/products/${id}/purchase`}
                  >
                    <Button>Purchase for {priceTag}</Button>
                  </Link>
                )}

                {isOwner && (
                  <Link
                    href={"/products/[id]/update"}
                    as={`/products/${id}/update`}
                  >
                    <Button style="text">Post an Update</Button>
                  </Link>
                )}
              </div>
            </div>

            <hr />
          </div>

          <div
            id="product-assets"
            className="relative mt-8 flex h-52 w-full mobile-lg:h-64"
          >
            {images?.images_url?.map((url, index) => (
              <ProductAssetImg alt={product.title} url={url} key={index} />
            ))}
          </div>

          <div className="mt-6">
            <hr />

            <DetailsBodyArea
              productId={product.id}
              ownerId={product.ownerId}
              body={body}
              versionDatas={versionDatas}
              userPurchase={purchase}
            />
          </div>
        </div>
      </>
    </>
  );
};

interface ProductAssetImgProps {
  url: string;
  alt: string;
}

const ProductAssetImg: React.FC<ProductAssetImgProps> = ({ url, alt }) => {
  return <Image className="md:max-w-sm" src={url} alt={alt} fill priority />;
};

export default ProductDetails;

ProductDetails.getInitialProps = ({ query }) => {
  const id = query.id as string;

  return {
    id,
  };
};

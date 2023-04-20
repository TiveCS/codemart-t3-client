import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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

const ProductDetails: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const id = router.query.id as string;

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
            <div className="grid grid-cols-6">
              <div className="col-span-4 w-full">
                <h2 className="text-2xl font-semibold">
                  {product.title}{" "}
                  <span className="text-xl font-normal text-gray-400">
                    {content.version}
                  </span>
                </h2>
                <p>{product.description}</p>
              </div>

              <div className="col-span-2 flex flex-row items-center justify-evenly">
                {purchase !== undefined || isOwner ? (
                  <Link href={content.code_url} target="_blank">
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

            <DetailsBodyArea body={body} versionDatas={versionDatas} />
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

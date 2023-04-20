import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/Button";
import FileInput from "~/components/Forms/FileInput";
import FormInput from "~/components/Forms/FormInput";
import useFileInputEncoded from "~/hooks/useFileInputEncoded";
import useInput from "~/hooks/useInput";
import { api } from "~/utils/api";
import useToastsStore from "~/zustand/toastsStore";

const ProductUpdatePage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const id = router.query.id as string;
  const { addToast } = useToastsStore();

  const publish = api.products.publishNewVersion.useMutation({
    onSuccess: async () => {
      setIsPublishing(false);
      addToast({
        message: "Update published successfully",
        variant: "success",
      });

      await router.push("/products/[id]", `/products/${id}`);
    },
    onError: (error) => {
      setIsPublishing(false);
      addToast({
        message: error.message,
        variant: "danger",
      });
    },
  });

  const { data: product, isLoading } = api.products.getProductById.useQuery({
    id: id,
    userId: session?.user.id,
  });

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [version, onChangeVersion] = useInput("");
  const [codeFile, onChangeCodeFile] = useFileInputEncoded();

  if (!id) {
    return <p>404</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>401</p>;
  }

  if (!product) {
    return <p>404</p>;
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!codeFile) {
      addToast({
        message: "Please select a file",
        variant: "danger",
      });
      return;
    }

    setIsPublishing(true);
    await publish.mutateAsync({
      productId: id,
      codeFile,
      version,
    });
  };

  return (
    <>
      <Head>
        <title>Post Update</title>
      </Head>
      <>
        <p>{product.title}</p>

        <form>
          <FormInput
            name="version"
            label="Version"
            type="text"
            placeholder="e.g 1.0.1"
            onChangeHandler={onChangeVersion}
            required
          />

          <FileInput
            name="code_file"
            label="Source Code File"
            accept=".zip"
            onChangeHandler={onChangeCodeFile}
            required
          />

          <Button type="submit" isLoading={isPublishing} onClick={handleSubmit}>
            Publish an Update
          </Button>
        </form>
      </>
    </>
  );
};

export default ProductUpdatePage;

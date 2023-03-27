import * as DOMPurify from "dompurify";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useState, type FormEvent } from "react";
import { Button } from "~/components/Button";
import FileInput from "~/components/Forms/FileInput";
import FormInput from "~/components/Forms/FormInput";
import TextAreaInput from "~/components/Forms/TextAreaInput";
import useFileInputEncoded from "~/hooks/useFileInputEncoded";
import useInput from "~/hooks/useInput";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import useToastsStore from "~/zustand/toastsStore";

const SellPage: NextPage = () => {
  const addToast = useToastsStore.getState().addToast;

  const publish = api.products.publish.useMutation();

  const [title, onTitleChangeHandler] = useInput("");
  const [description, onDescriptionChangeHandler] = useInput("");
  const [version, onVersionChangeHandler] = useInput("1.0.0");
  const [price, onPriceChangeHandler] = useInput(0);
  const [codeFile, onCodeFileChangeHandler] = useFileInputEncoded({
    chunkSize: 1024 * 1024 * 2.5,
    maxFileSize: 50,
  });
  const [coverImgFile, onCoverImgFileChangeHandler] = useFileInputEncoded({
    chunkSize: 1024 * 1024 * 3,
    maxFileSize: 1,
  });
  const [body, onBodyChangeHandler] = useInput("");

  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!codeFile || !coverImgFile) return;

    setIsPublishing(true);

    const mutate = publish.mutateAsync({
      title,
      description,
      codeFile,
      coverImgFile,
      version,
      price: Number(price),
      body: DOMPurify.sanitize(body),
    });

    mutate
      .catch(() => {
        setIsPublishing(false);

        addToast({
          message: "Failed to publish product",
          variant: "danger",
        });
      })
      .finally(() => {
        setIsPublishing(false);

        addToast({
          message: "Successfully publish a product",
          variant: "success",
        });
      });
  };

  return (
    <>
      <Head key={"sell"}>
        <title>CodeMart | Sell</title>
        <meta name="description" content="Start selling your code" />
      </Head>
      <>
        <form
          className="flex flex-col md:px-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid w-full grid-flow-row gap-y-4 md:grid-flow-col md:gap-y-0 md:gap-x-8">
            <FormInput
              name="title"
              label="Title"
              placeholder="My Awesome Software"
              onChangeHandler={onTitleChangeHandler}
              required
            />

            <FormInput
              name="description"
              label="Description"
              placeholder="A software that manage your task"
              onChangeHandler={onDescriptionChangeHandler}
            />
          </div>

          <div className="mt-4 flex flex-row justify-between md:justify-start md:gap-x-8">
            <FormInput
              name="price"
              label="Price"
              type={"number"}
              onChangeHandler={onPriceChangeHandler}
              value={price}
              className="max-w-us mobile-md:max-w-4xs"
              required
            />

            <FormInput
              name="version"
              label="Version"
              placeholder="1.0.0"
              onChangeHandler={onVersionChangeHandler}
              className="max-w-us mobile-md:max-w-4xs"
            />
          </div>

          <div className="mt-4">
            <FileInput
              name="cover_img_file"
              label="Cover Image"
              onChangeHandler={onCoverImgFileChangeHandler}
              accept={"image/png,image/jpeg"}
              required
            />
            <FileInput
              name="code_file"
              label="Source File"
              onChangeHandler={onCodeFileChangeHandler}
              required
            />
          </div>

          <div className="mt-4">
            <TextAreaInput
              name="body"
              label="Body"
              placeholder="Explain your product here..."
              onChangeHandler={onBodyChangeHandler}
            />
          </div>

          <Button type="submit" className="mt-8" isLoading={isPublishing}>
            Publish
          </Button>
        </form>
      </>
    </>
  );
};

export default SellPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

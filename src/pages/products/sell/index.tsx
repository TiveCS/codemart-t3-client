import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { type FormEvent } from "react";
import { Button } from "~/components/Button";
import FileInput from "~/components/Forms/FileInput";
import FormInput from "~/components/Forms/FormInput";
import useFileInputEncoded from "~/hooks/useFileInputEncoded";
import useInput from "~/hooks/useInput";
import { api } from "~/utils/api";

const SellPage: NextPage = () => {
  const publish = api.products.publish.useMutation();

  const [title, onTitleChangeHandler] = useInput("");
  const [description, onDescriptionChangeHandler] = useInput("");
  const [version, onVersionChangeHandler] = useInput("1.0.0");
  const [price, onPriceChangeHandler] = useInput(0);
  const [codeFile, onCodeFileChangeHandler] = useFileInputEncoded({
    chunkSize: 1024 * 1024 * 2.5,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!codeFile) return;

    publish.mutate({
      title,
      description,
      codeFile,
      version,
      price: Number(price),
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
          className="flex flex-col"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid w-full grid-flow-row gap-y-4">
            <FormInput
              name="title"
              label="Title"
              placeholder="My Awesome Software"
              onChangeHandler={onTitleChangeHandler}
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
              name="code_file"
              label="Source File"
              onChangeHandler={onCodeFileChangeHandler}
            />
          </div>

          <Button type="submit" className="mt-8">
            Publish
          </Button>
        </form>
      </>
    </>
  );
};

export default SellPage;

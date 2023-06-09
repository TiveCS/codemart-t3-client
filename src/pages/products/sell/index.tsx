import * as DOMPurify from "dompurify";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { Button } from "~/components/Button";
import FileImageInput from "~/components/Forms/FileImageInput";
import FileInput from "~/components/Forms/FileInput";
import FormCategoryInput from "~/components/Forms/FormCategoryInput";
import FormInput from "~/components/Forms/FormInput";
import TextAreaInput from "~/components/Forms/TextAreaInput";
import useFileInputEncoded from "~/hooks/useFileInputEncoded";
import useInput from "~/hooks/useInput";
import useMultiFileInput from "~/hooks/useMultiFileInput";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import { validateNotEmpty, validateText } from "~/utils/validation";
import useToastsStore from "~/zustand/toastsStore";

const SellPage: NextPage = () => {
  const router = useRouter();

  const addToast = useToastsStore.getState().addToast;
  const publish = api.products.publish.useMutation();

  const {
    value: title,
    onValueChangeHandler: onTitleChangeHandler,
    isValid: isTitleValueValid,
  } = useInput("", {
    isRequired: true,
    validate: (value) => validateText(value),
  });

  const {
    value: description,
    onValueChangeHandler: onDescriptionChangeHandler,
    isValid: isDescriptionValueValid,
  } = useInput("", {
    isRequired: true,
    validate: (value) => validateText(value),
  });
  const {
    value: version,
    onValueChangeHandler: onVersionChangeHandler,
    isValid: isVersionValueValid,
  } = useInput("1.0.0", {
    isRequired: false,
    validate: (value) => validateNotEmpty(value),
  });
  const { value: price, onValueChangeHandler: onPriceChangeHandler } =
    useInput(0);
  const [codeFile, onCodeFileChangeHandler] = useFileInputEncoded({
    chunkSize: 1024 * 1024 * 2.5,
    maxFileSize: 50,
  });
  const [coverImgFile, onCoverImgFileChangeHandler] = useFileInputEncoded({
    chunkSize: 1024 * 1024 * 3,
    maxFileSize: 1,
  });
  const { value: body, onValueChangeHandler: onBodyChangeHandler } = useInput(
    "",
    {
      isRequired: false,
    }
  );

  const {
    value: category,
    onValueChangeHandler: onCategoryChangeHandler,
    setValue: setCategory,
  } = useInput("", {
    isRequired: false,
    validate: (value) => {
      if (value.length === 0 || value.trim() === "") {
        setCategory("");
        return true;
      }

      return validateText(value);
    },
  });
  const [categories, setCategories] = useState<string[]>([]);
  const {
    value: demoUrl,
    onValueChangeHandler: onDemoUrlChangeHandler,
    isValid: isDemoUrlValid,
  } = useInput("", {
    isRequired: false,
    validate: (value) => {
      if (value.trim() === "") {
        return false;
      }

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  });

  const {
    files: assets,
    encodedDatas: encodedAssets,
    onFileChangeHandler: onAssetsChangeHandler,
    onDeleteFileHandler: onAssetsDeleteHandler,
    onFileDropHandler: onAssetsDropHandler,
    isEncoding: isEncodingAssets,
  } = useMultiFileInput({});

  const [isPublishing, setIsPublishing] = useState(false);

  const isValidInput = () => {
    const isValidTitle = title !== undefined && isTitleValueValid;
    const isValidDescription =
      description !== undefined && isDescriptionValueValid;
    const isValidVersion = version.length === 0 ? true : isVersionValueValid;

    const isValidPrice = price !== undefined && price >= 0;
    const isValidCategories = categories.length > 0;
    const isValidAssets = encodedAssets.length > 0;

    if (!isValidPrice) {
      addToast({
        message: "Please enter a valid price.",
        variant: "danger",
      });
      return false;
    }

    if (!isValidCategories) {
      addToast({
        message: "Please write at least one category.",
        variant: "danger",
      });
      return false;
    }

    if (!isDemoUrlValid) {
      addToast({
        message: "Please enter a valid demo url.",
        variant: "danger",
      });
      return false;
    }

    if (!isValidAssets) {
      addToast({
        message: "Please upload at least one asset.",
        variant: "danger",
      });
      return false;
    }

    if (!isValidTitle) {
      addToast({
        message: "Please enter a valid title.",
        variant: "danger",
      });
      return false;
    }

    if (!isValidDescription) {
      addToast({
        message: "Please enter a valid description.",
        variant: "danger",
      });
      return false;
    }

    if (!isValidVersion) {
      console.log({ version, isValidVersion, isVersionValueValid });

      addToast({
        message: "Please enter a valid version.",
        variant: "danger",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!codeFile || !coverImgFile) return;

    if (!isValidInput()) return;

    setIsPublishing(true);

    const mutate = publish.mutateAsync({
      title,
      description,
      codeFile,
      coverImgFile,
      version,
      price: Number(price),
      body: DOMPurify.sanitize(body),
      assets: encodedAssets,
      categories,
      demoUrl: demoUrl.trim() === "" ? null : demoUrl.trim(),
    });

    mutate
      .then(() => {
        setIsPublishing(false);

        addToast({
          message: "Successfully publish a product",
          variant: "success",
        });

        void router.push("/products");
      })
      .catch((err) => {
        setIsPublishing(false);

        addToast({
          message: "Failed to publish product",
          variant: "danger",
        });

        console.log(err);

        return Promise.reject();
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
          name="sell-form"
          className="flex flex-col md:px-6"
          onSubmit={(event) => void handleSubmit(event)}
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
              required
            />
          </div>

          <div className="mt-4 flex flex-row flex-wrap justify-between mobile-sm:gap-y-4 md:justify-start md:gap-x-8">
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

            <FormCategoryInput
              name="category-input"
              label="Categories"
              placeholder="Ex: Laravel, React, Node, etc..."
              onChangeHandler={onCategoryChangeHandler}
              onAddHandler={setCategories}
              onDeleteHandler={setCategories}
              setCategory={setCategory}
              value={category}
              className="max-w-2xs"
              items={categories}
            />
          </div>

          <div className="mt-4">
            <FormInput
              name="demo_url"
              label="Demo URL"
              placeholder="https://example.com/demo"
              onChangeHandler={onDemoUrlChangeHandler}
            />

            <FileInput
              name="cover_img_file"
              label="Cover Image"
              onChangeHandler={onCoverImgFileChangeHandler}
              accept={"image/png,image/jpeg"}
              acceptType="image"
              required
            />
            <FileInput
              name="code_file"
              label="Source File"
              accept=".zip"
              acceptType="zip"
              onChangeHandler={onCodeFileChangeHandler}
              required
            />
          </div>

          <div className="mt-4 flex flex-col gap-y-6">
            <FileImageInput
              name="assets"
              label="Assets"
              files={assets}
              onChangeHandler={onAssetsChangeHandler}
              onDeleteHandler={onAssetsDeleteHandler}
              onDropHandler={onAssetsDropHandler}
              isEncoding={isEncodingAssets}
              required
            />

            <TextAreaInput
              name="body"
              label="Body"
              placeholder="Explain your product here..."
              onChangeHandler={onBodyChangeHandler}
            />
          </div>

          <Button
            type="submit"
            className="mt-8"
            isLoading={isPublishing}
            disabled={isPublishing || isEncodingAssets}
          >
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

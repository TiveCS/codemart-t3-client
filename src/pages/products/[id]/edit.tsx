import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { Button } from "~/components/Button";
import FormCategoryInput from "~/components/Forms/FormCategoryInput";
import FormInput from "~/components/Forms/FormInput";
import TextAreaInput from "~/components/Forms/TextAreaInput";
import useInput from "~/hooks/useInput";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import useToastsStore from "~/zustand/toastsStore";

interface ProductEditPageProps {
  id: string;
}

const ProductEditPage: NextPage<ProductEditPageProps> = ({ id }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToastsStore();
  const { data: product, isLoading } = api.products.getProductById.useQuery(
    {
      id,
    },
    {
      onSuccess: (data) => {
        if (data) {
          setTitle(data.title);
          setDescription(data.description ?? "");
          setPrice(data.price);
          setCategories(data.categories);
          setBody(data.body ?? "");
          setDemoUrl(data.demo_url ?? "");
        }
      },
    }
  );

  const {
    value: title,
    onValueChangeHandler: onTitleChangeHandler,
    setValue: setTitle,
    isValid: isTitleValid,
  } = useInput<string>("", {
    isRequired: true,
  });
  const {
    value: description,
    onValueChangeHandler: onDescriptionChangeHandler,
    setValue: setDescription,
    isValid: isDescriptionValid,
  } = useInput<string>("", {
    isRequired: true,
  });
  const {
    value: price,
    onValueChangeHandler: onPriceChangeHandler,
    setValue: setPrice,
  } = useInput(0);
  const {
    value: body,
    onValueChangeHandler: onBodyChangeHandler,
    setValue: setBody,
  } = useInput<string>("");

  const {
    value: category,
    onValueChangeHandler: onCategoryChangeHandler,
    setValue: setCategory,
  } = useInput<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const {
    value: demoUrl,
    onValueChangeHandler: onDemoUrlChangeHandler,
    setValue: setDemoUrl,
    isValid: isDemoUrlValid,
  } = useInput<string>("", {
    isRequired: false,
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        if (value.length === 0) return true;

        setDemoUrl("");
        return true;
      }
    },
  });

  const [isPublishing, setIsPublishing] = useState(false);

  const editProduct = api.products.editProduct.useMutation({
    onMutate: () => {
      setIsPublishing(true);
    },
    onError: () => {
      addToast({
        message: "An error occurred while editing the product.",
        variant: "danger",
      });
      setIsPublishing(false);
    },
    onSuccess: () => {
      addToast({
        message: "Product edited successfully.",
        variant: "success",
      });
      setIsPublishing(false);
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>404</p>;
  }

  const isOwner = product.ownerId === session?.user.id;

  if (!isOwner) {
    return <p>403</p>;
  }

  const isValidInput = () => {
    const isValidTitle = isTitleValid && title.length > 0;
    const isValidDescription = isDescriptionValid && description.length > 0;
    const isValidPrice = price !== undefined && price >= 0;
    const isValidCategories = categories.length > 0;

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

    if (!title || !description || !isValidPrice || !isValidCategories) {
      addToast({
        message: "Please fill all the required fields.",
        variant: "danger",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidInput()) {
      return;
    }

    await editProduct.mutateAsync({
      id: product.id,
      title,
      description,
      price: Number(price),
      categories,
      body,
      demoUrl: demoUrl.trim() === "" ? null : demoUrl,
    });

    await router.push("/products/[id]", `/products/${product.id}`);
  };

  return (
    <>
      <Head>
        <title>{product.title} | Edit</title>
      </Head>

      <form
        name="sell-form"
        className="flex flex-col md:px-6"
        encType="multipart/form-data"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div className="mb-4">
          <h6 className="text-lg font-semibold text-gray-700">
            Editing {title}
          </h6>
        </div>

        <div className="grid w-full grid-flow-row gap-y-4 md:grid-flow-col md:gap-y-0 md:gap-x-8">
          <FormInput
            name="title"
            label="Title"
            value={title}
            placeholder="My Awesome Software"
            onChangeHandler={onTitleChangeHandler}
            required
          />

          <FormInput
            name="description"
            label="Description"
            placeholder="A software that manage your task"
            value={description}
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

        <div className="mt-4 flex flex-col gap-y-6">
          <FormInput
            name="demo-url"
            label="Demo URL"
            placeholder="https://example.com/demo"
            value={demoUrl}
            onChangeHandler={onDemoUrlChangeHandler}
          />

          <TextAreaInput
            name="body"
            label="Body"
            value={body}
            placeholder="Explain your product here..."
            onChangeHandler={onBodyChangeHandler}
          />
        </div>

        <Button isLoading={isPublishing} className="mt-8" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

const getServerSideProps: GetServerSideProps<ProductEditPageProps> = async (
  context
) => {
  if (!context.params) {
    return {
      notFound: true,
    };
  }

  const id = context.params.id as string;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

export { getServerSideProps };

export default ProductEditPage;

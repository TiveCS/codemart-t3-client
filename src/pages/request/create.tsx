import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/Button";
import FormInput from "~/components/Forms/FormInput";
import TextAreaInput from "~/components/Forms/TextAreaInput";
import useInput from "~/hooks/useInput";
import { api } from "~/utils/api";
import useToastsStore from "~/zustand/toastsStore";

const CreateRequestPage: NextPage = () => {
  const { addToast } = useToastsStore();
  const router = useRouter();

  const [title, onTitleChange] = useInput<string>("");
  const [content, onContentChange] = useInput<string>("");
  const [budget, onBudgetChange] = useInput<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createRequest = api.productRequests.create.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      addToast({
        message: "Request created successfully!",
        variant: "success",
      });
      setIsLoading(false);
    },
    onError: () => {
      addToast({
        message: "Something went wrong!",
        variant: "danger",
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createRequest.mutate({
      title,
      content,
      budget: Number(budget),
    });

    void router.push("/request");
  };

  return (
    <section id="create-request" className="mx-auto min-h-screen max-w-7xl">
      <h6>Create Request</h6>

      <form className="mt-6 flex flex-col gap-y-6" onSubmit={onSubmit}>
        <div className="flex flex-row gap-x-6">
          <FormInput
            placeholder="Title"
            label="Title"
            name="title"
            value={title}
            onChangeHandler={onTitleChange}
            required
          />

          <FormInput
            placeholder="Budget"
            label="Budget"
            name="budget"
            value={budget}
            onChangeHandler={onBudgetChange}
            required
          />
        </div>

        <TextAreaInput
          placeholder="Content"
          label="Content"
          name="content"
          value={content}
          onChangeHandler={onContentChange}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          <span>Create Request</span>
        </Button>
      </form>
    </section>
  );
};

export default CreateRequestPage;

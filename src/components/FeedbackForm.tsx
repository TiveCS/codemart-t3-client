import useInput from "~/hooks/useInput";
import FeedbackInput from "./FeedbackInput";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import useToastsStore from "~/zustand/toastsStore";
import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { type FeedbacksDataType } from "~/types/FeedbacksData";

interface FeedbackFormProps {
  productId: string;
  getFeedbacks: UseInfiniteQueryResult<FeedbacksDataType[], unknown>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  productId,
  getFeedbacks,
}) => {
  const { addToast } = useToastsStore();
  const userFeedback = api.feedbacks.getFeedbackForUser.useQuery({
    productId,
  });

  const {
    value: feedback,
    onValueChangeHandler: onFeedbackChangeHandler,
    setValue: setFeedback,
  } = useInput("");
  const [isRecomended, setIsRecomended] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFeedback(userFeedback.data?.content ?? "");
    setIsRecomended(userFeedback.data?.isRecomended ?? true);
  }, [
    setFeedback,
    userFeedback.data?.content,
    userFeedback.data?.isRecomended,
  ]);

  const sendFeedback = api.feedbacks.createFeedback.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      addToast({
        message: "Your feedback has been sent!",
        variant: "success",
      });
      await getFeedbacks.refetch();
      setLoading(false);
    },
    onError: () => {
      addToast({
        message: "Something went wrong when sending your feedback.",
        variant: "danger",
      });
      setLoading(false);
    },
  });

  const updateFeedback = api.feedbacks.updateFeedback.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      addToast({
        message: "Your feedback has been updated!",
        variant: "success",
      });
      await getFeedbacks.refetch();
      setLoading(false);
    },
    onError: () => {
      addToast({
        message: "Something went wrong when updating your feedback.",
        variant: "danger",
      });
      setLoading(false);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasFeedback = userFeedback.data?.content;

    if (!hasFeedback) {
      sendFeedback.mutate({
        productId,
        content: feedback,
        isRecomended,
      });
      return;
    }

    updateFeedback.mutate({
      productId,
      content: feedback,
      isRecomended,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FeedbackInput
        value={feedback}
        onChangeHandler={onFeedbackChangeHandler}
        isLoading={loading}
        isRecommended={isRecomended}
        setIsRecomended={setIsRecomended}
      />
    </form>
  );
};

export default FeedbackForm;

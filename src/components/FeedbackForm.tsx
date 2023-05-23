import useInput from "~/hooks/useInput";
import FeedbackInput from "./FeedbackInput";
import { api } from "~/utils/api";
import { useState } from "react";
import useToastsStore from "~/zustand/toastsStore";

interface FeedbackFormProps {
  productId: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ productId }) => {
  const { addToast } = useToastsStore();
  const [feedback, onFeedbackChangeHandler, setFeedback] = useInput("");
  const [loading, setLoading] = useState(false);

  const sendFeedback = api.feedbacks.createFeedback.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      addToast({
        message: "Your feedback has been sent!",
        variant: "success",
      });
      setFeedback("");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendFeedback.mutate({
      productId,
      content: feedback,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FeedbackInput
        value={feedback}
        onChangeHandler={onFeedbackChangeHandler}
        isLoading={loading}
      />
    </form>
  );
};

export default FeedbackForm;

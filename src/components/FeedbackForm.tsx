import useInput from "~/hooks/useInput";
import FeedbackInput from "./FeedbackInput";

const FeedbackForm: React.FC = () => {
  const [feedback, onFeedbackChangeHandler] = useInput("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FeedbackInput onChangeHandler={onFeedbackChangeHandler} />
    </form>
  );
};

export default FeedbackForm;

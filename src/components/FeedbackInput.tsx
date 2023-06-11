import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import FeedbackRecommendationOption from "./FeedbackRecommendationOption";

interface FeedbackInputProps {
  value: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setIsRecomended: React.Dispatch<React.SetStateAction<boolean>>;
  isRecommended: boolean;
  isLoading: boolean;
  hasPurchased?: boolean;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({
  value,
  onChangeHandler,
  setIsRecomended,
  isRecommended,
  isLoading,
  hasPurchased = false,
}) => {
  return (
    <div className="mt-8 flex flex-col gap-y-2 rounded-md border border-gray-200 shadow">
      <textarea
        id="feedback-input"
        onChange={onChangeHandler}
        value={value}
        name="feedback"
        className={`w-full p-4 focus:outline-none ${
          !hasPurchased ? "cursor-not-allowed" : ""
        }`}
        placeholder="What's your experience with this product?"
        disabled={isLoading || !hasPurchased}
        required
      ></textarea>

      <div className="flex flex-row items-center justify-between border-t border-gray-200 py-2 pr-2">
        <div className="inline-flex flex-row gap-x-6 pl-4">
          <FeedbackRecommendationOption
            isRecommended={isRecommended}
            setIsRecomended={setIsRecomended}
            option="recommended"
            hasPurchased={hasPurchased}
          />
          <FeedbackRecommendationOption
            isRecommended={isRecommended}
            setIsRecomended={setIsRecomended}
            option="not-recommended"
            hasPurchased={hasPurchased}
          />
        </div>

        <button
          type="submit"
          className="group flex w-fit items-center justify-center rounded p-1.5 hover:cursor-pointer hover:bg-gray-100"
        >
          <PaperAirplaneIcon className="h-6 w-6  text-gray-500 group-hover:text-codemart-500" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackInput;

import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface FeedbackRecommendationOptionProps {
  isRecommended: boolean;
  setIsRecomended: React.Dispatch<React.SetStateAction<boolean>>;
  option: "recommended" | "not-recommended";
}

const FeedbackRecommendationOption: React.FC<
  FeedbackRecommendationOptionProps
> = ({ isRecommended, setIsRecomended, option }) => {
  const optionEqualsRecommended = option === "recommended";
  const isCorrectOption = isRecommended === optionEqualsRecommended;

  const handleSetRecommended = () => {
    setIsRecomended(optionEqualsRecommended);
  };

  // TODO: Color is still not follow the isRecommended state
  return (
    <button
      className={`inline-flex flex-col flex-wrap gap-x-2 md:flex-row ${
        isCorrectOption
          ? optionEqualsRecommended
            ? "text-codemart-700"
            : "text-red-600"
          : "text-gray-500"
      }`}
      onClick={handleSetRecommended}
      type="button"
    >
      {optionEqualsRecommended ? (
        <>
          <HandThumbUpIcon className="h-6 w-6" />
          <span className="hidden md:block">Recommended</span>
        </>
      ) : (
        <>
          <HandThumbDownIcon className="h-6 w-6" />
          <span className="hidden md:block">Not Recommended</span>
        </>
      )}
    </button>
  );
};

export default FeedbackRecommendationOption;

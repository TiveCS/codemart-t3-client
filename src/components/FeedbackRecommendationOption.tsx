import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface FeedbackRecommendationOptionProps {
  isRecommended: boolean;
  setIsRecomended: React.Dispatch<React.SetStateAction<boolean>>;
  option: "recommended" | "not-recommended";
  hasPurchased: boolean;
}

const FeedbackRecommendationOption: React.FC<
  FeedbackRecommendationOptionProps
> = ({ isRecommended, setIsRecomended, option, hasPurchased }) => {
  const optionEqualsRecommended = option === "recommended";
  const isCorrectOption = isRecommended === optionEqualsRecommended;

  const handleSetRecommended = () => {
    setIsRecomended(optionEqualsRecommended);
  };

  const textColor = optionEqualsRecommended
    ? "text-codemart-700"
    : "text-red-600";

  return (
    <button
      className={`inline-flex flex-col flex-wrap gap-x-2 md:flex-row ${
        !hasPurchased ? "cursor-not-allowed" : ""
      } ${isCorrectOption && hasPurchased ? textColor : "text-gray-500"}`}
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

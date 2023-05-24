import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { type FeedbacksDataType } from "~/types/FeedbacksData";

interface FeedbackCardProps {
  feedback: FeedbacksDataType;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return (
    <div className=" border-b border-gray-200 pt-2 pb-4">
      <div id="feedback-header" className="flex flex-row items-center gap-x-4">
        {feedback.isRecomended ? (
          <>
            <div>
              <HandThumbUpIcon className="h-6 w-6 text-codemart-700" />
            </div>
            <div className="text-codemart-700">Recommended</div>
          </>
        ) : (
          <>
            <div>
              <HandThumbDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-red-600">Not Recommended</div>
          </>
        )}
      </div>

      <div id="feedback-body" className="mt-2">
        <p>{feedback.content}</p>
      </div>

      <div>
        <div className="mt-6 flex flex-row items-center gap-x-2">
          <div className="flex flex-row items-center gap-x-2">
            {feedback.reviewer.image ? (
              <Image
                src={feedback.reviewer.image}
                alt={feedback.reviewer.name ?? ""}
                width={24}
                height={24}
              />
            ) : (
              <div className="h-6 w-6 bg-slate-600">
                <p className="text-gray-50">
                  {feedback.reviewer.name?.charAt(0)}
                </p>
              </div>
            )}

            <span className="ml-1.5 text-sm font-medium">
              {feedback.reviewer.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;

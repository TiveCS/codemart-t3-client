import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface FeedbackInputProps {
  value: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({
  value,
  onChangeHandler,
  isLoading,
}) => {
  return (
    <div className="mt-8 flex flex-col gap-y-2 rounded-md border border-gray-200 shadow">
      <input
        id="feedback-input"
        onChange={onChangeHandler}
        value={value}
        name="feedback"
        className="w-full p-4 focus:outline-none"
        placeholder="What's your experience with this product?"
        disabled={isLoading}
        required
      ></input>

      <div className="flex justify-end border-t border-gray-200 py-1 pr-2">
        <button
          type="submit"
          className="group flex w-fit items-center justify-center rounded-full p-1.5 hover:cursor-pointer hover:bg-gray-100"
        >
          <PaperAirplaneIcon className="h-6 w-6  text-gray-500 group-hover:text-codemart-500" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackInput;

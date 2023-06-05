interface ChatMessageItemProps {
  message: string;
  sender: string | null;
  isSelf: boolean;
  isOneAudience: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  sender,
  isSelf,
  isOneAudience,
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {!isOneAudience && !isSelf && (
        <p className="text-sm font-medium">{sender}</p>
      )}

      <div className={`flex ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
        <p
          className={`max-w-sm overflow-auto whitespace-pre-line break-words rounded-md  px-2.5 py-2 ${
            isSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;

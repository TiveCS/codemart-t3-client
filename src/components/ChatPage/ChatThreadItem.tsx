import { type User, type ChatMessage, type ChatThread } from "@prisma/client";
import Link from "next/link";

interface ChatThreadItemProps {
  userId: string;
  thread: ChatThread & {
    audienceList: User[];
    messages: ChatMessage[];
  };
}

const ChatThreadItem: React.FC<ChatThreadItemProps> = ({ thread, userId }) => {
  const audienceSize = thread.audienceList.length;

  // Audience string should show the first 2 audience members and the number of audience members and not show the current user
  const audienceString =
    thread.audienceList
      .filter((audience) => audience.id !== userId)
      .slice(0, 2)
      .map((audience) => audience.name)
      .join(", ") + (audienceSize > 3 ? ` and ${audienceSize - 3} more` : "");

  return (
    <Link href={"/chat/[id]"} as={`/chat/${thread.id}`} className="group">
      <div className="border-b border-b-gray-200 px-8 py-4 font-medium group-hover:bg-codemart-50">
        {audienceString}
      </div>
    </Link>
  );
};

export default ChatThreadItem;

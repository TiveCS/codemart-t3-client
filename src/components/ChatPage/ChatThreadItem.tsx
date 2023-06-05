import { type User, type ChatMessage, type ChatThread } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ChatThreadItemProps {
  userId: string;
  thread: ChatThread & {
    audienceList: User[];
    messages: ChatMessage[];
  };
}

const ChatThreadItem: React.FC<ChatThreadItemProps> = ({ thread, userId }) => {
  const { data: session } = useSession();

  const audienceSize = thread.audienceList.length;

  // Audience string should show the first 2 audience members and the number of audience members and not show the current user
  const audienceString =
    thread.audienceList
      .filter((audience) => audience.id !== userId)
      .slice(0, 2)
      .map((audience) => audience.name)
      .join(", ") + (audienceSize > 3 ? ` and ${audienceSize - 3} more` : "");

  const latestMessage = thread.messages[thread.messages.length - 1];
  const latestSender = thread.audienceList.find(
    (audience) => audience.id === latestMessage?.senderId
  );
  const latestSenderName =
    latestSender?.id === session?.user.id ? "You" : latestSender?.name;

  return (
    <Link href={"/chat/[id]"} as={`/chat/${thread.id}`} className="group">
      <div className="px-8 py-4 group-hover:bg-codemart-50">
        <div className="mb-4">
          <p className="font-medium">{audienceString}</p>
          <p>
            {latestSenderName}: {latestMessage?.content}
          </p>
        </div>

        <hr />
      </div>
    </Link>
  );
};

export default ChatThreadItem;
